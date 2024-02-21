import { Fragment, useState } from "react";

import { ProductOptionsTable } from "~/pages/Options/ProductOptionsListing/components";
import { PageTitle } from "~/pages/common/components/PageTitle";
import { IconAddThick } from "~/pages/common/Icons";

import { Link } from "@tanstack/react-router";
import {
  TableFilterAccordion,
  FilterInputField,
} from "~/pages/common/components/Table/TableFilter";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import {
  useDeleteProductOption,
  useListProductOptions,
} from "~/pages/Options/api";

import { IconX } from "~/pages/common/Icons";
import { Transition, Dialog } from "@headlessui/react";

export function ProductOptionsListingPage() {
  const [searchOptionName, setSearchOptionName] = useState("");

  const optionsQuery = useListProductOptions(searchOptionName);

  const deleteProductOptionMutation = useDeleteProductOption();

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    name: string;
    optionCode: string;
  }>({
    open: false,
    name: "",
    optionCode: "",
  });

  if (optionsQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="display product options"
        failed="load product options data"
      />
    );
  }

  if (!optionsQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <PageTitle
          title={"Product options"}
          description="Manage configuration options of your product"
        />
        <Link
          to="/options/new"
          className="flex h-10 items-center rounded-md bg-teal-500 pr-4 text-sm text-white"
        >
          <span className="flex h-10 w-10 items-center justify-center">
            <IconAddThick className="h-5 w-5" />
          </span>
          <span>Create</span>
        </Link>
      </div>

      <TableFilterAccordion
        marginTop="mt-8"
        onFilter={(optionName) => setSearchOptionName(optionName)}
        defaultFilter=""
      >
        {(optionName, setOptionName) => (
          <FilterInputField
            label="Option name"
            type="text"
            value={optionName}
            onChange={(e) => setOptionName(e.target.value)}
          />
        )}
      </TableFilterAccordion>

      <div className="pb-10">
        <ProductOptionsTable
          productOptions={optionsQuery.data}
          onDeleteOption={(name, optionCode) =>
            setDeleteDialog({ open: true, name, optionCode })
          }
        />
      </div>

      <DeleteProductOptionDialog
        optionName={deleteDialog.name}
        open={deleteDialog.open}
        onClose={() => setDeleteDialog((d) => ({ ...d, open: false }))}
        onDelete={() => {
          deleteProductOptionMutation.mutate(deleteDialog.optionCode);
          setDeleteDialog((d) => ({ ...d, open: false }));
        }}
      />
    </>
  );
}

function DeleteProductOptionDialog(props: {
  optionName: string;
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
                    Delete product option
                  </Dialog.Title>
                  <button
                    onClick={props.onClose}
                    className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-gray-100"
                  >
                    <IconX className="h-3.5 w-3.5 text-gray-500" />
                  </button>
                </div>

                <div className="mt-4 text-sm">
                  <div className="mt-0.5">
                    Are you sure you want to delete product option
                    <span className="block italic">{props.optionName}</span>
                  </div>
                  <p className="mt-2">
                    All of the data related to the product option will be
                    deleted, including:
                  </p>
                  <p className="mt-2">
                    All the product variants and order items associated with the
                    options
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
