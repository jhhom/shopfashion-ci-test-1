import React, { useState, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { IconCaretDown, IconCheck } from "~/pages/common/Icons";

import { clsx as cx } from "clsx";
import {
  Controller,
  Control,
  ControllerRenderProps,
  FieldError,
  FieldPath,
  FieldValues,
  UseFormRegisterReturn,
} from "react-hook-form";

type Option<T extends React.Key> = {
  label: React.ReactNode;
  value: T;
};

type SelectFieldProps<
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

export function SelectField<
  T extends React.Key,
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
  TContext = any,
>(props: SelectFieldProps<T, TFieldValues, TName, TContext>) {
  const { options, name, label, className, id, control, error, required } =
    props;

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className={className}>
          <label className="block" htmlFor={id}>
            {label} {required && <span className="text-red-500">*</span>}
          </label>
          <Listbox {...field}>
            <div className="relative mt-1">
              <Listbox.Button
                className={cx(
                  "relative h-10 w-full cursor-default rounded-md border border-gray-300",
                  "bg-white pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500",
                  "focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2",
                  "focus-visible:ring-offset-orange-300 sm:text-sm",
                  { "border-red-500 ring-red-500": error !== undefined },
                )}
              >
                <span className="block truncate">
                  {options.find((o) => o.value === field.value)?.label}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <IconCaretDown className="h-3 w-3 text-gray-500" />
                </span>
              </Listbox.Button>
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className="absolute z-10 mt-1 w-full overflow-auto rounded-md border 
        border-gray-300 bg-white py-1 text-sm ring-1 ring-black/5 focus:outline-none"
                >
                  {options.map((op) => (
                    <Listbox.Option
                      key={op.value}
                      className="relative cursor-default select-none bg-white py-2 pl-4 pr-4 text-gray-900 hover:bg-sky-100 hover:text-sky-800"
                      value={op.value}
                    >
                      {({ selected }: { selected: boolean }) => (
                        <>
                          <span
                            className={`block truncate ${
                              selected ? "font-medium" : "font-normal"
                            }`}
                          >
                            {op.label}
                          </span>
                          {selected ? (
                            <span className="absolute inset-y-0 right-4 flex items-center pl-3 text-sky-600">
                              <IconCheck
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </Listbox>
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
    ></Controller>
  );
}
