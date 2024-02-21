import { authStorage } from "~/external/browser/local-storage/auth";
import { shoppingCartStorage } from "~/external/browser/local-storage/shopping-cart";

const storage = {
  auth: authStorage,
  shoppingCart: shoppingCartStorage,
};

export { storage };
