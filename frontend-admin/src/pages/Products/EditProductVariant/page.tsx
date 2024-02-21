import { useState } from "react";
import { useParams, Link, useNavigate } from "@tanstack/react-router";
import { Controller, useForm } from "react-hook-form";

import { PageTitle } from "~/pages/common/components/PageTitle";

import { IconExclamationCircle, IconSave } from "~/pages/common/Icons";

import { z } from "zod";
import { clsx as cx } from "clsx";

import { zProductStatus } from "@api-contract/common";
import { Select } from "~/pages/common/components/Select";
import { Form } from "~/pages/common/components/Form/Form";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { zImage } from "~/lib/zod";

import { PricingField } from "~/pages/common/components/Form/InputField";
import { file2Base64 } from "~/utils/utils";
import {
  useEditProductVariant,
  useEditedProductVariantInfo,
} from "~/pages/Products/api";

const formSchema = z.object({
  productVariantName: z.string().min(1, "Product variant name is required"),
  productStatus: zProductStatus.default("ACTIVE"),
  image: zImage.nullable().optional(),
  pricing: z.number(),
});

export function EditProductVariantPage() {
  const params = useParams({
    from: "/products/$productId/variants/$productVariantId/edit",
  });
  const productVariantId = Number.parseInt(params.productVariantId);
  const productId = Number.parseInt(params.productId);

  // map of: OPTION_CODE -> OPTION_VALUE_ID
  const [optionValues, setOptionValues] = useState<Map<string, number>>(
    new Map()
  );

  const navigate = useNavigate();

  const editProductVariantMutation = useEditProductVariant({
    productVariantId,
    onSuccess: () => {
      navigate({
        to: "/products/$productId/variants",
        params: { productId: params.productId },
      });
    },
  });
  const productVariantQuery = useEditedProductVariantInfo(
    productVariantId,
    (result) => {
      setOptionValues((v) => {
        for (const o of result.configurableOptions) {
          v.set(o.optionCode, o.currentValueId);
        }
        return new Map(v);
      });
    }
  );

  if (productVariantQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="display edit product variant form"
        failed="load product variant"
      />
    );
  }

  if (!productVariantQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <PageTitle title={"Edit product variant"} description="" />

      <Form
        onSubmit={async (v) => {
          const optionValuesArr = Array.from(optionValues.entries());
          const img = v.image?.item(0);

          editProductVariantMutation.mutate({
            productId,
            variantName: v.productVariantName,
            options: optionValuesArr.map(([optionCode, optionValueId]) => ({
              optionCode,
              optionValueId,
            })),
            pricing: v.pricing,
            status: v.productStatus,
            imageBase64: img ? await file2Base64(img) : null,
          });
        }}
        className="mt-6 rounded-md border border-gray-300 bg-white px-6 pb-6 pt-6 text-sm"
        schema={formSchema}
        options={{
          defaultValues: {
            productVariantName: productVariantQuery.data.productVariantName,
            productStatus: productVariantQuery.data.status,
            pricing: productVariantQuery.data.pricing,
          },
        }}
      >
        {({
          register,
          watch,
          setValue,
          formState: { errors, dirtyFields },
          control,
        }) => (
          <>
            <div className="rounded-md border border-gray-300 px-5 pb-8 pt-6">
              <div>
                <p className="text-base font-semibold text-gray-600">Details</p>
                <hr className="mt-0.5 border-gray-300" />
              </div>
              <div className="mt-4">
                <p>
                  Product variant name <span className="text-red-500">*</span>
                </p>
                <input
                  {...register("productVariantName")}
                  className="mt-1 block  w-full rounded-md border border-gray-300 px-3 py-2"
                  type="text"
                />
                {errors["productVariantName"]?.message && (
                  <p className="mt-1 text-red-500">
                    {errors["productVariantName"].message}
                  </p>
                )}
              </div>
            </div>
            <div className="mt-8 rounded-md border border-gray-300 px-5 pb-8 pt-6">
              <div>
                <p className="text-base font-semibold text-gray-600">Options</p>
                <hr className="mt-0.5 border-gray-300" />
              </div>
              <div className="mt-4 space-y-6 text-sm">
                {productVariantQuery.data.configurableOptions.map((o) => (
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

            <PricingField
              className="mt-6"
              label="Pricing"
              registration={register("pricing", {
                setValueAs: (v) =>
                  v === "" || Number.isNaN(v) ? 0.0 : parseFloat(v),
              })}
              error={errors["pricing"]}
            />

            <div className="mt-8">
              <Controller
                name="productStatus"
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

            <div className="mt-8 flex justify-end">
              <ButtonGroup productId={productId} />
            </div>
          </>
        )}
      </Form>
    </div>
  );
}

function ButtonGroup(props: { productId: number; disableCreate?: boolean }) {
  return (
    <div className="flex">
      <button
        type="submit"
        disabled={props.disableCreate}
        className={
          "flex h-9 items-center rounded-l-md bg-teal-500 pl-1 pr-4 text-sm text-white disabled:cursor-not-allowed disabled:bg-teal-500/50"
        }
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconSave className="h-4 w-4" />
        </span>
        <span>Save changes</span>
      </button>
      <Link
        to="/products/$productId/variants"
        params={{
          productId: props.productId.toString(),
        }}
        className={cx(
          "flex h-9 items-center rounded-r-md bg-gray-200 px-4 text-sm text-gray-500"
        )}
      >
        <span>Cancel</span>
      </Link>
    </div>
  );
}
