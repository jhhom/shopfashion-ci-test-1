package com.example.demo.services.store.customers;

import static com.example.demo.jooqmodels.Tables.*;
import static org.jooq.impl.DSL.exists;

import com.example.demo.services.common.JwtService;
import com.example.demo.services.common.ResultMessage;
import com.example.demo.services.common.exceptions.AuthIncorrectPasswordException;
import com.example.demo.services.common.exceptions.AuthUnauthorizedException;
import com.example.demo.services.common.exceptions.DbUniqueValueConflictException;
import com.example.demo.services.common.exceptions.ResourceNotFoundException;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import java.util.List;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CustomerAuthService {
  private final DSLContext ctx;
  private final JwtService jwtService;

  public CustomerAuthService(DSLContext ctx, JwtService jwtService) {
    this.ctx = ctx;
    this.jwtService = jwtService;
  }

  @Transactional
  public DTO.CustomerLogin.Response loginBasic(DTO.CustomerLogin.Request req) {
    DTO.CustomerLogin.User user =
        ctx.select(CUSTOMERS.ID, CUSTOMERS.EMAIL, CUSTOMERS.PASSWORD)
            .from(CUSTOMERS)
            .where(CUSTOMERS.EMAIL.eq(req.email))
            .fetchOne(x -> new DTO.CustomerLogin.User(x.value1(), x.value2(), x.value3()));

    if (user == null) {
      throw new ResourceNotFoundException("customers");
    }
    if (!user.password.equals(req.password)) {
      throw new AuthIncorrectPasswordException();
    }

    String token = jwtService.toToken(user.email, user.id, JwtService.UserRole.CUSTOMER);

    for (var i : req.cart.configurableItems) {
      ctx.insertInto(CUSTOMER_CART_CONFIGURABLE_ITEMS)
          .set(CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID, user.id)
          .set(CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID, i.id)
          .set(CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY, i.quantity)
          .set(CUSTOMER_CART_CONFIGURABLE_ITEMS.ADDED_AT, LocalDateTime.now())
          .onConflict(
              CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID,
              CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID)
          .doUpdate()
          .set(
              CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY,
              CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY.plus(i.quantity))
          .execute();
    }

    for (var i : req.cart.simpleItems) {
      ctx.insertInto(CUSTOMER_CART_SIMPLE_ITEMS)
          .set(CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID, user.id)
          .set(CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID, i.id)
          .set(CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY, i.quantity)
          .set(CUSTOMER_CART_SIMPLE_ITEMS.ADDED_AT, LocalDateTime.now())
          .onConflict(CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID, CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID)
          .doUpdate()
          .set(
              CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY,
              CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY.plus(i.quantity))
          .execute();
    }

    return new DTO.CustomerLogin.Response(
        token, (req.cart.configurableItems.size() + req.cart.simpleItems.size()) > 0);
  }

  public DTO.CustomerMe.Response customerMe(int customerId) {
    String email =
        ctx.select(CUSTOMERS.EMAIL)
            .from(CUSTOMERS)
            .where(CUSTOMERS.ID.eq(customerId))
            .fetchOne(x -> x.value1());

    return new DTO.CustomerMe.Response(email);
  }

  public ResultMessage registerCustomer(DTO.CustomerRegister.Request req) {
    var existCustomerWithSameEmail =
        ctx.select(
                exists(
                    ctx.select(CUSTOMERS.ID).from(CUSTOMERS).where(CUSTOMERS.EMAIL.eq(req.email))))
            .fetchOne(x -> x.value1());

    if (existCustomerWithSameEmail) {
      throw new DbUniqueValueConflictException("email");
    }

    ctx.insertInto(CUSTOMERS)
        .set(CUSTOMERS.EMAIL, req.email)
        .set(CUSTOMERS.PASSWORD, req.password)
        .execute();

    return new ResultMessage("Customer is created successfully.");
  }

  public DTO.CustomerVerifyToken.Response verifyToken(String token) {

    var user = jwtService.getUserFromToken(token);
    if (user.isEmpty() || user.get().userRole() != JwtService.UserRole.CUSTOMER) {
      throw new AuthUnauthorizedException();
    }

    String email =
        ctx.select(CUSTOMERS.EMAIL)
            .from(CUSTOMERS)
            .where(CUSTOMERS.EMAIL.eq(user.get().userEmail()))
            .fetchOne(x -> x.value1());

    if (email == null) {
      throw new AuthUnauthorizedException();
    }

    return new DTO.CustomerVerifyToken.Response(email);
  }

  public static class DTO {

    public static class CustomerLogin {
      public static record Request(
          @NotNull String email, @NotNull String password, @Valid Cart cart) {}

      public static record User(int id, String email, String password) {}

      public static record Cart(List<CartItem> simpleItems, List<CartItem> configurableItems) {}

      public static record CartItem(@NotNull Integer id, @NotNull Integer quantity) {}

      public static record Response(String token, Boolean isCartUpdated) {}
    }

    public static class CustomerMe {
      public static record Response(String email) {}
    }

    public static class CustomerRegister {
      public static record Request(@NotNull String email, @NotNull String password) {}
    }

    public static class CustomerVerifyToken {
      public static record Response(String email) {}
    }
  }
}
