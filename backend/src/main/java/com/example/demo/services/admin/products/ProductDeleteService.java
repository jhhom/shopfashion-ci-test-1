package com.example.demo.services.admin.products;

import static com.example.demo.jooqmodels.Tables.*;

import com.example.demo.services.common.MediaService;
import com.example.demo.services.common.ResultMessage;
import jakarta.validation.constraints.NotNull;
import java.io.IOException;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductDeleteService {

  private final MediaService mediaService;
  private final DSLContext ctx;

  public ProductDeleteService(MediaService mediaService, DSLContext ctx) {
    this.mediaService = mediaService;
    this.ctx = ctx;
  }

  @Transactional
  public ResultMessage deleteOneProduct(int productId) {
    deleteProduct(productId);

    return new ResultMessage("Product deleted successfully");
  }

  @Transactional
  public ResultMessage deleteManyProducts(List<Integer> productIds) throws IOException {
    for (var id : productIds) {
      String productImageKey = deleteProduct(id);
      mediaService.removeFile(productImageKey);
    }

    return new ResultMessage("Product deleted successfully");
  }

  private String deleteProduct(int productId) {
    var productVariants =
        ctx.select(PRODUCT_VARIANTS.ID)
            .from(PRODUCT_VARIANTS)
            .where(PRODUCT_VARIANTS.PRODUCT_ID.eq(productId));

    ctx.deleteFrom(ORDER_LINE_CONFIGURABLE_ITEMS)
        .where(ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.in(productVariants))
        .execute();

    ctx.deleteFrom(ORDER_LINE_SIMPLE_ITEMS)
        .where(ORDER_LINE_SIMPLE_ITEMS.PRODUCT_ID.eq(productId))
        .execute();

    ctx.deleteFrom(PRODUCT_ASSOCIATIONS)
        .where(PRODUCT_ASSOCIATIONS.PRODUCT_ID.eq(productId))
        .execute();

    ctx.deleteFrom(PRODUCT_VARIANT_OPTIONS)
        .where(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.in(productVariants))
        .execute();

    ctx.deleteFrom(CUSTOMER_CART_SIMPLE_ITEMS)
        .where(CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID.eq(productId))
        .execute();

    ctx.deleteFrom(CUSTOMER_CART_CONFIGURABLE_ITEMS)
        .where(CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.in(productVariants))
        .execute();

    ctx.deleteFrom(PRODUCT_VARIANTS).where(PRODUCT_VARIANTS.ID.eq(productId)).execute();

    ctx.deleteFrom(PRODUCT_TAXONS).where(PRODUCT_TAXONS.PRODUCT_ID.eq(productId)).execute();

    String productImageKey =
        ctx.deleteFrom(PRODUCTS)
            .where(PRODUCTS.ID.eq(productId))
            .returning(PRODUCTS.PRODUCT_IMAGE_URL)
            .fetchOne()
            .getProductImageUrl();

    return productImageKey;
  }

  public static class DTO {
    public static record DeleteManyProductsRequest(@NotNull List<Integer> productIds) {}
  }
}
