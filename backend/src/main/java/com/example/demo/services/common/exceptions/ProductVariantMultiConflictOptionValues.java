package com.example.demo.services.common.exceptions;

import java.util.List;
import java.util.Optional;

public final class ProductVariantMultiConflictOptionValues extends ApplicationException {
  public ProductVariantMultiConflictOptionValues(List<List<String>> variants) {
    super(
        "Some product variants have the same set of options",
        ErrorCode.PRODUCT_VARIANT_MULTI_CONFLICT_OPTION_VALUES,
        Optional.of(new Info(variants)));
  }

  public static class Info {
    public List<List<String>> variants;

    public Info(List<List<String>> variants) {
      this.variants = variants;
    }
  }
}
