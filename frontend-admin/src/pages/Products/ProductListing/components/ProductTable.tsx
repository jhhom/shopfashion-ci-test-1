import React, { Fragment, useMemo, useState } from "react";
import {
  IconMagnifyingGlass,
  IconPencil,
  IconThrashCan,
  IconAddThick,
  IconList,
  IconShuffle,
  IconCubes,
} from "~/pages/common/Icons";
import { clsx as cx } from "clsx";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";
import { Menu, Transition } from "@headlessui/react";
import { ProductType } from "@api-contract/common";

import { setHasAllElements } from "~/utils/utils";
import { Table } from "~/pages/common/components/Table/Table";

type Product = {
  id: number;
  name: string;
  type: ProductType;
};

const columnHelper = createColumnHelper<Product>();

export function ProductTable({
  selectedRows,
  ...props
}: {
  products: Product[];
  onDeleteProduct: (id: number, name: string) => void;
  selectedRows: Set<number>;
}) {
  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        cell: (info) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedRows.has(info.row.original.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  selectedRows.add(info.row.original.id);
                } else {
                  selectedRows.delete(info.row.original.id);
                }
              }}
            />
          </div>
        ),
        header: () => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              disabled={props.products.length === 0}
              checked={
                setHasAllElements(
                  selectedRows,
                  props.products.map((d) => d.id),
                ) && props.products.length !== 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  props.products.forEach((p) => selectedRows.add(p.id));
                } else {
                  selectedRows.clear();
                }
              }}
            />
          </div>
        ),
        meta: {
          headerProps: {
            className: "w-[80px]",
          },
          cellProps: {
            className: "w-[80px]",
          },
        },
      }),
      columnHelper.accessor("name", {
        id: "Name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        meta: {
          headerProps: {
            className: "w-[37%]",
          },
          cellProps: {
            className: "w-[37%]",
          },
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (i) => (
          <div>
            <ButtonGroup
              productId={i.row.original.id}
              onDelete={() =>
                props.onDeleteProduct(i.row.original.id, i.row.original.name)
              }
            />
            {i.row.original.type === "CONFIGURABLE" && (
              <>
                <div className="pr-3">
                  <hr className="my-3 border-gray-300" />
                </div>
                <ManageVariantsDropdown productId={i.row.original.id} />
              </>
            )}
          </div>
        ),
        header: () => <span>Actions</span>,
        meta: {
          headerProps: {
            className: "w-[63%-80px]",
          },
          cellProps: {
            className: "w-[63%-80px]",
          },
        },
      }),
    ],
    [selectedRows, props.products],
  );

  return <Table className="py-2" data={props.products} columns={columns} />;
}

function ButtonGroup(props: { productId: number; onDelete: () => void }) {
  return (
    <div className="flex">
      <Link
        to="/products/$productId"
        params={{
          productId: props.productId.toString(),
        }}
        className={cx(
          "flex h-9 items-center rounded-l-md bg-gray-200 pl-1 pr-4 text-sm text-gray-500 hover:bg-gray-300",
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconMagnifyingGlass className="h-3.5 w-3.5" />
        </span>
        <span>Details</span>
      </Link>
      <Link
        to="/products/$productId/edit"
        params={{
          productId: props.productId.toString(),
        }}
        className={cx(
          "flex h-9 items-center bg-gray-200 pl-1 pr-4 text-sm text-gray-500 hover:bg-gray-300",
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
          "flex h-9 items-center rounded-r-md bg-red-500 pl-1 pr-4 text-sm text-white",
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

function ManageVariantsDropdown(props: { productId: number }) {
  return (
    <Menu>
      <div className="relative">
        <Menu.Button
          className="flex h-9 w-44 items-center justify-center
        rounded-md bg-gray-200 text-gray-500 hover:bg-gray-300"
        >
          <span className="flex h-9 w-8 items-center pl-0.5 pt-0.5">
            <IconCubes className="h-4 text-gray-500" />
          </span>
          <span className="text-gray-500">Manage variants</span>
        </Menu.Button>

        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute left-0 top-8 z-10 mt-2 w-44 origin-top-right rounded-md border border-gray-300 bg-white p-1  text-sm shadow-lg shadow-o-md ring-1 ring-black ring-opacity-5 focus:outline-none">
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/products/$productId/variants"
                  params={{
                    productId: props.productId.toString(),
                  }}
                  className="flex h-10 w-full items-center rounded-md pl-1 text-left hover:bg-gray-100"
                >
                  <span className="flex h-10 w-10 items-center justify-center">
                    <IconList className="h-[1.125rem] w-[1.125rem] text-gray-500" />
                  </span>
                  <span className="pl-1">List variants</span>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/products/$productId/variants/new"
                  params={{
                    productId: props.productId.toString(),
                  }}
                  className="flex h-10 w-full items-center rounded-md pl-1 text-left hover:bg-gray-100"
                >
                  <span className="flex h-10 w-10 items-center justify-center">
                    <IconAddThick className="h-5 w-5 text-gray-500" />
                  </span>
                  <span className="pl-1">Create</span>
                </Link>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <Link
                  to="/products/$productId/variants/generate"
                  params={{
                    productId: props.productId.toString(),
                  }}
                  className="flex h-10 w-full items-center rounded-md pl-1 text-left hover:bg-gray-100"
                >
                  <span className="flex h-10 w-10 items-center justify-center">
                    <IconShuffle className="h-5 w-5 text-gray-500" />
                  </span>
                  <span className="pl-1">Generate</span>
                </Link>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </div>
    </Menu>
  );
}
