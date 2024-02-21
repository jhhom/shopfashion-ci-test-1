package com.example.demo.controllers.admin;

import jakarta.validation.Valid;
import org.jooq.DSLContext;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.services.admin.AdminService;
import com.example.demo.services.common.JwtService;

@RestController
public class AdminLoginController {

  private final AdminService adminService;

  public AdminLoginController(AdminService adminService) {
    this.adminService = adminService;
  }

  @PostMapping("admin_login")
  public AdminService.DTO.Login.Response login(
      @RequestBody @Valid AdminService.DTO.Login.Request req) {
    return adminService.loginBasic(req);
  }

  @PostMapping("admin/verify_token")
  public DTO.VerifyTokenResponse verifyToken(@AuthenticationPrincipal JwtService.DTO.User user) {
    return new DTO.VerifyTokenResponse(user.userEmail());
  }

  public class DTO {
    public static record VerifyTokenResponse(String email) {}
  }
}
