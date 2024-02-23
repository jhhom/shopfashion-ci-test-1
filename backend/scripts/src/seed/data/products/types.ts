import type { SeedOptions } from "@seed/data/product-options";

export type ShirtSize = {
  [k in keyof SeedOptions["size"]["values"]]: number;
};

export type ShirtColor = {
  [k in keyof SeedOptions["shirts_color"]["values"]]: number;
};

export type JeansColor = {
  [k in keyof SeedOptions["jeans_color"]["values"]]: number;
};

export type JeansSizeMen = {
  [k in keyof SeedOptions["men_jeans_size"]["values"]]: number;
};

export type JeansSizeWomen = {
  [k in keyof SeedOptions["women_jeans_size"]["values"]]: number;
};

export type ShortsColor = {
  [k in keyof SeedOptions["shorts_color"]["values"]]: number;
};

export type SkirtsColor = {
  [k in keyof SeedOptions["skirts_color"]["values"]]: number;
};

export type SeedProduct = {
  name: string;
  taxon: number;
  taxons: number[];
  options: string[];
  imgUrl: string;
  variants: {
    [k: string]: [number, number, number];
  };
};
