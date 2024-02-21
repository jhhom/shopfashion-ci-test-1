import { Fragment, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { clsx as cx } from "clsx";
import { IconCaretDown, IconCheck } from "~/pages/common/Icons";
import {
  Control,
  Controller,
  FieldError,
  FieldPath,
  FieldValues,
} from "react-hook-form";

type Option<T extends React.Key> = {
  label: string;
  value: T;
};

type ComboFieldProps<
  T extends React.Key,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = any,
> = {
  label: string;
  name: TName;
  options: Option<T>[];
  placeholder?: string;
  defaultValue?: string;
  id?: string;
  error?: FieldError | undefined;
  className?: string;
  required?: boolean;
  control: Control<TFieldValues, TContext>;
};

export function ComboboxField<
  T extends React.Key,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = any,
>(props: ComboFieldProps<T, TFieldValues, TName, TContext>) {
  const [query, setQuery] = useState("");

  const { options, name, label, className, id, control, error, required } =
    props;

  const filteredOptions =
    query === ""
      ? options
      : options.filter((op) =>
          op.label
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, "")),
        );

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={cx(className)}>
          <label className="block" htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <Combobox {...field}>
            <div className="relative mt-1">
              <div
                aria-errormessage={error?.message}
                className="relative w-full cursor-default overflow-hidden rounded-md border border-gray-300
         bg-white text-left text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75
         focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 aria-[errormessage]:border-red-500 aria-[errormessage]:ring-red-500"
              >
                <Combobox.Input
                  className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                  displayValue={(op) =>
                    options.find((o) => o.value === op)?.label ?? ""
                  }
                  onChange={(event) => setQuery(event.target.value)}
                />
                <Combobox.Button className="absolute inset-y-0 right-0 flex items-center border-l border-gray-300 bg-gray-100 px-3">
                  <IconCaretDown
                    className="h-3.5 w-3.5 text-gray-400"
                    aria-hidden="true"
                  />
                </Combobox.Button>
              </div>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setQuery("")}
              >
                <Combobox.Options
                  className="absolute z-10 mt-1 w-full overflow-auto 
          rounded-md border border-gray-300 bg-white py-1
          text-sm ring-1 ring-black/5 focus:outline-none"
                >
                  {filteredOptions.length === 0 && query !== "" ? (
                    <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                      Nothing found.
                    </div>
                  ) : (
                    filteredOptions.map((op) => (
                      <Combobox.Option
                        key={op.value}
                        className={({ active }) =>
                          `relative cursor-pointer select-none py-2 pl-4 pr-4 ${
                            active ? "bg-sky-500 text-white" : "text-gray-900"
                          }`
                        }
                        value={op.value}
                      >
                        {({
                          selected,
                          active,
                        }: {
                          selected: boolean;
                          active: boolean;
                        }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {op.label}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 right-4 flex items-center pl-3 ${
                                  active ? "text-white" : "text-white"
                                }`}
                              >
                                <IconCheck
                                  className="h-3.5 w-3.5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))
                  )}
                </Combobox.Options>
              </Transition>
            </div>
          </Combobox>
          {error?.message && (
            <div
              role="alert"
              aria-label={error.message}
              className="mt-1 text-sm text-red-500"
            >
              {error.message}
            </div>
          )}
        </div>
      )}
    />
  );
}
