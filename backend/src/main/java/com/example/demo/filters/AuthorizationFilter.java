package com.example.demo.filters;

import com.example.demo.logging.ApplicationLogger;
import com.example.demo.logging.Log;
import com.example.demo.logging.RequestId;
import com.example.demo.services.common.JwtService;
import com.example.demo.services.common.JwtService.UserRole;
import com.example.demo.services.common.exceptions.AuthUnauthorizedException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

public class AuthorizationFilter extends OncePerRequestFilter {
  private final String header = "Authorization";

  @Autowired private RequestId requestId;

  @Autowired private JwtService jwtService;

  @Override
  protected void doFilterInternal(
      HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
      throws ServletException, IOException {
    var authHeader = request.getHeader(this.header);

    if (authHeader == null || authHeader.isBlank()) {
      filterChain.doFilter(request, response);
      return;
    } else {
      if (!authHeader.startsWith("Bearer ")) {
        throw new AuthUnauthorizedException();
      }

      String token = authHeader.substring(7);

      Optional<JwtService.DTO.User> user = jwtService.getUserFromToken(token);

      List<SimpleGrantedAuthority> authorities = new ArrayList<>();

      if (!user.isEmpty()) {
        if (user.get().userRole() == UserRole.ADMIN) {
          authorities.add(new SimpleGrantedAuthority("ROLE_" + UserRole.ADMIN.name()));
        } else if (user.get().userRole() == UserRole.CUSTOMER) {
          authorities.add(new SimpleGrantedAuthority("ROLE_" + UserRole.CUSTOMER.name()));
        }

        UsernamePasswordAuthenticationToken principalToken =
            new UsernamePasswordAuthenticationToken(user.get(), null, authorities);

        SecurityContextHolder.getContext().setAuthentication(principalToken);
      }

      filterChain.doFilter(request, response);
    }
  }
}
