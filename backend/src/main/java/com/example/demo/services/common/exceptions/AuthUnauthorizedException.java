package com.example.demo.services.common.exceptions;

import java.util.Optional;

public final class AuthUnauthorizedException extends ApplicationException {
  public AuthUnauthorizedException() {
    super("Unauthorized", ErrorCode.AUTH_UNAUTHORIZED, Optional.empty());
  }
}
