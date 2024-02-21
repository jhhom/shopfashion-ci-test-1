import { LinkProps } from "@tanstack/react-router";
import { create } from "zustand";
import { AuthSlice } from "~/stores/auth.store";
import { ImmerStateCreator } from "~/stores/types";
// import { produce } from "immer";

export type AfterLoginNavigationSlice = {
  navigateTo: LinkProps["to"] | null;
  setNavigateTo: (navigateTo: LinkProps["to"] | null) => void;
};

export const afterLoginNavigationStore = create<AfterLoginNavigationSlice>(
  (set) => ({
    navigateTo: null,
    setNavigateTo: (navigateTo) => {
      set({ navigateTo });
    },
  })
);

export const createAfterLoginNavigationSlice: ImmerStateCreator<
  AfterLoginNavigationSlice
> = (set) => ({
  navigateTo: null,
  setNavigateTo: (navigateTo) => {
    set({ navigateTo });
  },
});
