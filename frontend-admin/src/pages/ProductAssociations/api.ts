import { useMutation, useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";

import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const QUERY_KEY = {
  list_associations: "list_associations",
  get_one_association: "get_one_association",
};

export function useAssociations(associationName: string | null) {
  return useQuery({
    queryKey: [QUERY_KEY.list_associations, associationName],
    queryFn: async () => {
      const r = await client.productAssociations.listAssociationTypes({
        query: {
          filter: {
            name: associationName === "" ? null : associationName,
          },
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useDeleteAssociation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (associationTypeId: number) => {
      const r = await client.productAssociations.deleteAssociationType({
        params: {
          associationTypeId: associationTypeId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product association is deleted successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_associations],
      });
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useCreateAssociation({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (associationTypeName: string) => {
      const r = await client.productAssociations.createAssociationType({
        body: {
          name: associationTypeName,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product association is created successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.list_associations],
      });
      onSuccess();
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}

export function useOneAssociation(associationTypeId: number) {
  return useQuery({
    queryKey: [QUERY_KEY.get_one_association, associationTypeId],
    queryFn: async () => {
      const r = await client.productAssociations.getOneAssociationType({
        params: {
          associationTypeId: associationTypeId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });
}

export function useEditAssociation({ onSuccess }: { onSuccess: () => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: {
      associationTypeId: number;
      associationTypeName: string;
    }) => {
      const r = await client.productAssociations.editAssociationType({
        body: {
          name: args.associationTypeName,
        },
        params: {
          associationTypeId: args.associationTypeId.toString(),
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    onSuccess() {
      toast.success("Product association is updated successfully", {
        position: "top-right",
        duration: 2000,
      });
      queryClient.invalidateQueries({
        queryKey: [QUERY_KEY.get_one_association],
      });
      onSuccess();
    },
    onError(e) {
      toast.error(`An unexpected error had occured`, {
        position: "top-right",
        duration: 2000,
      });
    },
  });
}
