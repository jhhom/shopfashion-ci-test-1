import { PageTitle } from "~/pages/common/components/PageTitle";

import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { ProductVariantsTable } from "~/pages/Products/ProductVariantListing/components/ProductVariantsTable";

import {
  IconCaretDown,
  IconFilter,
  IconMagnifyingGlassThicker600Weight,
  IconAddThick,
  IconShuffle,
  IconCheck,
  IconCheckThick,
} from "~/pages/common/Icons";

import { Link } from "@tanstack/react-router";

import * as Collapsible from "@radix-ui/react-collapsible";
import { clsx as cx } from "clsx";
import { DeleteButton } from "~/pages/common/components/Buttons";
import {
  TableFilterAccordion,
  FilterInputField,
} from "~/pages/common/components/Table/TableFilter";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import {
  useDeleteProductVariant,
  useProductVariantListings,
} from "~/pages/Products/api";

export function ProductVariantListingPage() {
  const productId = Number.parseInt(
    useParams({ from: "/products/$productId/variants" }).productId
  );

  const [searchVariantName, setSearchVariantName] = useState("");

  const variantsQuery = useProductVariantListings({
    productId,
    searchVariantName,
  });

  const deleteProductVariantMutation = useDeleteProductVariant();

  if (variantsQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="list product variants"
        failed="load product variants"
      />
    );
  }

  if (!variantsQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <PageTitle
        title={variantsQuery.data.productName}
        description="Manage variants"
      />

      <div className="flex justify-end">
        <ButtonGroup productId={productId} />
      </div>

      <TableFilterAccordion
        marginTop="mt-6"
        onFilter={(variantName) => setSearchVariantName(variantName)}
        defaultFilter={""}
      >
        {(variantName, setVariantName) => {
          return (
            <FilterInputField
              label="Variant name"
              value={variantName}
              onChange={(e) => setVariantName(e.target.value)}
              type="text"
            />
          );
        }}
      </TableFilterAccordion>

      <div className="pt-7">
        <DeleteButton />
      </div>

      <div className="pt-4">
        <ProductVariantsTable
          productId={productId}
          variants={variantsQuery.data.variants}
          onDelete={(productVariantId) =>
            deleteProductVariantMutation.mutate(productVariantId)
          }
        />
      </div>
    </div>
  );
}

export function Filter(props: {
  marginTop?: string;
  onFilter: (variantName: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const [variantName, setVariantName] = useState("");

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
                  { "-rotate-90": !open }
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
        <div className="border border-t-0 border-gray-300 bg-white px-5 py-6 text-sm">
          <div>
            <p>Variant name</p>
            <input
              value={variantName}
              onChange={(e) => {
                setVariantName(e.target.value);
              }}
              type="text"
              className="mt-1 w-full rounded-sm border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="mt-6">
            <button
              onClick={() => props.onFilter(variantName)}
              className="flex h-9 items-center rounded-md bg-blue-500 pl-2 pr-5 text-white"
            >
              <span className="flex h-9 w-8 items-center justify-center">
                <IconMagnifyingGlassThicker600Weight className="h-[1.125rem] w-[1.125rem]" />
              </span>
              <span>Filter</span>
            </button>
          </div>
        </div>
      </Collapsible.Content>
    </Collapsible.Root>
  );
}

function ButtonGroup(props: { productId: number }) {
  return (
    <div className="flex">
      <Link
        to="/products/$productId/variants/generate"
        params={{
          productId: props.productId.toString(),
        }}
        className={cx(
          "flex h-9 items-center rounded-l-md bg-gray-200 pl-1 pr-4 text-sm text-gray-500 hover:bg-gray-300"
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconShuffle className="h-3.5 w-3.5" />
        </span>
        <span>Generate</span>
      </Link>
      <Link
        to="/products/$productId/edit"
        params={{
          productId: props.productId.toString(),
        }}
        className={cx(
          "flex h-9 items-center bg-gray-200 pl-1 pr-4 text-sm text-gray-500 hover:bg-gray-300"
        )}
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconCheckThick className="h-4 w-4" />
        </span>
        <span>Save positions</span>
      </Link>
      <Link
        to="/products/$productId/variants/new"
        params={{
          productId: props.productId.toString(),
        }}
        className="flex h-9 items-center rounded-r-md bg-teal-500 pl-1 pr-4 text-sm text-white"
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconAddThick className="h-5 w-5" />
        </span>
        <span>Create</span>
      </Link>
    </div>
  );
}
