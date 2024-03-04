import { useEffect } from "react";
import { useAppStore } from "~/stores/stores";
import { useLocalStorageAuth } from "~/external/browser/local-storage/use-auth.hook";

import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCustomerLogin } from "~/pages/layouts/api";

export function useAutoLoginDebug() {
  const store = useAppStore();
  const authStorage = useLocalStorageAuth();
  const navigate = useNavigate();

  const router = useRouter();

  const customerLoginMutation = useCustomerLogin({
    onSuccess: (token) => {
      authStorage.setToken(token);
      store.setAuthenticated(true);
      if (store.navigateTo !== null) {
        navigate({ to: store.navigateTo, replace: true });
      } else if (router.state.location.pathname === "/login") {
        navigate({ to: "/" });
      }
    },
    onError: (err) => {
      alert("Auto login fail: " + err);
      authStorage.clearToken();
      store.setAuthenticated(false);
      store.setNavigateTo(null);
    },
  });

  useEffect(() => {
    if (!store.authenticated) {
      authStorage.clearToken();
      customerLoginMutation.mutate({
        email: "james@email.com",
        password: "james123",
        cart: {
          simpleItems: [],
          configurableItems: [],
        },
      });
    } else if (
      (authStorage.token === null || authStorage.token === "") &&
      store.authenticated
    ) {
      store.setAuthenticated(false);
    }
  }, [authStorage.token, store.authenticated]);
}
