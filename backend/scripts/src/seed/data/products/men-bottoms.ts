import { SeedOptions } from "@seed/data/product-options";
import { getFullTaxon, transformTaxon } from "@seed/data/products/taxons";
import type {
  JeansColor,
  JeansSizeMen,
  SeedProduct,
  ShirtColor,
  ShirtSize,
  ShortsColor,
} from "@seed/data/products/types";
import { SeedTaxon } from "@seed/data/taxons";

export function menJeans({
  size,
  color,
  options,
  seedTaxon,
}: {
  size: JeansSizeMen;
  color: JeansColor;
  options: SeedOptions;
  seedTaxon: SeedTaxon;
}) {
  const t = transformTaxon(seedTaxon);
  const full = getFullTaxon(t);

  const jeansData = {
    "Ultra Stretch Jeans": {
      name: "Ultra Stretch Jeans",
      taxon: t.men.bottoms.jeans.id,
      taxons: full(t.men.bottoms.jeans.id),
      options: [options.jeans_color.code, options.men_jeans_size.code],
      imgUrl:
        "products/images/z2FsGmzfwBxe1nF/P_Ultra Stretch Jeans-product.jpeg",
      variants: {
        "Blue-29 inch": [72.8, color.blue, size[29]],
        "Blue-30 inch": [72.8, color.blue, size[30]],
        "Blue-31 inch": [72.8, color.blue, size[31]],
        "Blue-32 inch": [72.8, color.blue, size[32]],
        "Blue-33 inch": [72.8, color.blue, size[33]],

        "Navy-29 inch": [72.8, color.navy, size[29]],
        "Navy-30 inch": [72.8, color.navy, size[30]],
        "Navy-31 inch": [72.8, color.navy, size[31]],
        "Navy-32 inch": [72.8, color.navy, size[32]],
        "Navy-33 inch": [72.8, color.navy, size[33]],
      } as const,
    },
    "Slim Fit Jeans": {
      name: "Slim Fit Jeans",
      taxon: t.men.bottoms.jeans.id,
      taxons: full(t.men.bottoms.jeans.id),
      options: [options.jeans_color.code, options.men_jeans_size.code],
      imgUrl: "products/images/qWzzstl225nbApJ/P_Slim Fit Jeans-product.jpeg",
      variants: {
        "Blue-29 inch": [59.9, color.blue, size[29]],
        "Blue-30 inch": [59.9, color.blue, size[30]],
        "Blue-31 inch": [60.1, color.blue, size[31]],
        "Blue-32 inch": [59.9, color.blue, size[32]],
        "Blue-33 inch": [59.9, color.blue, size[33]],

        "Navy-30 inch": [58.8, color.navy, size[30]],
        "Navy-31 inch": [58.8, color.navy, size[31]],
        "Navy-32 inch": [58.8, color.navy, size[32]],
      } as const,
    },
    "Jeans shorts": {
      name: "Jeans shorts",
      taxon: t.men.bottoms.jeans.id,
      taxons: [
        t.men.id,
        t.men.bottoms.id,
        t.men.bottoms.jeans.id,
        t.men.bottoms.shorts.id,
      ],
      options: [options.jeans_color.code, options.men_jeans_size.code],
      imgUrl: "products/images/mG2pJGstQEoQZHm/P_Jeans shorts-product.jpeg",
      variants: {
        "Blue-29 inch": [38.8, color.blue, size[29]],
        "Blue-30 inch": [40.1, color.blue, size[30]],
        "Blue-31 inch": [38.8, color.blue, size[31]],
        "Blue-32 inch": [38.8, color.blue, size[32]],

        "Navy-29 inch": [37.8, color.navy, size[29]],
        "Navy-30 inch": [37.8, color.navy, size[30]],
        "Navy-31 inch": [37.8, color.navy, size[31]],
        "Navy-32 inch": [37.8, color.navy, size[32]],

        "Natural-29 inch": [37.8, color.natural, size[29]],
        "Natural-30 inch": [37.8, color.natural, size[30]],
        "Natural-31 inch": [37.8, color.natural, size[31]],
        "Natural-32 inch": [37.8, color.natural, size[32]],
      } as const,
    },
    "Wide Fit Jeans": {
      name: "Wide Fit Jeans",
      taxon: t.men.bottoms.jeans.id,
      taxons: full(t.men.bottoms.jeans.id),
      options: [options.jeans_color.code, options.men_jeans_size.code],
      imgUrl: "products/images/8p5QJ3Yl0AvDP30/P_Wide Fit Jeans-product.jpeg",
      variants: {
        "Blue-31 inch": [56.6, color.blue, size[31]],
        "Blue-32 inch": [56.6, color.blue, size[32]],
        "Blue-33 inch": [56.6, color.blue, size[33]],

        "Navy-31 inch": [56.6, color.navy, size[31]],
        "Navy-32 inch": [56.6, color.navy, size[32]],
        "Navy-33 inch": [56.6, color.navy, size[33]],

        "Natural-31 inch": [57.8, color.natural, size[31]],
        "Natural-32 inch": [57.8, color.natural, size[32]],
        "Natural-33 inch": [57.8, color.natural, size[33]],
      } as const,
    },
  };

  const menJeansIds: {
    [k in keyof typeof jeansData]: {
      id: number;
      variants: {
        [l in keyof (typeof jeansData)[k]["variants"]]: number;
      };
    };
  } = {
    "Ultra Stretch Jeans": {
      id: 0,
      variants: {
        "Blue-29 inch": 0,
        "Blue-30 inch": 0,
        "Blue-31 inch": 0,
        "Blue-32 inch": 0,
        "Blue-33 inch": 0,

        "Navy-29 inch": 0,
        "Navy-30 inch": 0,
        "Navy-31 inch": 0,
        "Navy-32 inch": 0,
        "Navy-33 inch": 0,
      },
    },
    "Slim Fit Jeans": {
      id: 0,
      variants: {
        "Blue-29 inch": 0,
        "Blue-30 inch": 0,
        "Blue-31 inch": 0,
        "Blue-32 inch": 0,
        "Blue-33 inch": 0,

        "Navy-30 inch": 0,
        "Navy-31 inch": 0,
        "Navy-32 inch": 0,
      },
    },
    "Jeans shorts": {
      id: 0,
      variants: {
        "Blue-29 inch": 0,
        "Blue-30 inch": 0,
        "Blue-31 inch": 0,
        "Blue-32 inch": 0,

        "Navy-29 inch": 0,
        "Navy-30 inch": 0,
        "Navy-31 inch": 0,
        "Navy-32 inch": 0,

        "Natural-29 inch": 0,
        "Natural-30 inch": 0,
        "Natural-31 inch": 0,
        "Natural-32 inch": 0,
      },
    },
    "Wide Fit Jeans": {
      id: 0,
      variants: {
        "Blue-31 inch": 0,
        "Blue-32 inch": 0,
        "Blue-33 inch": 0,

        "Navy-31 inch": 0,
        "Navy-32 inch": 0,
        "Navy-33 inch": 0,

        "Natural-31 inch": 0,
        "Natural-32 inch": 0,
        "Natural-33 inch": 0,
      },
    },
  };

  return {
    products: jeansData,
    ids: menJeansIds,
  };
}

