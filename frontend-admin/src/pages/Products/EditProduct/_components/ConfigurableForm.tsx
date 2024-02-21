import { z } from "zod";
import { useForm, Controller } from "react-hook-form";
import { Link } from "@tanstack/react-router";
import { default as ReactSelect } from "react-select";

import { Select } from "~/pages/common/components/Select";
import { useState } from "react";
import { TaxonTreeSelection } from "~/pages/Products/_components/TaxonTreeSelection";
import { Taxon } from "~/api-contract/common";

import { zProductStatus, ProductStatus } from "~/api-contract/common";
import { ComboboxField } from "~/pages/common/components/Form/ComboboxField";
import { InputField } from "~/pages/common/components/Form/InputField";

import { Form } from "~/pages/common/components/Form/Form";
import { zImage } from "~/lib/zod";
import { ImageUploadField2 } from "~/pages/common/components/Form/ImageUploadField";

const formSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string(),
  taxonId: z.number().default(0),
  associations: z.array(z.object({ value: z.number(), label: z.string() })),
  status: zProductStatus,
  image: zImage.nullable().optional(),
});

type FormSchema = z.infer<typeof formSchema>;

export function ConfigurableProductForm(props: {
  productData: {
    name: string;
    description: string;
    productOptions: {
      code: string;
      name: string;
    }[];
    mainTaxonId: number | null;
    checkedTaxonIds: number[];
    productAssociations: { id: number; name: string }[];
    availableAssociations: { id: number; name: string }[];
    status: ProductStatus;
    defaultImageUrl: string | null;
  };
  taxonChoices: {
    taxonFullpath: string;
    taxonId: number;
  }[];
  taxonTreeSelection: Taxon[];
  onSubmit: (v: FormSchema, taxonIds: number[]) => void;
}) {
  const [checkedTaxonIds, setCheckedTaxonIds] = useState(
    new Set<number>(props.productData.checkedTaxonIds)
  );

  return (
    <div className="mt-5 rounded-md border border-gray-300 bg-white p-4 text-sm">
      <Form
        schema={formSchema}
        onSubmit={(v) => {
          props.onSubmit(v, Array.from(checkedTaxonIds));
        }}
        className="mt-8 rounded-md border border-gray-300 bg-white p-5 text-sm"
        options={{
          defaultValues: {
            name: props.productData.name,
            description: props.productData.description,
            taxonId: props.productData.mainTaxonId ?? undefined,
            associations: props.productData.productAssociations.map((a) => ({
              value: a.id,
              label: a.name,
            })),
            status: props.productData.status,
          },
        }}
      >
        {({
          register,
          watch,
          setValue,
          control,
          formState: { errors, dirtyFields },
        }) => {
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
                options={
                  props.taxonChoices?.map((t) => ({
                    label: t.taxonFullpath,
                    value: t.taxonId,
                  })) ?? []
                }
                label="Main Taxon"
                error={errors["taxonId"]}
              />

              <div className="mt-8">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label={"Status"}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      mRef={field.ref}
                      name={field.name}
                      width="w-[300px]"
                      options={[
                        { name: "Active", id: "ACTIVE" },
                        { name: "Archived", id: "ARCHIVED" },
                        { name: "Out of stock", id: "OUT_OF_STOCK" },
                      ]}
                    />
                  )}
                />
              </div>

              <ImageUploadField2
                label="Image"
                image={watch("image")}
                register={register("image")}
                setImage={(i, o) => setValue("image", i, o)}
                className="mt-8 w-[calc(92px+12rem)]"
                imageClassName="w-48 h-48"
                dirty={dirtyFields["image"] ?? false}
                currentImageUrl={props.productData.defaultImageUrl}
              />

              <div className="mt-8">
                <p>Product Taxon</p>
                <div className="mt-1.5">
                  <TaxonTreeSelection
                    tree={props.taxonTreeSelection}
                    checkedTaxonIds={checkedTaxonIds}
                    setCheckedTaxonIds={setCheckedTaxonIds}
                  />
                </div>
              </div>

              <div className="mt-6">
                <p>Product Options</p>
                <div className="mt-2">
                  {props.productData.productOptions.map((o) => (
                    <div key={o.code} className="flex">
                      <input type="checkbox" checked disabled />
                      <p className="ml-2.5">{o.name}</p>
                    </div>
                  ))}
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
                        options={props.productData.availableAssociations.map(
                          (a) => ({
                            label: a.name,
                            value: a.id,
                          })
                        )}
                        defaultValue={props.productData.productAssociations.map(
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

              <div className="mt-10 flex">
                <button
                  type="submit"
                  className="rounded-l-md bg-teal-500 px-4 py-2 font-medium text-white"
                >
                  Update
                </button>
                <Link
                  to="/products"
                  className="rounded-r-md bg-gray-200 px-4 py-2"
                >
                  Cancel
                </Link>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
}
