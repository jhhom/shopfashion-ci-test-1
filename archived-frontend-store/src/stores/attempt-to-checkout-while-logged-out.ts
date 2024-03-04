import { LinkPropsOptions } from "@tanstack/react-router";
import { create } from "zustand";
import { AuthSlice } from "~/stores/auth.store";
import { ImmerStateCreator } from "~/stores/types";
// import { produce } from "immer";

export type AttemptToCheckoutWhileLoggedOutSlice = {
  attemptToCheckoutWhileLoggedOut: boolean;
  setAttemptToCheckoutWhileLoggedOut: (attempted: boolean) => void;
};

export const attemptToCheckoutWhileLoggedOutStore =
  create<AttemptToCheckoutWhileLoggedOutSlice>((set) => ({
    attemptToCheckoutWhileLoggedOut: false,
    setAttemptToCheckoutWhileLoggedOut: (attempted) => {
      set({ attemptToCheckoutWhileLoggedOut: attempted });
    },
  }));

export const createAttemptToCheckoutWhileLoggedOutSlice: ImmerStateCreator<
  AttemptToCheckoutWhileLoggedOutSlice
> = (set) => ({
  attemptToCheckoutWhileLoggedOut: false,
  setAttemptToCheckoutWhileLoggedOut: (attempted) => {
    set({ attemptToCheckoutWhileLoggedOut: attempted });
  },
});
