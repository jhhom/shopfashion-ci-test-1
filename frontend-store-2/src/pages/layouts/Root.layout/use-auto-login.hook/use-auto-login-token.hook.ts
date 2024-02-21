import { useEffect } from "react";
import { useAppStore } from "~/stores/stores";
import { useLocalStorageAuth } from "~/external/browser/local-storage/use-auth.hook";

import { useMutation } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCustomerVerifyToken } from "~/pages/layouts/api";

export function useAutoLoginWithToken() {
  const store = useAppStore();
  const authStorage = useLocalStorageAuth();

  const verifyTokenMutation = useCustomerVerifyToken({
    onSuccess: () => {
      store.setAuthenticated(true);
      // navigate({ to: "/" });
      /*
      if (store.navigateTo !== null) {
        navigate({ to: store.navigateTo, replace: true });
      } else if (router.state.location.pathname === "/login") {
        navigate({ to: "/" });
      }
      */
    },
    onError: () => {
      authStorage.clearToken();
      store.setAuthenticated(false);
      store.setNavigateTo(null);
    },
  });

  useEffect(() => {
    if (
      authStorage.token !== null &&
      authStorage.token !== "" &&
      authStorage.token !== undefined &&
      !store.authenticated
    ) {
      verifyTokenMutation.mutate();
    } else if (
      (authStorage.token === null || authStorage.token === "") &&
      store.authenticated
    ) {
      store.setAuthenticated(false);
    }
  }, [authStorage.token, store.authenticated]);
}
