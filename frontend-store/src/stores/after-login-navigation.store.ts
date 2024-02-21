import { LinkPropsOptions } from "@tanstack/react-router";
import { create } from "zustand";
import { AuthSlice } from "~/stores/auth.store";
import { ImmerStateCreator } from "~/stores/types";
// import { produce } from "immer";

export type AfterLoginNavigationSlice = {
  navigateTo: LinkPropsOptions["to"] | null;
  setNavigateTo: (navigateTo: LinkPropsOptions["to"] | null) => void;
};

export const afterLoginNavigationStore = create<AfterLoginNavigationSlice>(
  (set) => ({
    navigateTo: null,
    setNavigateTo: (navigateTo) => {
      set({ navigateTo });
    },
  }),
);

export const createAfterLoginNavigationSlice: ImmerStateCreator<
  AfterLoginNavigationSlice
> = (set) => ({
  navigateTo: null,
  setNavigateTo: (navigateTo) => {
    set({ navigateTo });
  },
});
