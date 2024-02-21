import { expect, test } from "vitest";

import { sql } from "kysely";

import { setupTestDb } from "@backend/test-utils/db/db";

import { taxon } from "@backend/scripts/seed3/data/taxons";
import { options as _seedOptions } from "@backend/scripts/seed3/data/product-options";
import { customers as _seedCustomers } from "@backend/scripts/seed3/data/customers";

import { seedTaxons } from "@backend/scripts/seed3/seed/seed-taxon";
import { seedOptions } from "@backend/scripts/seed3/seed/seed-product-options";
import { seedCustomers } from "@backend/scripts/seed3/seed/seed-customers";
import { seedProducts } from "@backend/scripts/seed3/seed/seed-products";
import { seedOrders } from "@backend/scripts/seed3/seed/seed-orders";
import { generateOrders } from "@backend/scripts/seed3/data/orders/orders";

import {
  todayInUTC,
  generateDateFrom,
} from "@backend/scripts/seed3/seed/seed-orders";

const db = setupTestDb();

async function seed() {
  type TableName = Parameters<typeof db.deleteFrom>[0];

  const tableToTruncate: TableName[] = [
    "productTaxons",
    "productVariants",
    "productVariantOptions",
    "productOptions",
    "taxons",
    "products",
    "customers",
    "orders",
  ];

  for (const t of tableToTruncate) {
    await sql`TRUNCATE TABLE ${sql.table(
      t as string
    )} RESTART IDENTITY CASCADE`.execute(db);
  }
}

test("test seed order", async () => {
  await seed();

  const taxons = await seedTaxons(db, taxon);
  const options = await seedOptions(db, _seedOptions);
  const customers = await seedCustomers(db, _seedCustomers);

  const products = await seedProducts(db, { options, taxons });

  const orders = generateOrders({ customers, products });
  await seedOrders(db, { orders, seeded: { customers, products } });
});

test("today from", () => {
  const t = todayInUTC();

  const d = generateDateFrom(t, { days: 1 });
  console.log(d.toUTCString());
});
