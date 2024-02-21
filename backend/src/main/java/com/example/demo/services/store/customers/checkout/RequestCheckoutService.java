package com.example.demo.services.store.customers.checkout;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.*;

import com.example.demo.jackson.Mapper;
import com.example.demo.jooqmodels.enums.OrderLineItemStatus;
import com.example.demo.jooqmodels.enums.OrderStatus;
import com.example.demo.jooqmodels.enums.ProductStatus;
import com.example.demo.logging.ApplicationLogger;
import com.example.demo.logging.Log;
import com.example.demo.logging.RequestId;
import com.example.demo.repositories.RequestCheckoutRepository;
import com.example.demo.services.store.PaymentService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectWriter;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicReference;
import org.jooq.DSLContext;
import org.jooq.JSONB;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class RequestCheckoutService {
  private final String runningPort;
  private final PaymentService paymentService;
  private final RequestCheckoutRepository repo;
  private final RequestCheckoutLogger logger;

  public static final BigDecimal SHIPPING_FEE = BigDecimal.valueOf(20);

  public RequestCheckoutService(
      DSLContext ctx,
      RequestCheckoutRepository repo,
      PaymentService paymentService,
      RequestCheckoutLogger logger,
      @Value("${server.port}") String runningPort) {
    this.paymentService = paymentService;

    this.repo = repo;
    this.logger = logger;
    this.runningPort = runningPort;
  }

  @Transactional
  public DTO.RequestCheckout.Response requestCheckoutSession(
      int customerId, DTO.RequestCheckout.Request request) throws Exception {

    BigDecimal totalPrice;

    List<RequestCheckoutRepository.DTO.CartItem> simpleItems =
        repo.getCustomerCartSimpleItems(customerId);

    List<RequestCheckoutRepository.DTO.CartItem> configurableItems =
        repo.getCustomerCartConfigurableItems(customerId);

    var totalSimpleItemsPrice =
        simpleItems.stream()
            .map(i -> i.pricing().multiply(BigDecimal.valueOf(i.quantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    var totalConfigurableItemsPrice =
        configurableItems.stream()
            .map(i -> i.pricing().multiply(BigDecimal.valueOf(i.quantity())))
            .reduce(BigDecimal.ZERO, BigDecimal::add);

    totalPrice = totalSimpleItemsPrice.add(totalConfigurableItemsPrice);

    Integer orderId =
        repo.placeOrder(
            customerId, totalPrice, request.deliveryAddress, simpleItems, configurableItems);

    String successPaymentRedirectUrl =
        "http://localhost:" + this.runningPort + "/stripe-success-redirect/" + orderId;
    String sessionId =
        paymentService.createPaymentSession(
            totalPrice.add(SHIPPING_FEE), successPaymentRedirectUrl);

    logger.logPaymentSessionCreated(totalPrice, successPaymentRedirectUrl, LocalDateTime.now());

    return new DTO.RequestCheckout.Response(sessionId);
  }

  @Component
  public static class RequestCheckoutLogger {
    private final ApplicationLogger logger;
    private final RequestId requestId;

    public RequestCheckoutLogger(ApplicationLogger logger, RequestId requestId) {
      this.logger = logger;
      this.requestId = requestId;
    }

    public void logPaymentSessionCreated(
        BigDecimal totalPrice, String successRedirectUrl, LocalDateTime timestamp) {
      logger.log(
          new Log.InfoCustom(
              requestId,
              new HashMap<>() {
                {
                  put("total_price", totalPrice);
                  put("success_redirect_url", successRedirectUrl);
                  put("timestamp", timestamp.format(DateTimeFormatter.ISO_DATE_TIME));
                }
              }));
    }
  }

  public static class DTO {
    public static class RequestCheckout {
      public static record Response(String stripeSessionId) {}

      public static record CartItem(int id, BigDecimal pricing, int quantity) {}

      public static record Request(@NotNull @Valid OrderDeliverAddress deliveryAddress) {}

      public static class OrderDeliverAddress {
        @NotNull public String fullName;
        @NotNull public String address1;
        @NotNull public String address2;
        @NotNull public String city;
        @NotNull public String state;
        @NotNull public String postalCode;
        @NotNull public String mobilePhone;
      }
    }
  }
}
