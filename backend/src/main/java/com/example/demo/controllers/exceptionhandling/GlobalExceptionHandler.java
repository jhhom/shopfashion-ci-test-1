package com.example.demo.controllers.exceptionhandling;

import com.example.demo.logging.ApplicationLogger;
import com.example.demo.logging.Log;
import com.example.demo.logging.RequestId;
import com.example.demo.services.common.exceptions.ApplicationException;
import java.util.Optional;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

  private final ApplicationLogger logger;

  private final RequestId requestId;

  public GlobalExceptionHandler(ApplicationLogger logger, RequestId requestId) {
    this.logger = logger;
    this.requestId = requestId;
  }

  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(
      MethodArgumentNotValidException ex,
      HttpHeaders headers,
      HttpStatusCode status,
      WebRequest request) {
    logger.log(new Log.InfoMethodArgumentInvalidException(requestId, ex));

    return new ResponseEntity<>(
        new ErrorResponse.MethodArgumentNotValidError(ex), HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(ApplicationException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<Object> handleApplicationException(
      ApplicationException ex, WebRequest request) {
    logger.log(new Log.InfoApplicationException(requestId, ex));

    return new ResponseEntity<>(
        new ErrorResponse.ExpectedError(ex.code.name(), ex.getMessage(), ex.info),
        HttpStatus.BAD_REQUEST);
  }

  @ExceptionHandler(RuntimeException.class)
  @ResponseStatus(HttpStatus.BAD_REQUEST)
  public ResponseEntity<Object> handleRuntimeException(RuntimeException ex, WebRequest request) {
    logger.log(new Log.InfoUnexpectedException(requestId, ex));

    return new ResponseEntity<>(new ErrorResponse.UnexpectedError(ex), HttpStatus.BAD_REQUEST);
  }

  public class ErrorResponse {
    public static final class MethodArgumentNotValidError {
      public final String type = "method_argument_not_valid";
      public final MethodArgumentNotValidException exception;

      public MethodArgumentNotValidError(MethodArgumentNotValidException exception) {
        this.exception = exception;
      }
    }

    public static final class ExpectedError {
      public final String type = "application";
      public final Error error;

      public ExpectedError(String code, String message, Optional<Object> info) {

        if (info.isPresent()) {
          ErrorDetails details = new ErrorDetails(code, info.get());
          this.error = new Error(message, details);

        } else {
          ErrorDetails details = new ErrorDetails(code, null);
          this.error = new Error(message, details);
        }
      }

      public static record Error(String message, ErrorDetails details) {}

      public static record ErrorDetails(String code, Object info) {}
    }

    public static final class UnexpectedError {
      public final String type = "unexpected";
      public final Info error;

      public UnexpectedError(Object cause) {
        this.error = new Info(0, cause);
      }

      private static record Info(int traceId, Object cause) {}
    }
  }
}
