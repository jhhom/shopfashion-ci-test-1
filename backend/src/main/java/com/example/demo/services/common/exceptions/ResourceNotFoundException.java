package com.example.demo.services.common.exceptions;

import java.util.Optional;

public final class ResourceNotFoundException extends ApplicationException {
  public ResourceNotFoundException(String resource) {
    super(
        "Request resource not found",
        ErrorCode.RESOURCE_NOT_FOUND,
        Optional.of(new Info(resource)));
  }

  public static class Info {
    public String resource;

    public Info(String resource) {
      this.resource = resource;
    }
  }
}
