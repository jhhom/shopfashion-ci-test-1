import { z } from "zod";
import { Link } from "@tanstack/react-router";
import {
  useFieldArray,
  useForm,
  UseFieldArrayReturn,
  UseFormRegisterReturn,
  UseFormRegister,
  Control,
  FieldError,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AdminProductVariantResponse } from "~/api-contract/admin-api/types";
import { DeleteButton } from "~/pages/common/components/Buttons";
import { InputField } from "~/pages/common/components/Form/InputField";

import { TransitionGroup, CSSTransition } from "react-transition-group";

type GeneratedVariants =
  AdminProductVariantResponse["generateProductVariants"]["body"];

const zOption = z.object({
  code: z.string(),
  valueId: z.number(),
});

const formSchema = z.object({
  existingVariants: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1, "Product variant name is required"),
      options: z.array(zOption),
    })
  ),
  generatedVariants: z.array(
    z.object({
      name: z.string().min(1, "Product variant name is required"),
      options: z.array(zOption),
    })
  ),
});

type FormSchema = z.infer<typeof formSchema>;

export function GenerateProductVariantsForm({
  productId,
  existingVariants: defaultExistingVariants,
  generatedVariants: defaultGeneratedVariants,
  configurableOptions: availableConfigurableOptions,
  onSubmit,
}: {
  productId: number;
  configurableOptions: GeneratedVariants["configurableOptions"];
  existingVariants: GeneratedVariants["existingProductVariants"];
  generatedVariants: GeneratedVariants["generatedProductVariants"];
  onSubmit: (v: FormSchema) => void;
}) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      existingVariants: defaultExistingVariants,
      generatedVariants: defaultGeneratedVariants,
    },
  });

  const existingVariantsFields = useFieldArray({
    control,
    name: "existingVariants",
  });

  const generatedVariantsFields = useFieldArray({
    control,
    name: "generatedVariants",
  });

  const [existingVariants, generatedVariants] = watch([
    "existingVariants",
    "generatedVariants",
  ]);

  const configurableOptions = new Map(
    availableConfigurableOptions.map((o) => [o.code, o])
  );

  const formValues = watch();

  return (
    <div>
      <form
        className="mt-6 rounded-md border border-gray-300 bg-white px-6 pb-6 pt-6 text-sm"
        onSubmit={handleSubmit(
          (v) => {
            onSubmit(v);
          },
          (e) => {
            console.log("FORM VALUES");
            console.log(formValues);
            console.error(e);
          }
        )}
      >
        {existingVariants.length > 0 && (
          <div className="rounded-md border border-gray-300 px-5 pb-8 pt-6">
            <div>
              <p className="text-base font-semibold text-gray-600">
                Current Variants
              </p>
              <hr className="mt-0.5 border-gray-300" />
            </div>
            <div className="h-4" />
            <TransitionGroup component="ul" className="w-full">
              {existingVariantsFields.fields.map((field, i) => (
                <CSSTransition
                  key={field.id}
                  timeout={600}
                  addEndListener={() => {}}
                  className="generate-variant-list-item"
                >
                  <ExistingVariantField
                    register={register}
                    control={control}
                    nameErr={errors["existingVariants"]?.[i]?.name}
                    idx={i}
                    configurableOptions={configurableOptions}
                    onDelete={() => existingVariantsFields.remove(i)}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        )}

        {generatedVariants.length > 0 && (
          <div className="mt-8 rounded-md border border-gray-300 px-5 pb-8 pt-6">
            <div>
              <p className="text-base font-semibold text-gray-600">
                Generated Variants
              </p>
              <hr className="mt-0.5 border-gray-300" />
            </div>
            <div className="h-4" />
            <TransitionGroup component="ul" className="w-full">
              {generatedVariantsFields.fields.map((field, i) => (
                <CSSTransition
                  key={field.id}
                  timeout={600}
                  addEndListener={() => {}}
                  className="generate-variant-list-item"
                >
                  <GeneratedVariantField
                    key={field.id}
                    register={register}
                    control={control}
                    nameErr={errors["generatedVariants"]?.[i]?.name}
                    idx={i}
                    configurableOptions={configurableOptions}
                    onDelete={() => generatedVariantsFields.remove(i)}
                  />
                </CSSTransition>
              ))}
            </TransitionGroup>
          </div>
        )}

        <div className="mt-10 flex justify-end">
          <button
            type="submit"
            className="rounded-l-md bg-teal-500 px-4 py-2 font-medium text-white"
          >
            Save
          </button>
          <Link
            to="/products/$productId/variants"
            params={{ productId: productId.toString() }}
            className="rounded-r-md bg-gray-200 px-4 py-2"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

function getOptionValue(
  options: {
    code: string;
    valueId: number;
  }[],
  code: string
) {
  return options.find((o) => o.code === code)?.valueId;
}

type a = UseFieldArrayReturn<
  FormSchema,
  `existingVariants.${number}.options`,
  "id"
>;

function ExistingVariantField({
  register,
  control,
  nameErr,
  idx,
  configurableOptions,
  onDelete,
}: {
  register: UseFormRegister<FormSchema>;
  control: Control<FormSchema, any>;
  nameErr?: FieldError;
  idx: number;
  configurableOptions: Map<
    string,
    {
      code: string;
      values: {
        value: string;
        id: number;
      }[];
      name: string;
    }
  >;
  onDelete: () => void;
}) {
  const optionsFields = useFieldArray({
    control,
    name: `existingVariants.${idx}.options`,
  });

  return (
    <div className="generate-variant-list-item">
      <div className="w-full rounded-md border border-gray-300 px-5 pb-6 pt-4">
        <p className="mb-4 font-semibold">Product variant {idx + 1}</p>
        <div className="pt-3">
          <InputField
            label="Name"
            id="name"
            error={nameErr}
            type="text"
            registration={register(`existingVariants.${idx}.name`)}
            required
          />
          <ul className="mt-4 space-y-3">
            {optionsFields.fields.map((f, j) => (
              <div key={f.id}>
                <label htmlFor={`${f.id}-${f.code}`}>
                  {configurableOptions.get(f.code)?.name ?? ""}
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-4 py-2"
                  id={`${f.id}-${f.code}`}
                  {...register(`existingVariants.${idx}.options.${j}.valueId`, {
                    valueAsNumber: true,
                  })}
                >
                  {configurableOptions.get(f.code)?.values.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex justify-end">
          <DeleteButton onClick={onDelete} />
        </div>
      </div>
    </div>
  );
}

function GeneratedVariantField({
  register,
  control,
  nameErr,
  idx,
  configurableOptions,
  onDelete,
}: {
  register: UseFormRegister<FormSchema>;
  control: Control<FormSchema, any>;
  nameErr?: FieldError;
  idx: number;
  configurableOptions: Map<
    string,
    {
      code: string;
      values: {
        value: string;
        id: number;
      }[];
      name: string;
    }
  >;
  onDelete: () => void;
}) {
  const optionsFields = useFieldArray({
    control,
    name: `generatedVariants.${idx}.options`,
  });

  return (
    <div className="generate-variant-list-item">
      <div className="w-full rounded-md border border-gray-300 px-5 pb-6 pt-4">
        <p className="mb-4 font-semibold">Product variant {idx + 1}</p>
        <div className="pt-3">
          <InputField
            label="Name"
            id="name"
            error={nameErr}
            type="text"
            registration={register(`generatedVariants.${idx}.name`)}
            required
          />
          <ul className="mt-4 space-y-3">
            {optionsFields.fields.map((f, j) => (
              <div key={f.id}>
                <label htmlFor={`${f.id}-${f.code}`}>
                  {configurableOptions.get(f.code)?.name ?? ""}
                </label>
                <select
                  className="mt-1 w-full rounded-md border border-gray-300 bg-white px-4 py-2"
                  id={`${f.id}-${f.code}`}
                  {...register(
                    `generatedVariants.${idx}.options.${j}.valueId`,
                    {
                      valueAsNumber: true,
                    }
                  )}
                >
                  {configurableOptions.get(f.code)?.values.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </ul>
        </div>
        <div className="mt-10 flex justify-end">
          <DeleteButton onClick={onDelete} />
        </div>
      </div>
    </div>
  );
}
