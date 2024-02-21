package com.example.demo.logging;

import com.example.demo.services.common.JwtService;
import com.example.demo.services.common.exceptions.ApplicationException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.HashMap;
import java.util.Map;
import org.springframework.web.bind.MethodArgumentNotValidException;

public class Log {

  public static enum LogEvent {
    HTTP_REQUEST, // ✅ done
    HTTP_RESPONSE, // ✅ done
    SQL_QUERY, // ✅ done
    CUSTOM, // ✅ done
    API_UNEXPECTED_EXCEPTION,
    API_APPLICATION_EXCEPTION,
    API_METHOD_ARGUMENT_INVALID_EXCEPTION,
  }

  public static sealed class Info
      permits InfoHttpRequest,
          InfoHttpResponse,
          InfoSQLQuery,
          InfoCustom,
          InfoUnexpectedException,
          InfoApplicationException,
          InfoMethodArgumentInvalidException {
    public LogEvent event;
    public String requestId;

    protected Info(LogEvent event, RequestId requestId) {
      this.event = event;
      if (requestId != null) {
        this.requestId = requestId.getId();
      }
    }
  }

  // each Info subclass has their own unique `details<name>` property
  // this is to avoid the details of different events mixing together under the same JSON path when
  // being viewed in Elastic or Kibana
  //
  // example: instead of every LogEvent having `info.details` to store their details, we have:
  // `info.detailsRequest` for HTTP_REQUEST event
  // `info.detailsResponse` for HTTP_RESPONSE event
  // ... etc
  public static final class InfoHttpRequest extends Info {

    public final Details detailsRequest;

    private final ObjectMapper mapper = new ObjectMapper();

    public InfoHttpRequest(
        RequestId requestId,
        JwtService.DTO.User user,
        String method,
        String requestUri,
        String requestBody,
        String requestQuery,
        Map<String, String> headers) {
      super(LogEvent.HTTP_REQUEST, requestId);

      Object requestPayload = null;

      if (requestBody != null && requestBody != "") {
        if (requestBody.length() > 5000) {
          requestPayload = "request body too long...";
        } else {
          // try to serialize as JSON
          try {
            Map<String, Object> requestPayloadMap = mapper.readValue(requestBody, HashMap.class);

            // mask password
            if (requestPayloadMap.containsKey("password")) {
              requestPayloadMap.put("password", "xxxxxxxx");
            }
            requestPayload = requestPayloadMap;
          } catch (Exception ex) {
            // ex.printStackTrace();
            // do nothing
          }
        }
      }

      // mask token
      if (headers.containsKey("authorization")) {
        headers.put("authorization", "xxxxxxxx");
      } else if (headers.containsKey("Authorization")) {
        headers.put("Authorization", "xxxxxxxx");
      }

      this.detailsRequest =
          new Details(method, requestUri, requestPayload, requestQuery, headers, user);
    }

    public static record Details(
        String method,
        String requestUri,
        Object requestPayload,
        String requestQuery,
        Map<String, String> headers,
        JwtService.DTO.User user) {}
  }

  public static final class InfoHttpResponse extends Info {
    public final Details detailsResponse;

    public InfoHttpResponse(RequestId requestId, int status, Object responsePayload) {
      super(LogEvent.HTTP_RESPONSE, requestId);
      this.detailsResponse = new Details(status, responsePayload);
    }

    public static record Details(int status, Object responsePayload) {}
  }

  public static final class InfoSQLQuery extends Info {
    public final Details detailsSql;

    public InfoSQLQuery(RequestId requestId, String query) {
      super(LogEvent.SQL_QUERY, requestId);

      // mask password in SQL query
      //
      // a very crude approach to masking just to make the example easier to see
      // with this approach we lost the SQL query information
      //
      // another better approach is to still log the SQL query, but exclude the value of the
      // parameters
      // this can be done with Jooq's DSLContext.render instead of using DSLContext.renderInlined
      if (query.contains("password")) {
        if (query.contains("INSERT") || query.contains("insert")) {
          query = "INSERT ..., password ... INTO ...;";
        } else if (query.contains("UPDATE") || query.contains("update")) {
          query = "UPDATE ..., password ...;";
        }
        // we don't need to mask SELECT, because we don't pass in password in SELECT query
      }

      this.detailsSql = new Details(query);
    }

    public static record Details(String query) {}
  }

  public static final class InfoCustom extends Info {
    public final Object detailsCustom;

    public InfoCustom(RequestId requestId, Object details) {
      super(LogEvent.CUSTOM, requestId);
      this.detailsCustom = details;
    }
  }

  public static final class InfoUnexpectedException extends Info {
    public final Details detailsUnexpectedException;

    public InfoUnexpectedException(RequestId requestId, RuntimeException ex) {
      super(LogEvent.API_UNEXPECTED_EXCEPTION, requestId);
      this.detailsUnexpectedException = new Details(ex);
    }

    public static record Details(RuntimeException exception) {}
  }

  public static final class InfoApplicationException extends Info {
    public final Details detailsApplicationException;

    public InfoApplicationException(RequestId requestId, ApplicationException ex) {
      super(LogEvent.API_APPLICATION_EXCEPTION, requestId);
      this.detailsApplicationException = new Details(ex);
    }

    public static record Details(ApplicationException exception) {}
  }

  public static final class InfoMethodArgumentInvalidException extends Info {
    public final Details detailsMethodArgumentInvalidException;

    public InfoMethodArgumentInvalidException(
        RequestId requestId, MethodArgumentNotValidException ex) {
      super(LogEvent.API_METHOD_ARGUMENT_INVALID_EXCEPTION, requestId);
      this.detailsMethodArgumentInvalidException = new Details(ex);
    }

    public static record Details(MethodArgumentNotValidException exception) {}
  }
}
