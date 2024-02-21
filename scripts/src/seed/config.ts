import * as dotenv from "dotenv";
import { z } from "zod";

const configSchema = z.object({
  DATABASE_URL: z.string().min(1),
});

export function loadConfig() {
  dotenv.config();
  const result = configSchema.parse(process.env);
  return result;
}
