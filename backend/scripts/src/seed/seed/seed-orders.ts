import { KyselyDB } from "@seed/db";
import { SeedCustomers } from "@seed/data/customers";
import { SeedOrders } from "@seed/data/orders/orders";
import { constructGetProduct } from "@seed/data/orders/convert-products";
import { SeedProducts } from "@seed/data/products/products";
import { Duration, add, parse, startOfToday, sub } from "date-fns";
import { faker } from "@faker-js/faker";

export async function seedOrders(
  db: KyselyDB,
  {
    orders,
    seeded: { customers, products },
  }: {
    orders: SeedOrders;
    seeded: {
      customers: SeedCustomers;
      products: SeedProducts;
    };
  }
) {
  const shippingFee = 20;

  const getProduct = constructGetProduct(products);

  const today = todayInUTC();

  for (const periodOrders of Object.values(orders)) {
    for (const o of Object.values(periodOrders)) {
      const totalPrice = o.items
        .map((i) => {
          const p = getProduct(i[1]);

          return i[0] * p.pricing;
        })
        .reduce((a, v) => a + v);

      o.id = (
        await db
          .insertInto("orders")
          .values({
            customerId: o.customer,
            shippingFee,
            totalPrice,
            orderStatus: "PAID",
            createdAt: generateDateFrom(today, o.dateFromToday),
            deliveryAddress: o.deliveryAddress,
          })
          .returning("id")
          .executeTakeFirstOrThrow()
      ).id;

      await db
        .insertInto("orderLineConfigurableItems")
        .values(
          o.items.map(([quantity, path]) => {
            const prod = getProduct(path);
            return {
              orderId: o.id,
              productVariantId: prod.id,
              quantity,
              unitPrice: prod.pricing,
              orderLineItemStatus: "COMPLETED",
            };
          })
        )
        .execute();
    }
  }

  return orders;
}

export function todayInUTC() {
  const d = startOfToday();
  const day = d.getDate();
  const month = d.getMonth();
  const year = d.getFullYear();

  return parse(`${year}-${month + 1}-${day},+00`, "yyyy-M-d,x", new Date());
}

export function generateDateFrom(today: Date, duration: Duration) {
  const from = sub(today, duration);
  const to = add(from, { hours: 23, minutes: 59, seconds: 59 });
  const randTime = faker.date.between({ from, to });
  return randTime;
}
