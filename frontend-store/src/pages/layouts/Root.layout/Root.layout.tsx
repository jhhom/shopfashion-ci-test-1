import { useMutation } from "@tanstack/react-query";
import { Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useLayoutEffect } from "react";
import { Toaster } from "react-hot-toast";
import { client } from "~/external/api-client/client";
import { useLocalStorageAuth } from "~/external/browser/local-storage/use-auth.hook";
import { useAutoLoginDebug } from "~/pages/layouts/Root.layout/use-auto-login.hook/use-auto-login-debug.hook";
import { useAutoLoginWithToken } from "~/pages/layouts/Root.layout/use-auto-login.hook/use-auto-login-token.hook";
import { useAppStore } from "~/stores/stores";

// Create a root route
export function RootLayout() {
  const store = useAppStore();
  const authStorage = useLocalStorageAuth();

  const router = useRouterState();

  useAutoLoginWithToken();
  // useAutoLoginDebug();

  useEffect(() => {
    if (
      !(
        router.location.href === "/login" ||
        router.location.href === "/register"
      ) &&
      store.attemptToCheckoutWhileLoggedOut
    ) {
      store.setAttemptToCheckoutWhileLoggedOut(false);
    }
  }, [router.location, store.attemptToCheckoutWhileLoggedOut]);

  return (
    <>
      <Outlet />
      <Toaster />
    </>
  );
}
