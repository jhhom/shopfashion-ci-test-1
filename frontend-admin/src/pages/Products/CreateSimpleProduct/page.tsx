import { PageTitle } from "~/pages/common/components/PageTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { TaxonTreeSelection } from "~/pages/Products/_components/TaxonTreeSelection";
import { useState } from "react";
import { default as ReactSelect } from "react-select";
import { zProductStatus } from "@api-contract/common";
import { InputField } from "~/pages/common/components/Form/InputField";
import { SelectField } from "~/pages/common/components/Form/SelectField";
import { FormCreateActionButtons } from "~/pages/common/components/Form/FormCreateActionButtons";
import { ComboboxField } from "~/pages/common/components/Form/ComboboxField";
import { ImageUploadField } from "~/pages/common/components/Form/ImageUploadField";
import { Form } from "~/pages/common/components/Form/Form";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { UnexpectedErrorMessages } from "~/pages/common/components/Errors";
import { file2Base64 } from "~/utils/utils";
import { zImage } from "~/lib/zod";
import { useAssociations } from "~/pages/ProductAssociations/api";
import {
  useCreateSimpleProduct,
  useTaxonParents,
  useTaxonTree,
} from "~/pages/Products/api";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().default(""),
  pricing: z
    .number()
    .default(0.0)
    .refine((x) => Number(x) >= 0, "Pricing must be 0 or positive"),
  taxonId: z.number({
    required_error: "Main taxon is required",
  }),
  associations: z.array(z.object({ value: z.number(), label: z.string() })),
  status: zProductStatus.default("ACTIVE"),
  image: zImage.nullable(),
});

export function CreateSimpleProductPage() {
  const [checkedTaxonIds, setCheckedTaxonIds] = useState(new Set<number>());

  const queryClient = useQueryClient();

  const navigate = useNavigate();

  const createProductMutation = useCreateSimpleProduct({
    onSuccess: () => {
      navigate({ to: "/products" });
    },
  });

  const associationsTypeQuery = useAssociations(null);

  const taxonParentsQuery = useTaxonParents();

  const taxonTreeQuery = useTaxonTree();

  if (
    associationsTypeQuery.isError ||
    taxonParentsQuery.isError ||
    taxonTreeQuery.isError
  ) {
    return (
      <UnexpectedErrorMessages
        intent="display create product form"
        errors={[
          {
            error: associationsTypeQuery.error,
            action: "Load product association types",
          },
          {
            error: taxonParentsQuery.error,
            action: "Load taxons",
          },
          { error: taxonTreeQuery.error, action: "Load taxon tree" },
        ]}
      />
    );
  }

  if (
    !(
      associationsTypeQuery.data &&
      taxonParentsQuery.data &&
      taxonTreeQuery.data
    )
  ) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <PageTitle
        title="New product"
        description="Manage your product catalog"
      />

      <div className="mt-6 rounded-t-md border border-gray-300 bg-white text-sm">
        <div className="py-3 pl-6 font-semibold">Details</div>
      </div>

      <Form
        schema={formSchema}
        onSubmit={async (v) => {
          const img = v.image?.item(0);

          createProductMutation.mutate({
            name: v.name,
            description: v.description,
            pricing: v.pricing,
            mainTaxonId: v.taxonId,
            productTaxonIds: Array.from(checkedTaxonIds),
            productAssociations: v.associations.map((a) => a.value),
            status: v.status,
            imageBase64: img ? await file2Base64(img) : null,
          });
        }}
        options={{
          defaultValues: {
            pricing: 0,
            associations: [],
            status: "ACTIVE",
          },
        }}
        className="border-b border-l border-r 
        border-gray-300 bg-white px-6 pb-6 pt-6 text-sm"
      >
        {({ register, watch, setValue, control, formState: { errors } }) => {
          return (
            <>
              <InputField
                label="Name"
                id="name"
                error={errors["name"]}
                type="text"
                registration={register("name")}
                required
              />

              <div className="mt-6">
                <p>Description</p>
                <textarea
                  className="mt-1 block  w-full rounded-md border border-gray-300 px-3 py-2 
              focus:outline-none focus:ring-1"
                  {...register("description")}
                  cols={30}
                  rows={10}
                />
              </div>

              <ComboboxField
                name="taxonId"
                control={control}
                className="mt-6 w-[300px]"
                options={taxonParentsQuery.data.map((t) => ({
                  label: t.taxonFullpath,
                  value: t.taxonId,
                }))}
                label="Main Taxon"
                error={errors["taxonId"]}
              />

              <div className="mt-8">
                <p>Pricing</p>
                <div className="mt-1 flex rounded-md border border-gray-300">
                  <div className="flex basis-[35px] items-center justify-center rounded-l-sm  bg-gray-200">
                    $
                  </div>
                  <input
                    {...register("pricing", {
                      setValueAs: (v) =>
                        v === "" || Number.isNaN(v) ? 0.0 : parseFloat(v),
                    })}
                    className="block  flex-grow rounded-r-md px-3 py-2 focus:outline-none focus:ring-1"
                    type="text"
                  />
                </div>
                {errors["pricing"]?.message && (
                  <p className="mt-1 text-red-500">
                    {errors["pricing"].message}
                  </p>
                )}
              </div>

              <SelectField
                name="status"
                control={control}
                className="mt-8 w-[300px]"
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Archived", value: "ARCHIVED" },
                  { label: "Out of stock", value: "OUT_OF_STOCK" },
                ]}
                label="Status"
                error={errors["status"]}
              />

              <ImageUploadField
                label="Image"
                image={watch("image")}
                register={register("image")}
                onDeleteImage={() => setValue("image", null)}
                className="mt-8 w-[calc(92px+12rem)]"
                imageClassName="w-48 h-48"
              />

              <div className="mt-10">
                <p>Product Taxon</p>
                <div className="mt-1.5">
                  <TaxonTreeSelection
                    tree={taxonTreeQuery.data}
                    checkedTaxonIds={checkedTaxonIds}
                    setCheckedTaxonIds={setCheckedTaxonIds}
                  />
                </div>
              </div>

              <div className="mt-8">
                <p>Product associations</p>
                <div className="mt-1">
                  <Controller
                    name="associations"
                    control={control}
                    render={({ field }) => (
                      <ReactSelect
                        options={(
                          associationsTypeQuery.data?.results ?? []
                        ).map((a) => ({
                          label: a.name,
                          value: a.id,
                        }))}
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        ref={field.ref}
                        name={field.name}
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                    )}
                  />
                </div>
              </div>

              <FormCreateActionButtons
                linkProps={{ to: "/products", params: {} }}
                className="mt-12 flex justify-end"
              />
            </>
          );
        }}
      </Form>
    </div>
  );
}
