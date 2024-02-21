import React, { Fragment, useMemo, useState } from "react";
import { IconPencil, IconThrashCan, IconX } from "~/pages/common/Icons";
import { clsx as cx } from "clsx";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";

import { DeleteButton } from "~/pages/common/components/Buttons";
import { Dialog, Transition } from "@headlessui/react";
import { Table } from "~/pages/common/components/Table/Table";

type ProductAssociation = {
  id: number;
  name: string;
};

const defaultData: ProductAssociation[] = [{ id: 1, name: "Similar products" }];

const columnHelper = createColumnHelper<ProductAssociation>();

export function ProductAssociationsTable(props: {
  productAssociations: ProductAssociation[];
  onDeleteAssociation: (id: number) => void;
}) {
  const [selectedRows, setSelectedRows] = useState(new Set<number>());

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    name: "",
    id: 0,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        id: "Name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        meta: {
          headerProps: {
            className: "w-[50%]",
          },
          cellProps: {
            className: "w-[50%]",
          },
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (i) => (
          <ButtonGroup
            productAssociationTypeId={i.row.original.id}
            onDelete={() => {
              setDeleteDialog({
                open: true,
                name: i.row.original.name,
                id: i.row.original.id,
              });
            }}
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
    [props.onDeleteAssociation],
  );

  return (
    <div className="p-2">
      <div className="py-7">
        <DeleteButton disabled={selectedRows.size === 0} />
      </div>
      <Table data={props.productAssociations} columns={columns} />
      <DeleteProductAssociationDialog
        associationName={deleteDialog.name}
        open={deleteDialog.open}
        onClose={() => setDeleteDialog((d) => ({ ...d, open: false }))}
        onDelete={() => {
          props.onDeleteAssociation(deleteDialog.id);
          setDeleteDialog((d) => ({ ...d, open: false }));
        }}
      />
    </div>
  );
}

function ButtonGroup(props: {
  productAssociationTypeId: number;
  onDelete: () => void;
}) {
  return (
    <div className="flex">
      <Link
        to="/product-associations/$productAssociationTypeId/edit"
        params={{
          productAssociationTypeId: props.productAssociationTypeId.toString(),
        }}
        className={cx(
          "flex h-9 items-center rounded-l-md bg-gray-200 pl-1 pr-4 text-sm text-gray-500",
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

function DeleteProductAssociationDialog(props: {
  associationName: string;
  open: boolean;
  onClose: () => void;
  onDelete: () => void;
}) {
  return (
    <Transition appear show={props.open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={props.onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Delete product association
                  </Dialog.Title>
                  <button
                    onClick={props.onClose}
                    className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
                  >
                    <IconX className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>

                <div className="mt-4">
                  <p className="mt-0.5">
                    Are you sure you want to delete product association:{" "}
                    {props.associationName}?
                  </p>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={props.onDelete}
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
