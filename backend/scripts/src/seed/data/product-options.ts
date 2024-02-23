export type SeedOptions = typeof options;

export const options = {
  skirts_color: {
    name: "Color",
    code: "skirts_color",
    position: 1,
    values: {
      red: { id: 0, value: "Red" },
      black: { id: 0, value: "Black" },
    },
  },
  shorts_color: {
    name: "Color",
    code: "shorts_color",
    position: 2,
    values: {
      brown: { id: 0, value: "Brown" },
      blue: { id: 0, value: "Blue" },
    },
  },
  jeans_color: {
    name: "Color",
    code: "jeans_color",
    position: 3,
    // color reference: https://www.uniqlo.com/my/en/products/E463396-000?colorCode=COL30&sizeCode=INS022
    values: {
      blue: { id: 0, value: "Blue" },
      navy: { id: 0, value: "Navy" },
      natural: { id: 0, value: "Natural" },
    },
  },
  shirts_color: {
    name: "Color",
    code: "shirts_color",
    position: 4,
    values: {
      green: { id: 0, value: "Green" },
      white: { id: 0, value: "White" },
      grey: { id: 0, value: "Grey" },
      red: { id: 0, value: "Red" },
      black: { id: 0, value: "Black" },
    },
  },
  jackets_color: {
    name: "Color",
    code: "jackets_color",
    position: 5,
    values: {
      blue: { id: 0, value: "Blue" },
      red: { id: 0, value: "Red" },
      green: { id: 0, value: "Green" },
    },
  },
  size: {
    name: "Size",
    code: "size",
    position: 6,
    values: {
      S: { id: 0, value: "S" },
      M: { id: 0, value: "M" },
      L: { id: 0, value: "L" },
      XL: { id: 0, value: "XL" },
    },
  },
  men_jeans_size: {
    name: "Size",
    code: "men_jeans_size",
    position: 7,
    values: {
      "29": { id: 0, value: "29 inch" },
      "30": { id: 0, value: "30 inch" },
      "31": { id: 0, value: "31 inch" },
      "32": { id: 0, value: "32 inch" },
      "33": { id: 0, value: "33 inch" },
    },
  },
  women_jeans_size: {
    name: "Size",
    code: "women_jeans_size",
    position: 8,
    values: {
      "24": { id: 0, value: "24 inch" },
      "25": { id: 0, value: "25 inch" },
      "26": { id: 0, value: "26 inch" },
      "27": { id: 0, value: "27 inch" },
      "28": { id: 0, value: "28 inch" },
      "29": { id: 0, value: "29 inch" },
      "30": { id: 0, value: "30 inch" },
      "31": { id: 0, value: "31 inch" },
      "32": { id: 0, value: "32 inch" },
      "33": { id: 0, value: "33 inch" },
    },
  },
} as const;
