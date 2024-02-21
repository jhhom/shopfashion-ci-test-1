import { z } from "zod";
import { zApplicationErrorUnion, AppErrorUnion } from "./application-errors";

export const zErrorHttpResponse = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("application"),
    error: zApplicationErrorUnion,
  }),
  z.object({
    type: z.literal("unexpected"),
    error: z.unknown(),
  }),
]);

export type ErrorHTTPResponse =
  | {
      type: "application";
      error: AppErrorUnion;
    }
  | {
      type: "unexpected";
      error: unknown;
    };
