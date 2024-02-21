import { Link, Outlet, useRouter } from "@tanstack/react-router";

import { IconAddThick } from "~/pages/common/Icons";

import { PageTitle } from "~/pages/common/components/PageTitle";

import { P, match } from "ts-pattern";

import { TaxonTree } from "~/pages/Taxons/_components/TaxonTree";
import { useDeleteTaxon, useTaxonTree } from "~/pages/Taxons/api";

export function TaxonsPage() {
  const router = useRouter();

  const path = router.state.location.pathname;

  const { data, isFetching } = useTaxonTree();

  const deleteTaxonMutation = useDeleteTaxon();

  const pageTitle = match(path)
    .with("/taxon/new", () => ({
      title: "New taxon",
      description: "Manage categorization of your products",
    }))
    .with("/taxon/new2", () => ({
      title: "New taxon",
      description: "Manage categorization of your products",
    }))
    .with(P.string.regex(/taxon\/\d+\/edit/), () => ({
      title: "Edit taxon",
      description: "Manage categorization of your products",
    }))
    .with(P.string.regex(/taxon\/new\/\d+/), () => ({
      title: "New taxon",
      description: "Manage categorization of your products",
    }))
    .otherwise(() => ({
      title: "",
      description: "",
    }));

  return (
    <div>
      <div className="flex">
        <div className="basis-1/4 bg-gray-50 pr-5 pt-2">
          <div className="border bg-white px-6 py-6">
            <div className="mb-4">
              <Link
                className="flex h-9 w-full items-center rounded-md bg-teal-500 text-center text-sm text-white"
                to="/taxon/new"
              >
                <span className="flex h-9 basis-9 items-center justify-center">
                  <IconAddThick className="h-5 w-5" />
                </span>
                <span className="flex-grow pr-4">Create</span>
              </Link>
            </div>
            <TaxonTree
              tree={data ?? []}
              onDeleteTaxon={(taxonId) => deleteTaxonMutation.mutate(taxonId)}
            />
          </div>
        </div>

        <div className="basis-3/4 bg-gray-50 pt-2">
          <PageTitle
            title={pageTitle.title}
            description={pageTitle.description}
          />

          <Outlet />
        </div>
      </div>
    </div>
  );
}
