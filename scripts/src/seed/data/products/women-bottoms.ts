import { SeedOptions } from "@seed/data/product-options";
import { getFullTaxon, transformTaxon } from "@seed/data/products/taxons";
import type {
  JeansColor,
  JeansSizeWomen,
  ShirtSize,
  SkirtsColor,
} from "@seed/data/products/types";
import { type SeedTaxon } from "@seed/data/taxons";

export function womenJeans({
  size,
  color,
  options,
  seedTaxon,
}: {
  size: JeansSizeWomen;
  color: JeansColor;
  options: SeedOptions;
  seedTaxon: SeedTaxon;
}) {
  const t = transformTaxon(seedTaxon);
  const full = getFullTaxon(t);

  const jeansData = {
    "Ultra Stretch Jeans (Damaged)": {
      name: "Ultra Stretch Jeans (Damaged)",
      taxon: t.women.bottoms.jeans.id,
      taxons: full(t.women.bottoms.jeans.id),
      options: [options.jeans_color.code, options.women_jeans_size.code],
      imgUrl:
        "products/images/86jlo8HaMYTxk1p/P_Ultra Stretch Jeans (Damaged)-product.jpeg",
      variants: {
        "Blue-24 inch": [62.2, color.blue, size[24]],
        "Blue-25 inch": [62.2, color.blue, size[25]],
        "Blue-26 inch": [62.2, color.blue, size[26]],
        "Blue-27 inch": [62.2, color.blue, size[27]],
        "Blue-28 inch": [62.2, color.blue, size[28]],
        "Blue-29 inch": [62.2, color.blue, size[29]],
        "Blue-30 inch": [62.2, color.blue, size[30]],
        "Blue-31 inch": [62.2, color.blue, size[31]],
        "Blue-32 inch": [62.2, color.blue, size[32]],
        "Blue-33 inch": [62.2, color.blue, size[33]],

        "Navy-24 inch": [63.3, color.navy, size[24]],
        "Navy-25 inch": [63.3, color.navy, size[25]],
        "Navy-26 inch": [63.3, color.navy, size[26]],
        "Navy-27 inch": [63.3, color.navy, size[27]],
        "Navy-28 inch": [63.3, color.navy, size[28]],
        "Navy-29 inch": [63.3, color.navy, size[29]],
        "Navy-30 inch": [63.3, color.navy, size[30]],
        "Navy-31 inch": [63.3, color.navy, size[31]],
        "Navy-32 inch": [63.3, color.navy, size[32]],
        "Navy-33 inch": [63.3, color.navy, size[33]],
      } as const,
    },
    "Wide Fit Jeans (High Waist)": {
      name: "Wide Fit Jeans (High Waist)",
      taxon: t.women.bottoms.jeans.id,
      taxons: full(t.women.bottoms.jeans.id),
      options: [options.jeans_color.code, options.women_jeans_size.code],
      imgUrl: "products/images/PPUOJGSCRz5mV45/P_Wide Fit Jeans-product.jpeg",
      variants: {
        "Blue-26 inch": [68.7, color.blue, size[26]],
        "Blue-27 inch": [68.7, color.blue, size[27]],
        "Blue-28 inch": [68.7, color.blue, size[28]],
        "Blue-29 inch": [68.7, color.blue, size[29]],
        "Blue-30 inch": [68.7, color.blue, size[30]],
        "Blue-31 inch": [68.7, color.blue, size[31]],
        "Blue-32 inch": [68.7, color.blue, size[32]],
        "Blue-33 inch": [68.7, color.blue, size[33]],

        "Navy-28 inch": [68.7, color.navy, size[28]],
        "Navy-29 inch": [68.7, color.navy, size[29]],
        "Navy-30 inch": [68.7, color.navy, size[30]],
        "Navy-31 inch": [68.7, color.navy, size[31]],
        "Navy-32 inch": [68.7, color.navy, size[32]],
        "Navy-33 inch": [68.7, color.navy, size[33]],
      } as const,
    },
  };

  const jeansIds: {
    [k in keyof typeof jeansData]: {
      id: number;
      variants: {
        [l in keyof (typeof jeansData)[k]["variants"]]: number;
      };
    };
  } = {
    "Ultra Stretch Jeans (Damaged)": {
      id: 0,
      variants: {
        "Blue-24 inch": 0,
        "Blue-25 inch": 0,
        "Blue-26 inch": 0,
        "Blue-27 inch": 0,
        "Blue-28 inch": 0,
        "Blue-29 inch": 0,
        "Blue-30 inch": 0,
        "Blue-31 inch": 0,
        "Blue-32 inch": 0,
        "Blue-33 inch": 0,

        "Navy-24 inch": 0,
        "Navy-25 inch": 0,
        "Navy-26 inch": 0,
        "Navy-27 inch": 0,
        "Navy-28 inch": 0,
        "Navy-29 inch": 0,
        "Navy-30 inch": 0,
        "Navy-31 inch": 0,
        "Navy-32 inch": 0,
        "Navy-33 inch": 0,
      },
    },
    "Wide Fit Jeans (High Waist)": {
      id: 0,
      variants: {
        "Blue-26 inch": 0,
        "Blue-27 inch": 0,
        "Blue-28 inch": 0,
        "Blue-29 inch": 0,
        "Blue-30 inch": 0,
        "Blue-31 inch": 0,
        "Blue-32 inch": 0,
        "Blue-33 inch": 0,

        "Navy-28 inch": 0,
        "Navy-29 inch": 0,
        "Navy-30 inch": 0,
        "Navy-31 inch": 0,
        "Navy-32 inch": 0,
        "Navy-33 inch": 0,
      },
    },
  };

  return {
    products: jeansData,
    ids: jeansIds,
  };
}

