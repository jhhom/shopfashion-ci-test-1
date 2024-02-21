package com.example.demo.controllers.store;

import com.example.demo.jooqmodels.enums.ProductType;
import com.example.demo.services.common.JwtService;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.store.customers.CustomerAuthService;
import com.example.demo.services.store.customers.cart.CartCommandService;
import com.example.demo.services.store.customers.cart.CartQueryService;
import com.example.demo.services.store.customers.checkout.CheckoutInfoService;
import com.example.demo.services.store.customers.checkout.RequestCheckoutService;
import com.example.demo.services.store.products.ProductReviewService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.stripe.exception.StripeException;
import jakarta.validation.Valid;
import jakarta.validation.Validation;
import jakarta.validation.Validator;
import jakarta.validation.ValidatorFactory;
import java.util.List;
import java.util.Optional;
import org.jooq.DSLContext;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("store/customers")
public class StoreCustomersController {

  private final CartCommandService cartCommandService;
  private final CartQueryService cartQueryService;
  private final CheckoutInfoService checkoutInfoService;
  private final RequestCheckoutService requestCheckoutService;
  private final CustomerAuthService customerAuthService;
  private final ProductReviewService productReviewService;

  public StoreCustomersController(
      CartCommandService cartCommandService,
      CartQueryService cartQueryService,
      CheckoutInfoService checkoutInfoService,
      RequestCheckoutService requestCheckoutService,
      CustomerAuthService customerAuthService,
      ProductReviewService productReviewService) {
    this.cartCommandService = cartCommandService;
    this.cartQueryService = cartQueryService;
    this.checkoutInfoService = checkoutInfoService;
    this.requestCheckoutService = requestCheckoutService;
    this.customerAuthService = customerAuthService;
    this.productReviewService = productReviewService;
  }

  @GetMapping("me")
  public CustomerAuthService.DTO.CustomerMe.Response customerMe(
      @AuthenticationPrincipal JwtService.DTO.User user) {
    return customerAuthService.customerMe(user.userId());
  }

  @GetMapping("purchases/{status}")
  public CartQueryService.DTO.ListPurchases.Response listPurchases(
      @AuthenticationPrincipal JwtService.DTO.User user, @PathVariable String status) {
    return cartQueryService.listPurchases(user.userId(), status);
  }

  @GetMapping("checkout_details")
  public CheckoutInfoService.DTO.GetCheckoutInfo.Response getCheckoutInfo(
      @AuthenticationPrincipal JwtService.DTO.User user) {
    return checkoutInfoService.getCheckoutInfo(user.userId());
  }

  @PostMapping("checkout_session")
  public RequestCheckoutService.DTO.RequestCheckout.Response requestCheckoutSession(
      @AuthenticationPrincipal JwtService.DTO.User user,
      @Valid @RequestBody RequestCheckoutService.DTO.RequestCheckout.Request req)
      throws Exception {
    return requestCheckoutService.requestCheckoutSession(user.userId(), req);
  }

  @GetMapping("cart")
  public CartQueryService.DTO.GetShoppingCart.Response getShoppingCart(
      @AuthenticationPrincipal JwtService.DTO.User user) {
    return cartQueryService.getShoppingCart(user.userId());
  }

  @DeleteMapping("{productId}/cart_items/{productType}")
  public ResultMessage removeCartItem(
      @AuthenticationPrincipal JwtService.DTO.User user,
      @PathVariable Integer productId,
      @PathVariable ProductType productType) {
    return cartCommandService.removeCartItem(productId, user.userId(), productType);
  }

  @PutMapping("{productId}/cart_item")
  public ResultMessage setCartItemQuantity(
      @AuthenticationPrincipal JwtService.DTO.User user,
      @PathVariable Integer productId,
      @Valid @RequestBody CartCommandService.DTO.SetCartItemQuantity.Request req) {
    return cartCommandService.setCartItemQuantity(user.userId(), productId, req);
  }

  @PostMapping("product_reviews/{productId}")
  public ResultMessage createProductReview(
      @AuthenticationPrincipal JwtService.DTO.User user,
      @PathVariable Integer productId,
      @Valid @RequestBody ProductReviewService.DTO.CreateProductReview.Request req) {
    return productReviewService.createProductReview(user.userId(), productId, req);
  }

  @PostMapping("verify_token")
  public CustomerAuthService.DTO.CustomerVerifyToken.Response verifyToken(
      @AuthenticationPrincipal JwtService.DTO.User user) {
    // return customerVerifyTokenService.verifyToken(ctx, "");
    return new CustomerAuthService.DTO.CustomerVerifyToken.Response(user.userEmail());
  }

  @PostMapping("add_to_cart")
  public ResultMessage addToCart(
      @AuthenticationPrincipal JwtService.DTO.User user,
      @Valid @RequestBody CartCommandService.DTO.AddToCart.Request req) {
    return cartCommandService.addToCart(user.userId(), req);
  }
}
