export type Taxon = {
  id: number;
  taxonName: string;
  slug: string;
  children: Taxon[];
};
