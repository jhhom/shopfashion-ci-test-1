package com.example.demo.services.admin;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.OrderLineItemStatus;
import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.Pagination.PaginationMeta;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class CustomerService {

  private DSLContext ctx;

  public CustomerService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public DTO.GetCustomerDetails.Result getCustomerDetails(int customerId) {
    var customer =
        ctx.select(CUSTOMERS.EMAIL, CUSTOMERS.CREATED_AT)
            .from(CUSTOMERS)
            .where(CUSTOMERS.ID.eq(customerId))
            .fetchOne();

    var orders =
        ctx.select(
                ORDERS.ID,
                ORDERS.SHIPPING_FEE,
                ORDERS.TOTAL_PRICE,
                ORDERS.ORDER_STATUS,
                ORDERS.CREATED_AT,
                arrayRemove(
                        arrayAgg(ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS),
                        (OrderLineItemStatus) null)
                    .as("simple_items_status"),
                arrayRemove(
                        arrayAgg(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS),
                        (OrderLineItemStatus) null)
                    .as("configurable_items_status"))
            .from(
                ORDERS
                    .leftJoin(ORDER_LINE_SIMPLE_ITEMS)
                    .on(ORDER_LINE_SIMPLE_ITEMS.ORDER_ID.eq(ORDERS.ID))
                    .leftJoin(ORDER_LINE_CONFIGURABLE_ITEMS)
                    .on(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID.eq(ORDERS.ID)))
            .where(
                and(
                    or(
                        ORDERS.ORDER_STATUS.eq(OrderStatus.PAID),
                        ORDERS.ORDER_STATUS.eq(OrderStatus.CANCELLED))),
                ORDERS.CUSTOMER_ID.eq(customerId))
            .groupBy(ORDERS.ID)
            .orderBy(ORDERS.CREATED_AT.desc())
            .fetch();

    List<DTO.GetCustomerDetails.Result.Order> orderRecords =
        orders.map(
            o -> {
              var allItemsStatus = new ArrayList<OrderLineItemStatus>(Arrays.asList(o.value6()));
              allItemsStatus.addAll(Arrays.asList(o.value7()));

              OrderLineItemStatus shipmentStatus = OrderLineItemStatus.PROCESSING;
              if (allItemsStatus.contains(OrderLineItemStatus.PROCESSING)) {

              } else if (allItemsStatus.contains(OrderLineItemStatus.TO_SHIP)) {
                shipmentStatus = OrderLineItemStatus.TO_SHIP;
              } else if (allItemsStatus.contains(OrderLineItemStatus.TO_RECEIVE)) {
                shipmentStatus = OrderLineItemStatus.TO_RECEIVE;
              } else if (allItemsStatus.contains(OrderLineItemStatus.COMPLETED)) {
                shipmentStatus = OrderLineItemStatus.COMPLETED;
              }

              return new DTO.GetCustomerDetails.Result.Order(
                  o.value1(),
                  o.value2(),
                  o.value3(),
                  o.value4(),
                  o.value5(),
                  o.value6(),
                  o.value7(),
                  shipmentStatus);
            });

    // https://stackoverflow.com/questions/41749539/how-to-serialize-localdatetime-with-jackson
    // https://www.baeldung.com/java-serialization-approaches

    int numberOfOrders = orderRecords.size();
    BigDecimal totalOrdersValue =
        orderRecords.stream().map(o -> o.totalPrice()).reduce(BigDecimal.ZERO, BigDecimal::add);
    BigDecimal avgOrdersValue =
        numberOfOrders == 0
            ? BigDecimal.ZERO
            : totalOrdersValue.divide(BigDecimal.valueOf(numberOfOrders));

    DTO.GetCustomerDetails.Result result =
        new DTO.GetCustomerDetails.Result(
            numberOfOrders,
            totalOrdersValue,
            avgOrdersValue,
            customer.value1(),
            customer.value2(),
            orderRecords);

    return result;
  }

  public DTO.ListCustomers.Result listCustomers(
      DTO.ListCustomers.Filter filter, Pagination reqPagination) {
    var dataQuery = ctx.select(CUSTOMERS.ID, CUSTOMERS.EMAIL, CUSTOMERS.CREATED_AT).from(CUSTOMERS);

    var countQuery = ctx.select(count(CUSTOMERS.ID)).from(CUSTOMERS);

    if (filter != null && filter.email != null) {
      dataQuery.where(CUSTOMERS.EMAIL.likeIgnoreCase("%" + filter.email + "%"));
      countQuery.where(CUSTOMERS.EMAIL.likeIgnoreCase("%" + filter.email + "%"));
    }

    var countResult = countQuery.fetchOne();
    var totalItems = countResult.value1();

    int totalPages =
        (int)
            Math.round(
                Math.ceil(
                    totalItems.doubleValue()
                        / (reqPagination == null
                            ? Pagination.MAX_PAGE_SIZE
                            : reqPagination.pageSize)));
    Pagination pagination =
        reqPagination != null ? reqPagination : new Pagination(Pagination.MAX_PAGE_SIZE, 1);

    if (pagination.pageNumber > totalPages) {
      pagination.pageNumber = totalPages;
    }

    Pagination.SQLPagination pointer = Pagination.paginationToLimitOffsetPointer(pagination);

    var customers = dataQuery.limit(pointer.limit).offset(pointer.offset).fetch();

    DTO.ListCustomers.Result result =
        new DTO.ListCustomers.Result(
            customers.map(
                c -> {
                  return new DTO.ListCustomers.Result.Customer(c.value1(), c.value2(), c.value3());
                }),
            new PaginationMeta(totalItems, pagination.pageSize, pagination.pageNumber));

    return result;
  }

  public static class DTO {
    public static class GetCustomerDetails {
      public record Result(
          int numberOfOrders,
          BigDecimal totalOrdersValue,
          BigDecimal avgOrdersValue,
          String customerEmail,
          LocalDateTime customerSince,
          List<Order> orders) {
        public static record Order(
            Integer orderId,
            BigDecimal shippingFee,
            BigDecimal totalPrice,
            OrderStatus paymentStatus,
            LocalDateTime date,
            OrderLineItemStatus[] simpleItemsStatus,
            OrderLineItemStatus[] configurableItemsStatus,
            OrderLineItemStatus shipmentStatus) {}
      }
    }

    public static class ListCustomers {
      public static record Result(
          List<Customer> results, Pagination.PaginationMeta paginationMeta) {

        public static record Customer(Integer id, String email, LocalDateTime registeredAt) {}
      }

      public static record Filter(String email) {}
    }
  }
}