export function womenSkirts({
  size,
  color,
  options,
  seedTaxon,
}: {
  size: ShirtSize;
  color: SkirtsColor;
  options: SeedOptions;
  seedTaxon: SeedTaxon;
}) {
  const t = transformTaxon(seedTaxon);
  const full = getFullTaxon(t);

  const skirtsData = {
    "Long floral skirt": {
      name: "Long floral skirt",
      taxon: t.women.bottoms.skirts.id,
      taxons: full(t.women.bottoms.skirts.id),
      options: [options.skirts_color.code, options.size.code],
      imgUrl:
        "products/images/6lk8gU16jPcr0FW/P_Long floral skirt-product.jpeg",
      variants: {
        "Red-M": [43.3, color.red, size.M],
        "Red-L": [43.3, color.red, size.L],
        "Red-XL": [43.3, color.red, size.XL],
      } as const,
    },
    "Red checked skirt": {
      name: "Red checked skirt",
      taxon: t.women.bottoms.skirts.id,
      taxons: full(t.women.bottoms.skirts.id),
      options: [options.skirts_color.code, options.size.code],
      imgUrl:
        "products/images/HE1YhSusFdR30Vg/P_Red checked skirt-product.jpeg",
      variants: {
        "Red-S": [51.5, color.red, size.S],
        "Red-M": [53.5, color.red, size.M],
        "Red-L": [51.5, color.red, size.L],

        "Black-S": [51.5, color.black, size.S],
        "Black-M": [53.5, color.black, size.M],
        "Black-L": [51.5, color.black, size.L],
      } as const,
    },
    "Short Sequin Skirt": {
      name: "Short Sequin Skirt",
      taxon: t.women.bottoms.skirts.id,
      taxons: full(t.women.bottoms.skirts.id),
      options: [options.skirts_color.code, options.size.code],
      imgUrl:
        "products/images/WlQdNwtoYSrz9Kx/P_Short Sequin Skirt-product.jpeg",
      variants: {
        "Black-S": [110.5, color.black, size.S],
        "Black-M": [120.5, color.black, size.M],
        "Black-L": [120.5, color.black, size.L],
        "Black-XL": [120.5, color.black, size.XL],
      } as const,
    },
  };

  const skirtIds: {
    [k in keyof typeof skirtsData]: {
      id: number;
      variants: {
        [l in keyof (typeof skirtsData)[k]["variants"]]: number;
      };
    };
  } = {
    "Long floral skirt": {
      id: 0,
      variants: {
        "Red-M": 0,
        "Red-L": 0,
        "Red-XL": 0,
      } as const,
    },
    "Red checked skirt": {
      id: 0,
      variants: {
        "Red-S": 0,
        "Red-M": 0,
        "Red-L": 0,

        "Black-S": 0,
        "Black-M": 0,
        "Black-L": 0,
      } as const,
    },
    "Short Sequin Skirt": {
      id: 0,
      variants: {
        "Black-S": 0,
        "Black-M": 0,
        "Black-L": 0,
        "Black-XL": 0,
      } as const,
    },
  };

  return {
    products: skirtsData,
    ids: skirtIds,
  };
}