export function menShorts({
  size,
  color,
  options,
  seedTaxon,
}: {
  size: ShirtSize;
  color: ShortsColor;
  options: SeedOptions;
  seedTaxon: SeedTaxon;
}) {
  const t = transformTaxon(seedTaxon);
  const full = getFullTaxon(t);

  const shorts = {
    "Chinos shorts": {
      name: "Chinos shorts",
      taxon: t.men.bottoms.shorts.id,
      taxons: full(t.men.bottoms.shorts.id),
      options: [options.shorts_color.code, options.size.code],
      imgUrl: "products/images/NLGWQiDZZDMTMZL/P_Chinos shorts-product.jpeg",
      variants: {
        "Brown-S": [32, color.brown, size.S],
        "Brown-M": [32, color.brown, size.M],
        "Brown-L": [32, color.brown, size.L],
        "Brown-XL": [32, color.brown, size.XL],
      } as const,
    },
    "Relaxed Striped Shorts": {
      name: "Relaxed Striped Shorts",
      taxon: t.men.bottoms.shorts.id,
      taxons: full(t.men.bottoms.shorts.id),
      options: [options.shorts_color.code, options.size.code],
      imgUrl:
        "products/images/DoVaWMVECkYPjr9/P_Relaxed Striped Shorts-product.jpeg",
      variants: {
        "Blue-S": [15, color.blue, size.S],
        "Blue-M": [15, color.blue, size.M],
        "Blue-L": [15, color.blue, size.L],
        "Blue-XL": [15, color.blue, size.XL],
      } as const,
    },
  };

  const shortsIds: {
    [k in keyof typeof shorts]: {
      id: number;
      variants: {
        [l in keyof (typeof shorts)[k]["variants"]]: number;
      };
    };
  } = {
    "Chinos shorts": {
      id: 0,
      variants: {
        "Brown-S": 0,
        "Brown-M": 0,
        "Brown-L": 0,
        "Brown-XL": 0,
      },
    },
    "Relaxed Striped Shorts": {
      id: 0,
      variants: {
        "Blue-S": 0,
        "Blue-M": 0,
        "Blue-L": 0,
        "Blue-XL": 0,
      },
    },
  };

  return {
    products: shorts,
    ids: shortsIds,
  };
}
