import { KyselyDB } from "@seed/db";
import { SeedCustomers } from "@seed/data/customers";

export async function seedCustomers(db: KyselyDB, customers: SeedCustomers) {
  for (const customer of Object.values(customers)) {
    customer.id = (
      await db
        .insertInto("customers")
        .values({
          email: customer.email,
          password: customer.password,
        })
        .returning("id")
        .executeTakeFirstOrThrow()
    ).id;
  }

  return customers;
}
