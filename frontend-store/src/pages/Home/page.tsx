import { useState } from "react";

import { client } from "~/external/api-client/client";
import { useQuery } from "@tanstack/react-query";
import { StoreProductsResponse } from "~/shared/api-contract/store-api/api";
import { Link } from "@tanstack/react-router";
import { IconMinus, IconPlus } from "~/pages/common/Icons";
import { ProductListingItem } from "~/pages/ProductListingByTaxon/page";
import { LoadingSpinner } from "~/pages/Checkout/components/LoadingSpinner";

export function HomePage() {
  const taxonTreeQuery = useQuery({
    queryKey: ["taxon_tree"],
    queryFn: async () => {
      const r = await client.products.taxonTree();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });

  const productListingQuery = useQuery({
    queryKey: ["latest_products"],
    queryFn: async () => {
      const r = await client.products.latestProducts();
      if (r.status !== 200) {
        throw r.body;
      }
      return r.body;
    },
  });

  return (
    <div>
      <div className="overflow-hidden md:h-[calc(100vh-6rem)] md:px-6 md:py-6">
        <p className="mt-8 text-center text-xl font-medium">
          Browse our latest fashions
        </p>
        <div className="h-full w-full px-4 pb-12 sm:px-12 md:pb-0">
          <div className="mt-8 grid grid-cols-1 gap-x-4 gap-y-10 sm:grid-cols-3 md:gap-x-12">
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
      </div>
      <ul className="space-y-4 px-8 py-8 md:hidden">
        {taxonTreeQuery.data?.map((t) => (
          <CategoryButton key={t.id} taxon={t} />
        ))}
      </ul>
    </div>
  );
}

function CategoryButton(props: {
  taxon: StoreProductsResponse["taxonTree"]["body"][number];
}) {
  const [open, setOpen] = useState(false);

  return (
    <li className="rounded-md border border-gray-300">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex h-12 w-full items-center justify-between rounded-md  pl-8 pr-4 text-left"
      >
        <span className="uppercase">{props.taxon.taxonName}</span>
        <span className="flex h-12 w-12 items-center justify-center">
          {open ? (
            <IconMinus className="h-4 w-4 text-gray-500" />
          ) : (
            <IconPlus className="h-4 w-4 text-gray-500" />
          )}
        </span>
      </button>
      {props.taxon.children.length > 0 && open && (
        <ul className="pb-4 pl-8">
          {props.taxon.children.map((c) => (
            <li key={c.id}>
              <p>{c.taxonName}</p>
              <ul className="mt-2 space-y-2 pl-4 text-sm">
                {c.children.map((_c) => (
                  <Link
                    to="/products/*"
                    className="block"
                    params={{ "*": _c.slug }}
                    key={_c.id}
                  >
                    {_c.taxonName}
                  </Link>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
