package com.example.demo.example.controllers;

import static com.example.demo.jooqmodels.Tables.CUSTOMERS;
import static com.example.demo.jooqmodels.Tables.ORDERS;
import static org.junit.jupiter.api.Assertions.assertEquals;

import com.example.demo.controllers.admin.DashboardController;
import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.jooqmodels.tables.records.CustomersRecord;
import com.example.demo.jooqmodels.tables.records.OrdersRecord;
import com.example.demo.services.admin.dashboard.SalesGraphService.SalesGraphPeriod;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import org.jooq.DSLContext;
import org.jooq.JSONB;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@ActiveProfiles("test")
@Transactional
public class DashboardControllerTest {
  @Autowired private DashboardController ctrl;

  @Autowired private DSLContext ctx;

  @Test
  public void should_fetch_graph_with_correct_sales_data() {

    // 1. ARRANGE
    var salesFixture = TestHelper.GraphTest.setupSalesGraphFixture(ctx);

    // 2. ACT
    var date = LocalDateTime.of(2024, 01, 01, 0, 0);
    var dateISO = DateTimeFormatter.ISO_INSTANT.format(date.toInstant(ZoneOffset.UTC));
    var result = ctrl.graph(SalesGraphPeriod.YEAR.name(), dateISO);

    // 3. ASSERT
    BigDecimal expectedTotalSales =
        salesFixture.sales2024.stream()
            .map(s -> s.getTotalPrice())
            .reduce(BigDecimal.ZERO, BigDecimal::add);
    assertEquals(expectedTotalSales.intValue(), result.totalSales.intValue());
  }

  private static class TestHelper {
    public static class GraphTest {
      public static SalesGraphFixture setupSalesGraphFixture(DSLContext ctx) {
        record Sale(double amount, String date, String time) {}

        List<Sale> sales2023 =
            new ArrayList<>() {
              {
                add(new Sale(21.2, "10-21", "05:43"));
                add(new Sale(30, "10-21", "06:21"));
              }
            };

        List<Sale> sales2024 =
            new ArrayList<>() {
              {
                add(new Sale(21.2, "01-21", "05:43"));
                add(new Sale(100, "01-24", "07:21"));

                add(new Sale(21.2, "03-21", "05:43"));
                add(new Sale(35, "03-24", "07:21"));

                add(new Sale(10, "12-21", "05:43"));
                add(new Sale(20, "12-21", "06:21"));
                add(new Sale(30, "12-24", "06:21"));
              }
            };

        var customer = ctx.newRecord(CUSTOMERS);
        customer.setEmail("james@example.com");
        customer.setPassword("123456");
        var customerId =
            ctx.insertInto(CUSTOMERS)
                .columns(CUSTOMERS.EMAIL, CUSTOMERS.PASSWORD)
                .values(customer.getEmail(), customer.getPassword())
                .returning(CUSTOMERS.ID)
                .fetchOne(x -> x.get(CUSTOMERS.ID));

        List<OrdersRecord> orders2023 = new ArrayList<>();
        for (var sale : sales2023) {
          var order = ctx.newRecord(ORDERS);
          order.setCustomerId(customerId);
          order.setDeliveryAddress(JSONB.jsonb("{}"));
          order.setOrderStatus(OrderStatus.PAID);
          order.setTotalPrice(BigDecimal.valueOf(sale.amount));
          order.setCreatedAt(date2023(sale.date, sale.time));
          order.store();
          orders2023.add(order);
        }

        List<OrdersRecord> orders2024 = new ArrayList<>();
        for (var sale : sales2024) {
          var order = ctx.newRecord(ORDERS);
          order.setCustomerId(customerId);
          order.setDeliveryAddress(JSONB.jsonb("{}"));
          order.setOrderStatus(OrderStatus.PAID);
          order.setTotalPrice(BigDecimal.valueOf(sale.amount));
          order.setCreatedAt(date2024(sale.date, sale.time));
          order.store();
          orders2024.add(order);
        }

        return new SalesGraphFixture(orders2023, orders2024, customer);
      }

      public static record SalesGraphFixture(
          List<OrdersRecord> sales2023, List<OrdersRecord> sales2024, CustomersRecord customer) {}

      private static LocalDateTime date2023(String date, String time) {
        return LocalDateTime.parse("2023-" + date + "T" + time + ":00");
      }

      private static LocalDateTime date2024(String date, String time) {
        return LocalDateTime.parse("2024-" + date + "T" + time + ":00");
      }
    }
  }
}
