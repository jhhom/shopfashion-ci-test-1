package com.example.demo.services.store;

import java.math.BigDecimal;

public interface PaymentService {
  public String createPaymentSession(BigDecimal paymentAmount, String paymentSuccessRedirectUrl)
      throws Exception;
}
