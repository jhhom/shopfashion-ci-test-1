package com.example.demo.services.admin.order;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.OrderLineItemStatus;
import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.services.common.MediaService;
import com.example.demo.services.common.Pagination;
import com.example.demo.services.common.Pagination.PaginationMeta;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class OrderQueryService {
  private final DSLContext ctx;
  private final MediaService mediaService;

  public OrderQueryService(DSLContext ctx, MediaService mediaService) {
    this.ctx = ctx;
    this.mediaService = mediaService;
  }

  public DTO.GetOneOrder.Result getOneOrder(int orderId) throws JsonProcessingException {
    var _order =
        ctx.select(
                ORDERS.CUSTOMER_ID,
                ORDERS.CREATED_AT,
                ORDERS.TOTAL_PRICE,
                ORDERS.SHIPPING_FEE,
                ORDERS.ORDER_STATUS,
                ORDERS.DELIVERY_ADDRESS)
            .from(ORDERS)
            .where(ORDERS.ID.eq(orderId))
            .fetchOne();

    DTO.GetOneOrder.Result.DeliveryAddress address;
    ObjectMapper om = new ObjectMapper();
    try {
      address =
          om.readValue(_order.value6().toString(), DTO.GetOneOrder.Result.DeliveryAddress.class);
      System.out.println(address.address2);
    } catch (JsonProcessingException e) {
      throw e;
    }

    int customerId = _order.value1();
    BigDecimal totalPrice = _order.value3();
    BigDecimal shippingFee = _order.value4();

    DTO.GetOneOrder.Result.Order order = new DTO.GetOneOrder.Result.Order();
    order.itemsSubtotal = totalPrice;
    order.shippingTotal = shippingFee;
    order.orderTotal = totalPrice.add(shippingFee);
    order.orderStatus = _order.value5();
    order.createdAt = _order.value2();
    order.deliveryAddress = address;

    var customer =
        ctx.select(CUSTOMERS.EMAIL, CUSTOMERS.CREATED_AT)
            .from(CUSTOMERS)
            .where(CUSTOMERS.ID.eq(customerId))
            .fetchOne();

    var orderLineItems =
        ctx.select(
                PRODUCTS.ID,
                PRODUCTS.PRODUCT_NAME,
                ORDER_LINE_SIMPLE_ITEMS.UNIT_PRICE,
                ORDER_LINE_SIMPLE_ITEMS.QUANTITY,
                ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .from(ORDER_LINE_SIMPLE_ITEMS)
            .join(PRODUCTS)
            .on(ORDER_LINE_SIMPLE_ITEMS.PRODUCT_ID.eq(PRODUCTS.ID))
            .where(ORDER_LINE_SIMPLE_ITEMS.ORDER_ID.eq(orderId))
            .fetch()
            .map(
                r -> {
                  var i = new DTO.GetOneOrder.Result.OrderLineItems();
                  i.productId = r.value1();
                  i.productName = r.value2();
                  i.unitPrice = r.value3();
                  i.quantity = r.value4();
                  i.orderLineItemStatus = r.value5();
                  i.isConfigurableProduct = false;
                  i.productImageUrl = mediaService.mediaUrl(r.value6());
                  return i;
                });

    var configurableItems =
        ctx.select(
                PRODUCT_VARIANTS.ID,
                PRODUCTS.PRODUCT_NAME,
                ORDER_LINE_CONFIGURABLE_ITEMS.UNIT_PRICE,
                ORDER_LINE_CONFIGURABLE_ITEMS.QUANTITY,
                ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS,
                PRODUCTS.PRODUCT_IMAGE_URL)
            .from(ORDER_LINE_CONFIGURABLE_ITEMS)
            .join(PRODUCT_VARIANTS)
            .on(ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(PRODUCT_VARIANTS.ID))
            .join(PRODUCTS)
            .on(PRODUCT_VARIANTS.PRODUCT_ID.eq(PRODUCTS.ID))
            .where(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID.eq(orderId))
            .fetch()
            .map(
                r -> {
                  var i = new DTO.GetOneOrder.Result.OrderLineItems();
                  i.productId = r.value1();
                  i.productName = r.value2();
                  i.unitPrice = r.value3();
                  i.quantity = r.value4();
                  i.orderLineItemStatus = r.value5();
                  i.isConfigurableProduct = true;
                  i.productImageUrl = mediaService.mediaUrl(r.value6());
                  return i;
                });

    orderLineItems.addAll(configurableItems);

    return new DTO.GetOneOrder.Result(
        order,
        new DTO.GetOneOrder.Result.Customer(customer.value1(), customer.value2()),
        orderLineItems);
  }

  public DTO.ListOrders.Result listOrders(
      DTO.ListOrders.QueryFilter filter, Pagination reqPagination) {

    var dataQueryCondition =
        or(ORDERS.ORDER_STATUS.eq(OrderStatus.PAID), ORDERS.ORDER_STATUS.eq(OrderStatus.CANCELLED));
    var countQueryCondition = ORDERS.ORDER_STATUS.eq(OrderStatus.PAID);

    var dataQuery =
        ctx.select(
                ORDERS.ID,
                CUSTOMERS.EMAIL,
                ORDERS.SHIPPING_FEE,
                ORDERS.TOTAL_PRICE,
                ORDERS.ORDER_STATUS,
                ORDERS.CREATED_AT,
                arrayRemove(
                    arrayAgg(ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS),
                    (OrderLineItemStatus) null),
                arrayRemove(
                    arrayAgg(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS),
                    (OrderLineItemStatus) null))
            .from(ORDERS)
            .join(CUSTOMERS)
            .on(CUSTOMERS.ID.eq(ORDERS.CUSTOMER_ID))
            .leftJoin(ORDER_LINE_SIMPLE_ITEMS)
            .on(ORDER_LINE_SIMPLE_ITEMS.ORDER_ID.eq(ORDERS.ID))
            .leftJoin(ORDER_LINE_CONFIGURABLE_ITEMS)
            .on(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID.eq(ORDERS.ID));

    var countQuery =
        ctx.select(count(ORDERS.ID))
            .from(ORDERS)
            .join(CUSTOMERS)
            .on(CUSTOMERS.ID.eq(ORDERS.CUSTOMER_ID));

    if (filter != null) {
      if (filter.customerEmail != null) {
        String pattern = "%" + filter.customerEmail + "%";
        dataQueryCondition = dataQueryCondition.and(CUSTOMERS.EMAIL.likeIgnoreCase(pattern));
        countQueryCondition = countQueryCondition.and(CUSTOMERS.EMAIL.likeIgnoreCase(pattern));
      }
      if (filter.dateFrom != null) {
        dataQueryCondition =
            dataQueryCondition.and(ORDERS.CREATED_AT.greaterOrEqual(filter.dateFrom));
        countQueryCondition =
            countQueryCondition.and(ORDERS.CREATED_AT.greaterOrEqual(filter.dateFrom));
      }
      if (filter.dateTo != null) {
        dataQueryCondition = dataQueryCondition.and(ORDERS.CREATED_AT.lessOrEqual(filter.dateTo));
        countQueryCondition = countQueryCondition.and(ORDERS.CREATED_AT.lessOrEqual(filter.dateTo));
      }
      if (filter.totalPriceGreaterThan != null) {
        dataQueryCondition =
            dataQueryCondition.and(ORDERS.TOTAL_PRICE.greaterOrEqual(filter.totalPriceGreaterThan));
        countQueryCondition =
            countQueryCondition.and(
                ORDERS.TOTAL_PRICE.greaterOrEqual(filter.totalPriceGreaterThan));
      }
      if (filter.totalPriceLessThan != null) {
        dataQueryCondition =
            dataQueryCondition.and(ORDERS.TOTAL_PRICE.lessOrEqual(filter.totalPriceLessThan));
        countQueryCondition =
            countQueryCondition.and(ORDERS.TOTAL_PRICE.lessOrEqual(filter.totalPriceLessThan));
      }
    }

    dataQuery
        .where(dataQueryCondition)
        .groupBy(ORDERS.ID, CUSTOMERS.EMAIL)
        .orderBy(ORDERS.CREATED_AT.desc());
    countQuery.where(countQueryCondition);

    var countResult = countQuery.fetchOne();
    int totalItems = countResult.value1();
    int totalPages =
        (int)
            Math.round(
                Math.ceil(
                    (double) totalItems
                        / (reqPagination != null
                            ? reqPagination.pageSize
                            : Pagination.MAX_PAGE_SIZE)));

    Pagination pagination =
        reqPagination == null ? new Pagination(Pagination.MAX_PAGE_SIZE, 1) : reqPagination;
    if (pagination.pageNumber > totalPages) {
      pagination.pageNumber = totalPages;
    }

    var pointer = Pagination.paginationToLimitOffsetPointer(pagination);

    dataQuery.limit(pointer.limit).offset(pointer.offset);

    var orders =
        dataQuery
            .fetch()
            .map(
                o -> {
                  var allItemsStatus =
                      new ArrayList<OrderLineItemStatus>(Arrays.asList(o.value7()));
                  allItemsStatus.addAll(Arrays.asList(o.value8()));

                  DTO.ListOrders.Result.Order r = new DTO.ListOrders.Result.Order();
                  r.id = o.value1();
                  r.customerEmail = o.value2();
                  r.shippingFee = o.value3();
                  r.totalPrice = o.value4();
                  r.status = o.value5();

                  OrderLineItemStatus shipmentStatus = OrderLineItemStatus.PROCESSING;
                  if (allItemsStatus.contains(OrderLineItemStatus.PROCESSING)) {

                  } else if (allItemsStatus.contains(OrderLineItemStatus.TO_SHIP)) {
                    shipmentStatus = OrderLineItemStatus.TO_SHIP;
                  } else if (allItemsStatus.contains(OrderLineItemStatus.TO_RECEIVE)) {
                    shipmentStatus = OrderLineItemStatus.TO_RECEIVE;
                  } else if (allItemsStatus.contains(OrderLineItemStatus.COMPLETED)) {
                    shipmentStatus = OrderLineItemStatus.COMPLETED;
                  }

                  r.shipmentStatus = shipmentStatus;

                  return r;
                });

    PaginationMeta paginationMeta =
        new PaginationMeta(totalItems, pagination.pageSize, pagination.pageNumber);

    return new DTO.ListOrders.Result(orders, paginationMeta);
  }

  public static class DTO {
    public static class GetOneOrder {
      public static class Result {
        public Order order;
        public Customer customer;
        public List<OrderLineItems> orderLineItems;

        public Result(Order order, Customer customer, List<OrderLineItems> orderLineItems) {
          this.order = order;
          this.customer = customer;
          this.orderLineItems = orderLineItems;
        }

        public static class Customer {
          public String email;
          public LocalDateTime createdAt;

          public Customer(String email, LocalDateTime createdAt) {
            this.email = email;
            this.createdAt = createdAt;
          }
        }

        public static class Order {
          public BigDecimal itemsSubtotal;
          public BigDecimal shippingTotal;
          public BigDecimal orderTotal;
          public OrderStatus orderStatus;
          public LocalDateTime createdAt;
          public DeliveryAddress deliveryAddress;
        }

        public static class DeliveryAddress {
          public String fullName;
          public String address1;
          public String address2;
          public String city;
          public String state;
          public String postalCode;
          public String mobilePhone;
        }

        public static class OrderLineItems {
          public int productId;
          public String productName;
          public String productImageUrl;
          public BigDecimal unitPrice;
          public int quantity;
          public OrderLineItemStatus orderLineItemStatus;
          public boolean isConfigurableProduct;
        }
      }
    }

    public static class ListOrders {
      public static record Result(List<Order> results, PaginationMeta paginationMeta) {
        public static class Order {
          public int id;
          public String customerEmail;
          public BigDecimal shippingFee;
          public BigDecimal totalPrice;
          public OrderStatus status;
          public OrderLineItemStatus shipmentStatus;
        }
      }

      public static class QueryFilter {
        public LocalDateTime dateFrom;
        public LocalDateTime dateTo;
        public String customerEmail;
        public BigDecimal totalPriceGreaterThan;
        public BigDecimal totalPriceLessThan;
      }
    }
  }
}
