package com.example.demo.example.apis;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.example.demo.example.TestWithCurrentCustomer;
import com.example.demo.repositories.RequestCheckoutRepository;
import com.example.demo.repositories.RequestCheckoutRepository.DTO.CartItem;
import com.example.demo.services.store.PaymentService;
import com.example.demo.services.store.customers.checkout.RequestCheckoutService;
import com.example.demo.services.store.customers.checkout.RequestCheckoutService.DTO;
import com.example.demo.services.store.customers.checkout.RequestCheckoutService.DTO.RequestCheckout.OrderDeliverAddress;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

@AutoConfigureMockMvc
@Transactional
public class CustomersApiTest extends TestWithCurrentCustomer {

  @MockBean private PaymentService paymentService;

  @MockBean private RequestCheckoutRepository requestCheckoutRepo;

  @Autowired private MockMvc mockMvc;

  @Value("${server.port}")
  String runningPort;

  private final ObjectMapper mapper = new ObjectMapper();

  @Test
  public void should_create_payment_session_with_correct_payment_amount() throws Exception {
    // 1. ARRANGE
    Integer orderId = 1;
    List<CartItem> configurableItems =
        new ArrayList<>() {
          {
            add(new CartItem(0, BigDecimal.valueOf(10), 2));
            add(new CartItem(0, BigDecimal.valueOf(14.3), 2));
            add(new CartItem(0, BigDecimal.valueOf(15), 2));
          }
        };

    List<CartItem> simpleItems =
        new ArrayList<>() {
          {
            add(new CartItem(0, BigDecimal.valueOf(12), 2));
            add(new CartItem(0, BigDecimal.valueOf(11.3), 2));
            add(new CartItem(0, BigDecimal.valueOf(5.4), 2));
          }
        };

    when(requestCheckoutRepo.getCustomerCartConfigurableItems(customerId))
        .thenReturn(configurableItems);
    when(requestCheckoutRepo.getCustomerCartSimpleItems(customerId)).thenReturn(simpleItems);
    when(requestCheckoutRepo.placeOrder(eq(customerId), any(), any(), any(), any()))
        .thenReturn(orderId);

    // 2. ACT
    OrderDeliverAddress address = new OrderDeliverAddress();
    address.address1 = "36, Green Lane";
    address.address2 = "Penang";
    address.city = "Georgetown";
    address.fullName = "James";
    address.mobilePhone = "01888888";
    address.postalCode = "01000";
    address.state = "Penang";
    DTO.RequestCheckout.Request req = new DTO.RequestCheckout.Request(address);
    String requestBody = mapper.writeValueAsString(req);

    mockMvc
        .perform(
            post("/store/customers/checkout_session")
                .contentType(MediaType.APPLICATION_JSON)
                .header("Authorization", authHeader)
                .content(requestBody))
        .andExpect(status().isOk());

    // 3. ASSERT
    verify(paymentService, times(1))
        .createPaymentSession(
            Stream.concat(simpleItems.stream(), configurableItems.stream())
                .map(i -> i.pricing().multiply(BigDecimal.valueOf(i.quantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .add(RequestCheckoutService.SHIPPING_FEE),
            "http://localhost:" + this.runningPort + "/stripe-success-redirect/" + orderId);
  }
}
