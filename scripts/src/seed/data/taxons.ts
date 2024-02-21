export type SeedTaxon = typeof taxon;

export const taxon = {
  men: {
    id: 0,
    slug: "men",
    children: {
      ["Tops"]: {
        id: 0,
        slug: "tops",
        children: {
          ["Polo Shirts"]: {
            id: 0,
            slug: "polo-shirts",
          },
          ["T-Shirts"]: {
            id: 0,
            slug: "t-shirts",
          },
        },
      },
      ["Bottoms"]: {
        id: 0,
        slug: "bottoms",
        children: {
          ["Jeans"]: {
            id: 0,
            slug: "jeans",
          },
          ["Shorts"]: {
            id: 0,
            slug: "shorts",
          },
        },
      },
      ["Outerwear"]: {
        id: 0,
        slug: "jackets-coats",
        children: {
          ["Jackets & Coats"]: {
            id: 0,
            slug: "jackets-coats",
          },
        },
      },
    },
  },
  women: {
    id: 0,
    slug: "women",
    children: {
      ["Tops"]: {
        id: 0,
        slug: "tops",
        children: {
          ["T-Shirts"]: { slug: "t-shirts", id: 0 },
          ["Blouses"]: { slug: "blouses", id: 0 },
        },
      },
      ["Bottoms"]: {
        id: 0,
        slug: "bottoms",
        children: {
          ["Skirts"]: { slug: "skirts", id: 0 },
          ["Jeans"]: { slug: "jeans", id: 0 },
        },
      },
      ["Outerwear"]: {
        id: 0,
        slug: "outerwear",
        children: {
          ["Jackets & Coats"]: { slug: "jackets-coats", id: 0 },
        },
      },
    },
  },
};
