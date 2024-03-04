import { useLocalStorage } from "@uidotdev/usehooks";
import { keys } from "~/external/browser/local-storage/common";

export function useLocalStorageAuth() {
  const [token, setToken] = useLocalStorage<string | null | undefined>(
    keys.token,
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
