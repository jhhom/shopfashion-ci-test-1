import { initContract } from "@ts-rest/core";
import { z } from "zod";

const c = initContract();

export const adminApiContract = c.router({
  login: {
    method: "POST",
    path: "/admin_login",
    body: z.object({
      email: z.string(),
      password: z.string(),
    }),
    responses: {
      200: z.object({ token: z.string() }),
    },
  },
  verifyToken: {
    method: "POST",
    path: "/admin/verify_token",
    body: null,
    responses: {
      200: z.object({ email: z.string() }),
    },
    headers: z.object({
      authorization: z.string(),
    }),
  },
});
