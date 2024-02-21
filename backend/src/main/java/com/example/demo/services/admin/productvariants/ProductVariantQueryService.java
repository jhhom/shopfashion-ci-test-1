package com.example.demo.services.admin.productvariants;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.ProductStatus;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class ProductVariantQueryService {

  private final DSLContext ctx;

  public ProductVariantQueryService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public  DTO.ListProductVariants.Response listProductVariants(
       String filterVariantName, int productId) {
    String productName =
        ctx.select(PRODUCTS.PRODUCT_NAME)
            .from(PRODUCTS)
            .where(PRODUCTS.ID.eq(productId))
            .fetchOne(x -> x.value1());

    var queryConditions = and(PRODUCTS.ID.eq(productId));

    var query =
        ctx.select(
                PRODUCT_VARIANTS.ID,
                PRODUCT_VARIANTS.VARIANT_NAME,
                PRODUCT_VARIANTS.POSITION,
                arrayAgg(PRODUCT_OPTION_VALUES.OPTION_VALUE).orderBy(PRODUCT_OPTIONS.CODE.asc()))
            .from(PRODUCT_VARIANTS)
            .innerJoin(PRODUCT_VARIANT_OPTIONS)
            .on(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(PRODUCT_VARIANTS.ID))
            .innerJoin(PRODUCT_OPTION_VALUES)
            .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
            .innerJoin(PRODUCT_OPTIONS)
            .on(PRODUCT_OPTIONS.CODE.eq(PRODUCT_OPTION_VALUES.OPTION_CODE))
            .innerJoin(PRODUCTS)
            .on(PRODUCTS.ID.eq(PRODUCT_VARIANTS.PRODUCT_ID));

    if (filterVariantName != null) {
      queryConditions =
          queryConditions.and(
              PRODUCT_VARIANTS.VARIANT_NAME.likeIgnoreCase("%" + filterVariantName + "%"));
    }

    query
        .where(queryConditions)
        .groupBy(PRODUCT_VARIANTS.ID)
        .orderBy(PRODUCT_VARIANTS.POSITION.asc());

    var variants =
        query.fetch(
            v -> {
              System.out.println("OPTION VALUES: " + Arrays.toString(v.value4()));

              var r = new DTO.ListProductVariants.Response.ProductVariant();
              r.id = v.value1();
              r.name = v.value2();
              r.position = v.value3();
              r.optionValues = String.join(" | ", v.value4());
              return r;
            });

    return new DTO.ListProductVariants.Response(productName, variants);
  }

  public DTO.GetProductVariantForEdit.Response getProductVariantForEdit(int productVariantId) {
    var productVariant =
        ctx.select(
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                PRODUCT_VARIANTS.VARIANT_NAME,
                PRODUCT_VARIANTS.PRODUCT_STATUS,
                PRODUCT_VARIANTS.PRICING)
            .from(PRODUCTS)
            .join(PRODUCT_VARIANTS)
            .on(PRODUCTS.ID.eq(PRODUCT_VARIANTS.PRODUCT_ID))
            .where(PRODUCT_VARIANTS.ID.eq(productVariantId))
            .fetchOne(
                v -> {
                  var r = new DTO.GetProductVariantForEdit.Response();
                  r.productId = v.value1();
                  r.productName = v.value2();
                  r.productVariantName = v.value3();
                  r.status = v.get(PRODUCT_VARIANTS.PRODUCT_STATUS);
                  r.pricing = v.get(PRODUCT_VARIANTS.PRICING);

                  return r;
                });

    var optionValues =
        ctx.select(
                PRODUCT_OPTIONS.CODE,
                PRODUCT_OPTIONS.OPTION_NAME,
                multisetAgg(PRODUCT_OPTION_VALUES.ID, PRODUCT_OPTION_VALUES.OPTION_VALUE))
            .from(PRODUCT_CONFIGURABLE_OPTIONS)
            .join(PRODUCT_OPTIONS)
            .on(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_OPTION_CODE.eq(PRODUCT_OPTIONS.CODE))
            .join(PRODUCT_OPTION_VALUES)
            .on(PRODUCT_OPTION_VALUES.OPTION_CODE.eq(PRODUCT_OPTIONS.CODE))
            .where(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_ID.eq(productVariant.productId))
            .groupBy(PRODUCT_OPTIONS.CODE)
            .fetch(
                v -> {
                  var o = new DTO.GetProductVariantForEdit.ResponseConfigurableOption();
                  o.optionCode = v.value1();
                  o.optionName = v.value2();
                  o.optionValues =
                      v.value3()
                          .map(
                              x -> {
                                return new DTO.GetProductVariantForEdit.ResponseOptionValue(
                                    x.value1(), x.value2());
                              });

                  return o;
                });

    for (var option : optionValues) {
      var productOptionValueId =
          ctx.select(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID)
              .from(PRODUCT_VARIANT_OPTIONS)
              .join(PRODUCT_OPTION_VALUES)
              .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
              .where(
                  and(
                      PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(productVariantId),
                      PRODUCT_OPTION_VALUES.OPTION_CODE.eq(option.optionCode)))
              .fetchOne(x -> x.value1());
      option.currentValueId = productOptionValueId;
    }

    productVariant.configurableOptions = optionValues;
    return productVariant;
  }

  public static class DTO {
    public static class ListProductVariants {
      public static record QueryFilter(String variantName) {}

      public static record Response(String productName, List<ProductVariant> variants) {
        public static class ProductVariant {
          public int id;
          public String name;
          public int position;
          public String optionValues;
        }
      }
    }

    public static class GetProductVariantForEdit {
      public static class Response {
        private int productId;

        public String productName;
        public String productVariantName;
        public BigDecimal pricing;
        public ProductStatus status;
        public List<ResponseConfigurableOption> configurableOptions;
      }

      public static class ResponseConfigurableOption {
        public String optionCode;
        public String optionName;
        public int currentValueId;
        public List<ResponseOptionValue> optionValues;
      }

      public static record ResponseOptionValue(int id, String value) {}
    }
  }
}
