import { expect, test } from "vitest";

import { sql } from "kysely";

import { setupDB } from "@seed/db";

import { taxon } from "@seed/data/taxons";
import { options as _seedOptions } from "@seed/data/product-options";
import { customers as _seedCustomers } from "@seed/data/customers";

import { seedTaxons } from "@seed/seed/seed-taxon";
import { seedOptions } from "@seed/seed/seed-product-options";
import { seedCustomers } from "@seed/seed/seed-customers";
import { seedProducts } from "@seed/seed/seed-products";
import { seedOrders } from "@seed/seed/seed-orders";
import { generateOrders } from "@seed/data/orders/orders";

import { todayInUTC, generateDateFrom } from "@seed/seed/seed-orders";

const db = setupDB(
  "postgres://postgres@localhost:5432/jooq_shopfashion_playground"
);

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
