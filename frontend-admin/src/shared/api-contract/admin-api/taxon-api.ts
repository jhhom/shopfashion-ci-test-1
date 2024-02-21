import { initContract } from "@ts-rest/core";
import { z } from "zod";
import { zTaxon, slugRegex } from "../common";

const c = initContract();

export const taxonApiContract = c.router({
  taxonTree: {
    method: "GET",
    path: "/taxon_tree",
    responses: {
      200: z.array(zTaxon),
    },
  },

  createTaxon: {
    method: "POST",
    path: "/taxons",
    body: z.object({
      taxonName: z.string(),
      taxonSlug: z
        .string()
        .min(1)
        .regex(slugRegex, "Slug can only contain alphanumerics and dashes"),
      parentTaxonId: z.number().nullable(),
    }),
    responses: { 200: z.object({ message: z.string() }) },
  },

  editTaxon: {
    method: "PUT",
    path: "/taxons/:taxonId",
    body: z.object({
      taxonSlug: z
        .string()
        .min(1)
        .regex(slugRegex, "Slug can only contain alphanumerics and dashes"),
      taxonName: z.string(),
    }),
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  deleteTaxon: {
    method: "DELETE",
    body: null,
    path: "/taxons/:taxonId",
    responses: {
      200: z.object({ message: z.string() }),
    },
  },

  assignableTaxonParents: {
    method: "GET",
    path: "/taxons/parents_for_assign",
    responses: {
      200: z.array(
        z.object({
          taxonId: z.number(),
          taxonFullpath: z.string(),
        })
      ),
    },
  },

  getOneTaxon: {
    method: "GET",
    path: "/taxons/:taxonId",
    responses: {
      200: z.object({
        taxonId: z.number(),
        taxonName: z.string(),
        taxonSlug: z.string(),
        parentTaxonId: z.number().nullable(),
      }),
    },
  },

  checkTaxonSlugIsUnique: {
    method: "GET",
    path: "/taxons/slug/check_unique",
    query: z.object({
      slug: z.string(),
      taxonId: z.number().optional(),
      parentTaxonId: z.number().optional(),
    }),
    responses: {
      200: z.object({
        isUnique: z.boolean(),
      }),
    },
  },

  generateUniqueTaxonSlug: {
    method: "GET",
    path: "/taxons/:taxonName/generate_unique_slug",
    query: z.object({
      parentTaxonId: z.number().optional(),
    }),
    responses: {
      200: z.object({ slug: z.string() }),
    },
  },
});
