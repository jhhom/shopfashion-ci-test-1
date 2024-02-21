import { seed } from "@seed/seed";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = z.string().parse(process.env.DATABASE_URL);

seed(DATABASE_URL, { seed: false });
