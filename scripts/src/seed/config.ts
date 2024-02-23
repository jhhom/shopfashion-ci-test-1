import * as dotenv from "dotenv";
import { z } from "zod";

const seedConfigSchema = z.object({
  DATABASE_URL: z.string().min(1),
});

const seedAdminConfigSchema = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_SEED_EMAIL: z.string().min(1),
  ADMIN_SEED_PASSWORD: z.string().min(1),
  ADMIN_SEED_USERNAME: z.string().min(1),
});

export function loadSeedConfig() {
  dotenv.config();
  const result = seedConfigSchema.parse(process.env);
  return result;
}

export function loadSeedAdminConfig() {
  dotenv.config();
  const result = seedAdminConfigSchema.parse(process.env);
  return result;
}
