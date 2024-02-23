import { KyselyDB } from "@seed/db";
import { sql } from "kysely";
import { SeedReviews } from "@seed/data/reviews";
import { todayInUTC } from "@seed/seed/seed-orders";
import { faker } from "@faker-js/faker";
import _ from "lodash";

export async function seedReviews(
  db: KyselyDB,
  {
    reviews,
  }: {
    reviews: SeedReviews;
  }
) {
  const { men, women } = reviews;

  // 1. iterate through each product
  // 2. get its corresponding customers
  // 3. produce a pair of customer id and their review and date
  // 4. insert into reviews table

  const generatedReviews: {
    orderId: number;
    review: string;
    rating: number;
    date: Date;
    productId: number;
  }[] = [];

  for (const [_productId, reviews] of Object.entries(men)) {
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

  for (const [_productId, reviews] of Object.entries(women)) {
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
}

function pairCustomerWithReview({
  customerId,
  canReviewAfter,
}: {
  customerId: number;
  canReviewAfter: Date;
}) {}

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
