import { Popover, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IconCheckCircle, IconChevronDown } from "~/pages/common/Icons";

import { clsx as cx } from "clsx";
import { twMerge } from "tailwind-merge";
import React from "react";
import { UseFormRegisterReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const prices = [
  "RM 20 - 40",
  "RM 40 - 70",
  "RM 70 - 100",
  "RM 100 - 150",
  "RM 150 - 200",
  "RM 200+",
];

export function PriceFilterInput({
  className,
  placeholder,
  registration,
}: {
  className?: string;
  placeholder?: string;
  registration: UseFormRegisterReturn;
}) {
  return (
    <input
      type="text"
      className={cx(
        "app-number-input rounded-sm border border-gray-300 px-2 py-1",
        className,
      )}
      placeholder={placeholder}
      {...registration}
    />
  );
}

const priceFilterFormSchema = z.object({
  min: z.number().optional(),
  max: z.number().optional(),
});

export type PriceFilter = z.infer<typeof priceFilterFormSchema>;

export function DesktopPriceRangeFilter(props: {
  className?: string;
  onSubmit: (v: PriceFilter) => void;
  defaultValues: PriceFilter;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceFilter>({
    resolver: zodResolver(priceFilterFormSchema),
    defaultValues: props.defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className={props.className}>
      <p>Price Range</p>
      <div className="mt-2.5 flex justify-between rounded-sm text-sm">
        <PriceFilterInput
          className="w-20 py-2.5"
          placeholder="RM MIN"
          registration={register("min", {
            setValueAs(value) {
              if (value === "") {
                return undefined;
              }
              return Number.parseFloat(value);
            },
          })}
        />
        <div className="flex flex-grow items-center px-1.5">
          <hr className="w-full border-gray-300" />
        </div>
        <PriceFilterInput
          className="w-20 py-2.5"
          placeholder="RM MAX"
          registration={register("max", {
            setValueAs(value) {
              if (value === "") {
                return undefined;
              }
              return Number.parseFloat(value);
            },
          })}
        />
      </div>
      {(errors["max"] || errors["min"]) && (
        <div className="mt-2 text-center text-sm text-red-500">
          Please enter a valid price range
        </div>
      )}
      <button
        type="submit"
        className="mt-6 w-full rounded-md bg-teal-500 py-2.5 font-semibold uppercase text-white"
      >
        Apply
      </button>
    </form>
  );
}

export function MobilePriceRangeFilter(props: {
  className?: string;
  onSubmit: (v: PriceFilter) => void;
  defaultValues: PriceFilter;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PriceFilter>({
    resolver: zodResolver(priceFilterFormSchema),
    defaultValues: props.defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(props.onSubmit)} className={props.className}>
      <p>Price Range</p>
      <div className="mt-2.5 flex justify-between rounded-sm text-sm">
        <PriceFilterInput
          className="w-36 py-2.5"
          placeholder="RM MIN"
          registration={register("min", {
            setValueAs(value) {
              if (value === "") {
                return undefined;
              }
              return Number.parseFloat(value);
            },
          })}
        />
        <div className="flex flex-grow items-center px-1.5">
          <hr className="w-full border-gray-300" />
        </div>
        <PriceFilterInput
          className="w-36 py-2.5"
          placeholder="RM MAX"
          registration={register("max", {
            setValueAs(value) {
              if (value === "") {
                return undefined;
              }
              return Number.parseFloat(value);
            },
          })}
        />
      </div>
      {(errors["max"] || errors["min"]) && (
        <div className="mt-2 text-center text-sm text-red-500">
          Please enter a valid price range
        </div>
      )}
      <button
        type="submit"
        className="mt-6 w-full rounded-md bg-teal-500 py-2.5 font-semibold uppercase text-white"
      >
        Apply
      </button>
    </form>
  );
}

export function _PriceFilter({ priceFilters }: { priceFilters: Set<string> }) {
  return (
    <Popover className="relative">
      {({ open, close }) => (
        <>
          <Popover.Button className="w-22 flex font-semibold text-teal-600">
            <span>
              Price {priceFilters.size > 0 && `(${priceFilters.size})`}
            </span>
            <IconChevronDown
              className="ml-2 h-5 w-5 text-teal-600 transition duration-150 ease-in-out group-hover:text-opacity-80"
              aria-hidden="true"
            />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="opacity-0 translate-y-1"
            enterTo="opacity-100 translate-y-0"
            leave="transition ease-in duration-150"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 translate-y-1"
          >
            <Popover.Panel className="absolute left-0 z-10 mt-3 w-[150px] rounded-md bg-white px-4 sm:px-0 ">
              <ul className="rounded-md border border-gray-100 shadow-o-md">
                {prices.map((p) => {
                  const active = priceFilters.has(p);
                  return (
                    <li
                      key={p}
                      onClick={() => {
                        if (priceFilters.has(p)) {
                          priceFilters.delete(p);
                        } else {
                          priceFilters.add(p);
                        }
                        close();
                      }}
                      className={cx(
                        "cursor-pointer px-3 py-2 hover:bg-gray-100",
                        {
                          "text-teal-600": active,
                        },
                      )}
                    >
                      {p}
                    </li>
                  );
                })}
              </ul>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
