package com.example.demo.services.common.exceptions;

import java.util.Optional;

public final class ProductOptionConflictOptionValueNames extends ApplicationException {
  public ProductOptionConflictOptionValueNames() {
    super(
        "Multiple option values have the same name",
        ErrorCode.PRODUCT_OPTION_MULTIPLE_OPTION_VALUES_WITH_SAME_NAME,
        Optional.empty());
  }
}
