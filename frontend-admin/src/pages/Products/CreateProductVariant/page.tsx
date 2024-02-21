import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";

import { PageTitle } from "~/pages/common/components/PageTitle";
import { IconExclamationCircle } from "~/pages/common/Icons";

import { useState } from "react";
import { zProductStatus } from "~/api-contract/common";
import { InputField } from "~/pages/common/components/Form/InputField";
import { SelectField } from "~/pages/common/components/Form/SelectField";
import { FormCreateActionButtons } from "~/pages/common/components/Form/FormCreateActionButtons";
import { Form } from "~/pages/common/components/Form/Form";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { zImage } from "~/lib/zod";
import { file2Base64 } from "~/utils/utils";
import { ImageUploadField } from "~/pages/common/components/Form/ImageUploadField";
import {
  useCreateProductVariant,
  useProductConfigurableOptions,
} from "~/pages/Products/api";

const formSchema = z.object({
  productVariantName: z.string().min(1, "Product variant name is required"),
  productStatus: zProductStatus.default("ACTIVE"),
  image: zImage.nullable(),
  pricing: z.number(),
});

export function CreateProductVariantPage() {
  const productId = Number.parseInt(
    useParams({ from: "/products/$productId/variants/new" }).productId
  );

  // map of: OPTION_CODE -> OPTION_VALUE_ID
  const [optionValues, setOptionValues] = useState<Map<string, number>>(
    new Map()
  );

  const navigate = useNavigate();

  const optionsQuery = useProductConfigurableOptions(productId, (r) => {
    setOptionValues((v) => {
      for (const o of r.configurableOptions) {
        if (o.optionValues.length > 0) {
          v.set(o.optionCode, o.optionValues[0].id);
        }
      }
      return v;
    });
  });

  const createProductVariantMutation = useCreateProductVariant({
    onSuccess: () => {
      navigate({ to: "/products/" });
    },
  });

  if (optionsQuery.isError) {
    <UnexpectedErrorMessage
      intent="display create product variant form"
      failed="load product options data"
    />;
  }

  if (!optionsQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <PageTitle
        title={optionsQuery.data.productName}
        description="New product variant"
      />

      <Form
        schema={formSchema}
        onSubmit={async (v) => {
          const optionValuesArr = Array.from(optionValues.entries());
          const img = v.image?.item(0);

          createProductVariantMutation.mutate({
            productId: productId,
            variantName: v.productVariantName,
            options: optionValuesArr.map(([optionCode, optionValueId]) => ({
              optionCode,
              optionValueId,
            })),
            status: v.productStatus,
            imageBase64: img ? await file2Base64(img) : null,
            pricing: v.pricing,
          });
        }}
        options={{
          defaultValues: {
            productStatus: "ACTIVE",
            pricing: 0,
          },
        }}
        className="mt-6 rounded-md border border-gray-300 bg-white px-6 pb-6 pt-6 text-sm"
      >
        {({ register, control, watch, setValue, formState: { errors } }) => {
          return (
            <>
              <div className="rounded-md border border-gray-300 px-5 pb-8 pt-6">
                <div>
                  <p className="text-base font-semibold text-gray-600">
                    Details
                  </p>
                  <hr className="mt-0.5 border-gray-300" />
                </div>
                <InputField
                  className="mt-4"
                  label="Product variant name"
                  id="name"
                  error={errors["productVariantName"]}
                  type="text"
                  registration={register("productVariantName")}
                  required
                />
              </div>

              <div className="mt-8 rounded-md border border-gray-300 px-5 pb-8 pt-6">
                <div>
                  <p className="text-base font-semibold text-gray-600">
                    Options
                  </p>
                  <hr className="mt-0.5 border-gray-300" />
                </div>
                <div className="mt-4 space-y-6">
                  {optionsQuery.data.configurableOptions.map((o) => (
                    <div key={o.optionCode}>
                      {o.optionValues.length === 0 && (
                        <div className="mb-3 rounded-md border border-red-500 bg-red-100 px-5 py-3 text-red-500">
                          <p className="flex">
                            <span>
                              <IconExclamationCircle className="h-5 w-5" />
                            </span>
                            <span className="ml-2">
                              Please{" "}
                              <Link
                                to="/options/$optionCode/edit"
                                className="font-medium underline-offset-[3px] hover:underline"
                                params={{
                                  optionCode: o.optionCode,
                                }}
                              >
                                provide at least one option for{" "}
                                <i>{o.optionName}</i>
                              </Link>{" "}
                              before creating a product variant with this
                              attribute
                            </span>
                          </p>
                        </div>
                      )}

                      <p>
                        <span>{o.optionName}</span>
                        <span className="text-red-500"> *</span>
                      </p>
                      <div className="mt-1">
                        <select
                          disabled={o.optionValues.length === 0}
                          className="w-full rounded-md border border-gray-300 bg-white px-4 py-2 disabled:bg-gray-200"
                          onChange={(e) => {
                            setOptionValues((v) => {
                              v.set(o.optionCode, parseInt(e.target.value));
                              return new Map(v);
                            });
                            e.target.value;
                          }}
                          value={optionValues.get(o.optionCode)}
                        >
                          {o.optionValues.map((v) => (
                            <option key={v.id} value={v.id}>
                              {v.value}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <SelectField
                id="status"
                name="productStatus"
                control={control}
                className="mt-8 w-[300px]"
                options={[
                  { label: "Active", value: "ACTIVE" },
                  { label: "Archived", value: "ARCHIVED" },
                  { label: "Out of stock", value: "OUT_OF_STOCK" },
                ]}
                label="Status"
                error={errors["productStatus"]}
              />

              <ImageUploadField
                label="Image"
                image={watch("image")}
                register={register("image")}
                onDeleteImage={() => setValue("image", null)}
                className="mt-8 w-[calc(92px+12rem)]"
                imageClassName="w-48 h-48"
              />

              <FormCreateActionButtons
                disableCreate={optionsQuery.data.configurableOptions.some(
                  (o) => o.optionValues.length === 0
                )}
                linkProps={{ to: "/products", params: {} }}
                className="mt-8 justify-end"
              />
            </>
          );
        }}
      </Form>
    </div>
  );
}
