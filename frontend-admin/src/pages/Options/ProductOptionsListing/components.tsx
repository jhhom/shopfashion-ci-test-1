import React, { useMemo, useState } from "react";
import { IconPencil, IconThrashCan } from "~/pages/common/Icons";
import { clsx as cx } from "clsx";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { twMerge } from "tailwind-merge";

import { DeleteButton } from "~/pages/common/components/Buttons";
import { Table } from "~/pages/common/components/Table/Table";

type ProductOption = {
  code: string;
  name: string;
  position: number;
};

const columnHelper = createColumnHelper<ProductOption>();

export function ProductOptionsTable(props: {
  productOptions: ProductOption[];
  onDeleteOption: (optionName: string, optionCode: string) => void;
}) {
  const columns = useMemo(
    () => [
      columnHelper.accessor("position", {
        id: "Position",
        cell: (info) => (
          <div className="flex w-full justify-center">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
              {info.getValue()}
            </span>
          </div>
        ),
        header: () => <span>Position</span>,
        meta: {
          headerProps: {
            className: "w-[15%]",
          },
          cellProps: {
            className: "w-[15%]",
          },
        },
      }),
      columnHelper.accessor("code", {
        id: "Code",
        cell: (info) => info.getValue(),
        header: () => <span>Code</span>,
        meta: {
          headerProps: {
            className: "w-[20%]",
          },
          cellProps: {
            className: "w-[20%]",
          },
        },
      }),
      columnHelper.accessor("name", {
        id: "Name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        meta: {
          headerProps: {
            className: "w-[15%]",
          },
          cellProps: {
            className: "w-[15%]",
          },
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (i) => (
          <ButtonGroup
            optionCode={i.row.original.code}
            onDelete={() =>
              props.onDeleteOption(i.row.original.name, i.row.original.code)
            }
          />
        ),
        header: () => <span>Actions</span>,
        meta: {
          headerProps: {
            className: "w-[50%]",
          },
          cellProps: {
            className: "w-[50%]",
          },
        },
      }),
    ],
    [props.productOptions]
  );

  return (
    <div className="mt-7">
      <Table data={props.productOptions} columns={columns} />
    </div>
  );
}

function ButtonGroup(props: { optionCode: string; onDelete: () => void }) {
  return (
    <div className="flex">
      <Link
        to="/options/$optionCode/edit"
        params={{
          optionCode: props.optionCode,
        }}
        className={cx(
          "flex h-9 items-center rounded-l-md bg-gray-200 pl-1 pr-4 text-sm text-gray-500"
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconPencil className="h-3.5 w-3.5" />
        </span>
        <span>Edit</span>
      </Link>
      <button
        onClick={props.onDelete}
        className={cx(
          "flex h-9 items-center rounded-r-md bg-red-500 pl-1 pr-4 text-sm text-white"
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconThrashCan className="h-3.5 w-3.5" />
        </span>
        <span>Delete</span>
      </button>
    </div>
  );
}

function setHasAllElements<T>(s: Set<T>, els: T[]) {
  for (const e of els) {
    if (!s.has(e)) {
      return false;
    }
  }
  return true;
}
