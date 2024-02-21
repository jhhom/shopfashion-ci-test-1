package com.example.demo.services.store.customers.checkout;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.services.common.MediaService;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class CheckoutInfoService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public CheckoutInfoService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  public DTO.GetCheckoutInfo.Response getCheckoutInfo(int customerId) {
    var simpleItems =
        ctx.select(
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY,
                CUSTOMER_CART_SIMPLE_ITEMS.ADDED_AT,
                PRODUCTS.PRICING,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .from(CUSTOMER_CART_SIMPLE_ITEMS)
            .join(PRODUCTS)
            .on(PRODUCTS.ID.eq(CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID))
            .where(
                and(
                    CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId),
                    PRODUCTS.PRODUCT_STATUS.eq(ProductStatus.ACTIVE)))
            .fetch(
                v -> {
                  String url = mediaService.mediaUrl(v.value6());

                  return new DTO.GetCheckoutInfo.OrderItem(
                      v.value2(), v.value3(), v.value1(), v.value5(), url, v.value4());
                });

    var configurableItems =
        ctx.select(
                PRODUCT_VARIANTS.ID,
                PRODUCTS.PRODUCT_NAME,
                PRODUCT_VARIANTS.PRICING,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.ADDED_AT,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .from(CUSTOMER_CART_CONFIGURABLE_ITEMS)
            .join(PRODUCT_VARIANTS)
            .on(PRODUCT_VARIANTS.ID.eq(CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID))
            .join(PRODUCTS)
            .on(PRODUCTS.ID.eq(PRODUCT_VARIANTS.PRODUCT_ID))
            .where(
                and(
                    CUSTOMER_CART_CONFIGURABLE_ITEMS
                        .CUSTOMER_ID
                        .eq(customerId)
                        .and(PRODUCT_VARIANTS.PRODUCT_STATUS.eq(ProductStatus.ACTIVE))))
            .fetch(
                v -> {
                  String url = mediaService.mediaUrl(v.value6());

                  return new DTO.GetCheckoutInfo.OrderItem(
                      v.value2(), v.value5(), v.value1(), v.value3(), url, v.value4());
                });

    List<DTO.GetCheckoutInfo.ResponseOrderItem> allItems =
        new ArrayList<>() {
          {
            addAll(
                simpleItems.stream()
                    .map(
                        i ->
                            new DTO.GetCheckoutInfo.ResponseOrderItem(
                                "S_" + i.productId,
                                i.quantity,
                                i.pricing,
                                i.productName,
                                i.imgUrl,
                                i.addedAt))
                    .toList());
            addAll(
                configurableItems.stream()
                    .map(
                        i ->
                            new DTO.GetCheckoutInfo.ResponseOrderItem(
                                "C_" + i.productId,
                                i.quantity,
                                i.pricing,
                                i.productName,
                                i.imgUrl,
                                i.addedAt))
                    .toList());
          }
        };

    Collections.sort(
        allItems, Comparator.comparing(DTO.GetCheckoutInfo.ResponseOrderItem::addedAt).reversed());

    var totalSimpleItemsPrice =
        simpleItems.stream()
            .map(i -> i.pricing.multiply(BigDecimal.valueOf(i.quantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    var totalConfigurableItemsPrice =
        configurableItems.stream()
            .map(i -> i.pricing.multiply(BigDecimal.valueOf(i.quantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    var totalPrice = totalSimpleItemsPrice.add(totalConfigurableItemsPrice);

    BigDecimal shippingFee = BigDecimal.valueOf(20.0);

    return new DTO.GetCheckoutInfo.Response(
        allItems,
        new DTO.GetCheckoutInfo.OrderSummary(
            totalPrice, shippingFee, totalPrice, shippingFee.add(totalPrice)));
  }

  public static class DTO {
    public static class GetCheckoutInfo {
      public static record Response(
          List<ResponseOrderItem> orderItems, OrderSummary orderSummary) {}

      public static record ResponseOrderItem(
          String productId,
          int quantity,
          BigDecimal pricing,
          String productName,
          String imgUrl,
          LocalDateTime addedAt) {}

      public static record OrderItem(
          String productName,
          int quantity,
          int productId,
          BigDecimal pricing,
          String imgUrl,
          LocalDateTime addedAt) {}

      public static record OrderSummary(
          BigDecimal itemsSubtotal,
          BigDecimal shippingFee,
          BigDecimal subtotal,
          BigDecimal orderTotal) {}
    }
  }
}
