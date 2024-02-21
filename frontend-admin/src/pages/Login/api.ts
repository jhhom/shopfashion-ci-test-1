import { client } from "~/external/api-client/client";
import { useMutation } from "@tanstack/react-query";
import { useUser } from "~/providers/user";
import { parseApiError } from "~/utils/api";
import toast from "react-hot-toast";
import { useLocalStorageAuth } from "~/external/browser/use-local-storage-auth";
import { useAfterVerifyTokenNavigation } from "~/providers/after-verify-token-navigation";
import { useNavigate } from "@tanstack/react-router";

export function useLogin() {
  const [user, setUser] = useUser();

  const { setToken, clearToken } = useLocalStorageAuth();

  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (values: { email: string; password: string }) => {
      const result = await client.admin.login({
        body: values,
      });
      if (result.status !== 200) {
        throw result.body;
      }
      return { ...result.body, email: values.email };
    },
    onSuccess({ token, email }) {
      setUser({ email });
      setToken(token);
    },
    onError(e) {
      clearToken();
      const err = parseApiError(e);
      if (err.type == "application") {
        if (err.error.details.code === "RESOURCE_NOT_FOUND") {
          toast.error("Incorrect email address");
        } else if (err.error.details.code === "AUTH.INCORRECT_PASSWORD") {
          toast.error("Incorrect password");
        } else {
          toast.error("Failed to login, an unexpected had occured");
        }
      } else {
        toast.error("Failed to login, an unexpected had occured");
      }
    },
  });
}
