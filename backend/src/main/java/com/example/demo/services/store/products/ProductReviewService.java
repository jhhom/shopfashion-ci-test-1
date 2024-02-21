package com.example.demo.services.store.products;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.services.common.MediaService;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.common.exceptions.ResourceNotFoundException;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import java.time.LocalDateTime;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductReviewService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public ProductReviewService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  public DTO.ListAllProductReviews.Response listAllProductReviews(int productId) {
    DTO.ListAllProductReviews.ResponseProduct product =
        ctx.select(PRODUCTS.PRODUCT_NAME, PRODUCTS.PRODUCT_IMAGE_URL, avg(PRODUCT_REVIEWS.RATING))
            .from(PRODUCTS)
            .leftJoin(PRODUCT_REVIEWS)
            .on(PRODUCT_REVIEWS.PRODUCT_ID.eq(PRODUCTS.ID))
            .where(PRODUCTS.ID.eq(productId))
            .groupBy(PRODUCTS.ID)
            .fetchOne(
                x -> {
                  String imageUrl = mediaService.mediaUrl(x.value2());

                  return new DTO.ListAllProductReviews.ResponseProduct(
                      x.value1(), Math.round(x.value3().doubleValue()), imageUrl);
                });

    if (product == null) {
      throw new ResourceNotFoundException("products");
    }

    List<DTO.ListAllProductReviews.ResponseReview> reviews =
        ctx.select(
                PRODUCT_REVIEWS.COMMENT,
                PRODUCT_REVIEWS.RATING,
                PRODUCT_REVIEWS.CREATED_AT,
                CUSTOMERS.EMAIL)
            .from(PRODUCT_REVIEWS)
            .join(ORDERS)
            .on(PRODUCT_REVIEWS.ORDER_ID.eq(ORDERS.ID))
            .join(CUSTOMERS)
            .on(ORDERS.CUSTOMER_ID.eq(CUSTOMERS.ID))
            .where(PRODUCT_REVIEWS.PRODUCT_ID.eq(productId))
            .fetch(
                x ->
                    new DTO.ListAllProductReviews.ResponseReview(
                        x.value4(), x.value1(), x.value2(), x.value3()));

    return new DTO.ListAllProductReviews.Response(product, reviews);
  }

  @Transactional
  public ResultMessage createProductReview(
      int customerId, int productId, DTO.CreateProductReview.Request req) {

    Integer orderId =
        req.isConfigurableProduct
            ? ctx.select(ORDERS.ID)
                .from(ORDER_LINE_CONFIGURABLE_ITEMS)
                .join(ORDERS)
                .on(ORDERS.ID.eq(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID))
                .where(
                    and(
                        ORDERS.CUSTOMER_ID.eq(customerId),
                        ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(productId),
                        ORDERS.ORDER_STATUS.eq(OrderStatus.PAID)))
                .fetchOne(x -> x.value1())
            : ctx.select(ORDERS.ID)
                .from(ORDER_LINE_SIMPLE_ITEMS)
                .join(ORDERS)
                .on(ORDERS.ID.eq(ORDER_LINE_SIMPLE_ITEMS.ORDER_ID))
                .where(
                    and(
                        ORDERS.CUSTOMER_ID.eq(customerId),
                        ORDER_LINE_SIMPLE_ITEMS.PRODUCT_ID.eq(productId),
                        ORDERS.ORDER_STATUS.eq(OrderStatus.PAID)))
                .fetchOne(x -> x.value1());

    int reviewProductId = productId;

    if (req.isConfigurableProduct) {
      reviewProductId =
          ctx.select(PRODUCT_VARIANTS.PRODUCT_ID)
              .from(PRODUCT_VARIANTS)
              .where(PRODUCT_VARIANTS.ID.eq(productId))
              .fetchOne(x -> x.value1());
    }

    ctx.insertInto(PRODUCT_REVIEWS)
        .set(PRODUCT_REVIEWS.ORDER_ID, orderId)
        .set(PRODUCT_REVIEWS.PRODUCT_ID, reviewProductId)
        .set(PRODUCT_REVIEWS.COMMENT, req.comment)
        .set(PRODUCT_REVIEWS.RATING, req.rating)
        .execute();

    return new ResultMessage("Review created successfully");
  }

  public class DTO {
    public static class ListAllProductReviews {
      public static record Response(ResponseProduct product, List<ResponseReview> reviews) {}
      ;

      public static record ResponseProduct(String name, long rating, String imageUrl) {}
      ;

      public static record ResponseReview(
          String customerEmail, String comment, int rating, LocalDateTime createdAt) {}
      ;
    }

    public static class CreateProductReview {
      public static record Request(
          @NotNull Boolean isConfigurableProduct,
          String comment,
          @PositiveOrZero @Max(value = 5) Integer rating) {}
      ;
    }
  }
}
