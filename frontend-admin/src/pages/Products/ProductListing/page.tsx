import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { IconAddThick, IconCube, IconX } from "~/pages/common/Icons";

import { Fragment, useState } from "react";
import { PageTitle } from "~/pages/common/components/PageTitle";
import {
  TablePagination,
  useTablePagination,
} from "~/pages/common/components/Table/TablePagination/Pagination";
import { ProductTable } from "~/pages/Products/ProductListing/components/ProductTable";

import { Dialog, Popover, Transition } from "@headlessui/react";
import { Link, useParams } from "@tanstack/react-router";

import { DeleteButton } from "~/pages/common/components/Buttons";

import { TaxonTree } from "~/pages/Products/ProductListing/components/TaxonTreeFilter";
import {
  TableFilterAccordion,
  FilterInputField,
} from "~/pages/common/components/Table/TableFilter";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";

import { useSet } from "@uidotdev/usehooks";
import {
  useBulkDeleteProducts,
  useDeleteProduct,
  useProductListings,
  useTaxonTree,
} from "~/pages/Products/api";

export function ProductListingPage() {
  return <ProductListing taxonId={null} />;
}

export function ProductListingByTaxonPage() {
  const taxonId = Number.parseInt(
    useParams({ from: "/products/taxon/$taxonId" }).taxonId
  );

  return <ProductListing taxonId={taxonId} />;
}

function ProductListing(props: { taxonId: number | null }) {
  const { taxonId } = props;

  const pagination = useTablePagination({
    pageNumber: 1,
    pageSize: 10,
  });

  const [filter, setFilter] = useState<{
    productName: string;
  }>({
    productName: "",
  });

  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    names: string[];
    ids: number[];
  }>({
    open: false,
    names: [],
    ids: [],
  });

  const selectedRows = useSet<number>();

  const productListingQuery = useProductListings({
    pagination: pagination.pagination,
    filterProductName: filter.productName,
    taxonId: props.taxonId,
  });

  const taxonTreeQuery = useTaxonTree();

  const bulkDeleteProductsMutation = useBulkDeleteProducts();

  if (!taxonTreeQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  if (productListingQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="display products"
        failed="load products"
      />
    );
  }

  if (taxonTreeQuery.isError) {
    return (
      <UnexpectedErrorMessage intent="display products" failed="load taxons" />
    );
  }

  return (
    <div className="">
      <div className="flex items-end justify-between">
        <PageTitle
          title={"Products"}
          description="Manage your product catalog"
        />

        <CreateButton />
      </div>

      <div className="flex">
        <div className="basis-1/5">
          <div className="mt-8 border border-gray-300 bg-white pb-4 pt-2">
            <TaxonTree tree={taxonTreeQuery.data} />
          </div>
        </div>
        <div className="basis-4/5 pb-8 pl-4">
          <TableFilterAccordion
            marginTop="mt-8"
            onFilter={(productName) =>
              setFilter((f) => ({ ...f, productName }))
            }
            defaultFilter={""}
          >
            {(productName, setProductName) => {
              return (
                <FilterInputField
                  label="Product name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  type="text"
                />
              );
            }}
          </TableFilterAccordion>

          <div className="relative left-0 top-0 h-full w-full">
            {productListingQuery.data ? (
              <>
                <div className="flex py-7">
                  <DeleteButton
                    onClick={() => {
                      const selectedProds =
                        productListingQuery.data.results.filter((p) =>
                          selectedRows.has(p.id)
                        );

                      setDeleteDialog({
                        open: true,
                        names: selectedProds.map((p) => p.name),
                        ids: selectedProds.map((p) => p.id),
                      });
                    }}
                    disabled={selectedRows.size === 0}
                  />
                  <TablePagination
                    className="ml-2 flex-grow"
                    pageSizeSelectClassName="w-[140px]"
                    totalPages={
                      productListingQuery.data.paginationMeta.totalPages
                    }
                    currentPage={pagination.currentPage}
                    onGoToPage={pagination.onGotoPage}
                    onPreviousPage={pagination.onPreviousPage}
                    onNextPage={pagination.onNextPage}
                    pageSize={pagination.pageSize}
                    onChangePageSize={pagination.onChangePageSize}
                  />
                </div>

                <ProductTable
                  products={productListingQuery.data.results}
                  selectedRows={selectedRows}
                  onDeleteProduct={(id, name) =>
                    setDeleteDialog({ open: true, names: [name], ids: [id] })
                  }
                />
              </>
            ) : (
              <LoadingSpinnerOverlay />
            )}
          </div>

          <DeleteProductDialog
            productNames={deleteDialog.names}
            open={deleteDialog.open}
            onClose={() => setDeleteDialog((d) => ({ ...d, open: false }))}
            onDelete={() => {
              bulkDeleteProductsMutation.mutate(deleteDialog.ids);
              setDeleteDialog((d) => ({ ...d, open: false }));
            }}
          />
        </div>
      </div>
    </div>
  );
}

function CreateButton() {
  return (
    <Popover className="relative">
      <Popover.Button className="flex h-10 items-center rounded-md bg-teal-500 pl-3 pr-4 text-sm text-white">
        <span className="flex h-10 w-5 items-center">
          <IconAddThick />
        </span>
        <span className="ml-1.5">Create</span>
      </Popover.Button>

      <Transition
        enter="transition duration-100 ease-out"
        enterFrom="transform scale-95 opacity-0"
        enterTo="transform scale-100 opacity-100"
        leave="transition duration-75 ease-out"
        leaveFrom="transform scale-100 opacity-100"
        leaveTo="transform scale-95 opacity-0"
      >
        <Popover.Panel
          className="absolute -left-[7rem] 
        top-2 z-10 w-[210px] border
        border-gray-300 bg-white text-sm shadow-o-md"
        >
          <div className="flex items-center bg-white px-5">
            <span className="flex h-10 w-5 items-center">
              <IconCube className="h-3 w-3" />
            </span>
            <span className="ml-2 text-xs font-semibold uppercase">Type</span>
          </div>
          <div className="border-t border-gray-200 bg-white pt-1">
            <Link
              to="/products/new/simple"
              className="flex h-10 items-center pl-4 hover:bg-gray-100"
            >
              <span className="flex h-10 w-5 items-center">
                <IconAddThick className="h-5 w-5" />
              </span>
              <span className="ml-3">Simple product</span>
            </Link>
            <Link
              to="/products/new/configurable"
              className="flex h-10 items-center pl-4 hover:bg-gray-100"
            >
              <span className="flex h-10 w-5 items-center">
                <IconAddThick className="h-5 w-5" />
              </span>
              <span className="ml-3">Configurable product</span>
            </Link>
          </div>
        </Popover.Panel>
      </Transition>
    </Popover>
  );
}

function DeleteProductDialog(props: {
  productNames: string[];
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
                    Delete product
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
                    Are you sure you want to delete product
                    {props.productNames.length > 1 && `s`}:
                    {props.productNames.length > 1 ? (
                      <ul className="list-inside list-disc">
                        {props.productNames.map((n) => (
                          <li key={n}>{n}</li>
                        ))}
                      </ul>
                    ) : (
                      <span className="block italic">
                        {props.productNames[0]}
                      </span>
                    )}
                  </div>
                  <p className="mt-2">
                    All of the data related to the product(s) will be deleted,
                    including the:
                  </p>
                  <p className="mt-2">
                    Order items, product variants, customer cart items
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
