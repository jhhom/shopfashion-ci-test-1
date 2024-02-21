import {
  Link,
  useNavigate,
  useParams,
  useSearch,
} from "@tanstack/react-router";
import { useSet } from "@uidotdev/usehooks";
import { useState } from "react";
import { match } from "ts-pattern";
import { LoadingSpinner } from "~/pages/Checkout/components/LoadingSpinner";
import {
  useBreadcrumbs,
  useProductListings,
  useTaxonTree,
} from "~/pages/ProductListingByTaxon/api";
import { MobileFilterSidebar } from "~/pages/ProductListingByTaxon/components/MobileFilterSidebar";
import { DesktopPriceRangeFilter } from "~/pages/ProductListingByTaxon/components/PriceFilter";
import { PriceSortby } from "~/pages/ProductListingByTaxon/components/PriceSortby";
import { TaxonTree } from "~/pages/ProductListingByTaxon/components/TaxonTree";
import {
  PageDoesNotExist,
  UnexpectedError,
} from "~/pages/common/ErrorContents";
import { IconClose, IconShirt, IconSliders } from "~/pages/common/Icons";
import { Rating } from "~/pages/common/Rating";
import { Breadcrumb } from "~/pages/common/components/Breadcrumb";
import { parseApiError } from "~/utils/api-error";

import { formatPrice } from "~/utils/utils";

const prices = [
  "RM 20 - 40",
  "RM 40 - 70",
  "RM 70 - 100",
  "RM 100 - 150",
  "RM 150 - 200",
  "RM 200+",
];

export function ProductListingByTaxonPage() {
  const taxonSlug = (
    useParams({ from: "/products/*" }) as {
      "*": string;
    }
  )["*"];

  const [openSidebar, setOpenSidebar] = useState(false);

  const search = useSearch({ from: "/products/*" });
  const searchSortPrice = search.sort_price ? search.sort_price : "asc";

  const navigate = useNavigate();

  const productListingQuery = useProductListings({
    taxonSlug,
    minPrice: search.price_min,
    maxPrice: search.price_max,
    sortPriceOrder: searchSortPrice,
  });

  const breadcrumbsQuery = useBreadcrumbs(taxonSlug);

  const taxonTreeQuery = useTaxonTree(taxonSlug);

  const priceFilters = useSet<string>();

  if (productListingQuery.error) {
    const err = parseApiError(productListingQuery.error);
    if (
      err.type === "application" &&
      err.error.details.code === "RESOURCE_NOT_FOUND"
    ) {
      return <PageDoesNotExist />;
    } else {
      return <UnexpectedError />;
    }
  }

  if (productListingQuery.data === undefined) {
    return <LoadingSpinner />;
  }

  return (
    <div className="h-full w-full px-4 pb-12 sm:px-12 md:pb-0">
      <Breadcrumb
        crumbs={
          breadcrumbsQuery.data
            ? breadcrumbsQuery.data.precedingSlugs.map((c) => ({
                id: c.id,
                name: c.name,
                link: `/products/${c.slug}`,
              }))
            : []
        }
        lastCrumb={breadcrumbsQuery.data?.lastSlug ?? null}
      />

      <div className="hidden py-4 md:block">
        <p className="text-xl font-medium">T-Shirts</p>
      </div>

      <div className="md:flex md:pb-16">
        <div className="hidden basis-64 pr-12 pt-16 text-base md:block">
          <TaxonTree taxons={taxonTreeQuery.data ?? []} />
          <DesktopPriceRangeFilter
            className="mt-8"
            onSubmit={(v) => {
              navigate({
                to: "/products/*",
                params: { "*": taxonSlug },
                search: {
                  ...search,
                  price_min: v.min,
                  price_max: v.max,
                },
              });
            }}
            defaultValues={{
              min: search.price_min,
              max: search.price_max,
            }}
          />
        </div>

        <div className="flex-grow basis-[calc(100%-16rem)]">
          <FilterBar
            priceSortBy={
              <PriceSortby
                order={searchSortPrice}
                onSetOrder={(order) => {
                  navigate({
                    to: "/products/*",
                    params: {
                      "*": taxonSlug,
                    },
                    search: {
                      ...search,
                      sort_price: order,
                    },
                  });
                }}
              />
            }
            onOpenFilterSidebar={() => setOpenSidebar(true)}
          />
          <FilterAndPageDisplay
            priceFilters={priceFilters}
            numberOfItems={productListingQuery.data.products.length}
          />
          <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-10 md:gap-x-12 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
            {productListingQuery.data ? (
              productListingQuery.data.products.map((pr) => (
                <ProductListingItem
                  key={pr.id}
                  id={pr.id}
                  imgUrl={pr.imgUrl}
                  name={pr.name}
                  price={pr.pricing}
                  rating={pr.rating}
                  reviews={pr.numberOfReviews}
                  taxonSlug={taxonSlug}
                />
              ))
            ) : (
              <LoadingSpinner />
            )}
          </div>
        </div>
      </div>

      <MobileFilterSidebar
        open={openSidebar}
        setOpen={setOpenSidebar}
        defaultValues={{
          min: search.price_min,
          max: search.price_max,
        }}
        onPriceRangeSubmit={(v) => {
          navigate({
            // @ts-expect-error
            to: `/products/${taxonSlug}`,
            search: {
              ...search,
              price_min: v.min,
              price_max: v.max,
            },
          });
        }}
      />
    </div>
  );
}

