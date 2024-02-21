package com.example.demo.services.admin.productvariants;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.common.exceptions.ProductVariantConflictOptionValues;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import lombok.Getter;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductVariantCommandService {
  private final DSLContext ctx;

  public ProductVariantCommandService(DSLContext ctx) {
    this.ctx = ctx;
  }

  @Transactional
  public ResultMessage createProductVariant(DTO.CreateProductVariant.Request req) {
    var isUnique =
        ProductVariantUtil.isProductVariantUnique(
            ctx,
            req.options.stream().map(o -> o.optionValueId).toList(),
            req.productId,
            Optional.empty());

    if (!isUnique.left) {
      throw new ProductVariantConflictOptionValues(isUnique.right);
    }

    var lastVariantPosition =
        ctx.select(PRODUCT_VARIANTS.POSITION)
            .from(PRODUCT_VARIANTS)
            .where(PRODUCT_VARIANTS.PRODUCT_ID.eq(req.productId))
            .orderBy(PRODUCT_VARIANTS.POSITION.desc())
            .fetchOne(x -> x.value1());

    int position = 1;
    if (lastVariantPosition != null) {
      position = lastVariantPosition + 1;
    }

    var variantId =
        ctx.insertInto(PRODUCT_VARIANTS)
            .set(PRODUCT_VARIANTS.VARIANT_NAME, req.variantName)
            .set(PRODUCT_VARIANTS.PRODUCT_ID, req.productId)
            .set(PRODUCT_VARIANTS.POSITION, position)
            .set(PRODUCT_VARIANTS.PRICING, req.pricing)
            .returning(PRODUCT_VARIANTS.ID)
            .fetchOne(x -> x.getId());

    if (req.options.size() > 0) {
      var batch =
          ctx.batch(
              ctx.insertInto(
                      PRODUCT_VARIANT_OPTIONS,
                      PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID,
                      PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID)
                  .values((Integer) null, null));

      for (var o : req.options) {
        batch.bind(o.optionValueId, variantId);
      }
      batch.execute();
    }

    return new ResultMessage("Product variant created successfully");
  }

  @Transactional
  public ResultMessage editProductVariant(
      int productVariantId, DTO.EditProductVariant.Request req) {

    var isUnique =
        ProductVariantUtil.isProductVariantUnique(
            ctx,
            req.options.stream().map(o -> o.optionValueId).toList(),
            req.productId,
            Optional.of(productVariantId));
    if (!isUnique.left) {
      throw new ProductVariantConflictOptionValues(isUnique.right);
    }

    ctx.update(PRODUCT_VARIANTS)
        .set(PRODUCT_VARIANTS.VARIANT_NAME, req.variantName)
        .set(PRODUCT_VARIANTS.PRODUCT_STATUS, req.status)
        .set(PRODUCT_VARIANTS.PRICING, req.pricing)
        .where(PRODUCT_VARIANTS.ID.eq(productVariantId))
        .returning(PRODUCT_VARIANTS.ID)
        .fetchOne(x -> x.getId());

    for (var o : req.options) {
      var variantOption =
          ctx.select(PRODUCT_VARIANT_OPTIONS.ID, PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID)
              .from(PRODUCT_VARIANT_OPTIONS)
              .join(PRODUCT_OPTION_VALUES)
              .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
              .where(
                  and(
                      PRODUCT_OPTION_VALUES.OPTION_CODE.eq(o.optionCode),
                      PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(productVariantId)))
              .fetchOne();
      if (variantOption.value2() != o.optionValueId) {
        ctx.update(PRODUCT_VARIANT_OPTIONS)
            .set(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID, o.optionValueId)
            .where(PRODUCT_VARIANT_OPTIONS.ID.eq(variantOption.value1()))
            .execute();
      }
    }

    if (req.status == ProductStatus.ARCHIVED) {
      ctx.deleteFrom(CUSTOMER_CART_CONFIGURABLE_ITEMS)
          .where(CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(productVariantId))
          .execute();
    }

    return new ResultMessage("Product variant updated successfully");
  }

  @Transactional
  public ResultMessage deleteProductVariant(int productVariantId) {

    ctx.deleteFrom(ORDER_LINE_CONFIGURABLE_ITEMS)
        .where(ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(productVariantId))
        .execute();

    ctx.deleteFrom(PRODUCT_VARIANT_OPTIONS)
        .where(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(productVariantId))
        .execute();

    ctx.deleteFrom(PRODUCT_VARIANTS)
        .where(PRODUCT_VARIANTS.ID.eq(productVariantId))
        .returning(PRODUCT_VARIANTS.PRODUCT_VARIANT_IMAGE_URL)
        .fetchOne(x -> x.getProductVariantImageUrl());

    return new ResultMessage("Product variant deleted successfully");
  }

  public static class DTO {
    public static class CreateProductVariant {
      @Getter
      public static class Request {
        @NotNull public Integer productId;

        @NotNull public String variantName;

        @NotNull public BigDecimal pricing;

        @NotNull public ProductStatus status;

        @Valid @NotNull public List<Option> options;
      }

      public static record Option(@NotNull String optionCode, @NotNull Integer optionValueId) {}
    }

    public static class EditProductVariant {
      @Getter
      public static class Request {
        @Positive public Integer productId;

        @NotNull public String variantName;

        @NotNull public BigDecimal pricing;

        @NotNull public ProductStatus status;

        @NotNull public List<Option> options;

        public static record Option(@NotNull String optionCode, @NotNull Integer optionValueId) {}
      }
    }
  }
}
