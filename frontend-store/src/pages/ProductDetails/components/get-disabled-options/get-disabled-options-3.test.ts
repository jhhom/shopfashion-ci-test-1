import { test, expect } from "vitest";
import {
  aggregateVariantOptions,
  getUnavailableOptions,
  mergeMaps,
  removeFromMap,
  getDisabledOptions2,
} from "~/pages/ProductDetails/components/get-disabled-options/get-disabled-options-3";

const size = "size" as const;
const color = "color" as const;

type Option = "size" | "color";

type SizeValue = 1 | 2 | 3 | 4;
type ColorValue = 5 | 6 | 7;

type Values = {
  size: 1 | 2 | 3 | 4;
  color: 5 | 6 | 7;
};

const SIZE = {
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
} as const;

const COLOR = {
  BLUE: 5,
  GREEN: 6,
} as const;

type OptionValuePair<T extends Option> = [T, Values[T]];

test("get disabled options - v3", () => {
  const options = new Map<string, Set<number>>([
    [size, new Set([1, 2, 3, 4])],
    [color, new Set([5, 6, 7])],
  ]);

  const testsets: {
    input: {
      selectedOptions: Map<string, number>;
      options: Map<string, Set<number>>;
      variants: [typeof size, SizeValue, typeof color, ColorValue][];
    };
    output: Map<string, Set<number>>;
  }[] = [
    {
      input: {
        selectedOptions: new Map(),
        options,
        variants: [
          [size, 1, color, 5],
          [size, 1, color, 6],
          [size, 3, color, 6],
          [size, 3, color, 7],
        ],
      },
      output: new Map([[size, new Set([2, 4])]]),
    },
    {
      input: {
        selectedOptions: new Map([[color, 5]]),
        options,
        variants: [
          [size, 1, color, 5],
          [size, 1, color, 6],
          [size, 3, color, 6],
          [size, 3, color, 7],
        ],
      },
      output: new Map([[size, new Set([2, 3, 4])]]),
    },
    {
      input: {
        selectedOptions: new Map([
          [color, COLOR.BLUE],
          [size, SIZE.S],
        ]),
        options,
        variants: [
          [size, SIZE.XS, color, COLOR.BLUE],
          [size, SIZE.S, color, COLOR.BLUE],
          [size, SIZE.M, color, COLOR.GREEN],
          [size, SIZE.L, color, COLOR.GREEN],
        ],
      },
      output: new Map([
        [size, new Set([SIZE.M, SIZE.L])],
        [color, new Set([COLOR.GREEN, 7])],
      ]),
    },
  ];

  for (const [i, { input, output }] of testsets.entries()) {
    const result = getDisabledOptions2({
      selectedOptions: input.selectedOptions,
      options: input.options,
      variants: input.variants.map(
        (v) =>
          new Map([
            [size, v[1]],
            [color, v[3]],
          ]),
      ),
    });
    if (!areMapsEqual(result, output)) {
      console.log("EXPECTED", output);
      console.log("GOT", result);
      throw new Error(`${i}: output is different`);
    }
  }
});

test("merge maps", () => {
  const testsets: {
    input: [Map<string, Set<number>>, Map<string, Set<number>>];
    output: Map<string, Set<number>>;
  }[] = [
    {
      input: [
        new Map([[color, new Set([5, 6, 7])]]),
        new Map([[size, new Set([1, 2, 3, 4])]]),
      ],
      output: new Map([
        [color, new Set([5, 6, 7])],
        [size, new Set([1, 2, 3, 4])],
      ]),
    },
    {
      input: [
        new Map([
          [color, new Set([5, 7])],
          [size, new Set([3, 4])],
        ]),
        new Map([
          [color, new Set([6, 7])],
          [size, new Set([1])],
        ]),
      ],
      output: new Map([
        [color, new Set([5, 6, 7])],
        [size, new Set([1, 3, 4])],
      ]),
    },
  ];

  for (const [i, { input, output }] of testsets.entries()) {
    const result = mergeMaps(...input);
    if (!areMapsEqual(result, output)) {
      console.log("EXPECTED", output);
      console.log("GOT", result);
      throw new Error(`${i}: output is different`);
    }
  }
});

