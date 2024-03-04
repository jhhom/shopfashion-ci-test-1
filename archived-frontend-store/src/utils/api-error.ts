import {
  ErrorHTTPResponse,
  zErrorHttpResponse,
} from "@api-contract/errors/errors";

export function parseApiError(error: unknown): ErrorHTTPResponse {
  const err = zErrorHttpResponse.safeParse(error);
  if (err.success) {
    if (err.data.type === "application") {
      return err.data;
    } else {
      return {
        type: "unexpected",
        error: err.data.error,
      };
    }
  }
  return {
    type: "unexpected",
    error: err,
  };
}
