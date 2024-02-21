package com.example.demo.services.common.exceptions;

import java.util.Optional;

public final class DbDeletedEntityInUseException extends ApplicationException {
  public DbDeletedEntityInUseException(String entity) {
    super(
        "The entity to be deleted is referenced or used by other entities",
        ErrorCode.DB_DELETED_ENTITY_IN_USE,
        Optional.of(new Info(entity)));
  }

  public static class Info {
    public String entity;

    public Info(String entity) {
      this.entity = entity;
    }
  }
}
