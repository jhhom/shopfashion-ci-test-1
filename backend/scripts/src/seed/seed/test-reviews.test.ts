import { expect, test } from "vitest";

import {
  CamelCasePlugin,
  PostgresDialect,
  Kysely,
  Insertable,
  sql,
} from "kysely";
import _, { minBy, random } from "lodash";

import { faker } from "@faker-js/faker";
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
import { KyselyDB } from "@seed/db";
import { generateReviews } from "@seed/data/reviews";

const db = setupDB(
  "postgres://postgres@localhost:5432/jooq_shopfashion_playground"
);

async function seed() {
  const tableToTruncate: Parameters<typeof db.deleteFrom>[0][] = [
    "productTaxons",
    "productVariants",
    "productVariantOptions",
    "productOptions",
    "taxons",
    "products",
    "customers",
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

  return { products };
}

async function truncateTable(
  db: KyselyDB,
  t: Parameters<typeof db.deleteFrom>[0]
) {
  await sql`TRUNCATE TABLE ${sql.table(
    t as string
  )} RESTART IDENTITY CASCADE`.execute(db);
}

test("test seed reviews", async () => {
  const { products } = await seed();

  const { men: menReviews, women: womenReviews } = generateReviews({
    products,
  });

  const generatedReviews: {
    orderId: number;
    review: string;
    rating: number;
    date: Date;
    productId: number;
  }[] = [];

  for (const [_productId, reviews] of Object.entries(menReviews)) {
    const productId = Number.parseInt(_productId);

    const customersWhoCanLeaveReviews = (
      await getCustomersWhoCanLeaveReviews(db, productId)
    ).filter(
      (
        c
      ): c is {
        orderId: number;
        orderDate: Date;
      } => c !== undefined
    );

    const a = randomlyPairCustomersWithReviews(
      customersWhoCanLeaveReviews.map((c) => ({ canReviewAfter: c })),
      reviews
    ).map((r) => ({ ...r, productId }));

    generatedReviews.push(...a);
  }

  for (const [_productId, reviews] of Object.entries(womenReviews)) {
    const productId = Number.parseInt(_productId);

    const customersWhoCanLeaveReviews = (
      await getCustomersWhoCanLeaveReviews(db, productId)
    ).filter(
      (
        c
      ): c is {
        orderId: number;
        orderDate: Date;
      } => c !== undefined
    );

    const a = randomlyPairCustomersWithReviews(
      customersWhoCanLeaveReviews.map((c) => ({ canReviewAfter: c })),
      reviews
    ).map((r) => ({ ...r, productId }));

    generatedReviews.push(...a);
  }

  await db
    .insertInto("productReviews")
    .values(
      generatedReviews.map((r) => ({
        orderId: r.orderId,
        productId: r.productId,
        comment: r.review,
        rating: r.rating,
        createdAt: r.date,
      }))
    )
    .execute();
});

async function getCustomersWhoCanLeaveReviews(db: KyselyDB, productId: number) {
  const customersWhoCanLeaveReviews = (
    await db
      .selectFrom("customers")
      .innerJoin("orders", "customers.id", "orders.customerId")
      .innerJoin(
        "orderLineConfigurableItems",
        "orderLineConfigurableItems.orderId",
        "orders.id"
      )
      .innerJoin(
        "productVariants",
        "productVariants.id",
        "orderLineConfigurableItems.productVariantId"
      )
      .select([
        sql<
          {
            id: number;
            createdAt: string;
          }[]
        >`ARRAY_AGG(
          JSON_BUILD_OBJECT(
            'id', ${sql.ref("orders.id")},
            'created_at', ${sql.ref("orders.created_at")}
          )
        )
        `.as("orders"),
      ])
      .where("productVariants.productId", "=", productId)
      .where("orders.orderStatus", "=", "PAID")
      .groupBy(["customers.id"])
      .execute()
  ).map((c) => {
    return getCanReviewAfterFromOrders(
      c.orders.map((o) => ({
        orderId: o.id,
        orderDate: new Date(o.createdAt),
      }))
    );
  });
  return customersWhoCanLeaveReviews;
}

function getCanReviewAfterFromOrders(
  orders: {
    orderId: number;
    orderDate: Date;
  }[]
) {
  return _.minBy(orders, (o) => o.orderDate.getTime());
}

function randomlyPairCustomersWithReviews(
  customers: {
    canReviewAfter: {
      orderId: number;
      orderDate: Date;
    };
  }[],
  reviews: { comment: string; rating: number }[]
) {
  const today = todayInUTC();
  const shuffledCustomers = shuffleArray(customers);
  const shuffledReviews = shuffleArray(reviews);

  const customerReviews: {
    orderId: number;
    review: string;
    rating: number;
    date: Date;
  }[] = [];

  if (shuffledCustomers.length < shuffledReviews.length) {
    for (let i = 0; i < shuffledCustomers.length; i++) {
      customerReviews.push({
        orderId: shuffledCustomers[i].canReviewAfter.orderId,
        review: shuffledReviews[i].comment,
        rating: shuffledReviews[i].rating,
        date: faker.date.between({
          from: shuffledCustomers[i].canReviewAfter.orderDate,
          to: today,
        }),
      });
    }
  }

  if (shuffledReviews.length < shuffledCustomers.length) {
    for (let i = 0; i < shuffledReviews.length; i++) {
      customerReviews.push({
        orderId: shuffledCustomers[i].canReviewAfter.orderId,
        review: shuffledReviews[i].comment,
        rating: shuffledReviews[i].rating,
        date: faker.date.between({
          from: shuffledCustomers[i].canReviewAfter.orderDate,
          to: today,
        }),
      });
    }
  }

  return customerReviews;
}

function shuffleArray<T>(array: Array<T>) {
  const arr = _.cloneDeep(array);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
