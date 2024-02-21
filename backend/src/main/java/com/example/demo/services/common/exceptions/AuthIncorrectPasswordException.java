package com.example.demo.services.common.exceptions;

import java.util.Optional;

public final class AuthIncorrectPasswordException extends ApplicationException {
  public AuthIncorrectPasswordException() {
    super("Incorrect password", ErrorCode.AUTH_INCORRECT_PASSWORD, Optional.empty());
  }
}
