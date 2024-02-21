package com.example.demo.services.store.customers.cart;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.and;
import static org.jooq.impl.DSL.multisetAgg;

import com.example.demo.jooqmodels.enums.OrderLineItemStatus;
import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.services.common.MediaService;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class CartQueryService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public CartQueryService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  public DTO.ListPurchases.Response listPurchases(int customerId, String status) {
    var simpleQuery =
        ctx.select(
                ORDERS.ID,
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                ORDER_LINE_SIMPLE_ITEMS.QUANTITY,
                ORDER_LINE_SIMPLE_ITEMS.UNIT_PRICE,
                ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS,
                ORDERS.CREATED_AT,
                PRODUCT_REVIEWS.ORDER_ID,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .from(ORDER_LINE_SIMPLE_ITEMS)
            .join(PRODUCTS)
            .on(PRODUCTS.ID.eq(ORDER_LINE_SIMPLE_ITEMS.PRODUCT_ID))
            .join(ORDERS)
            .on(ORDERS.ID.eq(ORDER_LINE_SIMPLE_ITEMS.ORDER_ID))
            .leftJoin(PRODUCT_REVIEWS)
            .on(
                PRODUCT_REVIEWS
                    .ORDER_ID
                    .eq(ORDERS.ID)
                    .and(PRODUCT_REVIEWS.PRODUCT_ID.eq(PRODUCTS.ID)))
            .where(
                and(
                    ORDERS.ORDER_STATUS.eq(
                        status.equals(OrderStatus.CANCELLED.toString())
                            ? OrderStatus.CANCELLED
                            : OrderStatus.PAID),
                    ORDERS.CUSTOMER_ID.eq(customerId)));

    if (status.equals("COMPLETED")) {
      simpleQuery.and(
          ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS.eq(OrderLineItemStatus.COMPLETED));
    } else if (status.equals("TO_RECEIVE")) {
      simpleQuery.and(
          ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS.notEqual(OrderLineItemStatus.COMPLETED));
    }

    List<DTO.ListPurchases.Purchase> simpleItems =
        simpleQuery
            .orderBy(ORDERS.CREATED_AT.desc())
            .fetch(
                v -> {
                  var p = new DTO.ListPurchases.Purchase();

                  p.orderId = v.value1();
                  p.productId = v.value2();
                  p.productName = v.value3();
                  p.productImageUrl = v.value9();
                  p.quantity = v.value4();
                  p.unitPrice = v.value5();
                  p.orderTotal = p.unitPrice.multiply(BigDecimal.valueOf(p.quantity));
                  p.status = v.value6();
                  p.orderDate = v.value7();
                  p.isConfigurableProduct = false;
                  p.canReview = v.value8() == null;

                  p.productImageUrl = mediaService.mediaUrl(p.productImageUrl);

                  return p;
                });

    var configurableQuery =
        ctx.select(
                ORDERS.ID,
                PRODUCT_VARIANTS.ID,
                PRODUCTS.PRODUCT_NAME,
                ORDER_LINE_CONFIGURABLE_ITEMS.QUANTITY,
                ORDER_LINE_CONFIGURABLE_ITEMS.UNIT_PRICE,
                ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS,
                ORDERS.CREATED_AT,
                PRODUCT_REVIEWS.ORDER_ID,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .from(ORDER_LINE_CONFIGURABLE_ITEMS)
            .join(PRODUCT_VARIANTS)
            .on(PRODUCT_VARIANTS.ID.eq(ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID))
            .join(PRODUCTS)
            .on(PRODUCTS.ID.eq(PRODUCT_VARIANTS.PRODUCT_ID))
            .join(ORDERS)
            .on(ORDERS.ID.eq(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID))
            .leftJoin(PRODUCT_REVIEWS)
            .on(
                PRODUCT_REVIEWS
                    .ORDER_ID
                    .eq(ORDERS.ID)
                    .and(PRODUCT_REVIEWS.PRODUCT_ID.eq(PRODUCTS.ID)))
            .where(
                and(
                    ORDERS.ORDER_STATUS.eq(
                        status.equals(OrderStatus.CANCELLED.toString())
                            ? OrderStatus.CANCELLED
                            : OrderStatus.PAID),
                    ORDERS.CUSTOMER_ID.eq(customerId)));

    if (status.equals("COMPLETED")) {
      configurableQuery.and(
          ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS.eq(OrderLineItemStatus.COMPLETED));
    } else if (status.equals("TO_RECEIVE")) {
      configurableQuery.and(
          ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS.notEqual(
              OrderLineItemStatus.COMPLETED));
    }

    List<DTO.ListPurchases.Purchase> configurableItems =
        configurableQuery
            .orderBy(ORDERS.CREATED_AT.desc())
            .fetch(
                v -> {
                  var p = new DTO.ListPurchases.Purchase();

                  p.orderId = v.value1();
                  p.productId = v.value2();
                  p.productName = v.value3();
                  p.productImageUrl = v.value9();
                  p.quantity = v.value4();
                  p.unitPrice = v.value5();
                  p.orderTotal = p.unitPrice.multiply(BigDecimal.valueOf(p.quantity));
                  p.status = v.value6();
                  p.orderDate = v.value7();
                  p.isConfigurableProduct = true;
                  p.canReview = v.value8() == null;

                  p.productImageUrl = mediaService.mediaUrl(p.productImageUrl);

                  return p;
                });

    simpleItems.addAll(configurableItems);
    return new DTO.ListPurchases.Response(simpleItems);
  }

  public DTO.GetShoppingCart.Response getShoppingCart(int customerId) {
    var simpleCartItems =
        ctx.select(
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY,
                CUSTOMER_CART_SIMPLE_ITEMS.ADDED_AT,
                PRODUCTS.PRICING,
                PRODUCTS.PRODUCT_STATUS,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .from(CUSTOMER_CART_SIMPLE_ITEMS)
            .join(PRODUCTS)
            .on(PRODUCTS.ID.eq(CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID))
            .where(CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId))
            .fetch(
                v -> {
                  var i = new DTO.GetShoppingCart.Item();

                  i.id = v.value1();
                  i.name = v.value2();
                  i.quantity = v.value3();
                  i.pricing = v.value5();
                  i.status = v.value6();
                  i.imgUrl = mediaService.mediaUrl(v.value7());
                  i.addedAt = v.value4();
                  i.type = new DTO.GetShoppingCart.SimpleItemType();

                  return i;
                });

    var q =
        ctx.select(
                PRODUCT_VARIANTS.ID,
                PRODUCTS.PRODUCT_NAME,
                PRODUCT_VARIANTS.PRODUCT_STATUS,
                PRODUCT_VARIANTS.PRICING,
                PRODUCTS.PRODUCT_IMAGE_URL,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.ADDED_AT,
                multisetAgg(PRODUCT_OPTION_VALUES.OPTION_VALUE, PRODUCT_OPTIONS.OPTION_NAME))
            .from(CUSTOMER_CART_CONFIGURABLE_ITEMS)
            .join(PRODUCT_VARIANTS)
            .on(PRODUCT_VARIANTS.ID.eq(CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID))
            .join(PRODUCTS)
            .on(PRODUCTS.ID.eq(PRODUCT_VARIANTS.PRODUCT_ID))
            .join(PRODUCT_VARIANT_OPTIONS)
            .on(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(PRODUCT_VARIANTS.ID))
            .join(PRODUCT_OPTION_VALUES)
            .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
            .join(PRODUCT_OPTIONS)
            .on(PRODUCT_OPTIONS.CODE.eq(PRODUCT_OPTION_VALUES.OPTION_CODE))
            .where(CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID.eq(customerId))
            .groupBy(
                PRODUCT_VARIANTS.ID,
                PRODUCTS.PRODUCT_NAME,
                PRODUCTS.PRODUCT_IMAGE_URL,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.ADDED_AT);

    var configurableCartItems =
        q.fetch(
            v -> {
              var i = new DTO.GetShoppingCart.Item();

              i.id = v.value1();
              i.name = v.value2();
              i.quantity = v.value6();
              i.pricing = v.value4();
              i.status = v.value3();
              i.imgUrl = mediaService.mediaUrl(v.value5());
              i.addedAt = v.value7();
              i.type =
                  new DTO.GetShoppingCart.ConfigurableItemType(
                      v.value8().map(x -> new DTO.GetShoppingCart.Option(x.value2(), x.value1())));

              return i;
            });

    simpleCartItems.addAll(configurableCartItems);

    return new DTO.GetShoppingCart.Response(simpleCartItems);
  }

  public DTO.GetCartItemsInfo.Response getCartItemsInfo(DTO.GetCartItemsInfo.Request req) {
    List<DTO.GetCartItemsInfo.SimpleItem> simpleProducts =
        ctx.select(
                PRODUCTS.PRODUCT_NAME,
                PRODUCTS.ID,
                PRODUCTS.PRICING,
                PRODUCTS.PRODUCT_IMAGE_URL,
                PRODUCTS.PRODUCT_STATUS)
            .from(PRODUCTS)
            .where(PRODUCTS.ID.in(req.simple))
            .fetch(
                v -> {
                  var i = new DTO.GetCartItemsInfo.SimpleItem();

                  i.id = v.value2();
                  i.name = v.value1();
                  i.pricing = v.value3();
                  i.imgUrl = mediaService.mediaUrl(v.value4());
                  i.status = v.value5();

                  return i;
                });

    List<DTO.GetCartItemsInfo.ConfigurableItem> configurableProducts =
        ctx.select(
                PRODUCTS.PRODUCT_NAME,
                PRODUCT_VARIANTS.ID,
                PRODUCT_VARIANTS.PRICING,
                PRODUCTS.PRODUCT_IMAGE_URL,
                PRODUCT_VARIANTS.PRODUCT_STATUS,
                multisetAgg(PRODUCT_OPTION_VALUES.OPTION_VALUE, PRODUCT_OPTIONS.OPTION_NAME))
            .from(PRODUCTS)
            .join(PRODUCT_VARIANTS)
            .on(PRODUCTS.ID.eq(PRODUCT_VARIANTS.PRODUCT_ID))
            .join(PRODUCT_VARIANT_OPTIONS)
            .on(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(PRODUCT_VARIANTS.ID))
            .join(PRODUCT_OPTION_VALUES)
            .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
            .join(PRODUCT_OPTIONS)
            .on(PRODUCT_OPTIONS.CODE.eq(PRODUCT_OPTION_VALUES.OPTION_CODE))
            .where(PRODUCT_VARIANTS.ID.in(req.configurable))
            .groupBy(PRODUCT_VARIANTS.ID, PRODUCTS.PRODUCT_NAME, PRODUCTS.PRODUCT_IMAGE_URL)
            .fetch(
                v -> {
                  var i = new DTO.GetCartItemsInfo.ConfigurableItem();

                  i.id = v.value2();
                  i.name = v.value1();
                  i.pricing = v.value3();
                  i.imgUrl = mediaService.mediaUrl(v.value4());
                  i.status = v.value5();
                  i.options =
                      v.value6().map(x -> new DTO.GetCartItemsInfo.Option(x.value2(), x.value1()));

                  return i;
                });

    return new DTO.GetCartItemsInfo.Response(simpleProducts, configurableProducts);
  }

  public static class DTO {
    public static class ListPurchases {
      public static record Response(List<Purchase> purchases) {}

      public static class Purchase {
        public int orderId;
        public int productId;
        public String productName;
        public String productImageUrl;
        public int quantity;
        public BigDecimal orderTotal;
        public BigDecimal unitPrice;
        public OrderLineItemStatus status;
        public LocalDateTime orderDate;
        public boolean isConfigurableProduct;
        public boolean canReview;
      }
    }

    public static class GetCartItemsInfo {
      public static record Request(
          @NotNull List<Integer> configurable, @NotNull List<Integer> simple) {}

      public static class SimpleItem {
        public Integer id;
        public String name;
        public BigDecimal pricing;
        public String imgUrl;
        public ProductStatus status;
      }

      public static class ConfigurableItem {
        public Integer id;
        public String name;
        public BigDecimal pricing;
        public List<Option> options;
        public String imgUrl;
        public ProductStatus status;
      }

      public static record Response(
          List<SimpleItem> simpleItems, List<ConfigurableItem> configurableItems) {}

      public static record Option(String option, String value) {}
    }

    public static class GetShoppingCart {
      public static record Response(List<Item> items) {}

      public static class Item {
        public Integer id;
        public String name;
        public int quantity;
        public BigDecimal pricing;
        public LocalDateTime addedAt;
        public ProductStatus status;
        public String imgUrl;
        public ItemType type;
      }

      public static record Option(String option, String value) {}

      public abstract static sealed class ItemType permits SimpleItemType, ConfigurableItemType {
        public String type;

        public ItemType(String type) {
          this.type = type;
        }
      }

      public static final class SimpleItemType extends ItemType {
        public SimpleItemType() {
          super("SIMPLE");
        }
      }

      public static final class ConfigurableItemType extends ItemType {
        public List<Option> options;

        public ConfigurableItemType(List<Option> options) {
          super("CONFIGURABLE");
          this.options = options;
        }
      }
    }
  }
}
