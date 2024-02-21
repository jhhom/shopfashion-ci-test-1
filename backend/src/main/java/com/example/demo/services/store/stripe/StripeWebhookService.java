package com.example.demo.services.store.stripe;

import static com.example.demo.jooqmodels.Tables.*;

import com.example.demo.jooqmodels.enums.OrderStatus;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class StripeWebhookService {
  private final DSLContext ctx;

  public StripeWebhookService(DSLContext ctx) {
    this.ctx = ctx;
  }

  @Transactional
  public void orderPaymentSuccess(Integer orderId) {
    Integer customerId =
        ctx.select(ORDERS.CUSTOMER_ID)
            .from(ORDERS)
            .where(ORDERS.ID.eq(orderId))
            .fetchOne(x -> x.value1());

    ctx.update(ORDERS)
        .set(ORDERS.ORDER_STATUS, OrderStatus.PAID)
        .where(ORDERS.ID.eq(orderId))
        .execute();

    ctx.delete(CUSTOMER_CART_CONFIGURABLE_ITEMS)
        .where(CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID.eq(customerId))
        .execute();

    ctx.delete(CUSTOMER_CART_SIMPLE_ITEMS)
        .where(CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId))
        .execute();
  }
}
