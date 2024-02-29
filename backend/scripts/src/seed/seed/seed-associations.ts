import { KyselyDB } from "@seed/db";
import { seedProducts } from "@seed/seed/seed-products";

export async function seedAssociations(
  db: KyselyDB,
  products: Awaited<ReturnType<typeof seedProducts>>
) {
  const associationType = await db
    .insertInto("productAssociationTypes")
    .values({
      typeName: "People also buy",
    })
    .returning("id")
    .executeTakeFirstOrThrow();

  const peopleAlsoBuy = [
    products.men["jeans"].ids["Slim Fit Jeans"].id,
    products.men["jeans"].ids["Ultra Stretch Jeans"].id,
    products.men["tops"].polo["ids"]["Short Sleeve Polo"].id,
    products.men["tops"].tshirt["ids"]["Regular Fit Crew-neck T-Shirt"].id,
  ];

  await db
    .insertInto("productAssociations")
    .values(
      peopleAlsoBuy.map((productId) => ({
        productAssociationTypeId: associationType.id,
        productId,
      }))
    )
    .execute();
}