export function ProductListingItem(props: {
  id: number;
  imgUrl: string | null;
  name: string;
  price:
    | {
        type: "SIMPLE";
        price: number;
      }
    | {
        type: "CONFIGURABLE";
        minPrice: number;
        maxPrice: number;
      }
    | {
        type: "UNAVAILABLE";
      };
  rating: number;
  reviews: number;
  taxonSlug?: string;
}) {
  return (
    <Link
      to="/product/$productId"
      params={{ productId: props.id.toString() }}
      search={props.taxonSlug ? { from_taxon: props.taxonSlug } : undefined}
      mask={{
        to: "/product/$productId",
        params: { productId: props.id.toString() },
      }}
      className="block"
    >
      <div className="h-56 w-full">
        {props.imgUrl ? (
          <img
            src={props.imgUrl}
            className="h-full w-full rounded-md object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-gray-100">
            <p>No image</p>
          </div>
        )}
      </div>
      <div className="justify-between pt-2">
        <p className="text-sm font-semibold">{props.name}</p>
        <div className="mt-4 text-base font-semibold">
          {props.price.type !== "UNAVAILABLE" && (
            <span className="self-start pt-1 text-xs">RM&nbsp;</span>
          )}
          {match(props.price)
            .with({ type: "SIMPLE" }, (p) => formatPrice(p.price))
            .with({ type: "CONFIGURABLE" }, (p) => {
              if (p.minPrice.toFixed(2) === p.maxPrice.toFixed(2)) {
                return formatPrice(p.minPrice);
              } else {
                return (
                  formatPrice(p.minPrice) + " - " + formatPrice(p.maxPrice)
                );
              }
            })
            .with({ type: "UNAVAILABLE" }, (p) => (
              <div>
                <span className="text-sm text-gray-500">Unavailable</span>
              </div>
            ))
            .exhaustive()}
        </div>
      </div>
      <div className="flex items-center py-1">
        <Rating
          value={props.rating}
          className="max-w-[80px]"
          onChange={undefined}
        />
        <span className="pl-2 text-sm text-gray-500">({props.reviews})</span>
      </div>
    </Link>
  );
}

function FilterAndPageDisplay({
  priceFilters,
  numberOfItems,
}: {
  priceFilters: Set<string>;
  numberOfItems: number;
}) {
  return (
    <div className="flex min-h-16 justify-between pb-2 pt-4">
      <div className="flex h-full flex-wrap items-center gap-x-2 gap-y-2 text-sm">
        {Array.from(priceFilters.values()).map((f) => (
          <div
            key={f}
            className="flex items-center rounded-md border border-teal-500 bg-teal-100 py-0.5 pl-1.5 text-sm"
          >
            <span>{f}</span>
            <button
              onClick={() => priceFilters.delete(f)}
              className="ml-1 flex h-6 w-6 items-center justify-center"
            >
              <IconClose className="h-4 w-4 text-gray-500" />
            </button>
          </div>
        ))}
      </div>
      <div className="whitespace-nowrap text-sm">
        Showing {numberOfItems} item{numberOfItems === 1 ? "" : "s"}
      </div>
    </div>
  );
}

function FilterBar(props: {
  priceSortBy: JSX.Element;
  onOpenFilterSidebar: () => void;
}) {
  return (
    <div className="flex items-center justify-between text-sm md:justify-end md:border-y md:border-gray-200 md:py-2">
      <div className="flex items-center">
        <p>Sort by:</p>
        {props.priceSortBy}
      </div>
      <div className="md:hidden">
        <button
          onClick={props.onOpenFilterSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-gray-100"
        >
          <IconSliders className="h-5 w-5 text-gray-500" />
        </button>
      </div>
    </div>
  );
}
