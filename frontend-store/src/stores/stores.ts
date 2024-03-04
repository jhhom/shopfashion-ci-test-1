import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  AfterLoginNavigationSlice,
  createAfterLoginNavigationSlice,
} from "~/stores/after-login-navigation.store";
import {
  AttemptToCheckoutWhileLoggedOutSlice,
  createAttemptToCheckoutWhileLoggedOutSlice,
} from "~/stores/attempt-to-checkout-while-logged-out";
import { type AuthSlice, createAuthSlice } from "~/stores/auth.store";

export const useAppStore = create(
  immer<
    AuthSlice & AfterLoginNavigationSlice & AttemptToCheckoutWhileLoggedOutSlice
  >((...a) => ({
    ...createAuthSlice(...a),
    ...createAfterLoginNavigationSlice(...a),
    ...createAttemptToCheckoutWhileLoggedOutSlice(...a),
  }))
);
