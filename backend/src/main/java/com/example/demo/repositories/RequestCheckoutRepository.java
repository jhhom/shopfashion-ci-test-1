package com.example.demo.repositories;

import static com.example.demo.jooqmodels.Tables.CUSTOMER_CART_CONFIGURABLE_ITEMS;
import static com.example.demo.jooqmodels.Tables.CUSTOMER_CART_SIMPLE_ITEMS;
import static com.example.demo.jooqmodels.Tables.ORDERS;
import static com.example.demo.jooqmodels.Tables.ORDER_LINE_CONFIGURABLE_ITEMS;
import static com.example.demo.jooqmodels.Tables.ORDER_LINE_SIMPLE_ITEMS;
import static com.example.demo.jooqmodels.Tables.PRODUCTS;
import static com.example.demo.jooqmodels.Tables.PRODUCT_VARIANTS;
import static org.jooq.impl.DSL.*;

import com.example.demo.jackson.Mapper;
import com.example.demo.jooqmodels.enums.OrderLineItemStatus;
import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.services.store.customers.checkout.RequestCheckoutService.DTO.RequestCheckout.OrderDeliverAddress;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectWriter;
import java.math.BigDecimal;
import java.util.List;
import org.jooq.DSLContext;
import org.jooq.JSONB;
import org.springframework.stereotype.Repository;

@Repository
public class RequestCheckoutRepository {
  private final DSLContext ctx;
  private final ObjectWriter mapper = Mapper.createMapper();

  public RequestCheckoutRepository(DSLContext ctx) {
    this.ctx = ctx;
  }

  public List<DTO.CartItem> getCustomerCartSimpleItems(int customerId) {

    List<DTO.CartItem> simpleItems =
        ctx.select(PRODUCTS.ID, PRODUCTS.PRICING, CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY)
            .from(CUSTOMER_CART_SIMPLE_ITEMS)
            .join(PRODUCTS)
            .on(PRODUCTS.ID.eq(CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID))
            .where(
                and(
                    CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId),
                    PRODUCTS.PRODUCT_STATUS.eq(ProductStatus.ACTIVE)))
            .fetch(x -> new DTO.CartItem(x.value1(), x.value2(), x.value3()));

    return simpleItems;
  }

  public List<DTO.CartItem> getCustomerCartConfigurableItems(int customerId) {
    List<DTO.CartItem> configurableItems =
        ctx.select(
                PRODUCT_VARIANTS.ID,
                PRODUCT_VARIANTS.PRICING,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY)
            .from(CUSTOMER_CART_CONFIGURABLE_ITEMS)
            .join(PRODUCT_VARIANTS)
            .on(PRODUCT_VARIANTS.ID.eq(CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID))
            .where(
                and(
                    CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID.eq(customerId),
                    PRODUCT_VARIANTS.PRODUCT_STATUS.eq(ProductStatus.ACTIVE)))
            .fetch(x -> new DTO.CartItem(x.value1(), x.value2(), x.value3()));

    return configurableItems;
  }

  public Integer placeOrder(
      int customerId,
      BigDecimal totalPrice,
      OrderDeliverAddress address,
      List<DTO.CartItem> simpleItems,
      List<DTO.CartItem> configurableItems)
      throws JsonProcessingException {
    String addressJson = "{}";
    addressJson = mapper.writeValueAsString(address);

    Integer orderId =
        ctx.insertInto(ORDERS)
            .set(ORDERS.CUSTOMER_ID, customerId)
            .set(ORDERS.SHIPPING_FEE, BigDecimal.valueOf(20))
            .set(ORDERS.TOTAL_PRICE, totalPrice)
            .set(ORDERS.ORDER_STATUS, OrderStatus.PENDING_PAYMENT)
            .set(ORDERS.DELIVERY_ADDRESS, JSONB.jsonb(addressJson))
            .returning(ORDERS.ID)
            .fetchOne(x -> x.getId());

    if (simpleItems.size() > 0) {
      var batch =
          ctx.batch(
              ctx.insertInto(
                      ORDER_LINE_SIMPLE_ITEMS,
                      ORDER_LINE_SIMPLE_ITEMS.ORDER_ID,
                      ORDER_LINE_SIMPLE_ITEMS.PRODUCT_ID,
                      ORDER_LINE_SIMPLE_ITEMS.QUANTITY,
                      ORDER_LINE_SIMPLE_ITEMS.UNIT_PRICE,
                      ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS)
                  .values((Integer) null, null, null, null, null));

      for (var i : simpleItems) {
        batch.bind(orderId, i.id(), i.quantity(), i.pricing(), OrderLineItemStatus.PROCESSING);
      }
      batch.execute();
    }

    if (configurableItems.size() > 0) {
      var batch =
          ctx.batch(
              ctx.insertInto(
                      ORDER_LINE_CONFIGURABLE_ITEMS,
                      ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID,
                      ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID,
                      ORDER_LINE_CONFIGURABLE_ITEMS.QUANTITY,
                      ORDER_LINE_CONFIGURABLE_ITEMS.UNIT_PRICE,
                      ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS)
                  .values((Integer) null, null, null, null, null));

      for (var i : configurableItems) {
        batch.bind(orderId, i.id(), i.quantity(), i.pricing(), OrderLineItemStatus.PROCESSING);
      }

      batch.execute();
    }

    return orderId;
  }

  public static class DTO {
    public static record CartItem(int id, BigDecimal pricing, int quantity) {}
  }
}
