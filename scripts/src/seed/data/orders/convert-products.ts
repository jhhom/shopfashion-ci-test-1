import { SeedProducts } from "@seed/data/products/products";
import _ from "lodash";

type CategoryProducts = {
  [name: string]: {
    variants: {
      [variant: string]: readonly [number, number, number];
    };
  };
};

type CategoryProductIds<T extends CategoryProducts> = {
  [k in keyof T]: {
    variants: {
      [l in keyof T[k]["variants"]]: number;
    };
  };
};

function constructProductVariantPricingTable<T extends CategoryProducts>(
  products: T,
  ids: CategoryProductIds<T>
): {
  [productName in keyof T]: {
    [variantName in keyof T[productName]["variants"]]: {
      id: number;
      pricing: number;
    };
  };
} {
  return _.mapValues(products, function (product, productName) {
    return _.mapValues(
      product.variants,
      function (variant, variantName: string) {
        return {
          pricing: variant[0],
          id: ids[productName]["variants"][variantName],
        };
      }
    );
  }) as {
    [productName in keyof T]: {
      [variantName in keyof T[productName]["variants"]]: {
        id: number;
        pricing: number;
      };
    };
  };
}

function convertProducts(products: SeedProducts) {
  const p = {
    "men/polo": constructProductVariantPricingTable(
      products.men.tops.polo.products,
      products.men.tops.polo.ids
    ),
    "men/tshirt": constructProductVariantPricingTable(
      products.men.tops.tshirt.products,
      products.men.tops.tshirt.ids
    ),
    "men/jeans": constructProductVariantPricingTable(
      products.men.jeans.products,
      products.men.jeans.ids
    ),
    "men/shorts": constructProductVariantPricingTable(
      products.men.shorts.products,
      products.men.shorts.ids
    ),
    "women/tshirt": constructProductVariantPricingTable(
      products.women.tops.shirt.products,
      products.women.tops.shirt.ids
    ),
    "women/blouse": constructProductVariantPricingTable(
      products.women.tops.blouse.products,
      products.women.tops.blouse.ids
    ),
    "women/skirts": constructProductVariantPricingTable(
      products.women.skirts.products,
      products.women.skirts.ids
    ),
    "women/jeans": constructProductVariantPricingTable(
      products.women.jeans.products,
      products.women.jeans.ids
    ),
  };

  return p;
}

type ProductTable = ReturnType<typeof convertProducts>;

export type Category = keyof ProductTable;
export type Product<T extends Category> = keyof ProductTable[T];
export type Variant<
  C extends Category,
  T extends Product<C>
> = keyof ProductTable[C][T];

export type ProductPath = [
  Category,
  Product<Category>,
  Variant<Category, Product<Category>>
];

export function productPath<C extends Category, P extends Product<C>>(
  c: C,
  p: P,
  v: Variant<C, P>
): [C, P, Variant<C, P>] {
  return [c, p, v];
}

export function constructGetProduct(products: SeedProducts) {
  const pricingTable = convertProducts(products);

  return function getProduct<
    C extends Category,
    P extends Product<C>,
    V extends Variant<C, P>
  >(
    path: [C, P, V]
  ): {
    id: number;
    pricing: number;
  } {
    return pricingTable[path[0]][path[1]][path[2]] as {
      id: number;
      pricing: number;
    };
  };
}

// https://stackoverflow.com/questions/57599715/tuple-where-a-succeeding-elements-type-is-dependent-on-the-value-of-a-preceding
// https://stackoverflow.com/questions/61281041/create-a-union-from-values-of-a-nested-object-with-different-keys
