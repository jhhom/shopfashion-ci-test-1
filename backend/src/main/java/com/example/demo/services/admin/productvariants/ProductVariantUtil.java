package com.example.demo.services.admin.productvariants;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import java.util.List;
import java.util.Optional;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.jooq.DSLContext;
import org.jooq.impl.DSL;

public class ProductVariantUtil {
  public String generateProductVariantFilename(
      int productId, String variantName, String fileExtension) {
    return "V_" + productId + "-" + variantName + "-product-variant" + fileExtension != null
        ? "." + fileExtension
        : "";
  }

  public static ImmutablePair<Boolean, String> isProductVariantUnique(
      DSLContext ctx,
      List<Integer> optionValueIds,
      int productId,
      Optional<Integer> productVariantId) {

    var queryConditions = and(PRODUCT_VARIANTS.PRODUCT_ID.eq(productId));

    var query =
        ctx.select(PRODUCT_VARIANTS.ID, PRODUCT_VARIANTS.VARIANT_NAME)
            .from(PRODUCT_VARIANTS)
            .join(PRODUCT_VARIANT_OPTIONS)
            .on(PRODUCT_VARIANT_OPTIONS.PRODUCT_VARIANT_ID.eq(PRODUCT_VARIANTS.ID));

    if (productVariantId.isPresent()) {
      queryConditions = queryConditions.and(PRODUCT_VARIANTS.ID.notEqual(productVariantId.get()));
    }

    String conflictingVariantName =
        query
            .where(queryConditions)
            .groupBy(PRODUCT_VARIANTS.ID, PRODUCT_VARIANTS.VARIANT_NAME)
            .having(
                arrayAgg(PRODUCT_VARIANT_OPTIONS.PRODUCT_OPTION_VALUE_ID)
                    .contains(array(optionValueIds.toArray(new Integer[0]))))
            .fetchOne(x -> x.value2());

    System.out.println("SQL: " + query);

    if (conflictingVariantName == null) {
      return ImmutablePair.of(true, "");
    }
    return ImmutablePair.of(false, conflictingVariantName);
  }
}
