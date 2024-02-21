package com.example.demo.controllers.store;

import org.jooq.DSLContext;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

import com.example.demo.services.store.stripe.StripeWebhookService;

@RestController
public class StoreStripeWebhookController {
  private final String storeFrontPort;
  private final StripeWebhookService stripeWebhookService;

  public StoreStripeWebhookController(StripeWebhookService stripeWebhookService) {
    this.storeFrontPort = "9020";
    this.stripeWebhookService = stripeWebhookService;
  }

  @GetMapping("stripe-success-redirect/{orderId}")
  public RedirectView stripeSuccessRedirect(@PathVariable Integer orderId) {
    stripeWebhookService.orderPaymentSuccess(orderId);

    return new RedirectView("http://localhost:" + storeFrontPort + "/thank-you");
  }
}
