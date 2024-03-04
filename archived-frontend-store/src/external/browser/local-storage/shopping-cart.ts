import { keys } from "~/external/browser/local-storage/common";
import superjson from "superjson";
import { z } from "zod";
import { useLocalStorage } from "@uidotdev/usehooks";
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

function getCartItems(type: "SIMPLE" | "CONFIGURABLE") {
  const key =
    type === "SIMPLE"
      ? keys.shopping_cart_simple
      : keys.shopping_cart_configurable;

  const str = window.localStorage.getItem(key);
  if (str !== null) {
    const result = zCartItemsWithStringDate.safeParse(JSON.parse(str));
    if (result.success) {
      return result.data.map((x) => ({
        ...x,
        addedAt: new Date(x.addedAt),
      }));
    } else {
      window.localStorage.removeItem(key);
    }
  }

  return [];
}

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

  useEffect(() => {
    console.log("SIMPLE", simpleItems);
    console.log("CONFIGURABLE", configurableItems);
  }, [simpleItems, configurableItems]);

  const simple = getCartItemsFrom("SIMPLE", simpleItems);
  const configurable = getCartItemsFrom("CONFIGURABLE", configurableItems);

  return {
    simpleItems: simple,
    configurableItems: configurable,
  };
}

const shoppingCartStorage = {
  getCartItems: () => {
    const simple = getCartItems("SIMPLE");
    const configurable = getCartItems("CONFIGURABLE");

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
    const cartItems = getCartItems("SIMPLE");

    cartItems.push({ id: productId, quantity, addedAt });

    window.localStorage.setItem(
      keys.shopping_cart_simple,
      JSON.stringify(cartItems),
    );
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
    const cartItems = getCartItems("CONFIGURABLE");

    cartItems.push({ id: productVariantId, quantity, addedAt });

    window.localStorage.setItem(
      keys.shopping_cart_configurable,
      JSON.stringify(cartItems),
    );
  },
  removeSimpleProduct: (productId: number) => {
    const cartItems = getCartItems("SIMPLE");

    window.localStorage.setItem(
      keys.shopping_cart_simple,
      JSON.stringify(cartItems.filter((i) => i.id !== productId)),
    );
  },
  removeConfigurableProduct: (productId: number) => {
    const cartItems = getCartItems("CONFIGURABLE");

    window.localStorage.setItem(
      keys.shopping_cart_configurable,
      JSON.stringify(cartItems.filter((i) => i.id !== productId)),
    );
  },
};

export { shoppingCartStorage };
