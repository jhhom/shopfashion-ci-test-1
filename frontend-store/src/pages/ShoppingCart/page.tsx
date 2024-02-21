import { useLocalStorageShoppingCart } from "~/external/browser/local-storage/use-shopping-cart.hook";
import { useMemo, useState } from "react";

import type { CartItem } from "~/pages/ShoppingCart/components/ShoppingCartContent";
import { ShoppingCartContent } from "~/pages/ShoppingCart/components/ShoppingCartContent";
import { match } from "ts-pattern";
import { useAppStore } from "~/stores/stores";
import { Navigate, useNavigate } from "@tanstack/react-router";
import {
  useCartItemsInformation,
  useCustomerCartItems,
  useRemoveCartItem,
  useSetCartItemQuantity,
} from "~/pages/ShoppingCart/api";

export function ShoppingCartPage() {
  const authenticated = useAppStore((s) => s.authenticated);

  return (
    <div>
      {authenticated ? <LoggedInShoppingCart /> : <LoggedOutShoppingCart />}
    </div>
  );
}

function LoggedOutShoppingCart() {
  const shoppingCart = useLocalStorageShoppingCart();
  const cartItems = shoppingCart.getCartItems();

  const navigate = useNavigate();

  const setAttemptToCheckoutWhileLoggedOut = useAppStore(
    (s) => s.setAttemptToCheckoutWhileLoggedOut,
  );

  const cartItemsQuery = useCartItemsInformation({
    configurableItemsIds: cartItems.configurableItems.map((i) => i.id),
    simpleItemsIds: cartItems.simpleItems.map((i) => i.id),
  });

  const itemsToDisplay = useMemo(() => {
    const simpleItems = (cartItemsQuery.data?.simpleItems ?? []).map((i) => {
      const item = cartItems.simpleItems.find((x) => x.id === i.id);

      return {
        ...i,
        quantity: item?.quantity ?? 0,
        addedAt: item?.addedAt,
      };
    });

    const configurableItems = (
      cartItemsQuery.data?.configurableItems ?? []
    ).map((i) => {
      const item = cartItems.configurableItems.find((x) => x.id === i.id);
      return {
        ...i,
        quantity: item?.quantity ?? 0,
        addedAt: item?.addedAt,
      };
    });

    const configurableItemsToDisplay: CartItem[] = configurableItems.map(
      (i) => ({
        id: i.id,
        name: i.name,
        pricing: i.pricing,
        addedAt: i.addedAt,
        quantity: i.quantity,
        imgUrl: i.imgUrl,
        status: i.status,
        type: {
          type: "CONFIGURABLE" as const,
          options: i.options,
        },
      }),
    );

    const simpleItemsToDisplay: CartItem[] = simpleItems.map((i) => ({
      ...i,
      type: {
        type: "SIMPLE",
      },
    }));

    const itemsToDisplay = configurableItemsToDisplay
      .concat(simpleItemsToDisplay)
      .sort((a, b) => {
        if (a.addedAt === undefined) {
          return -1;
        }
        if (b.addedAt === undefined) {
          return 1;
        }
        return b.addedAt.getTime() - a.addedAt.getTime();
      });

    return itemsToDisplay;
  }, [cartItemsQuery.data, cartItems]);

  return (
    <ShoppingCartContent
      itemsToDisplay={itemsToDisplay}
      onRemoveCartItem={(id, type) => {
        if (type === "SIMPLE") {
          shoppingCart.removeSimpleProduct(id);
        } else {
          shoppingCart.removeConfigurableProduct(id);
        }
      }}
      onCheckout={() => {
        setAttemptToCheckoutWhileLoggedOut(true);
        navigate({ to: "/login" });
      }}
      onSetItemQuantity={({ id, type, quantity }) => {
        if (quantity <= 0) {
          quantity = 0;
        }
        if (type === "SIMPLE") {
          shoppingCart.setSimpleProductQuantity({ id, quantity });
        } else {
          shoppingCart.setConfigurableProductQuantity({ id, quantity });
        }
      }}
    />
  );
}

function LoggedInShoppingCart() {
  const cartItemsQuery = useCustomerCartItems();

  const navigate = useNavigate();

  const removeCartItemMutation = useRemoveCartItem();

  const setItemQuantityMutation = useSetCartItemQuantity();

  return (
    <ShoppingCartContent
      // why this unnecessary mapping? TypeScript type error for no reason...
      // having this unnecessary mapping removes the error somehow...
      itemsToDisplay={(cartItemsQuery.data?.items ?? []).map((i) => {
        return match(i.type)
          .with({ type: "SIMPLE" }, (t) => ({
            ...i,
            addedAt: new Date(i.addedAt),
            type: {
              type: "SIMPLE" as const,
            },
          }))
          .with({ type: "CONFIGURABLE" }, (t) => ({
            ...i,
            addedAt: new Date(i.addedAt),
            type: {
              type: "CONFIGURABLE" as const,
              options: t.options,
            },
          }))
          .exhaustive();
      })}
      onCheckout={() => {
        navigate({ to: "/checkout" });
      }}
      onSetItemQuantity={({ id, type, quantity }) => {
        if (quantity <= 0) {
          quantity = 0;
        }

        setItemQuantityMutation.mutate({
          productType: type,
          productId: id,
          quantity,
        });
      }}
      onRemoveCartItem={(id, type) => {
        removeCartItemMutation.mutate({
          productType: type,
          productId: id,
        });
      }}
    />
  );
}
