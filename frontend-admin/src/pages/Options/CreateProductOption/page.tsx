import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";

import { PageTitle } from "~/pages/common/components/PageTitle";
import { IconAddThick, IconX } from "~/pages/common/Icons";
import { Link, useNavigate } from "@tanstack/react-router";
import { FormCreateActionButtons } from "~/pages/common/components/Form/FormCreateActionButtons";
import { Form } from "~/pages/common/components/Form/Form";
import { useCreateProductOption } from "~/pages/Options/api";
import { InputField } from "~/pages/common/components/Form/InputField";

const formSchema = z.object({
  productOptionName: z.string().min(1, "Product option name is required"),
  productOptionCode: z.string().min(1, "Product option code is required"),
  position: z
    .number()
    .int("Position has to be an integer")
    .positive("Position has to be a positive integer")
    .nullable(),
  productOptionValues: z.array(
    z.object({
      name: z.string().min(1, "Name of the product option value is required"),
    })
  ),
});

export function CreateProductOptionPage() {
  const navigate = useNavigate();

  const createProductOptionMutation = useCreateProductOption({
    onSuccess: () => {
      navigate({ to: "/options" });
    },
  });

  return (
    <>
      <div className="flex items-end justify-between">
        <PageTitle
          title={"New product option"}
          description="Manage configuration options of your product"
        />
      </div>

      <Form
        schema={formSchema}
        onSubmit={(v) => {
          createProductOptionMutation.mutate({
            code: v.productOptionCode,
            name: v.productOptionName,
            position: v.position,
            productOptionValues: v.productOptionValues.map((x) => x.name),
          });
        }}
        className="mt-8 rounded-md border border-gray-300 bg-white p-5 text-sm"
      >
        {({ register, control, formState: { errors } }) => {
          const { fields, append, prepend, remove, swap, move, insert } =
            useFieldArray({
              control,
              name: "productOptionValues",
            });

          return (
            <>
              <div className="rounded-md border border-gray-300 p-5">
                <InputField
                  label="Product option name"
                  id="name"
                  error={errors.productOptionName}
                  type="text"
                  registration={register("productOptionName")}
                  required
                />

                <InputField
                  className="mt-5"
                  label="Product option code"
                  id="code"
                  error={errors.productOptionCode}
                  type="text"
                  registration={register("productOptionCode")}
                  required
                />

                <InputField
                  className="mt-5"
                  label="Position"
                  id="position"
                  error={errors.position}
                  type="number"
                  registration={register("position", {
                    setValueAs: (v) =>
                      v === "" || Number.isNaN(v) ? null : parseInt(v),
                  })}
                />
              </div>

              <div className="mt-8">
                <p className="font-semibold">Values</p>
                <hr className="mt-1" />

                <div className="mt-4 space-y-4">
                  {fields.map((field, index) => {
                    const err = errors?.productOptionValues
                      ? errors.productOptionValues[index]
                      : undefined;

                    return (
                      <div key={field.id}>
                        <div className="flex-grow">
                          <p>
                            Option value {index + 1}
                            <span className="text-red-500"> *</span>
                          </p>
                          <div className="flex">
                            <input
                              {...register(`productOptionValues.${index}.name`)}
                              className="mt-1  w-full rounded-md border border-gray-300 px-3 py-2"
                              type="text"
                            />
                            <div className="flex basis-[50px] items-end">
                              <button
                                type="button"
                                onClick={() => remove(index)}
                                className="ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-md bg-red-100 text-red-500"
                              >
                                <IconX className="h-4 w-4" />
                              </button>
                            </div>
                          </div>

                          {err?.name?.message && (
                            <p className="mt-0.5 text-red-500">
                              {err.name.message}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4">
                  <button
                    type="button"
                    onClick={() => append({ name: "" })}
                    className="rounded-md bg-gray-200 px-4 py-2"
                  >
                    Add value
                  </button>
                </div>

                <FormCreateActionButtons
                  linkProps={{ to: "/options", params: {} }}
                  className="mt-12"
                />
              </div>
            </>
          );
        }}
      </Form>
    </>
  );
}
