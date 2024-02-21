package com.example.demo.services.admin;

import static com.example.demo.jooqmodels.Tables.*;

import jakarta.validation.constraints.NotNull;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

import com.example.demo.services.common.JwtService;
import com.example.demo.services.common.exceptions.AuthIncorrectPasswordException;
import com.example.demo.services.common.exceptions.ResourceNotFoundException;

@Service
public class AdminService {

  private final JwtService jwtService;
  private final DSLContext ctx;

  public AdminService(JwtService jwtService, DSLContext ctx) {
    this.jwtService = jwtService;
    this.ctx = ctx;
  }

  public DTO.Login.Response loginBasic(DTO.Login.Request req) {

    record Admin(Integer id, String email, String password) {}

    Admin admin =
        ctx.select(ADMINS.ID, ADMINS.EMAIL, ADMINS.PASSWORD)
            .from(ADMINS)
            .where(ADMINS.EMAIL.eq(req.email))
            .fetchOne(x -> new Admin(x.value1(), x.value2(), x.value3()));

    if (admin == null) {
      throw new ResourceNotFoundException("admins");
    }
    if (!admin.password.equals(req.password)) {
      throw new AuthIncorrectPasswordException();
    }

    String token = jwtService.toToken(admin.email, admin.id, JwtService.UserRole.ADMIN);

    return new DTO.Login.Response(token);
  }

  public static class DTO {
    public static class Login {
      public static record Request(@NotNull String email, @NotNull String password) {}

      public static record Response(String token) {}
    }
  }
}
