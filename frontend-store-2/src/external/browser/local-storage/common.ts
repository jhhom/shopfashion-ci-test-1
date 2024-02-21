export const STORAGE_PREFIX = "shopfashion_store";

const Key = (key: string) => `${STORAGE_PREFIX}_${key}`;

export const keys = {
  token: Key("token"),
  shopping_cart_simple: Key("shopping_cart_simple"),
  shopping_cart_configurable: Key("shopping_cart_configurable"),
};
