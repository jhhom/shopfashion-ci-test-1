import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { Select } from "~/pages/common/components/Select";

import { useDebounce } from "@uidotdev/usehooks";
import { match } from "ts-pattern";

import { clsx as cx } from "clsx";
import {
  useAssignableTaxonParents,
  useCreateTaxon,
  useGenerateUniqueTaxonSlug,
  useTaxonSlugIsUnique,
} from "~/pages/Taxons/api";

const formSchema = z.object({
  taxonName: z.string().min(1, "Taxon name is required"),
  taxonSlug: z.string().min(1, "Slug is required"),
  parentId: z.number().default(0),
});

type FormSchema = z.infer<typeof formSchema>;

export function CreateTaxon2Page() {
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
  });

  const debouncedTaxonName = useDebounce(watch("taxonName"), 1000);
  const debouncedTaxonParentId = useDebounce(watch("parentId"), 1000);
  const taxonSlug = watch("taxonSlug");
  const debouncedSlug = useDebounce(taxonSlug, 1000);

  const { data: taxonParentsData } = useAssignableTaxonParents();

  const generatedUniqueTaxonSlugQuery = useGenerateUniqueTaxonSlug({
    taxonName: debouncedTaxonName,
    taxonParentId: debouncedTaxonParentId,
    onSuccess(slug) {
      setValue("taxonSlug", slug);
    },
  });

  const isSlugUniqueQuery = useTaxonSlugIsUnique(
    debouncedSlug,
    debouncedTaxonParentId
  );

  const createTaxonMutation = useCreateTaxon();

  return (
    <div className="mt-5 rounded-md border border-gray-300 bg-white p-4 text-sm">
      <form
        onSubmit={handleSubmit(
          async (v) => {
            createTaxonMutation.mutate({
              taxonName: v.taxonName,
              parentTaxonId: v.parentId === 0 ? null : v.parentId,
              taxonSlug: v.taxonSlug,
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
            className={cx(
              "mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500",
              {
                "ring-2 ring-red-600":
                  taxonSlug !== "" &&
                  !generatedUniqueTaxonSlugQuery.isLoading &&
                  formErrors["taxonSlug"] === undefined &&
                  isSlugUniqueQuery.isSuccess &&
                  !isSlugUniqueQuery.data.isUnique,
              }
            )}
            type="text"
          />
          {formErrors["taxonSlug"]?.message && (
            <p className="mt-1 text-red-500">
              {formErrors["taxonSlug"].message}
            </p>
          )}
          {generatedUniqueTaxonSlugQuery.isLoading && (
            <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-white/50">
              <Spinner />
            </div>
          )}
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
                      <p className="text-red-600">
                        Slug is not available: {taxonSlug}
                      </p>
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
                  taxonParentsData?.map((t) => ({
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

function Spinner() {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="mr-2 h-8 w-8 animate-spin fill-blue-600 text-gray-200"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
}
