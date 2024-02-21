package com.example.demo.services.admin.order;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jooqmodels.enums.OrderLineItemStatus;
import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.services.common.ResultMessage;

import jakarta.validation.constraints.NotNull;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class OrderCommandService {
  private final DSLContext ctx;

  public OrderCommandService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public ResultMessage cancelOrder(int orderId) {
    ctx.update(ORDERS)
        .set(ORDERS.ORDER_STATUS, OrderStatus.CANCELLED)
        .where(ORDERS.ID.eq(orderId))
        .execute();

    return new ResultMessage("Order is cancelled successfully");
  }

  public ResultMessage updateItemShipmentStatus(
      int orderId, int productId, DTO.UpdateItemShipmentStatus.Request req) {

    if (req.isConfigurableProduct) {
      ctx.update(ORDER_LINE_CONFIGURABLE_ITEMS)
          .set(ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_LINE_ITEM_STATUS, req.status)
          .where(
              and(
                  ORDER_LINE_CONFIGURABLE_ITEMS.ORDER_ID.eq(orderId),
                  ORDER_LINE_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(productId)))
          .execute();
    } else {
      ctx.update(ORDER_LINE_SIMPLE_ITEMS)
          .set(ORDER_LINE_SIMPLE_ITEMS.ORDER_LINE_ITEM_STATUS, req.status)
          .where(
              and(
                  ORDER_LINE_SIMPLE_ITEMS.ORDER_ID.eq(orderId),
                  ORDER_LINE_SIMPLE_ITEMS.PRODUCT_ID.eq(productId)))
          .execute();
    }

    return new ResultMessage("Shipment status updated successfully");
  }

  public static class DTO {
    public static class UpdateItemShipmentStatus {
      public static record Request(
          @NotNull Boolean isConfigurableProduct, @NotNull OrderLineItemStatus status) {}
    }
  }
}
