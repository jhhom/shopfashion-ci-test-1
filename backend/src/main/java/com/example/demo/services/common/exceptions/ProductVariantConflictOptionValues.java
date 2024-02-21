package com.example.demo.services.common.exceptions;

import java.util.Optional;

public final class ProductVariantConflictOptionValues extends ApplicationException {
  public ProductVariantConflictOptionValues(String variant) {
    super(
        "Another product variant with same set of options already exist",
        ErrorCode.PRODUCT_VARIANT_CONFLICT_OPTION_VALUES,
        Optional.of(new Info(variant)));
  }

  public static class Info {
    public String variant;

    public Info(String variant) {
      this.variant = variant;
    }
  }
}
