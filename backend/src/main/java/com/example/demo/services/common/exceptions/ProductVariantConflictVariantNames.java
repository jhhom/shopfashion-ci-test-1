package com.example.demo.services.common.exceptions;

import java.util.List;
import java.util.Optional;

public final class ProductVariantConflictVariantNames extends ApplicationException {
  public ProductVariantConflictVariantNames(List<String> names) {
    super(
        "Multiple variants have the same name",
        ErrorCode.PRODUCT_VARIANT_CONFLICT_VARIANT_NAMES,
        Optional.of(new Info(names)));
  }

  public static class Info {
    public List<String> names;

    public Info(List<String> names) {
      this.names = names;
    }
  }
}
