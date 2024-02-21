import { SeedOptions } from "@seed/data/product-options";
import { getFullTaxon, transformTaxon } from "@seed/data/products/taxons";
import type { ShirtColor, ShirtSize } from "@seed/data/products/types";
import { SeedTaxon } from "@seed/data/taxons";

export function womenTops({
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

  const blouses = {
    "Floral Long Sleeve Blouse": {
      name: "Floral Long Sleeve Blouse",
      taxon: t.women.tops.blouse.id,
      taxons: full(t.women.tops.blouse.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/LqtcFl2Zl7rReln/P_Floral Long Sleeve Blouse-product.jpeg",
      variants: {
        "Black-S": [46.6, color.black, size.S],
        "Black-M": [46.6, color.black, size.M],
        "Black-L": [46.6, color.black, size.L],
        "Black-XL": [46.6, color.black, size.XL],

        "White-S": [46.6, color.white, size.S],
        "White-M": [46.6, color.white, size.M],
        "White-L": [46.6, color.white, size.L],
        "White-XL": [46.6, color.white, size.XL],
      } as const,
    },
    "Creped blouse with tie": {
      name: "Creped blouse with tie",
      taxon: t.women.tops.blouse.id,
      taxons: full(t.women.tops.blouse.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/ZQTkiY9OCLRTUN3/P_Creped blouse with tie-product.jpeg",
      variants: {
        "Black-S": [65.6, color.black, size.S],
        "Black-M": [68.6, color.black, size.M],
        "Black-L": [65.6, color.black, size.L],
        "Black-XL": [65.6, color.black, size.XL],

        "White-S": [65.6, color.white, size.S],
        "White-M": [68.6, color.white, size.M],
        "White-L": [65.6, color.white, size.L],
        "White-XL": [65.6, color.white, size.XL],
      } as const,
    },
    "Pleated Long Sleeve Blouse": {
      name: "Pleated Long Sleeve Blouse",
      taxon: t.women.tops.blouse.id,
      taxons: full(t.women.tops.blouse.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/8wJKerEIwWcfum3/P_Pleated Long Sleeve Blouse-product.jpeg",
      variants: {
        "White-S": [53.8, color.white, size.S],
        "White-M": [53.8, color.white, size.M],
        "White-L": [53.8, color.white, size.L],
        "White-XL": [53.8, color.white, size.XL],
      } as const,
    },
  };

  const blousesProductIds: {
    [k in keyof typeof blouses]: {
      id: number;
      variants: {
        [l in keyof (typeof blouses)[k]["variants"]]: number;
      };
    };
  } = {
    "Floral Long Sleeve Blouse": {
      id: 0,
      variants: {
        "Black-S": 0,
        "Black-M": 0,
        "Black-L": 0,
        "Black-XL": 0,

        "White-S": 0,
        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,
      },
    },
    "Creped blouse with tie": {
      id: 0,
      variants: {
        "Black-S": 0,
        "Black-M": 0,
        "Black-L": 0,
        "Black-XL": 0,

        "White-S": 0,
        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,
      },
    },
    "Pleated Long Sleeve Blouse": {
      id: 0,
      variants: {
        "White-S": 0,
        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,
      },
    },
  };

  const shirts = {
    "Striped Short-Sleeve T-Shirt": {
      name: "Striped Short-Sleeve T-Shirt",
      taxon: t.women.tops.tShirt.id,
      taxons: full(t.women.tops.tShirt.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/qSgoNXMTVlVGurk/P_Striped Short-Sleeve T-Shirt-product.jpeg",
      variants: {
        "Black-S": [26.7, color.black, size.S],
        "Black-M": [28.9, color.black, size.M],
        "Black-L": [26.7, color.black, size.L],

        "White-S": [26.7, color.white, size.S],
        "White-M": [28.9, color.white, size.M],
        "White-L": [26.7, color.white, size.L],
        "White-XL": [26.7, color.white, size.XL],
      } as const,
    },
    "USA Gray Mini T-Shirt": {
      name: "USA Gray Mini T-Shirt",
      taxon: t.women.tops.tShirt.id,
      taxons: full(t.women.tops.tShirt.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/XzeEjMCqZEOfgNM/P_USA Gray Mini T-Shirt-product.jpeg",
      variants: {
        "Grey-S": [29.5, color.grey, size.S],
        "Grey-M": [29.5, color.grey, size.M],
        "Grey-L": [29.5, color.grey, size.L],

        "White-S": [26.7, color.white, size.S],
        "White-M": [26.7, color.white, size.M],
      } as const,
    },
    "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)": {
      name: "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)",
      taxon: t.women.tops.tShirt.id,
      taxons: full(t.women.tops.tShirt.id),
      options: [options.shirts_color.code, options.size.code],
      imgUrl:
        "products/images/r5OyyEac3Qlja9f/P_NORMAL IS BORING (Short Sleeve Graphic T-Shirt)-product.jpeg",
      variants: {
        "Green-S": [36.7, color.green, size.S],
        "Green-M": [38.7, color.green, size.M],
        "Green-L": [36.7, color.green, size.L],
        "Green-XL": [36.7, color.green, size.XL],

        "White-M": [38.7, color.white, size.M],
        "White-L": [36.7, color.white, size.L],
        "White-XL": [36.7, color.white, size.XL],
      } as const,
    },
  };

  const shirtsProductIds: {
    [k in keyof typeof shirts]: {
      id: number;
      variants: {
        [l in keyof (typeof shirts)[k]["variants"]]: number;
      };
    };
  } = {
    "Striped Short-Sleeve T-Shirt": {
      id: 0,
      variants: {
        "Black-S": 0,
        "Black-M": 0,
        "Black-L": 0,

        "White-S": 0,
        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,
      },
    },
    "USA Gray Mini T-Shirt": {
      id: 0,
      variants: {
        "Grey-S": 0,
        "Grey-M": 0,
        "Grey-L": 0,

        "White-S": 0,
        "White-M": 0,
      },
    },
    "NORMAL IS BORING (Short Sleeve Graphic T-Shirt)": {
      id: 0,
      variants: {
        "Green-S": 0,
        "Green-M": 0,
        "Green-L": 0,
        "Green-XL": 0,

        "White-M": 0,
        "White-L": 0,
        "White-XL": 0,
      },
    },
  };

  return {
    blouse: {
      products: blouses,
      ids: blousesProductIds,
    },
    shirt: {
      products: shirts,
      ids: shirtsProductIds,
    },
  };
}
