import { SeedOptions } from "@seed/data/product-options";

export function convertOptions(options: SeedOptions) {
  const color = {
    shirts: {
      green: options.shirts_color.values.green.id,
      white: options.shirts_color.values.white.id,
      grey: options.shirts_color.values.grey.id,
      red: options.shirts_color.values.red.id,
      black: options.shirts_color.values.black.id,
    },
    skirts: {
      red: options.skirts_color.values.red.id,
      black: options.skirts_color.values.black.id,
    },
    shorts: {
      brown: options.shorts_color.values.brown.id,
      blue: options.shorts_color.values.blue.id,
    },
    jeans: {
      blue: options.jeans_color.values.blue.id,
      navy: options.jeans_color.values.navy.id,
      natural: options.jeans_color.values.natural.id,
    },
  };

  const size = {
    shirt: {
      S: options.size.values.S.id,
      M: options.size.values.M.id,
      L: options.size.values.L.id,
      XL: options.size.values.XL.id,
    },
    men_jeans: {
      "29": options.men_jeans_size.values[29].id,
      "30": options.men_jeans_size.values[30].id,
      "31": options.men_jeans_size.values[31].id,
      "32": options.men_jeans_size.values[32].id,
      "33": options.men_jeans_size.values[33].id,
    },
    women_jeans: {
      "24": options.women_jeans_size.values[24].id,
      "25": options.women_jeans_size.values[25].id,
      "26": options.women_jeans_size.values[26].id,
      "27": options.women_jeans_size.values[27].id,
      "28": options.women_jeans_size.values[28].id,
      "29": options.men_jeans_size.values[29].id,
      "30": options.men_jeans_size.values[30].id,
      "31": options.men_jeans_size.values[31].id,
      "32": options.men_jeans_size.values[32].id,
      "33": options.men_jeans_size.values[33].id,
    },
  };

  return {
    color,
    size,
  };
}
