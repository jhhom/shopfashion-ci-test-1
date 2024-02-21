package com.example.demo.controllers.admin;

import com.example.demo.services.admin.dashboard.RecentSalesService;
import com.example.demo.services.admin.dashboard.SalesGraphService;
import com.example.demo.services.admin.dashboard.SalesGraphService.SalesGraphPeriod;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAccessor;
import java.util.Date;
import org.jooq.DSLContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/admin/dashboard")
public class DashboardController {

  private final SalesGraphService salesGraphService;
  private final RecentSalesService recentSalesService;

  public DashboardController(
      SalesGraphService salesGraphService, RecentSalesService recentSalesService) {
    this.salesGraphService = salesGraphService;
    this.recentSalesService = recentSalesService;
  }

  @GetMapping("sales_graph/{period}")
  public SalesGraphService.DTO.GraphResult graph(
      @PathVariable String period, @RequestParam(name = "date", required = true) String date) {

    TemporalAccessor ta = DateTimeFormatter.ISO_INSTANT.parse(date);
    Instant i = Instant.from(ta);
    Date d = Date.from(i);
    var salesPeriod = SalesGraphPeriod.valueOf(period);

    return salesGraphService.graph(
        salesPeriod, d.toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
  }

  @GetMapping("recent_customers_orders")
  public RecentSalesService.DTO.Result recentSales() {
    return recentSalesService.RecentSalesResult();
  }
}
