import { KyselyDB } from "@seed/db";
import { SeedOptions } from "@seed/data/product-options";
import { products } from "@seed/data/products/products";
import { SeedProduct } from "@seed/data/products/types";
import { SeedTaxon } from "@seed/data/taxons";

type Products = {
  [productName: string]: SeedProduct;
};

export async function seedProducts(
  db: KyselyDB,
  {
    options,
    taxons,
  }: {
    options: SeedOptions;
    taxons: SeedTaxon;
  }
) {
  const prods = products({
    options,
    taxons,
  });

  await seed(db, {
    products: prods.men.tops.polo.products as unknown as Products,
    ids: prods.men.tops.polo.ids,
  });

  await seed(db, {
    products: prods.men.tops.tshirt.products as unknown as Products,
    ids: prods.men.tops.tshirt.ids,
  });

  await seed(db, {
    products: prods.men.shorts.products as unknown as Products,
    ids: prods.men.shorts.ids,
  });

  await seed(db, {
    products: prods.men.jeans.products as unknown as Products,
    ids: prods.men.jeans.ids,
  });

  // women

  await seed(db, {
    products: prods.women.tops.blouse.products as unknown as Products,
    ids: prods.women.tops.blouse.ids,
  });

  await seed(db, {
    products: prods.women.tops.shirt.products as unknown as Products,
    ids: prods.women.tops.shirt.ids,
  });

  await seed(db, {
    products: prods.women.skirts.products as unknown as Products,
    ids: prods.women.skirts.ids,
  });

  await seed(db, {
    products: prods.women.jeans.products as unknown as Products,
    ids: prods.women.jeans.ids,
  });

  return prods;
}

async function seed(
  db: KyselyDB,
  data: {
    products: {
      [productName: string]: SeedProduct;
    };
    ids: {
      [productName: string]: {
        id: number;
        variants: {
          [variantName: string]: number;
        };
      };
    };
  }
) {
  for (const [productName, product] of Object.entries(data.products)) {
    const { id: productId } = await db
      .insertInto("products")
      .values({
        productName,
        productType: "CONFIGURABLE",
        taxonId: product.taxon,
        productStatus: "ACTIVE",
        productImageUrl: product.imgUrl,
      })
      .returning("id")
      .executeTakeFirstOrThrow();

    data.ids[productName].id = productId;

    await db
      .insertInto("productTaxons")
      .values(
        product.taxons.map((taxonId) => ({
          productId,
          taxonId,
        }))
      )
      .execute();

    await db
      .insertInto("productConfigurableOptions")
      .values(
        product.options.map((o) => ({
          productId,
          productOptionCode: o,
        }))
      )
      .execute();

    for (const [i, [variantName, [pricing, color, size]]] of Object.entries(
      product.variants
    ).entries()) {
      const { id: variantId } = await db
        .insertInto("productVariants")
        .values({
          variantName,
          pricing,
          productId,
          productStatus: "ACTIVE",
          position: i + 1,
        })
        .returning("id")
        .executeTakeFirstOrThrow();

      data.ids[productName].variants[variantName] = variantId;

      await db
        .insertInto("productVariantOptions")
        .values(
          [color, size].map((v) => ({
            productVariantId: variantId,
            productOptionValueId: v,
          }))
        )
        .execute();
    }
  }
}

function _seed<
  T extends {
    [productName: string]: SeedProduct;
  }
>(
  products: T,
  ids: {
    [prod: string]: {
      id: number;
      variants: {
        [k in keyof T[typeof prod]["variants"]]: number;
      };
    };
  }
) {
  for (const [name, product] of Object.entries(products)) {
    for (const _v of Object.keys(product.variants)) {
      const variant = _v as keyof (typeof ids)[typeof name]["variants"];
      ids[name].variants[variant] = 2;
    }
  }
}
