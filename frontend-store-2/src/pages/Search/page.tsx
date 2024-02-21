import { Link, useSearch } from "@tanstack/react-router";

import { LoadingSpinner } from "~/pages/Checkout/components/LoadingSpinner";
import { ProductListingItem } from "~/pages/ProductListingByTaxon/page";
import { useProductSearch } from "~/pages/Search/api";

export function SearchPage() {
  const search = useSearch({ from: "/search" });

  const productListingQuery = useProductSearch(search.search);

  return (
    <>
      <div className="h-full w-full px-4 py-12 pb-12 text-center text-xl font-medium sm:px-12 md:pb-0">
        <p>
          Showing results for{" "}
          {search.search === "" ? "(empty)" : `"${search.search}"`}
        </p>
      </div>

      <div className="h-full w-full px-4 pb-12 sm:px-12 md:pb-0">
        <p>{productListingQuery.data?.length ?? 0} results</p>
        <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-2 sm:gap-x-10 md:gap-x-12 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
          {productListingQuery.data ? (
            productListingQuery.data.map((pr) => (
              <ProductListingItem
                key={pr.id}
                id={pr.id}
                imgUrl={pr.imgUrl}
                name={pr.name}
                price={pr.pricing}
                rating={pr.rating}
                reviews={pr.numberOfReviews}
              />
            ))
          ) : (
            <LoadingSpinner />
          )}
        </div>
      </div>
    </>
  );
}
