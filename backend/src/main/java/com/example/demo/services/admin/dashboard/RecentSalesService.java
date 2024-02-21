package com.example.demo.services.admin.dashboard;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import java.math.BigDecimal;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class RecentSalesService {

  private DSLContext ctx;

  public RecentSalesService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public DTO.Result RecentSalesResult() {
    var customers =
        ctx.select(CUSTOMERS.ID, CUSTOMERS.EMAIL)
            .from(CUSTOMERS)
            .orderBy(CUSTOMERS.CREATED_AT.desc())
            .limit(5)
            .fetch();

    var orders =
        ctx.select(
                ORDERS.ID,
                CUSTOMERS.EMAIL,
                ORDERS.TOTAL_PRICE,
                count(ORDER_LINE_SIMPLE_ITEMS.PRODUCT_ID),
                count(ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID))
            .from(
                ORDERS
                    .join(CUSTOMERS)
                    .on(CUSTOMERS.ID.eq(ORDERS.CUSTOMER_ID))
                    .leftJoin(ORDER_LINE_SIMPLE_ITEMS)
                    .on(ORDER_LINE_SIMPLE_ITEMS.ORDER_ID.eq(ORDERS.ID))
                    .leftJoin(ORDER_LINE_CONFIGURABLE_ITEMS)
                    .on(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID.eq(ORDERS.ID)))
            .groupBy(ORDERS.ID, CUSTOMERS.ID)
            .orderBy(ORDERS.CREATED_AT.desc())
            .limit(5)
            .fetch();

    DTO.Result result = new DTO.Result();

    result.customers =
        customers.map(
            c -> {
              return new DTO.Result.Customer(c.value2(), c.value1());
            });

    result.orders =
        orders.map(
            o -> {
              return new DTO.Result.Order(
                  o.value1(), o.value2(), o.value4() + o.value5(), o.value3());
            });

    return result;
  }

  public static class DTO {
    public static class Result {
      public List<Customer> customers;
      public List<Order> orders;

      public static class Customer {
        public String email;
        public int id;

        Customer(String email, int id) {
          this.email = email;
          this.id = id;
        }
      }

      public static class Order {
        public int id;
        public String email;
        public int numOfItems;
        public BigDecimal totalPrice;

        Order(int id, String email, int numOfItems, BigDecimal totalPrice) {
          this.id = id;
          this.email = email;
          this.numOfItems = numOfItems;
          this.totalPrice = totalPrice;
        }
      }
    }
  }
}