test("get unavailable options", () => {
  const options = new Map<string, Set<number>>([
    [size, new Set([1, 2, 3, 4])],
    [color, new Set([5, 6, 7])],
  ]);

  const testsets: {
    input: {
      selectedOption: {
        code: string;
        value: number;
      };
      variants: (OptionValuePair<"size"> | OptionValuePair<"color">)[][];
      options: Map<string, Set<number>>;
    };
    output: Map<string, Set<number>>;
  }[] = [
    {
      input: {
        selectedOption: { code: size, value: 1 },
        variants: [
          [
            [size, 1],
            [color, 5],
          ],
          [
            [size, 1],
            [color, 7],
          ],
          [
            [size, 2],
            [color, 6],
          ],
          [
            [size, 2],
            [color, 7],
          ],
        ],
        options,
      },
      output: new Map([[color, new Set([6])]]),
    },
    {
      input: {
        selectedOption: { code: color, value: 7 },
        variants: [
          [
            [size, 1],
            [color, 5],
          ],
          [
            [size, 1],
            [color, 7],
          ],
          [
            [size, 2],
            [color, 6],
          ],
          [
            [size, 2],
            [color, 7],
          ],
        ],
        options,
      },
      output: new Map([[size, new Set([3, 4])]]),
    },
  ];

  for (const [i, { input, output }] of testsets.entries()) {
    const result = getUnavailableOptions({
      selectedOption: input.selectedOption,
      variants: input.variants.map((v) => new Map(v.map((x) => [x[0], x[1]]))),
      options: input.options,
    });
    if (!areMapsEqual(result, output)) {
      console.log("EXPECTED", output);
      console.log("GOT", result);
      throw new Error(`${i}: output is different`);
    }
  }
});

test("remove from map", () => {
  const testsets: {
    input: {
      map: Map<string, Set<number>>;
      toRemove: Map<string, Set<number>>;
    };
    output: Map<string, Set<number>>;
  }[] = [
    {
      input: {
        map: new Map([
          [size, new Set([1, 2, 3, 4, 5])],
          [color, new Set([6, 7, 8, 9])],
        ]),
        toRemove: new Map([[size, new Set([2, 3, 4])]]),
      },
      output: new Map([
        [size, new Set([1, 5])],
        [color, new Set([6, 7, 8, 9])],
      ]),
    },
    {
      input: {
        map: new Map([
          [size, new Set([1, 2, 3, 4, 5])],
          [color, new Set([6, 7, 8, 9])],
        ]),
        toRemove: new Map([
          ["material", new Set([2, 3, 4])],
          [color, new Set([9, 10])],
        ]),
      },
      output: new Map([
        [size, new Set([1, 2, 3, 4, 5])],
        [color, new Set([6, 7, 8])],
      ]),
    },
  ];

  for (const [i, { input, output }] of testsets.entries()) {
    const removed = removeFromMap(input);
    if (!areMapsEqual(removed, output)) {
      throw new Error(`${i}: output is different`);
    }
  }
});

test("get unavailable options", () => {
  const options = new Map<string, Set<number>>([
    [size, new Set([1, 2, 3, 4])],
    [color, new Set([5, 6, 7])],
  ]);

  const testsets: {
    // e.g selected option is { size, 1 }
    // options: { size, 1, 2, 3, 4 }, { color, 5, 6, 7 }
    // variants: { size, 1, color, 5 }, { size, 2, color, 6 }
    // unavailable options would be { color, 6, 7 }
    input: {
      selectedOption: [string, number];
      variants: (OptionValuePair<"size"> | OptionValuePair<"color">)[][];
    };
    output: Map<string, Set<number>>;
  }[] = [
    {
      input: {
        variants: [
          [
            [size, 1],
            [color, 5],
          ],
          [
            [size, 2],
            [color, 6],
          ],
          [
            [size, 1],
            [color, 7],
          ],
        ],
        selectedOption: [size, 1],
      },
      output: new Map([[color, new Set([6, 7])]]),
    },
  ];
});

test("aggregate variant options", () => {
  const testsets: {
    input: {
      variants: (OptionValuePair<"size"> | OptionValuePair<"color">)[][];
      dontAggregate: Set<string>;
    };
    output: Map<string, Set<number>>;
  }[] = [
    {
      input: {
        variants: [
          [
            [size, 1],
            [color, 5],
          ],
          [
            [size, 2],
            [color, 6],
          ],
          [
            [size, 1],
            [color, 7],
          ],
        ],
        dontAggregate: new Set([size]),
      },
      output: new Map([[color, new Set([5, 6, 7])]]),
    },
    {
      input: {
        variants: [
          [
            [size, 1],
            [color, 5],
          ],
          [
            [size, 2],
            [color, 6],
          ],
          [
            [size, 1],
            [color, 7],
          ],
        ],
        dontAggregate: new Set([color]),
      },
      output: new Map([[size, new Set([1, 2])]]),
    },
  ];

  for (const [i, { input, output }] of testsets.entries()) {
    const aggregated = aggregateVariantOptions({
      variants: input.variants.map((v) => new Map(v.map((x) => [x[0], x[1]]))),
      dontAggregate: input.dontAggregate,
    });
    if (!areMapsEqual(aggregated, output)) {
      throw new Error(`${i}: output is different`);
    }
  }
});

function areSetsEqual<T>(s1: Set<T>, s2: Set<T>): boolean {
  return s1.size === s2.size && [...s1].every((s) => s2.has(s));
}

function areMapsEqual<T, U>(m1: Map<T, Set<U>>, m2: Map<T, Set<U>>): boolean {
  if (m1.size !== m2.size) {
    return false;
  }
  for (const [k, v] of m1) {
    const v2 = m2.get(k);

    if (v2 === undefined) {
      return false;
    }
    if (!areSetsEqual(v, v2)) {
      return false;
    }
  }
  return true;
}
