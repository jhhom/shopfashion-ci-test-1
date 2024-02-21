import { create } from "zustand";
import { ImmerStateCreator } from "~/stores/types";
// import { produce } from "immer";

export type AuthSlice = {
  authenticated: boolean;
  setAuthenticated: (authenticated: boolean) => void;
};

export const authStore = create<AuthSlice>((set) => ({
  authenticated: false,
  setAuthenticated: (authenticated) => {
    set({ authenticated });
  },
}));

export const createAuthSlice: ImmerStateCreator<AuthSlice> = (set) => ({
  authenticated: false,
  setAuthenticated(authenticated) {
    set({ authenticated });
  },
});
