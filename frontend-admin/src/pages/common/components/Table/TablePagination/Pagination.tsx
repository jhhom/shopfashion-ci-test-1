import React, { Fragment, useState } from "react";
import { clsx as cx } from "clsx";
import { Listbox, Transition } from "@headlessui/react";

import { PaginationParameters } from "~/utils/pagination";
import { paginationToItems } from "~/pages/common/components/Table/TablePagination/pagination-utils";
import { IconCaretDown, IconCheck } from "~/pages/common/Icons";

export function useTablePagination(props: {
  pageNumber: number;
  pageSize: number;
}) {
  const [pagination, setPagination] = useState<PaginationParameters>(props);

  return {
    currentPage: pagination.pageNumber,
    onGotoPage: (pageNumber: number) =>
      setPagination((p) => ({ ...p, pageNumber })),
    onPreviousPage: () =>
      setPagination((p) => ({
        ...p,
        pageNumber: p.pageNumber - 1,
      })),
    onNextPage: () =>
      setPagination((p) => ({
        ...p,
        pageNumber: p.pageNumber + 1,
      })),
    pageSize: pagination.pageSize,
    onChangePageSize: (pageSize: number) =>
      setPagination({ pageNumber: 1, pageSize }),
    pagination,
  };
}

export function TablePagination(props: {
  totalPages: number;
  currentPage: number;
  onGoToPage: (pageNumber: number) => void;
  onPreviousPage: () => void;
  onNextPage: () => void;
  onChangePageSize: (size: number) => void;
  pageSize: number;
  className?: string;
  pageSizeSelectClassName?: string;
}) {
  const {
    className,
    pageSizeSelectClassName,
    onChangePageSize,
    pageSize,
    onNextPage,
    onPreviousPage,
    currentPage,
    totalPages,
    ...paginationProps
  } = props;

  return (
    <div className={cx("flex justify-between", className)}>
      <Pagination
        totalItems={5}
        onNext={onNextPage}
        onPrevious={onPreviousPage}
        totalPages={totalPages < 1 ? 1 : totalPages}
        currentPage={currentPage < 1 ? 1 : currentPage}
        {...paginationProps}
      />
      <PageSizeSelect
        className={pageSizeSelectClassName}
        onChange={onChangePageSize}
        value={pageSize}
      />
    </div>
  );
}

export function Pagination(props: {
  totalPages: number;
  currentPage: number;
  totalItems: number;
  onGoToPage: (pageNumber: number) => void;
  onPrevious: () => void;
  onNext: () => void;
}) {
  const items = paginationToItems({
    totalPages: props.totalPages,
    currentPage: props.currentPage,
    totalItems: props.totalItems,
  });

  const previousDisabled = props.currentPage === 1;
  const nextDisabled = props.currentPage === props.totalPages;

  return (
    <div>
      <div className="flex text-sm">
        <button
          onClick={props.onPrevious}
          disabled={previousDisabled}
          className={cx(
            "h-10 rounded-l-md border-b border-l border-t border-gray-300 bg-white px-3",
            {
              "cursor-not-allowed border-gray-300 text-gray-400/60":
                previousDisabled,
            },
          )}
        >
          Previous
        </button>
        {items.map((i, idx) => {
          if (i.type === "break") {
            return (
              <button
                key={`break-${idx}`}
                className="h-10 w-10 cursor-default border-b border-l border-t border-gray-300 bg-white"
              >
                ...
              </button>
            );
          } else {
            return (
              <button
                key={i.page}
                className={cx(
                  "h-10 w-10 border-b border-l border-t border-gray-300",
                  {
                    "bg-gray-200": i.active,
                    "bg-white": !i.active,
                  },
                )}
                onClick={() => props.onGoToPage(i.page)}
              >
                {i.page}
              </button>
            );
          }
        })}
        <button
          onClick={props.onNext}
          disabled={nextDisabled}
          className={cx(
            "h-10 rounded-r-md border border-gray-300 bg-white px-3",
            {
              "cursor-not-allowed border-gray-300 text-gray-400/60":
                nextDisabled,
            },
          )}
        >
          Next
        </button>
      </div>
    </div>
  );
}

const pageSizes = [
  { label: "Show 10", value: 10 },
  { label: "Show 25", value: 25 },
  { label: "Show 50", value: 50 },
];

export function PageSizeSelect(props: {
  className?: string;
  value: number;
  onChange: (pageSize: number) => void;
}) {
  const pageSize = pageSizes.find((p) => p.value === props.value);
  if (pageSize === undefined) {
    throw new Error("Page size can only be either 10, 25, or 50");
  }

  return (
    <Listbox onChange={(e) => props.onChange(e.value)} value={pageSize}>
      <div className={cx("relative", props.className)}>
        <Listbox.Button
          className={cx(
            "relative h-10 w-full cursor-default rounded-md border border-gray-300",
            "bg-white pl-3 pr-10 text-left focus:outline-none focus-visible:border-indigo-500",
            "focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2",
            "focus-visible:ring-offset-orange-300 sm:text-sm",
          )}
        >
          <span className="block truncate">{pageSize.label}</span>
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
            {pageSizes.map((op) => (
              <Listbox.Option
                key={op.value}
                className="relative cursor-default select-none bg-white py-2 pl-4 pr-4 text-gray-900 hover:bg-gray-100"
                value={op}
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
                      <span className="absolute inset-y-0 right-4 flex items-center pl-3 text-gray-600">
                        <IconCheck className="h-3.5 w-3.5" aria-hidden="true" />
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
  );
}
