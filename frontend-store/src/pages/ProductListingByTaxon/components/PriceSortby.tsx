import { Popover, Transition, Listbox } from "@headlessui/react";
import { Fragment, useState } from "react";
import { IconCheckCircle, IconChevronDown } from "~/pages/common/Icons";

type SortOrder = "asc" | "desc";

const sortOrderNames = {
  asc: "Price: Low to high",
  desc: "Price: High to low",
};

export function PriceSortby({
  order,
  onSetOrder,
}: {
  order: SortOrder;
  onSetOrder: (v: SortOrder) => void;
}) {
  const selected = {
    order,
    label: sortOrderNames[order],
  };
  return (
    <Listbox value={selected} onChange={(v) => onSetOrder(v.order)}>
      <div className="relative w-[180px]">
        <Listbox.Button className="relative w-full cursor-default rounded-lg py-2 pl-3 text-left font-bold text-teal-600 sm:text-sm">
          <span className="block truncate">{selected.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <IconCheckCircle
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          enter="transition duration-100 ease-out"
          enterFrom="transform scale-95 opacity-0"
          enterTo="transform scale-100 opacity-100"
          leave="transition duration-75 ease-out"
          leaveFrom="transform scale-100 opacity-100"
          leaveTo="transform scale-95 opacity-0"
        >
          <Listbox.Options
            static
            className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            {Object.entries(sortOrderNames).map(([order, label]) => (
              <Listbox.Option
                key={order}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-3 pr-4 ${
                    active ? "bg-teal-100 text-teal-700" : "text-gray-900"
                  }`
                }
                value={{ order, label }}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? "font-medium" : "font-normal"
                      }`}
                    >
                      {label}
                    </span>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}

export function PopoverSample() {
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button className="flex font-semibold text-teal-600">
            <span>Most popular</span>
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
            <Popover.Panel className="absolute left-0 z-10 mt-3 w-[240px] px-4 sm:px-0 ">
              <div className="overflow-hidden rounded-lg shadow-lg">
                <p>haha</p>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}
