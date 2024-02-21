import { useMutation } from "@tanstack/react-query";
import {
  StoreCustomersRequests,
  StoreProductsRequests,
} from "@api-contract/store-api/api";
import { client } from "~/external/api-client/client";
import { useLocalStorageShoppingCart } from "~/external/browser/local-storage/use-shopping-cart.hook";
import toast from "react-hot-toast";
import { useLocalStorageAuth } from "~/external/browser/local-storage/use-auth.hook";
import { useAppStore } from "~/stores/stores";
import { useNavigate } from "@tanstack/react-router";
import {
  ErrorHTTPResponse,
  zErrorHttpResponse,
} from "@api-contract/errors/errors";
import { parseApiError } from "~/utils/api-error";

export function useLogin({
  onError,
}: {
  onError: (e: ErrorHTTPResponse) => void;
}) {
  const shoppingCart = useLocalStorageShoppingCart();
  const auth = useLocalStorageAuth();
  const store = useAppStore((s) => ({
    authenticated: s.authenticated,
    attemptToCheckoutWhileLoggedOut: s.attemptToCheckoutWhileLoggedOut,
    setAttemptToCheckoutWhileLoggedOut: s.setAttemptToCheckoutWhileLoggedOut,
  }));
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (
      values: StoreProductsRequests["customerLogin"]["body"],
    ) => {
      const result = await client.products.customerLogin({ body: values });
      if (result.status !== 200) {
        throw result.body;
      }
      return result.body;
    },
    onSuccess({ token, isCartUpdated }) {
      shoppingCart.clearCart();
      auth.setToken(token);
      toast.success("Login successful", {
        position: "top-center",
        duration: 2000,
      });
      if (isCartUpdated) {
        toast.success("Cart has been updated, please check your cart", {
          position: "top-center",
          duration: 4000,
        });
      }
      if (store.attemptToCheckoutWhileLoggedOut) {
        store.setAttemptToCheckoutWhileLoggedOut(false);
        navigate({ to: "/cart" });
      } else {
        navigate({ to: "/" });
      }
    },
    onError(e) {
      const err = parseApiError(e);
      onError(err);
    },
  });
}
