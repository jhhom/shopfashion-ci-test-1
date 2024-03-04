import { keys } from "~/external/browser/local-storage/common";
import { useLocalStorage } from "@uidotdev/usehooks";
import { z } from "zod";
import { useEffect } from "react";

const zCartItem = z.object({
  id: z.number().int(),
  quantity: z.number().int(),
  addedAt: z.date(),
});

type CartItem = z.infer<typeof zCartItem>;

const zCartItems = z.array(zCartItem);

const zCartItemWithStringDate = z.object({
  id: z.number().int(),
  quantity: z.number().int(),
  addedAt: z.string(),
});

const zCartItemsWithStringDate = z.array(zCartItemWithStringDate);

function getCartItemsFrom(
  type: "SIMPLE" | "CONFIGURABLE",
  localStorageItem: unknown,
): CartItem[] {
  const key =
    type === "SIMPLE"
      ? keys.shopping_cart_simple
      : keys.shopping_cart_configurable;

  const result = zCartItemsWithStringDate.safeParse(localStorageItem);
  if (result.success) {
    return result.data.map((p) => ({
      ...p,
      addedAt: new Date(p.addedAt),
    }));
  } else {
    window.localStorage.removeItem(key);
  }

  return [];
}

export function useLocalStorageShoppingCart() {
  const [simpleItems, setSimpleItems] = useLocalStorage(
    keys.shopping_cart_simple,
  );
  const [configurableItems, setConfigurableItems] = useLocalStorage(
    keys.shopping_cart_configurable,
  );

  return {
    getCartItems: () => {
      const simple = getCartItemsFrom("SIMPLE", simpleItems);
      const configurable = getCartItemsFrom("CONFIGURABLE", configurableItems);
      return {
        simpleItems: simple,
        configurableItems: configurable,
      };
    },
    addSimpleProduct: ({
      productId,
      quantity,
      addedAt,
    }: {
      productId: number;
      quantity: number;
      addedAt: Date;
    }) => {
      const cartItems = getCartItemsFrom("SIMPLE", simpleItems);

      const itemIdx = cartItems.findIndex((i) => i.id === productId);
      if (itemIdx >= 0) {
        cartItems[itemIdx].quantity += quantity;
      } else {
        cartItems.push({ id: productId, quantity, addedAt });
      }

      setSimpleItems(cartItems);
    },
    addConfigurableProduct: ({
      productVariantId,
      quantity,
      addedAt,
    }: {
      productVariantId: number;
      quantity: number;
      addedAt: Date;
    }) => {
      const cartItems = getCartItemsFrom("CONFIGURABLE", configurableItems);

      const itemIdx = cartItems.findIndex((i) => i.id === productVariantId);
      if (itemIdx >= 0) {
        cartItems[itemIdx].quantity += quantity;
      } else {
        cartItems.push({ id: productVariantId, quantity, addedAt });
      }

      setConfigurableItems(cartItems);
    },
    setSimpleProductQuantity: ({
      id,
      quantity,
    }: {
      id: number;
      quantity: number;
    }) => {
      const cartItems = getCartItemsFrom("SIMPLE", simpleItems);

      const idx = cartItems.findIndex((i) => i.id === id);
      if (idx >= 0) {
        cartItems[idx].quantity = quantity;
      }
      setSimpleItems(cartItems);
    },
    setConfigurableProductQuantity: ({
      id,
      quantity,
    }: {
      id: number;
      quantity: number;
    }) => {
      const cartItems = getCartItemsFrom("CONFIGURABLE", configurableItems);

      const idx = cartItems.findIndex((i) => i.id === id);
      if (idx >= 0) {
        cartItems[idx].quantity = quantity;
      }
      setConfigurableItems(cartItems);
    },
    removeSimpleProduct: (productId: number) => {
      const cartItems = getCartItemsFrom("SIMPLE", simpleItems);

      setSimpleItems(cartItems.filter((i) => i.id !== productId));
    },
    removeConfigurableProduct: (productId: number) => {
      const cartItems = getCartItemsFrom("CONFIGURABLE", configurableItems);

      setConfigurableItems(cartItems.filter((i) => i.id !== productId));
    },
    clearCart: () => {
      setSimpleItems([]);
      setConfigurableItems([]);
    },
  };
}
