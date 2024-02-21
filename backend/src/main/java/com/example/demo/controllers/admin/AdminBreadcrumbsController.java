package com.example.demo.controllers.admin;

import com.example.demo.services.admin.BreadcrumbService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("admin")
public class AdminBreadcrumbsController {

  private final BreadcrumbService breadcrumbService;

  public AdminBreadcrumbsController(BreadcrumbService breadcrumbService) {
    this.breadcrumbService = breadcrumbService;
  }

  @GetMapping("route/{param}/breadcrumb_title/{value}")
  public BreadcrumbService.DTO.GetBreadcrumbTitle.Response getBreadcrumbTitle(
      @PathVariable String param, @PathVariable String value) {
    return breadcrumbService.getBreadcrumbTitle(param, value);
  }
}
