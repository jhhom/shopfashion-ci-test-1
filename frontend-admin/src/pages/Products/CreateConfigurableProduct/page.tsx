import { PageTitle } from "~/pages/common/components/PageTitle";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";

import { IconAddThick, IconExclamationCircle } from "~/pages/common/Icons";

import { P, match } from "ts-pattern";
import { ErrorMessage } from "@hookform/error-message";
import { useState } from "react";
import { TaxonTreeSelection } from "~/pages/Products/_components/TaxonTreeSelection";
import { default as ReactSelect } from "react-select";
import { SelectField } from "~/pages/common/components/Form/SelectField";
import { FormCreateActionButtons } from "~/pages/common/components/Form/FormCreateActionButtons";
import { InputField } from "~/pages/common/components/Form/InputField";
import { ComboboxField } from "~/pages/common/components/Form/ComboboxField";

import { Form } from "~/pages/common/components/Form/Form";
import { UnexpectedErrorMessages } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { ImageUploadField } from "~/pages/common/components/Form/ImageUploadField";
import { zImage } from "~/lib/zod";
import { file2Base64 } from "~/utils/utils";
import { useAssociations } from "~/pages/ProductAssociations/api";
import { useListProductOptions } from "~/pages/Options/api";
import {
  useCreateConfigurableProduct,
  useTaxonParents,
  useTaxonTree,
} from "~/pages/Products/api";
import { zProductStatus } from "@api-contract/common";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().default(""),
  productOptionCodes: z
    .array(z.string())
    .refine(
      (x) => x.length > 0,
      "There must be at least one product option for a configurable product"
    ),
  taxonId: z.number({
    required_error: "Main taxon is required",
  }),
  associations: z.array(z.object({ value: z.number(), label: z.string() })),
  status: zProductStatus.default("ACTIVE"),
  image: zImage.nullable(),
});

export function CreateConfigurableProductPage() {
  const navigate = useNavigate();

  const [checkedTaxonIds, setCheckedTaxonIds] = useState(new Set<number>());

  const queryClient = useQueryClient();

  const productOptionsQuery = useListProductOptions(null);

  const associationsTypeQuery = useAssociations(null);

  const taxonParentsQuery = useTaxonParents();

  const taxonTreeQuery = useTaxonTree();

  const createProductMutation = useCreateConfigurableProduct({
    onSuccess: () => {
      navigate({ to: "/products" });
    },
  });

  if (
    productOptionsQuery.isError ||
    associationsTypeQuery.isError ||
    taxonParentsQuery.isError ||
    taxonTreeQuery.isError
  ) {
    return (
      <UnexpectedErrorMessages
        intent="display create product form"
        errors={[
          { error: productOptionsQuery.error, action: "Load product options" },
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
      productOptionsQuery.data &&
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

      {match(productOptionsQuery)
        .with(
          {
            status: "success",
            data: P.when((d) => d.length === 0),
          },
          () => (
            <div
              className="mt-6 flex border border-red-500 bg-red-100 
            px-6 py-4 text-sm text-red-500"
            >
              <span className="flex h-8 items-center">
                <IconExclamationCircle className="h-6 w-6" />
              </span>
              <p className="ml-2.5 flex items-center">
                Please &thinsp;
                <Link
                  to="/options/new"
                  className="font-semibold underline underline-offset-4 hover:underline"
                >
                  create one product option
                </Link>
                &thinsp; before creating a configurable product
              </p>
            </div>
          )
        )
        .with(
          {
            status: "success",
            data: P.when((d) => d.length > 0),
          },
          () => (
            <>
              <div className="mt-6 rounded-md border border-gray-300 bg-white text-sm">
                <div className="py-3 pl-6 font-semibold">Details</div>
                <Form
                  onSubmit={async (v) => {
                    const img = v.image?.item(0);

                    createProductMutation.mutate({
                      name: v.name,
                      description: v.description,
                      productOptionCodes: v.productOptionCodes,
                      mainTaxonId: v.taxonId,
                      productTaxonIds: Array.from(checkedTaxonIds),
                      productAssociations: v.associations.map((a) => a.value),
                      status: v.status,
                      imageBase64: img ? await file2Base64(img) : null,
                    });
                  }}
                  options={{
                    defaultValues: {
                      productOptionCodes: [],
                      associations: [],
                      status: "ACTIVE",
                    },
                  }}
                  schema={formSchema}
                  className="rounded-b-md border-t border-gray-300 bg-white px-6 pb-6 pt-6 text-sm"
                >
                  {({
                    register,
                    control,
                    watch,
                    setValue,
                    formState: { errors },
                  }) => {
                    const selectedOptionCodes = watch("productOptionCodes");

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
                            className="mt-1 block  w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-1"
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

                        <div className="mt-10">
                          <p className="font-semibold">Product options</p>

                          <hr className="mb-3 mt-2 border-gray-300" />

                          <div className="mt-1.5">
                            <ProductOptionsCheckboxes
                              productOptions={productOptionsQuery.data}
                              selectedOptionCodes={selectedOptionCodes ?? []}
                              onChange={(ids) =>
                                setValue("productOptionCodes", ids)
                              }
                            />
                            <p className="mt-2 text-sm text-red-500">
                              <ErrorMessage
                                errors={errors}
                                name="productOptionCodes"
                              />
                            </p>
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
                                  options={associationsTypeQuery.data.results.map(
                                    (a) => ({
                                      label: a.name,
                                      value: a.id,
                                    })
                                  )}
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
                            ></Controller>
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
            </>
          )
        )
        .otherwise(() => (
          <div></div>
        ))}
    </div>
  );
}

function ProductOptionsCheckboxes(props: {
  productOptions: {
    code: string;
    name: string;
  }[];
  onChange: (codes: string[]) => void;
  selectedOptionCodes: string[];
}) {
  return (
    <div className="space-y-2">
      {props.productOptions.map((o) => (
        <div className="flex text-sm" key={o.code}>
          <input
            className="cursor-pointer"
            type="checkbox"
            checked={
              props.selectedOptionCodes.findIndex((s) => s === o.code) !== -1
            }
            onChange={(e) => {
              if (e.target.checked) {
                props.onChange([o.code].concat([...props.selectedOptionCodes]));
              } else {
                props.onChange(
                  Array.from(
                    props.selectedOptionCodes.filter((i) => i !== o.code)
                  )
                );
              }
            }}
            id={`option-${o.code}`}
          />
          <label htmlFor={`option-${o.code}`} className="ml-3 cursor-pointer">
            {o.name}{" "}
            <span className="font-medium text-gray-400">({o.code})</span>
          </label>
        </div>
      ))}
    </div>
  );
}
