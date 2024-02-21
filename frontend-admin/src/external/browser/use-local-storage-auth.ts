import { useLocalStorage } from "@uidotdev/usehooks";

const STORAGE_PREFIX = "shopfashion_admin";
const TOKEN_KEY = `${STORAGE_PREFIX}_token`;

// TODO: replace @uidotdev/usehooks with a better localStorage hook
// one problem with @uidotdev/usehooks is when reading from the local storage or writing to the local storage
// it automatically treats anything as JSON
// we want to store JWT token as string in local storage and not as JSON
// (where the token will be stored with extra double quotes, e.g '"token"' instead of just 'token')
// but there is no way to disable this behaviour
// When this hook reads a value that is not JSON, it will throw an error
//
// This is problematic in following scenario:
// If user manually sets the local storage token with an invalid JSON value, this will throw an unexpected error
// By right when there is an invalid token in the local storage, we should remove the token and redirect back to login page
// But this error is difficult to handle gracefully because we cannot use try-catch with hooks
// So this error will cause cryptic error message to be shown in the UI
//
// The best solution is to roll-out own `useLocalStorage` hook or find a better library
//
// We ignore this for now because very rarely user will try to set anything in the local storage manually
export function useLocalStorageAuth() {
  const [token, setToken] = useLocalStorage<string | null | undefined>(
    TOKEN_KEY
  );

  return {
    setToken: (token: string) => {
      setToken(token);
    },
    token,
    clearToken: () => {
      setToken(null);
    },
  };
}

export const storage = {
  getToken: () => {
    const token = window.localStorage.getItem(TOKEN_KEY);
    if (token !== "" && token !== null) {
      try {
        const t = JSON.parse(token);
        return t;
      } catch {
        return null;
      }
    } else {
      return null;
    }
  },
};
