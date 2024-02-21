import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller, set } from "react-hook-form";
import { useParams } from "@tanstack/react-router";
import { z } from "zod";

import { client } from "~/external/api-client/client";

import { QUERY_KEY } from "~/pages/Taxons/api";

import { useDebounce } from "@uidotdev/usehooks";
import { match } from "ts-pattern";

import { slugRegex } from "~/api-contract/common";
import { InputField } from "~/pages/common/components/Form/InputField";
import { useEditTaxon, useOneTaxon } from "~/pages/Taxons/api";

const formSchema = z.object({
  taxonName: z.string().min(1, "Taxon name is required"),
  taxonSlug: z
    .string()
    .min(1, "Taxon slug is required")
    .regex(slugRegex, "Slug can only contain alphanumerics and dashes"),
});

type FormSchema = z.infer<typeof formSchema>;

export function EditTaxonPage() {
  const taxonId = Number.parseInt(
    useParams({ from: "/taxon/$taxonId/edit" }).taxonId
  );

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors: formErrors, dirtyFields, isDirty },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });

  const taxonSlug = watch("taxonSlug");
  const debouncedSlug = useDebounce(taxonSlug, 1000);

  const { data } = useOneTaxon(taxonId, ({ taxonName, taxonSlug }) => {
    setValue("taxonName", taxonName);
    setValue("taxonSlug", taxonSlug);
  });

  const parentTaxonId =
    data?.parentTaxonId === undefined ? null : data.parentTaxonId;

  const editTaxonMutation = useEditTaxon();

  const isSlugUniqueQuery = useQuery({
    queryKey: [
      QUERY_KEY.is_taxon_slug_unique,
      debouncedSlug,
      parentTaxonId,
      data?.taxonId,
    ],
    queryFn: async () => {
      const r = await client.taxons.checkTaxonSlugIsUnique({
        query: {
          slug: debouncedSlug,
          parentTaxonId: parentTaxonId ?? undefined,
          taxonId: data?.taxonId ?? undefined,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    enabled:
      !(debouncedSlug === "" || debouncedSlug === undefined) &&
      "taxonSlug" in dirtyFields,
  });

  return (
    <div className="mt-5 rounded-md border border-gray-300 bg-white p-4 text-sm">
      <form
        onSubmit={handleSubmit(
          async (v) => {
            editTaxonMutation.mutate({
              taxonId: taxonId,
              taxon: {
                taxonName: v.taxonName,
                taxonSlug: v.taxonSlug,
              },
            });
          },
          (e) => console.error(e)
        )}
      >
        <InputField
          label="Name"
          id="name"
          error={formErrors.taxonName}
          type="text"
          registration={register("taxonName")}
          required
        />

        <div className="relative mt-6">
          <label className="block">Slug</label>
          <input
            {...register("taxonSlug")}
            className="mt-1 block  w-full rounded-md border border-gray-300 px-3 py-2"
            type="text"
          />
          {formErrors["taxonSlug"]?.message && (
            <p className="mt-1 text-red-500">
              {formErrors["taxonSlug"].message}
            </p>
          )}
          {"taxonSlug" in dirtyFields &&
            formErrors["taxonSlug"] === undefined &&
            taxonSlug !== "" && (
              <div className="mt-1">
                {match(isSlugUniqueQuery)
                  .with({ status: "pending" }, (q) => (
                    <p className="text-gray-500">
                      Checking url availability...
                    </p>
                  ))
                  .with({ status: "success" }, (q) =>
                    q.data.isUnique ? (
                      <p className="text-green-600">Slug is available</p>
                    ) : (
                      <p className="text-red-600">Slug is not available</p>
                    )
                  )
                  .run()}
              </div>
            )}
        </div>

        <div className="mt-8 flex">
          <button
            type="submit"
            className="rounded-l-md bg-teal-500 px-4 py-2 font-medium text-white"
          >
            Update
          </button>
          <button type="button" className="rounded-r-md bg-gray-200 px-4 py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
