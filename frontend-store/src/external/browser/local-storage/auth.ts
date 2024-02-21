import { keys } from "~/external/browser/local-storage/common";

const authStorage = {
  setToken: (token: string) => window.localStorage.setItem(keys.token, token),
  token: () => window.localStorage.getItem(keys.token),
  clearToken: () => window.localStorage.removeItem(keys.token),
};

export { authStorage };
