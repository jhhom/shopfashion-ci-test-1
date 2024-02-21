package com.example.demo.services.store.stripe;

import com.example.demo.services.store.PaymentService;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.checkout.Session;
import com.stripe.param.checkout.SessionCreateParams;
import com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData;
import com.stripe.param.checkout.SessionCreateParams.LineItem.PriceData.ProductData;
import java.math.BigDecimal;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class StripePaymentService implements PaymentService {
  public StripePaymentService(@Value("${stripe_api_key}") String stripeApiKey) {
    Stripe.apiKey = stripeApiKey;
  }

  public String createPaymentSession(BigDecimal paymentAmount, String paymentSuccessRedirectUrl)
      throws StripeException {

    long paymentAmountInCents = paymentAmount.multiply(BigDecimal.valueOf(100)).longValue();

    SessionCreateParams params =
        SessionCreateParams.builder()
            .setSuccessUrl(paymentSuccessRedirectUrl)
            .setMode(SessionCreateParams.Mode.PAYMENT)
            .addLineItem(
                SessionCreateParams.LineItem.builder()
                    .setPriceData(
                        PriceData.builder()
                            .setCurrency("myr")
                            .setUnitAmount(paymentAmountInCents)
                            .setProductData(
                                ProductData.builder()
                                    .setName("(shopfashion) E-commerce puchase")
                                    .build())
                            .build())
                    .setQuantity(Long.valueOf(1))
                    .build())
            .build();

    Session session = Session.create(params);

    return session.getId();
  }
}
