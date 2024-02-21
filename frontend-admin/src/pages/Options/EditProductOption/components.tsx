import React, { useState, useRef, useEffect, Fragment } from "react";
import { z } from "zod";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Button,
  Dialog,
  DialogTrigger,
  Heading,
  Input,
  Label,
  Modal,
  TextField,
} from "react-aria-components";
import { Form } from "~/pages/common/components/Form/Form";
import {
  IconCheck,
  IconFloppyDisk,
  IconPencil,
  IconSquarePlus,
  IconX,
} from "~/pages/common/Icons";
import { Result } from "neverthrow";
import { InputField } from "~/pages/common/components/Form/InputField";

const formSchema = z.object({
  productOptionName: z.string().min(1, "Product option name is required"),
  position: z
    .number()
    .int("Position has to be an integer")
    .positive("Position has to be a positive integer")
    .nullable(),
  editedProductOptionValues: z.array(
    z.object({
      id: z.number(),
      name: z.string().min(1, "Name of product option value is required"),
    })
  ),
  newProductOptionValues: z.array(
    z.object({
      name: z.string().min(1, "Name of the product option value is required"),
    })
  ),
});

type FormSchema = z.infer<typeof formSchema>;

type EditProductOptionFormProps = {
  defaultFormValues: FormSchema;
  onSaveChanges: (formValues: FormSchema) => Promise<unknown>;
  onDeleteProductOptionValue: (
    optionValueId: number
  ) => Promise<Result<unknown, unknown>>;
  onCancel: () => void;
};

// has to use a React.memo on this to prevent re-rendering when `defaultFormValues` doesn't change
// have to use deep comparison for `props.defaultFormValues`, by default React use shallow comparison for props
// which re-rendering will trigger unwanted side effects of modifying the form values
export function EditProductOptionForm(props: EditProductOptionFormProps) {
  return (
    <div className="pb-10">
      <Form
        schema={formSchema}
        onSubmit={(v) => {
          props.onSaveChanges(v);
        }}
        className="mt-2 rounded-md border border-gray-300 pb-5"
        options={{
          defaultValues: props.defaultFormValues,
        }}
      >
        {({
          register,
          handleSubmit,
          control,
          watch,
          setValue,
          formState: { errors },
        }) => {
          const editedOptions = useFieldArray({
            control,
            name: "editedProductOptionValues",
          });

          const newProductOptionValues = useFieldArray({
            control,
            name: "newProductOptionValues",
          });

          const editedOptionValues = watch("editedProductOptionValues");

          return (
            <>
              <div className="mt-5 px-5 text-sm">
                <InputField
                  label="Product option name"
                  id="name"
                  error={errors["productOptionName"]}
                  type="text"
                  registration={register("productOptionName")}
                  required
                />

                <InputField
                  className="mt-5 w-[300px]"
                  label="Position"
                  id="position"
                  error={errors["position"]}
                  type="number"
                  registration={register("position", {
                    setValueAs: (v) =>
                      v === "" || Number.isNaN(v) ? null : parseInt(v),
                  })}
                />
              </div>

              <div className="mt-10 space-y-4 px-5 text-sm">
                {editedOptions.fields.map((field, i) => {
                  const err = errors?.editedProductOptionValues
                    ? errors?.editedProductOptionValues[i]
                    : undefined;

                  const { ref: formFieldRef, ...formFieldRegister } = register(
                    `editedProductOptionValues.${i}.name`
                  );

                  return (
                    <Fragment key={field.id}>
                      <EditedOptionField
                        {...formFieldRegister}
                        fRef={formFieldRef}
                        errorMessage={err?.name?.message}
                        onDelete={async () => {
                          const r = await props.onDeleteProductOptionValue(
                            editedOptionValues[i].id
                          );
                          if (r.isOk()) {
                            editedOptions.remove(i);
                          }
                        }}
                        optionIdx={i}
                        optionName={field.name}
                      />
                    </Fragment>
                  );
                })}
              </div>

              <hr className="mt-10 border-gray-300" />

              <div className="mt-6 space-y-4 px-5 text-sm">
                <div className="flex justify-between">
                  <p className="font-semibold">New options</p>

                  <button
                    onClick={() => {
                      newProductOptionValues.append({ name: "" });
                    }}
                    type="button"
                    className="flex h-10 items-center justify-center rounded-md bg-gray-200 pl-1 pr-4"
                  >
                    <span className="flex h-10 w-10 items-center justify-center text-gray-400">
                      <IconSquarePlus className="h-[1.125rem] w-[1.125rem]" />
                    </span>
                    <span>Add value</span>
                  </button>
                </div>
                {newProductOptionValues.fields.map((field, i) => {
                  const err = errors?.newProductOptionValues
                    ? errors?.newProductOptionValues[i]
                    : undefined;

                  return (
                    <Fragment key={field.id}>
                      <div>
                        <div className="flex-grow">
                          <p>
                            Option value {i + 1}
                            <span className="text-red-500"> *</span>
                          </p>
                          <div className="flex">
                            <input
                              {...register(`newProductOptionValues.${i}.name`)}
                              className="mt-1  w-full rounded-md border border-gray-300 px-3 py-2"
                              type="text"
                            />
                            <div className="flex basis-[50px] items-end">
                              <button
                                type="button"
                                className="ml-auto flex h-[40px] w-[40px] items-center justify-center rounded-md bg-red-100 text-red-500"
                                onClick={() => newProductOptionValues.remove(i)}
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
                    </Fragment>
                  );
                })}
              </div>

              <div className="mt-10 flex justify-end px-5  text-sm">
                <button
                  type="submit"
                  className="flex h-10 items-center rounded-l-md bg-teal-500 pl-1 pr-4 text-white"
                >
                  <span className="flex h-10 w-10 items-center justify-center">
                    <IconFloppyDisk className="h-[1.125rem] w-[1.125rem]" />
                  </span>
                  <span>Save changes</span>
                </button>
                <button
                  type="button"
                  onClick={props.onCancel}
                  className="h-10 rounded-r-md bg-gray-200 px-4"
                >
                  Cancel
                </button>
              </div>
            </>
          );
        }}
      </Form>
    </div>
  );
}

