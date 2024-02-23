import { KyselyDB } from "@seed/db";
import type { SeedTaxon } from "@seed/data/taxons";

type TaxonData = {
  id: number;
  slug: string;
  children?: {
    [name: string]: TaxonData;
  };
};

const seedTaxon = async (
  db: KyselyDB,
  taxonName: string,
  taxon: TaxonData,
  parentTaxonId: number | null
) => {
  taxon.id = (
    await db
      .insertInto("taxons")
      .values({
        slug: taxon.slug,
        taxonName: taxonName,
        parentId: parentTaxonId,
      })
      .returning("id")
      .executeTakeFirstOrThrow()
  ).id;

  if (taxon.children) {
    for (const [name, child] of Object.entries(taxon.children)) {
      await seedTaxon(db, name, child, taxon.id);
    }
  }
};

export const seedTaxons = async (
  db: KyselyDB,
  taxon: SeedTaxon
): Promise<SeedTaxon> => {
  await seedTaxon(db, "Men", taxon.men, null);
  await seedTaxon(db, "Women", taxon.women, null);

  return taxon;
};

export type SeedTaxons = Awaited<ReturnType<typeof seedTaxons>>;
