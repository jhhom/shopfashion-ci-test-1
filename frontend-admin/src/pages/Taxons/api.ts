import { client } from "~/external/api-client/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AdminTaxonsRequests } from "@api-contract/admin-api/types";
import { parseApiError } from "~/utils/api";
import { useEffect } from "react";

export const QUERY_KEY = {
  taxon_parents: "taxon_parents",
  taxon_tree: "taxon_tree",
  get_edited_taxon: "get_edited_taxon",
  generate_taxon_unique_slug: "generate_taxon_unique_slug",
  is_taxon_slug_unique: "is_taxon_slug_unique",
};

export function useAssignableTaxonParents() {
  return useQuery({
    queryKey: [QUERY_KEY.taxon_parents],
    queryFn: async () => {
      const r = await client.taxons.assignableTaxonParents();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useGenerateUniqueTaxonSlug({
  taxonName,
  taxonParentId,
  onSuccess,
}: {
  taxonName: string;
  taxonParentId: number | undefined;
  onSuccess: (slug: string) => void;
}) {
  const query = useQuery({
    queryKey: [QUERY_KEY.generate_taxon_unique_slug, taxonName],
    queryFn: async () => {
      if (taxonName === "" || taxonName === undefined) {
        return { slug: "" };
      }
      const r = await client.taxons.generateUniqueTaxonSlug({
        params: {
          taxonName: taxonName === undefined ? "" : taxonName,
        },
        query: {
          parentTaxonId: taxonParentId === 0 ? undefined : taxonParentId,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });

  useEffect(() => {
    if (query.isSuccess) {
      onSuccess(query.data.slug);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  return query;
}

export function useTaxonSlugIsUnique(
  slug: string,
  parentTaxonId: number | undefined
) {
  return useQuery({
    queryKey: [QUERY_KEY.is_taxon_slug_unique, slug, parentTaxonId],
    queryFn: async () => {
      if (slug === "" || slug === undefined) {
        return { isUnique: false };
      }
      const r = await client.taxons.checkTaxonSlugIsUnique({
        query: {
          parentTaxonId: parentTaxonId === 0 ? undefined : parentTaxonId,
          taxonId: undefined,
          slug,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useCreateTaxon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taxon: AdminTaxonsRequests["createTaxon"]["body"]) => {
      const r = await client.taxons.createTaxon({
        body: taxon,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Taxon is created successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.taxon_parents],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.taxon_tree],
      });
    },
    onError(err) {
      const e = parseApiError(err);
      const message =
        e.type === "application" &&
        e.error.details.code === "DB.UNIQUE_VALUE_CONFLICT"
          ? `Cannot create taxon, the slug is in use by other taxons. Please use a different slug.`
          : `An unexpected error had occured`;
      toast.error(message, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useOneTaxon(
  taxonId: number,
  onSuccess: ({
    taxonName,
    taxonSlug,
  }: {
    taxonName: string;
    taxonSlug: string;
  }) => void
) {
  const query = useQuery({
    queryKey: [QUERY_KEY.get_edited_taxon, taxonId],
    queryFn: async () => {
      const r = await client.taxons.getOneTaxon({
        params: {
          taxonId: taxonId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }

      return r.body;
    },
    staleTime: 0,
  });

  useEffect(() => {
    if (query.isSuccess) {
      onSuccess(query.data);
    }
  }, [query.isSuccess, query.data, onSuccess]);

  return query;
}

export function useEditTaxon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      taxonId: number;
      taxon: AdminTaxonsRequests["editTaxon"]["body"];
    }) => {
      const r = await client.taxons.editTaxon({
        params: {
          taxonId: args.taxonId.toString(),
        },
        body: args.taxon,
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Taxon is updated successfully", {
        position: "top-right",
        duration: 2000,
      });

      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.taxon_parents],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.taxon_tree],
      });
    },
    onError(err) {
      const e = parseApiError(err);
      const message =
        e.type === "application" &&
        e.error.details.code === "DB.UNIQUE_VALUE_CONFLICT"
          ? `Cannot create taxon, the slug is in use by other taxons. Please use a different slug.`
          : "An unexpected error had occured";
      if (message) {
        toast.error(message, {
          position: "top-right",
          duration: 2000,
        });
      }
    },
  });
}

export function useTaxonTree() {
  return useQuery({
    queryKey: [QUERY_KEY.taxon_tree],
    queryFn: async () => {
      const r = await client.taxons.taxonTree();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useDeleteTaxon() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taxonId: number) => {
      const r = await client.taxons.deleteTaxon({
        params: { taxonId: taxonId.toString() },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Taxon is deleted successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.taxon_parents],
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.taxon_tree],
      });
    },
    onError(err) {
      const e = parseApiError(err);
      const message =
        e.type === "application" &&
        e.error.details.code === "DB.DELETED_ENTITY_IN_USE"
          ? `Cannot delete, the Taxon is in use`
          : `An unexpected error had occured`;
      if (message) {
        toast.error(message, {
          position: "top-right",
          duration: 2000,
        });
      }
    },
  });
}