function EditedOptionField(props: {
  optionIdx: number;
  optionName: string;
  disabled?: boolean;
  name: string;
  max?: string | number;
  maxLength?: number;
  min?: string | number;
  minLength?: number;
  required?: boolean;
  pattern?: string;
  onBlur: React.FocusEventHandler<HTMLInputElement> | undefined;
  onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
  onDelete: () => Promise<void>;
  fRef: React.RefCallback<HTMLInputElement>;
  errorMessage: string | undefined;
}) {
  const [enable, setEnable] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [enable]);

  return (
    <div className="flex-grow">
      <p>
        Option value {props.optionIdx + 1}
        <span className="text-red-500"> *</span>
      </p>
      <div className="flex">
        <div className="mt-1 w-full">
          <input
            ref={(r) => {
              if (r) {
                props.fRef(r);
                inputRef.current = r;
              }
            }}
            name={props.name}
            max={props.max}
            maxLength={props.maxLength}
            min={props.min}
            minLength={props.minLength}
            required={props.required}
            pattern={props.pattern}
            onChange={props.onChange}
            onBlur={props.onBlur}
            disabled={!enable}
            className="w-full rounded-md border border-gray-300 px-3 py-2 ring-blue-500 ring-offset-1 focus:outline-none focus:ring-2 disabled:text-gray-400"
            type="text"
          />
        </div>

        <div className="flex basis-[200px] items-end">
          <button
            type="button"
            className="ml-auto flex h-10 items-center justify-center rounded-md bg-gray-200 pl-1 pr-4"
            onClick={() => {
              setEnable(!enable);
            }}
          >
            {enable ? (
              <>
                <span className="flex h-10 w-8 items-center justify-center">
                  <IconCheck className="h-3.5 w-3.5" />
                </span>
                <span className="">Done</span>
              </>
            ) : (
              <>
                <span className="flex h-10 w-8 items-center justify-center">
                  <IconPencil className="h-3.5 w-3.5" />
                </span>
                <span>Edit</span>
              </>
            )}
          </button>

          <DialogTrigger>
            <Button
              type="button"
              className="ml-2 flex h-10 w-[60px] items-center justify-center rounded-md bg-red-100 text-red-500"
            >
              <span>Delete</span>
            </Button>
            <Modal
              className="
            fixed left-0 top-0 flex h-screen w-screen items-start justify-center bg-gray-900/30
            data-[entering]:animate-dialog-show data-[exiting]:animate-dialog-hide data-[entering]:duration-200
            data-[exiting]:duration-150 data-[entering]:ease-in
          "
            >
              <Dialog
                className="relative top-[8rem] rounded-md 
          border border-gray-300 bg-white pb-6 pl-5 pr-6 pt-5
          shadow-o-md duration-200"
              >
                {({ close }: { close: () => void }) => (
                  <div>
                    <Heading className="text-lg">
                      Delete Product Option Value
                    </Heading>
                    <p className="mt-2 text-sm">
                      Are you sure you want to delete the product option value:
                    </p>
                    <p className="italic">{props.optionName}</p>

                    <div className="mt-10 flex justify-end text-sm">
                      <Button
                        className="mr-4 rounded-md border border-gray-300 px-4 py-2"
                        onPress={close}
                        type="button"
                      >
                        Cancel
                      </Button>
                      <Button
                        className="rounded-md bg-red-500 px-4 py-2 text-white"
                        type="button"
                        onPress={async () => {
                          await props.onDelete();
                          close();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Dialog>
            </Modal>
          </DialogTrigger>
        </div>
      </div>

      {props.errorMessage && (
        <p className="mt-0.5 text-red-500">{props.errorMessage}</p>
      )}
    </div>
  );
}
