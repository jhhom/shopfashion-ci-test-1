package com.example.demo.services.common.exceptions;

import java.util.Optional;

public final class DbUniqueValueConflictException extends ApplicationException {
  public DbUniqueValueConflictException(String entity) {
    super(
        "The value to be used is conflicting with other values",
        ErrorCode.DB_UNIQUE_VALUE_CONFLICT,
        Optional.of(new Info(entity)));
  }

  public static class Info {
    public String entity;

    public Info(String entity) {
      this.entity = entity;
    }
  }
}
