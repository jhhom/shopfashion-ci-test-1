import { cloneDeep } from "lodash";

export function getDisabledOptions({
  selectedOptions,
  options,
  variants,
}: {
  selectedOptions: Map<string, number>;
  options: Map<string, Set<number>>;
  variants: Map<string, number>[];
}) {
  const disabledOptions = cloneDeep(options);
  for (const code of disabledOptions.keys()) {
    // if user is selecting [Color], don't disable any [Color] except for those that don't have any variants
    if (selectedOptions.has(code)) {
      disabledOptions.delete(code);
    }
  }

  // for every option
  // option: { size, 1, 2, 3 }, { color, 5, 6, 7 }
  // check if there is an available variant for it in variants
  // variant: { size, 1, color, 5 }, { size, 2, color, 7 }
  // if variant is found, delete it from the `disabled`

  // how to check if a variant is available?
  // assuming we have selected options as { size, 1 }
  // we can check for all variants with { size, 1 }

  // once we get available variants in the form of { size, 1, color, 5 }, { size, 1, color, 6 }
  // we then check their aggregated colors: colors { 5, 6 }

  // there is [size] and [color]
  // how to know to aggregate [color] and not [size]?

  // by checking `selectedOptions`
  // we want to aggregate the options which are not available in `selectedOptions`

  // and we remove { 5, 6 } from `disabledOptions`

  // get available variants matching selected options

  // 1. REMOVE OPTIONS IN AVAILABLE VARIANTS FROM DISABLED

  // if selectedOptions is { size, 1 }
  // available is all variants with { size, 1 }
  const available = variants.filter((variant) => {
    for (const [c, v] of selectedOptions) {
      if (variant.get(c) !== v) {
        return false;
      }
    }
    return true;
  });
  const aggregated = aggregateVariantOptions(
    available,
    new Set(selectedOptions.keys()),
  );

  for (const [code, vals] of aggregated) {
    const o = disabledOptions.get(code);
    if (o) {
      vals.forEach((v) => o.delete(v));
    }
  }

  // 2. ADD OPTIONS COMPLETELY MISSING IN AVAILABLE VARIANTS TO DISABLED
  const missing = getMissingOptions({ options: new Map(options), variants });

  for (const [code, val] of missing) {
    const o = disabledOptions.get(code);
    if (o) {
      val.forEach((v) => o.add(v));
    } else {
      disabledOptions.set(code, val);
    }
  }

  return disabledOptions;
}

function aggregateVariantOptions(
  variants: Map<string, number>[],
  dontAggregate: Set<string>,
): Map<string, Set<number>> {
  const vs = Array.from(variants).map((_v) => new Map(_v));
  dontAggregate.forEach((a) => vs.forEach((o) => o.delete(a)));

  const aggregated = new Map<string, Set<number>>();

  for (const v of vs) {
    for (const [code, val] of v) {
      const a = aggregated.get(code);
      if (a) {
        a.add(val);
      } else {
        aggregated.set(code, new Set([val]));
      }
    }
  }

  return aggregated;
}

export function getMissingOptions({
  options,
  variants,
}: {
  options: Map<string, Set<number>>;
  variants: Map<string, number>[];
}) {
  // options example
  // { size, 1, 2, 3 }, { color, 6, 7, 8 }

  // variants example
  // { size, 1, color, 7 }, { size, 2, color, 7 }

  // output example
  // { size 3 }, { color, 6, 8 }

  // steps
  // 1. aggregate variants as follows
  // { size: [1, 2], color: [7] }

  // 2. for each options, check if each value exist in the aggregated variants

  // 3. if not, remove it

  const aggregatedVariants = new Map<string, Set<number>>();

  for (const variant of variants) {
    for (const [code, value] of variant) {
      const v = aggregatedVariants.get(code);
      if (v) {
        v.add(value);
      } else {
        aggregatedVariants.set(code, new Set([value]));
      }
    }
  }

  for (const [code, values] of options) {
    const v = aggregatedVariants.get(code);
    if (v === undefined) {
      continue;
    }

    for (const val of values) {
      if (v.has(val)) {
        values.delete(val);
      }
    }
  }

  return options;
}
