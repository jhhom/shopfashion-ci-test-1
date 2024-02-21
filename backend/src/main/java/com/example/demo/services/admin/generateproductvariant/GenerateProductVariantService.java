package com.example.demo.services.admin.generateproductvariant;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.common.exceptions.ProductVariantConflictVariantNames;
import com.example.demo.services.common.exceptions.ProductVariantMultiConflictOptionValues;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class GenerateProductVariantService {
  private DSLContext ctx;

  public GenerateProductVariantService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public DTO.GenerateProductVariant.Result generateProductVariant(int productId)
      throws JsonProcessingException {
    var options =
        ctx.select(
                PRODUCT_OPTIONS.CODE,
                PRODUCT_OPTIONS.OPTION_NAME,
                multisetAgg(PRODUCT_OPTION_VALUES.ID, PRODUCT_OPTION_VALUES.OPTION_VALUE))
            .from(PRODUCT_CONFIGURABLE_OPTIONS)
            .join(PRODUCT_OPTIONS)
            .on(PRODUCT_OPTIONS.CODE.eq(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_OPTION_CODE))
            .join(PRODUCT_OPTION_VALUES)
            .on(PRODUCT_OPTION_VALUES.OPTION_CODE.eq(PRODUCT_OPTIONS.CODE))
            .where(PRODUCT_CONFIGURABLE_OPTIONS.PRODUCT_ID.eq(productId))
            .groupBy(PRODUCT_OPTIONS.CODE)
            .fetch(
                o -> {
                  var v =
                      new DTO.GenerateProductVariant.Result.ConfigurableOption(
                          o.value1(),
                          o.value2(),
                          o.value3()
                              .map(
                                  _o ->
                                      new DTO.GenerateProductVariant.Result.ConfigurableOptionValue(
                                          _o.value1(), _o.value2())));
                  return v;
                });

    var existingProductVariants =
        ctx.select(
                PRODUCT_VARIANTS.ID,
                PRODUCT_VARIANTS.VARIANT_NAME,
                multisetAgg(
                    PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID,
                    PRODUCT_OPTION_VALUES.OPTION_CODE))
            .from(PRODUCT_VARIANTS)
            .join(PRODUCT_VARIANT_OPTIONS)
            .on(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(PRODUCT_VARIANTS.ID))
            .join(PRODUCT_OPTION_VALUES)
            .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
            .where(PRODUCT_VARIANTS.PRODUCT_ID.eq(productId))
            .groupBy(PRODUCT_VARIANTS.ID)
            .orderBy(PRODUCT_VARIANTS.POSITION.asc())
            .fetch(
                v ->
                    new DTO.GenerateProductVariant.Result.ExistingProductVariant(
                        v.value1(),
                        v.value2(),
                        v.value3()
                            .map(
                                o -> {
                                  return new Util.Variant.Option(o.value2(), o.value1());
                                })));

    String productName =
        ctx.select(PRODUCTS.PRODUCT_NAME)
            .from(PRODUCTS)
            .where(PRODUCTS.ID.eq(productId))
            .fetchOne()
            .value1();

    var optionsToGenerateVariantFrom =
        options.stream()
            .map(
                o -> {
                  Map<Integer, String> optionsMap = new HashMap<Integer, String>();

                  o.values.forEach(
                      v -> {
                        optionsMap.put(v.id, v.value);
                      });

                  return ImmutablePair.of(o.code, optionsMap);
                })
            .toList();

    ObjectMapper om = new ObjectMapper();

    var possibleVariants = Util.generateVariant(optionsToGenerateVariantFrom);

    var possibleVariantsWithoutExistingVariants =
        possibleVariants.stream()
            .filter(
                possibleVariant -> {
                  return !existingProductVariants.stream()
                      .anyMatch(
                          existing -> {
                            var firstVariant =
                                existing.options.stream()
                                    .map(
                                        x -> {
                                          return ImmutablePair.of(x.code(), x.valueId());
                                        })
                                    .toList();
                            var secondVariant =
                                possibleVariant.options().stream()
                                    .map(
                                        x -> {
                                          return ImmutablePair.of(x.code(), x.valueId());
                                        })
                                    .toList();

                            var isEqual = Util.isVariantEqual(firstVariant, secondVariant);

                            return isEqual;
                          });
                })
            .map(
                v -> {
                  return new DTO.GenerateProductVariant.Result.GeneratedProductVariant(
                      v.name(),
                      v.options().stream()
                          .map(
                              _v -> {
                                Util.Variant.Option o =
                                    new Util.Variant.Option(_v.code(), _v.valueId());
                                return o;
                              })
                          .toList());
                })
            .toList();

    DTO.GenerateProductVariant.Result result = new DTO.GenerateProductVariant.Result();
    result.productName = productName;
    result.configurableOptions = options;
    result.existingProductVariants = existingProductVariants;
    result.generatedProductVariants = possibleVariantsWithoutExistingVariants;

    return result;
  }

  @Transactional
  public ResultMessage saveGeneratedProductVariant(
      int productId,
      List<DTO.SaveGeneratedProductVariant.Request.ExistingProductVariant> existingVariants,
      List<Util.Variant> generatedVariants) {

    List<String> variantNames =
        new ArrayList<>(existingVariants.stream().map(v -> v.name).toList());
    variantNames.addAll(generatedVariants.stream().map(v -> v.name()).toList());

    List<String> repeatedNames = Util.checkForConflictingVariantNames(variantNames);
    if (repeatedNames.size() != 0) {
      throw new ProductVariantConflictVariantNames(repeatedNames);
    }

    List<List<String>> conflictingVariants = Util.getConflictingVariants(generatedVariants);
    if (conflictingVariants.size() > 0) {
      throw new ProductVariantMultiConflictOptionValues(conflictingVariants);
    }

    for (DTO.SaveGeneratedProductVariant.Request.ExistingProductVariant variant :
        existingVariants) {

      ctx.dsl()
          .update(PRODUCT_VARIANTS)
          .set(PRODUCT_VARIANTS.VARIANT_NAME, variant.name)
          .where(PRODUCT_VARIANTS.ID.eq(variant.id))
          .execute();

      for (var o : variant.options) {
        var variantOption =
            ctx.dsl()
                .select(PRODUCT_VARIANT_OPTIONS.ID, PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID)
                .from(PRODUCT_VARIANT_OPTIONS)
                .innerJoin(PRODUCT_OPTION_VALUES)
                .on(PRODUCT_OPTION_VALUES.ID.eq(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID))
                .where(
                    and(
                        PRODUCT_OPTION_VALUES.OPTION_CODE.eq(o.code()),
                        PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(variant.id)))
                .fetchOne();

        if (variantOption.value2() != o.valueId()) {
          ctx.dsl()
              .update(PRODUCT_VARIANT_OPTIONS)
              .set(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID, o.valueId())
              .where(PRODUCT_VARIANT_OPTIONS.ID.eq(variantOption.value1()))
              .execute();
        }
      }
    }

    for (Util.Variant variant : generatedVariants) {
      var lastVariantPositionResult =
          ctx.dsl()
              .select(PRODUCT_VARIANTS.POSITION)
              .from(PRODUCT_VARIANTS)
              .where(PRODUCT_VARIANTS.PRODUCT_ID.eq(productId))
              .orderBy(PRODUCT_VARIANTS.POSITION.desc())
              .limit(1)
              .fetchOne();
      Integer lastVariantPosition =
          lastVariantPositionResult == null ? null : lastVariantPositionResult.value1();

      int position = 1;

      if (lastVariantPosition != null) {
        position = lastVariantPosition + 1;
      }

      Integer variantId =
          ctx.dsl()
              .insertInto(
                  PRODUCT_VARIANTS,
                  PRODUCT_VARIANTS.VARIANT_NAME,
                  PRODUCT_VARIANTS.PRODUCT_ID,
                  PRODUCT_VARIANTS.POSITION)
              .values(variant.name(), productId, position)
              .returning(PRODUCT_VARIANTS.ID)
              .fetchOne()
              .getId();

      if (variant.options().size() > 0) {
        var batch =
            ctx.dsl()
                .batch(
                    ctx.dsl()
                        .insertInto(
                            PRODUCT_VARIANT_OPTIONS,
                            PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID,
                            PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID)
                        .values((Integer) null, null));

        for (var o : variant.options()) {
          batch.bind(o.valueId(), variantId);
        }
        batch.execute();
      }
    }

    return new ResultMessage("Generated product variants saved successfully");
  }

  public static class DTO {
    public static class GenerateProductVariant {
      public static class Result {

        public String productName;
        public List<ConfigurableOption> configurableOptions;
        public List<ExistingProductVariant> existingProductVariants;
        public List<GeneratedProductVariant> generatedProductVariants;

        public static record ConfigurableOption(
            String code, String name, List<ConfigurableOptionValue> values) {}

        public static record ConfigurableOptionValue(int id, String value) {}

        public static record ExistingProductVariant(
            int id, String name, List<Util.Variant.Option> options) {}

        public static record GeneratedProductVariant(
            String name, List<Util.Variant.Option> options) {}
      }
    }

    public static class SaveGeneratedProductVariant {
      public static record Request(
          @NotNull List<ExistingProductVariant> existingProductVariants,
          @NotNull List<Util.Variant> generatedProductVariants) {
        public static record ExistingProductVariant(
            @NotNull Integer id,
            @NotNull String name,
            @NotNull List<Util.Variant.Option> options) {}
      }
    }
  }
}
