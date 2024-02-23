import { SeedTaxon } from "@seed/data/taxons";

export function getFullTaxon(t: ReturnType<typeof transformTaxon>) {
  const m = new Map<number, number[]>([
    [t.men.id, [t.men.id]],
    [t.men.tops.id, [t.men.id, t.men.tops.id]],
    [t.men.tops.polo.id, [t.men.id, t.men.tops.id, t.men.tops.polo.id]],
    [t.men.tops.tShirt.id, [t.men.id, t.men.tops.id, t.men.tops.tShirt.id]],
    [t.men.bottoms.id, [t.men.id, t.men.bottoms.id]],
    [
      t.men.bottoms.jeans.id,
      [t.men.id, t.men.bottoms.id, t.men.bottoms.jeans.id],
    ],
    [
      t.men.bottoms.shorts.id,
      [t.men.id, t.men.bottoms.id, t.men.bottoms.shorts.id],
    ],
    [
      t.men.outerwear.id,
      [t.men.id, t.men.outerwear.id, t.men.outerwear.jacketsAndCoats.id],
    ],
    [t.women.id, [t.women.id]],
    [t.women.tops.id, [t.women.id, t.women.tops.id]],
    [
      t.women.tops.tShirt.id,
      [t.women.id, t.women.tops.id, t.women.tops.tShirt.id],
    ],
    [
      t.women.tops.blouse.id,
      [t.women.id, t.women.tops.id, t.women.tops.blouse.id],
    ],
    [
      t.women.bottoms.jeans.id,
      [t.women.id, t.women.bottoms.id, t.women.bottoms.jeans.id],
    ],
    [
      t.women.bottoms.skirts.id,
      [t.women.id, t.women.bottoms.id, t.women.bottoms.skirts.id],
    ],
    [t.women.outerwear.id, [t.women.id, t.women.outerwear.id]],
    [
      t.women.outerwear.jacketsAndCoats.id,
      [t.women.id, t.women.outerwear.id, t.women.outerwear.jacketsAndCoats.id],
    ],
  ]);

  function fullTaxon(taxonId: number) {
    const i = taxonId;

    const ids = m.get(i);
    if (ids === undefined) {
      throw new Error("Full taxon is missing for taxon id: " + i);
    }
    return ids;
  }

  return fullTaxon;
}

export function transformTaxon(taxons: SeedTaxon) {
  return {
    men: {
      id: taxons.men.id,
      tops: {
        id: taxons.men.children.Tops.id,
        polo: {
          id: taxons.men.children.Tops["children"]["Polo Shirts"].id,
        },
        tShirt: {
          id: taxons.men.children.Tops["children"]["T-Shirts"].id,
        },
      },
      bottoms: {
        id: taxons.men.children.Bottoms.id,
        jeans: {
          id: taxons.men.children.Bottoms.children["Jeans"].id,
        },
        shorts: {
          id: taxons.men.children.Bottoms.children["Shorts"].id,
        },
      },
      outerwear: {
        id: taxons.men.children.Outerwear.id,
        jacketsAndCoats: {
          id: taxons.men.children.Outerwear.children["Jackets & Coats"].id,
        },
      },
    },
    women: {
      id: taxons.women.id,
      tops: {
        id: taxons.women.children.Tops.id,
        tShirt: {
          id: taxons.women.children.Tops.children["T-Shirts"].id,
        },
        blouse: {
          id: taxons.women.children.Tops.children["Blouses"].id,
        },
      },
      bottoms: {
        id: taxons.women.children.Bottoms.id,
        skirts: {
          id: taxons.women.children.Bottoms.children.Skirts.id,
        },
        jeans: {
          id: taxons.women.children.Bottoms.children.Jeans.id,
        },
      },
      outerwear: {
        id: taxons.women.children.Outerwear.id,
        jacketsAndCoats: {
          id: taxons.women.children.Outerwear.children["Jackets & Coats"].id,
        },
      },
    },
  };
}
