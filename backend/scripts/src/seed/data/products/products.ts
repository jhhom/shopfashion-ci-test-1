import type { SeedOptions } from "@seed/data/product-options";
import { convertOptions } from "@seed/data/products/convert-options";
import { menJeans, menShorts } from "@seed/data/products/men-bottoms";
import { menTops } from "@seed/data/products/men-tops";
import { womenJeans, womenSkirts } from "@seed/data/products/women-bottoms";
import { womenTops } from "@seed/data/products/women-tops";
import { SeedTaxon } from "@seed/data/taxons";

export type SeedProducts = ReturnType<typeof products>;

export function products({
  taxons: seedTaxon,
  options,
}: {
  taxons: SeedTaxon;
  options: SeedOptions;
}) {
  const { color, size } = convertOptions(options);

  const menTop = menTops({
    size: size.shirt,
    color: color.shirts,
    options,
    seedTaxon,
  });
  const menJean = menJeans({
    size: size.men_jeans,
    color: color.jeans,
    options,
    seedTaxon,
  });
  const menShort = menShorts({
    size: size.shirt,
    color: color.shorts,
    options,
    seedTaxon,
  });

  const womenTop = womenTops({
    size: size.shirt,
    color: color.shirts,
    options,
    seedTaxon,
  });
  const womenJean = womenJeans({
    size: size.women_jeans,
    color: color.jeans,
    options,
    seedTaxon,
  });
  const womenSkirt = womenSkirts({
    size: size.shirt,
    color: color.skirts,
    options,
    seedTaxon,
  });

  return {
    men: {
      tops: menTop,
      jeans: menJean,
      shorts: menShort,
    },
    women: {
      tops: womenTop,
      jeans: womenJean,
      skirts: womenSkirt,
    },
  };
}
