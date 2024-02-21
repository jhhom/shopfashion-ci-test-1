import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { Select } from "~/pages/common/components/Select";
import { client } from "~/external/api-client/client";

import { QUERY_KEY } from "~/pages/Taxons/api";
import { useEffect, useState } from "react";
import { useParams } from "@tanstack/react-router";

import { Spinner } from "~/pages/Taxons/_components/Spinner";

import { useDebounce } from "@uidotdev/usehooks";
import { match } from "ts-pattern";
import { slugRegex } from "@api-contract/common";
import { useAssignableTaxonParents, useCreateTaxon } from "~/pages/Taxons/api";

const formSchema = z.object({
  taxonName: z.string().min(1, "Taxon name is required"),
  taxonSlug: z
    .string()
    .min(1, "Taxon slug is required")
    .regex(slugRegex, "Slug can only contain alphanumerics and dashes"),
  parentId: z.number().default(0),
});

type FormSchema = z.infer<typeof formSchema>;

export function CreateTaxonUnderParentPage() {
  const queryClient = useQueryClient();

  const { taxonId } = useParams({ from: "/taxon/new/$taxonId" });
  const initialParentId = Number.parseInt(taxonId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    setValue,
    formState: { errors: formErrors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      parentId: initialParentId,
    },
  });

  const debouncedTaxonName = useDebounce(watch("taxonName"), 1000);
  const debouncedTaxonParentId = useDebounce(watch("parentId"), 1000);
  const taxonSlug = watch("taxonSlug");
  const debouncedSlug = useDebounce(taxonSlug, 1000);

  const { data } = useAssignableTaxonParents();

  const createTaxonMutation = useCreateTaxon();

  useEffect(() => {
    setValue("parentId", initialParentId ? initialParentId : 0);
  }, [initialParentId]);

  const [playGenerateSlugAnimation, setPlayGenerateSlugAnimation] =
    useState(false);

  const generatedUniqueTaxonSlugQuery = useQuery({
    queryKey: [QUERY_KEY.generate_taxon_unique_slug, debouncedTaxonName],
    queryFn: async () => {
      if (debouncedTaxonName === "" || debouncedTaxonName === undefined) {
        return "";
      }
      let playGenerateSlugAnim = true;
      setPlayGenerateSlugAnimation(true);

      let s: string | undefined = undefined;

      setTimeout(() => {
        setPlayGenerateSlugAnimation(false);
        playGenerateSlugAnim = false;
        if (s !== undefined) {
          setValue("taxonSlug", s);
        }
      }, 1000);
      const r = await client.taxons.generateUniqueTaxonSlug({
        params: {
          taxonName: debouncedTaxonName === undefined ? "" : debouncedTaxonName,
        },
        query: {
          parentTaxonId:
            debouncedTaxonParentId === 0 ? undefined : debouncedTaxonParentId,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }

      // if 1.5 seconds expire before we get the result, we set the value
      if (!playGenerateSlugAnim) {
        setValue("taxonSlug", r.body.slug);
      } else {
        // if we get the result before 1.5 seconds expire, we set s, and wait until 1.5 seconds expire
        // before we set the slug in the timeout
        s = r.body.slug;
      }
      return r.body;
    },
  });

  const isSlugUniqueQuery = useQuery({
    queryKey: [
      QUERY_KEY.is_taxon_slug_unique,
      debouncedSlug,
      debouncedTaxonParentId,
    ],
    queryFn: async () => {
      const r = await client.taxons.checkTaxonSlugIsUnique({
        query: {
          slug: debouncedSlug,
          parentTaxonId:
            debouncedTaxonParentId === 0 ? undefined : debouncedTaxonParentId,
          taxonId: undefined,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
    enabled: !(
      debouncedSlug === "" ||
      debouncedSlug === undefined ||
      generatedUniqueTaxonSlugQuery.isLoading
    ),
  });

  return (
    <div className="mt-5 rounded-md border border-gray-300 bg-white p-4 text-sm">
      <form
        onSubmit={handleSubmit(
          async (v) => {
            createTaxonMutation.mutate({
              taxonName: v.taxonName,
              taxonSlug: v.taxonSlug,
              parentTaxonId: v.parentId === 0 ? null : v.parentId,
            });

            reset();
            setValue("parentId", 0);
          },
          (e) => console.error(e)
        )}
      >
        <div>
          <label className="block">Name</label>
          <input
            {...register("taxonName")}
            className="mt-1 block  w-full rounded-md border border-gray-300 px-3 py-2"
            type="text"
          />
          {formErrors["taxonName"]?.message && (
            <p className="mt-1 text-red-500">
              {formErrors["taxonName"].message}
            </p>
          )}
        </div>

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
          {generatedUniqueTaxonSlugQuery.isLoading ||
            (playGenerateSlugAnimation && (
              <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white/50">
                <Spinner />
              </div>
            ))}
          {taxonSlug !== "" &&
            !generatedUniqueTaxonSlugQuery.isLoading &&
            formErrors["taxonSlug"] === undefined && (
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

        <div className="mt-8">
          <Controller
            name="parentId"
            control={control}
            render={({ field }) => (
              <Select
                label={"Parent"}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                mRef={field.ref}
                name={field.name}
                width="w-[300px]"
                options={(
                  data?.map((t) => ({
                    name: t.taxonFullpath,
                    id: t.taxonId,
                  })) ?? []
                ).concat([
                  {
                    id: 0,
                    name: "",
                  },
                ])}
              />
            )}
          />
        </div>

        <div className="mt-8 flex">
          <button
            type="submit"
            className="rounded-l-md bg-teal-500 px-4 py-2 font-medium text-white"
          >
            Create
          </button>
          <button type="button" className="rounded-r-md bg-gray-200 px-4 py-2">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
