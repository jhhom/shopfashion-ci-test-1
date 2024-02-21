import { type SeedOptions } from "@seed/data/product-options";
import { getFullTaxon, transformTaxon } from "@seed/data/products/taxons";
import type { ShirtColor, ShirtSize } from "@seed/data/products/types";
import type { SeedTaxon } from "@seed/data/taxons";

export function menTops({
  size,
  color,
  options,
  seedTaxon,
}: {
  size: ShirtSize;
  color: ShirtColor;
  options: SeedOptions;
  seedTaxon: SeedTaxon;
}) {
  const t = transformTaxon(seedTaxon);
  const full = getFullTaxon(t);

  const poloProducts = {
    ["Slim Fit Dotted Polo"]: {
      name: "Slim Fit Dotted Polo",
      taxon: t.men.tops.polo.id,
      taxons: full(t.men.tops.polo.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/okRuOJyccu61W25/P_Slim Fit Dotted Polo-product.jpeg",
      variants: {
        "Red-S": [28.9, color.red, size.S],
        "Red-M": [28.9, color.red, size.M],
        "Red-L": [28.9, color.red, size.L],
        "Red-XL": [28.9, color.red, size.XL],
        "White-S": [28.9, color.white, size.S],
        "White-M": [28.9, color.white, size.M],
        "White-L": [26.9, color.white, size.L],
        "White-XL": [26.9, color.white, size.XL],
      } as const,
    },
    ["Short Sleeve Polo"]: {
      name: "Short Sleeve Polo",
      taxon: t.men.tops.polo.id,
      taxons: full(t.men.tops.polo.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/Hqw3W7Lb1eoGnS2/P_Short Sleeve Polo-product.jpeg",
      variants: {
        "White-S": [30.9, color.white, size.S],
        "White-M": [30.9, color.white, size.M],
        "White-L": [30.9, color.white, size.L],
        "White-XL": [30.9, color.white, size.XL],

        "Black-S": [32, color.black, size.S],
        "Black-M": [32, color.black, size.M],
        "Black-L": [32, color.black, size.L],
        "Black-XL": [32, color.black, size.XL],

        "Grey-S": [30.9, color.grey, size.S],
        "Grey-M": [30.9, color.grey, size.M],
        "Grey-L": [30.9, color.grey, size.L],
        "Grey-XL": [30.9, color.grey, size.XL],
      } as const,
    },
    ["Vito Willy Polo"]: {
      name: "Vito Willy Polo",
      taxon: t.men.tops.polo.id,
      taxons: full(t.men.tops.polo.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl: "products/images/l4G8cgkOfEc67tH/P_Vito Willy Polo-product.jpeg",
      variants: {
        "Red-S": [34.9, color.red, size.S],
        "Red-M": [34.9, color.red, size.M],
        "Red-L": [34.9, color.red, size.L],
        "Red-XL": [34.9, color.red, size.XL],

        "Black-S": [36.7, color.black, size.S],
        "Black-M": [36.7, color.black, size.M],
        "Black-L": [36.7, color.black, size.L],
        "Black-XL": [36.7, color.black, size.XL],

        "Grey-S": [38.9, color.grey, size.S],
        "Grey-M": [40.3, color.grey, size.M],
        "Grey-L": [38.9, color.grey, size.L],
        "Grey-XL": [38.9, color.grey, size.XL],
      } as const,
    },
  };

  const poloProductIds: {
    [k in keyof typeof poloProducts]: {
      id: number;
      variants: {
        [l in keyof (typeof poloProducts)[k]["variants"]]: number;
      };
    };
  } = {
    "Slim Fit Dotted Polo": {
      id: 0,
      variants: {
        ["Red-S"]: 0,
        ["Red-M"]: 0,
        ["Red-L"]: 0,
        ["Red-XL"]: 0,
        ["White-S"]: 0,
        ["White-M"]: 0,
        ["White-L"]: 0,
        ["White-XL"]: 0,
      },
    },
    "Short Sleeve Polo": {
      id: 0,
      variants: {
        "White-S": 0,
        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,
        "Black-S": 0,
        "Black-M": 0,
        "Black-L": 0,
        "Black-XL": 0,
        "Grey-S": 0,
        "Grey-M": 0,
        "Grey-L": 0,
        "Grey-XL": 0,
      },
    },
    "Vito Willy Polo": {
      id: 0,
      variants: {
        "Red-S": 0,
        "Red-M": 0,
        "Red-L": 0,
        "Red-XL": 0,

        "Black-S": 0,
        "Black-M": 0,
        "Black-L": 0,
        "Black-XL": 0,

        "Grey-S": 0,
        "Grey-M": 0,
        "Grey-L": 0,
        "Grey-XL": 0,
      },
    },
  };

  const tshirts = {
    ["Regular Fit Crew-neck T-Shirt"]: {
      name: "Regular Fit Crew-neck T-Shirt",
      taxon: t.men.tops.tShirt.id,
      taxons: full(t.men.tops.tShirt.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/gOHGsKglMrb436F/P_Regular Fit Crew-neck T-Shirt-product.jpeg",
      variants: {
        "Black-S": [22.5, color.black, size.S],
        "Black-M": [26.4, color.black, size.M],
        "Black-L": [22.5, color.black, size.L],
        "Black-XL": [22.5, color.black, size.XL],
        "White-S": [22.5, color.white, size.S],
        "White-M": [26.4, color.white, size.M],
        "White-L": [22.5, color.white, size.L],
        "White-XL": [22.5, color.white, size.XL],
      } as const,
    },
    ["Oversized Round-neck T-Shirt"]: {
      name: "Oversized Round-neck T-Shirt",
      taxon: t.men.tops.tShirt.id,
      taxons: full(t.men.tops.tShirt.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/Zkv0ZSDXPijie30/P_Oversized Round-neck T-Shirt-product.jpeg",
      variants: {
        "White-S": [35.3, color.white, size.S],
        "White-M": [37.8, color.white, size.M],
        "White-L": [35.3, color.white, size.L],
        "White-XL": [35.3, color.white, size.XL],

        "Black-M": [31.5, color.black, size.M],
        "Black-L": [31.5, color.black, size.L],
        "Black-XL": [31.5, color.black, size.XL],
      } as const,
    },
    ["Relaxed Sleeveless T-Shirt"]: {
      name: "Relaxed Sleeveless T-Shirt",
      taxon: t.men.tops.tShirt.id,
      taxons: full(t.men.tops.tShirt.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/LaDu93HyEMxW5Gw/P_Relaxed Sleeveless T-Shirt-product.jpeg",
      variants: {
        "Red-S": [20, color.red, size.S],
        "Red-M": [22.2, color.red, size.M],
        "Red-L": [20, color.red, size.L],
        "Red-XL": [20, color.red, size.XL],

        "White-S": [20, color.white, size.S],
        "White-M": [22.2, color.white, size.M],
        "White-L": [20, color.white, size.L],
        "White-XL": [20, color.white, size.XL],
      } as const,
    },
  };

  const tshirtIds: {
    [k in keyof typeof tshirts]: {
      id: number;
      variants: {
        [l in keyof (typeof tshirts)[k]["variants"]]: number;
      };
    };
  } = {
    "Regular Fit Crew-neck T-Shirt": {
      id: 0,
      variants: {
        ["Black-S"]: 0,
        ["Black-M"]: 0,
        ["Black-L"]: 0,
        ["Black-XL"]: 0,

        ["White-S"]: 0,
        ["White-M"]: 0,
        ["White-L"]: 0,
        ["White-XL"]: 0,
      },
    },
    "Oversized Round-neck T-Shirt": {
      id: 0,
      variants: {
        "White-S": 0,
        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,

        "Black-M": 0,
        "Black-L": 0,
        "Black-XL": 0,
      },
    },
    "Relaxed Sleeveless T-Shirt": {
      id: 0,
      variants: {
        "Red-S": 0,
        "Red-M": 0,
        "Red-L": 0,
        "Red-XL": 0,

        "White-S": 0,
        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,
      },
    },
  };

  return {
    polo: {
      products: poloProducts,
      ids: poloProductIds,
    },
    tshirt: {
      products: tshirts,
      ids: tshirtIds,
    },
  };
}
