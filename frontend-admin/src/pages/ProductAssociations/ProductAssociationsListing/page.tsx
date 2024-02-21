import { useState } from "react";

import { ProductAssociationsTable } from "~/pages/ProductAssociations/ProductAssociationsListing/components";
import { PageTitle } from "~/pages/common/components/PageTitle";
import { IconAddThick, IconListCheck } from "~/pages/common/Icons";

import { Link } from "@tanstack/react-router";
import {
  TableFilterAccordion,
  FilterInputField,
} from "~/pages/common/components/Table/TableFilter";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import {
  useAssociations,
  useDeleteAssociation,
} from "~/pages/ProductAssociations/api";

export function ProductAssociationsListingPage() {
  const [name, setName] = useState("");

  const associationsQuery = useAssociations(name);

  const deleteProductAssociationMutation = useDeleteAssociation();

  if (associationsQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="list product associations"
        failed="load product associations' data"
      />
    );
  }

  if (!associationsQuery.data) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <>
      <div className="flex items-end justify-between">
        <PageTitle
          title={"Product associations types"}
          description="Manage association types of your products"
          icon={<IconListCheck className="h-6 w-6 text-teal-500" />}
        />
        <Link
          to="/product-associations/new"
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
        onFilter={(name) => setName(name)}
        defaultFilter={""}
      >
        {(optionName, setOptionName) => {
          return (
            <FilterInputField
              label="Name"
              value={optionName}
              onChange={(e) => setOptionName(e.target.value)}
              type="text"
            />
          );
        }}
      </TableFilterAccordion>

      <div className="pb-10">
        <ProductAssociationsTable
          productAssociations={associationsQuery.data?.results ?? []}
          onDeleteAssociation={(id) =>
            deleteProductAssociationMutation.mutate(id)
          }
        />
      </div>
    </>
  );
}
