import { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { useState } from "react";
import * as Collapsible from "@radix-ui/react-collapsible";

import {
  IconCaretDown,
  IconFilter,
  IconMagnifyingGlassThicker600Weight,
} from "~/pages/common/Icons";
import { clsx as cx } from "clsx";

export function TableFilterAccordion<T>(props: {
  marginTop?: string;
  open?: boolean;
  onFilter: (filter: T) => void;
  children: (
    filter: T,
    setFilter: React.Dispatch<React.SetStateAction<T>>,
  ) => JSX.Element;
  defaultFilter: T;
}) {
  const [filter, setFilter] = useState<T>(props.defaultFilter);
  const [open, setOpen] = useState(
    props.open !== undefined ? props.open : true,
  );

  return (
    <Collapsible.Root
      className={cx(props.marginTop)}
      open={open}
      onOpenChange={setOpen}
    >
      <div className="bg-white">
        <Collapsible.Trigger asChild>
          <button className="flex h-12 w-full items-center rounded-t-md border border-gray-300 pl-4 text-sm font-semibold text-black">
            <span className="flex h-12 w-6 items-center justify-center">
              <IconCaretDown
                className={cx(
                  "duration-400 h-3.5 w-3.5  transition-transform",
                  { "rotate-0": open },
                  { "-rotate-90": !open },
                )}
              />
            </span>
            <span className="ml-1 flex h-12 w-5 items-center justify-center">
              <IconFilter className="h-5 w-5" />
            </span>
            <span className="ml-2">Filters</span>
          </button>
        </Collapsible.Trigger>
      </div>

      <Collapsible.Content className="data-[state=closed] overflow-hidden shadow-o-md duration-200 ease-out data-[state=closed]:animate-slide-up data-[state=open]:animate-slide-down">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            props.onFilter(filter);
          }}
        >
          <div className="border border-t-0 border-gray-300 bg-white px-5 py-6 text-sm">
            {props.children(filter, setFilter)}

            <div className="mt-6">
              <button
                type="submit"
                className="flex h-9 items-center rounded-md bg-blue-500 pl-2 pr-5 text-white"
              >
                <span className="flex h-9 w-8 items-center justify-center">
                  <IconMagnifyingGlassThicker600Weight className="h-[1.125rem] w-[1.125rem]" />
                </span>
                <span>Filter</span>
              </button>
            </div>
          </div>
        </form>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

export function FilterInputField(props: {
  label: string;
  id?: string;
  type?: "text" | "email" | "password" | "number";
  className?: string;
  value: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["value"];
  onChange: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >["onChange"];
}) {
  const { type = "text", label, className, id, value, onChange } = props;

  return (
    <div className={className}>
      <label className="block" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 block w-full appearance-none rounded-md border border-gray-300 
          px-3 py-2 text-sm placeholder-gray-400
          shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
      />
    </div>
  );
}
