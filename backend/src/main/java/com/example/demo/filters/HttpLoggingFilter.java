package com.example.demo.filters;

import com.example.demo.logging.ApplicationLogger;
import com.example.demo.logging.Log;
import com.example.demo.logging.RequestId;
import com.example.demo.services.common.JwtService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ReadListener;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletInputStream;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.Map;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.web.util.ContentCachingRequestWrapper;
import org.springframework.web.util.ContentCachingResponseWrapper;

public class HttpLoggingFilter extends OncePerRequestFilter {
  @Autowired private RequestId requestId;

  @Autowired private ApplicationLogger logger;

  private final ObjectMapper om = new ObjectMapper();

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    RepeatableContentCachingRequestWrapper requestWrapper =
        new RepeatableContentCachingRequestWrapper(request);
    ContentCachingResponseWrapper responseWrapper = new ContentCachingResponseWrapper(response);

    String requestBody = requestWrapper.readInputAndDuplicate();

    Map<String, String> headers =
        Collections.list(request.getHeaderNames()).stream()
            .collect(Collectors.toMap(h -> h, request::getHeader));

    JwtService.DTO.User user = null;
    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null) {
      user = (JwtService.DTO.User) authentication.getPrincipal();
    }

    logger.log(
        new Log.InfoHttpRequest(
            requestId,
            user,
            request.getMethod(),
            request.getRequestURI(),
            requestBody,
            request.getQueryString(),
            headers));

    filterChain.doFilter(requestWrapper, responseWrapper);

    Object responsePayload = null;
    if (!request.getMethod().equals("GET")) {
      String responseBody = new String(responseWrapper.getContentAsByteArray());
      if (!responseBody.isEmpty()) {
        try {
          responsePayload = om.readValue(responseBody, Object.class);
        } catch (Exception ex) {
          responsePayload = responseBody;
        }
      }
    } else {
      responsePayload = "...";
    }
    logger.log(new Log.InfoHttpResponse(requestId, response.getStatus(), responsePayload));

    responseWrapper.copyBodyToResponse();
  }

  public static class RepeatableContentCachingRequestWrapper extends ContentCachingRequestWrapper {
    private SimpleServletInputStream inputStream;

    public RepeatableContentCachingRequestWrapper(HttpServletRequest request) {
      super(request);
    }

    @Override
    public ServletInputStream getInputStream() {
      return this.inputStream;
    }

    public String readInputAndDuplicate() throws IOException {
      if (inputStream == null) {
        byte[] body = super.getInputStream().readAllBytes();
        this.inputStream = new SimpleServletInputStream(body);
      }
      return new String(super.getContentAsByteArray());
    }
  }

  public static class SimpleServletInputStream extends ServletInputStream {
    private InputStream delegate;

    public SimpleServletInputStream(byte[] data) {
      this.delegate = new ByteArrayInputStream(data);
    }

    @Override
    public boolean isFinished() {
      return false;
    }

    @Override
    public boolean isReady() {
      return true;
    }

    @Override
    public void setReadListener(ReadListener listener) {
      throw new UnsupportedOperationException();
    }

    @Override
    public int read() throws IOException {
      return this.delegate.read();
    }
  }
}
