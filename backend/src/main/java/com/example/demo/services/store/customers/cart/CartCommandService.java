package com.example.demo.services.store.customers.cart;

import static com.example.demo.jooqmodels.Tables.CUSTOMER_CART_CONFIGURABLE_ITEMS;
import static com.example.demo.jooqmodels.Tables.CUSTOMER_CART_SIMPLE_ITEMS;
import static org.jooq.impl.DSL.and;
import static org.jooq.impl.DSL.exists;

import com.example.demo.jooqmodels.enums.ProductType;
import com.example.demo.services.common.ResultMessage;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import org.jooq.DSLContext;
import org.springframework.stereotype.Service;

@Service
public class CartCommandService {
  private final DSLContext ctx;

  public CartCommandService(DSLContext ctx) {
    this.ctx = ctx;
  }

  public ResultMessage addToCart(int customerId, DTO.AddToCart.Request req) {
    if (req.type == ProductType.SIMPLE) {
      boolean alreadyInCart =
          ctx.select(
                  exists(
                      ctx.select(CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID)
                          .from(CUSTOMER_CART_SIMPLE_ITEMS)
                          .where(
                              and(
                                  CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID.eq(req.productId),
                                  CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId)))))
              .fetchOne(x -> x.value1());
      if (alreadyInCart) {
        ctx.update(CUSTOMER_CART_SIMPLE_ITEMS)
            .set(
                CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY,
                CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY.add(req.quantity))
            .where(
                and(
                    CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID.eq(req.productId),
                    CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId)))
            .execute();
      } else {
        var cartItem = ctx.newRecord(CUSTOMER_CART_SIMPLE_ITEMS);
        cartItem.setCustomerId(customerId);
        cartItem.setProductId(req.productId);
        cartItem.setQuantity(req.quantity);
        cartItem.setAddedAt(LocalDateTime.now());
        cartItem.store();
      }
    } else {
      boolean alreadyInCart =
          ctx.select(
                  exists(
                      ctx.select(CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID)
                          .from(CUSTOMER_CART_CONFIGURABLE_ITEMS)
                          .where(
                              and(
                                  CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(
                                      req.productId),
                                  CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID.eq(customerId)))))
              .fetchOne(x -> x.value1());

      if (alreadyInCart) {
        ctx.update(CUSTOMER_CART_CONFIGURABLE_ITEMS)
            .set(
                CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY,
                CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY.add(req.quantity))
            .where(
                and(
                    CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(req.productId),
                    CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID.eq(customerId)))
            .execute();
      } else {
        var cartItem = ctx.newRecord(CUSTOMER_CART_CONFIGURABLE_ITEMS);
        cartItem.setCustomerId(customerId);
        cartItem.setProductVariantId(req.productId);
        cartItem.setQuantity(req.quantity);
        cartItem.setAddedAt(LocalDateTime.now());
        cartItem.store();
      }
    }

    return new ResultMessage("Item added to cart");
  }

  public ResultMessage removeCartItem(int productId, int customerId, ProductType type) {
    if (type == ProductType.CONFIGURABLE) {
      ctx.deleteFrom(CUSTOMER_CART_CONFIGURABLE_ITEMS)
          .where(
              and(
                  CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(productId),
                  CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID.eq(customerId)))
          .execute();
    } else {
      ctx.deleteFrom(CUSTOMER_CART_SIMPLE_ITEMS)
          .where(
              and(
                  CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID.eq(productId),
                  CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId)))
          .execute();
    }
    return new ResultMessage("Item removed from cart");
  }

  public ResultMessage setCartItemQuantity(
      int customerId, int productId, DTO.SetCartItemQuantity.Request req) {
    if (req.type == ProductType.CONFIGURABLE) {
      ctx.update(CUSTOMER_CART_CONFIGURABLE_ITEMS)
          .set(CUSTOMER_CART_CONFIGURABLE_ITEMS.QUANTITY, req.quantity)
          .where(
              and(
                  CUSTOMER_CART_CONFIGURABLE_ITEMS.PRODUCT_VARIANT_ID.eq(productId),
                  CUSTOMER_CART_CONFIGURABLE_ITEMS.CUSTOMER_ID.eq(customerId)));
    } else {
      ctx.update(CUSTOMER_CART_SIMPLE_ITEMS)
          .set(CUSTOMER_CART_SIMPLE_ITEMS.QUANTITY, req.quantity)
          .where(
              and(
                  CUSTOMER_CART_SIMPLE_ITEMS.PRODUCT_ID.eq(productId),
                  CUSTOMER_CART_SIMPLE_ITEMS.CUSTOMER_ID.eq(customerId)));
    }

    return new ResultMessage("Item quantity updated");
  }



  public static class DTO {
    public static class AddToCart {
      public static record Request(
          @NotNull ProductType type, @NotNull Integer productId, @NotNull Integer quantity) {}
    }

    public static class SetCartItemQuantity {
      public static record Request(@NotNull Integer quantity, @NotNull ProductType type) {}
    }
  }
}
