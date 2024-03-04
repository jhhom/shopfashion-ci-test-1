import { cloneDeep } from "lodash";

export function getDisabledOptions(
  selectedOptions: [string, number][],
  options: Map<string, Set<number>>,
  availableOptions: Map<string, number>[],
) {
  let filteredOptions: Map<string, number>[] = availableOptions;

  filteredOptions = filteredOptions.filter((o) => {
    for (const [code, value] of selectedOptions) {
      if (o.get(code) === value) {
        return true;
      }
    }
    return false;
  });

  for (const [code, values] of options) {
    const available = new Set(filteredOptions.map((o) => o.get(code)));
    for (const v of available) {
      if (v) {
        values.delete(v);
      }
    }
    options.set(code, values);
  }

  return options;
}

export function removeMissingOptions({
  options,
  variants,
}: {
  options: Map<string, Set<number>>;
  variants: Map<string, number>[];
}) {
  const availableOptions: Map<string, Set<number>> = new Map();

  for (const variant of variants) {
    for (const [code, value] of variant) {
      const opts = availableOptions.get(code);
      if (opts) {
        opts.add(value);
      } else {
        availableOptions.set(code, new Set([value]));
      }
    }
  }

  for (const [code, opts] of options) {
    const availableValues = availableOptions.get(code);
    if (availableValues === undefined) {
      options.delete(code);
      continue;
    }

    for (const o of opts) {
      if (!availableValues.has(o)) {
        opts.delete(o);
      }
    }
  }

  return options;
}

export function getDisabledOptions2({
  selectedOptions,
  options,
  availableOptions,
}: {
  selectedOptions: Map<string, number>;
  options: Map<string, Set<number>>;
  availableOptions: Map<string, number>[];
}) {
  /*
  filteredOptions = filteredOptions.filter((o) => {
    for (const [code, value] of selectedOptions) {
      if (o.get(code) === value) {
        return true;
      }
    }
    return false;
  });
  */

  // in the available options, search for selected options
  // e.g
  // selected: [color, 7]
  // available: [1, 6], [1, 7], [2, 8], [4, 9], [5, 7]
  // we should get [1, 7], [5, 7]

  // from the options
  // size: [1, 2, 3, 4, 5]
  // color: [6, 7, 8, 9]

  // since selected is [color]
  // remove color
  // we're left with [1, 2, 3, 4, 5]
  // filter [1, 5] out from [1, 2, 3, 4, 5] and got the result [2, 3, 4]

  for (const code of options.keys()) {
    if (selectedOptions.has(code)) {
      options.delete(code);
    }
  }

  // for each option
  // check what is available
  // filter out the

  // available should be [1, 5], instead of [1, 2, 4, 5]
  // we need to filter out the available options with non-matching color

  // selectedOptions could be { color: 7 }
  // availableOptions could be { size: 1, color, 6 }, { size: 1, color, 7 }, { size: 5, color, 7 }

  // filter availableOptions where selectedOptions.color = availableOptions.color

  // at this point options could be { size: [1, 2, 3, 4, 5] }

  for (const [code, values] of options) {
    const available = availableOptions
      .filter((opts) => {
        for (const [c, v] of selectedOptions) {
          if (opts.get(c) !== v) {
            return false;
          }
        }
        return true;
      })
      .map((o) => o.get(code))
      .filter((x): x is number => x !== undefined);

    for (const a of available) {
      values.delete(a);
    }
    options.set(code, values);
  }

  return options;
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
