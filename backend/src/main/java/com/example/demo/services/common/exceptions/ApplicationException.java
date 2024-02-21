package com.example.demo.services.common.exceptions;

import java.util.Optional;

public abstract sealed class ApplicationException extends RuntimeException
    permits ResourceNotFoundException,
        AuthUnauthorizedException,
        AuthIncorrectPasswordException,
        DbUniqueValueConflictException,
        DbDeletedEntityInUseException,
        ProductOptionConflictOptionValueNames,
        ProductVariantConflictOptionValues,
        ProductVariantMultiConflictOptionValues,
        ProductVariantConflictVariantNames {

  public ErrorCode code;
  public Optional<Object> info;
  public Optional<Integer> httpStatus;

  public ApplicationException(String message, ErrorCode code, Optional<Object> info) {
    super(message);
    this.code = code;
    this.info = info;
  }

  public ApplicationException(
      String message, ErrorCode code, Optional<Object> info, int httpStatus) {
    super(message);
    this.code = code;
    this.info = info;
    this.httpStatus = Optional.of(httpStatus);
  }
}
