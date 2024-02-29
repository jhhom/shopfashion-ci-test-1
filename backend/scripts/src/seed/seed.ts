import { sql } from "kysely";

import { customers as _seedCustomers } from "@seed/data/customers";
import { options as _seedOptions } from "@seed/data/product-options";
import { taxon } from "@seed/data/taxons";

import { seedCustomers } from "@seed/seed/seed-customers";
import { seedTaxons } from "@seed/seed/seed-taxon";
import { seedOptions } from "@seed/seed/seed-product-options";
import { seedProducts } from "@seed/seed/seed-products";
import { generateOrders } from "@seed/data/orders/orders";
import { seedOrders } from "@seed/seed/seed-orders";
import { seedReviews } from "@seed/seed/seed-reviews";
import { seedAdmins } from "@seed/seed/seed-admins";
import { generateReviews } from "@seed/data/reviews";
import { KyselyDB } from "@seed/db";

import pg, { Pool } from "pg";
import { CamelCasePlugin, PostgresDialect, Kysely } from "kysely";

import path from "path";

import { DB } from "@seed/codegen/schema";

import * as fs from "fs";
import { seedAssociations } from "@seed/seed/seed-associations";

async function truncateTable(
  db: KyselyDB,
  t: Parameters<typeof db.deleteFrom>[0]
) {
  await sql`TRUNCATE TABLE ${sql.table(
    t as string
  )} RESTART IDENTITY CASCADE`.execute(db);
}

async function seedDatabase(db: KyselyDB) {
  const tableToTruncate: Parameters<typeof db.deleteFrom>[0][] = [
    "productTaxons",
    "productVariants",
    "productVariantOptions",
    "productOptions",
    "taxons",
    "products",
    "customers",
    "admins",
    "productAssociations",
  ];

  for (const t of tableToTruncate) {
    await truncateTable(db, t);
  }
  const taxons = await seedTaxons(db, taxon);
  const options = await seedOptions(db, _seedOptions);
  const customers = await seedCustomers(db, _seedCustomers);

  const products = await seedProducts(db, { options, taxons });

  const _ordersSeed = generateOrders({ customers, products });

  await seedOrders(db, {
    orders: _ordersSeed,
    seeded: { customers, products },
  });

  const reviews = generateReviews({ products });

  await seedReviews(db, { reviews });
  await seedAdmins(db);

  await seedAssociations(db, products);
}

function seedAssets(paths: {
  assetSource: string;
  assetCopyDestination: string;
}) {
  fs.rmSync(paths.assetCopyDestination, { recursive: true, force: true });
  fs.cpSync(paths.assetSource, paths.assetCopyDestination, { recursive: true });
  fs.writeFileSync(path.join(paths.assetCopyDestination, ".gitkeep"), "");
}

export async function seed(
  databaseUrl: string,
  seedAssetsConfig:
    | {
        seed: false;
      }
    | {
        seed: true;
        assetSource: string;
        assetCopyDestination: string;
      }
) {
  const dialect = new PostgresDialect({
    pool: new Pool({
      connectionString: databaseUrl,
    }),
  });

  const db = new Kysely<DB>({
    dialect,
    log(event) {
      if (event.level === "query") {
        console.log(event.query.sql);
        console.log(event.query.parameters);
      }
    },
    plugins: [new CamelCasePlugin()],
  });

  console.log("🟢 Seeding database...");
  await seedDatabase(db);
  console.log("✅ Database seeding completed.");

  if (seedAssetsConfig.seed) {
    console.log("🟢 Seeding assets...");
    console.log("Asset source: ", seedAssetsConfig.assetSource);
    console.log("Asset destination: ", seedAssetsConfig.assetCopyDestination);
    seedAssets(seedAssetsConfig);
    console.log("✅ Asset seeding completed.");
  }

  console.log("✅ Seeding completed ✅");
}
