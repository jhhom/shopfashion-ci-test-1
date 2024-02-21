import { useState } from "react";
import { clsx as cx } from "clsx";

import { IconExpandMore, IconMinus, IconPlus } from "~/pages/common/Icons";
import { Link } from "@tanstack/react-router";
import { PriceFilterInput } from "~/pages/ProductListingByTaxon/components/PriceFilter";

export type TaxonProps = {
  id: number;
  taxonName: string;
  children: {
    taxonName: string;
    slug: string;
  }[];
};

export function TaxonTree(props: { taxons: TaxonProps[] }) {
  return (
    <div className="w-full text-sm">
      {props.taxons.map((t) => (
        <Taxon
          key={t.id}
          id={t.id}
          taxonName={t.taxonName}
          children={t.children}
        />
      ))}


    </div>
  );
}

function Taxon(props: TaxonProps) {
  const [expand, setExpand] = useState(true);

  return (
    <div className="border-b border-gray-200 py-3.5">
      <div className="flex w-full items-center justify-between">
        <p className={cx({ "font-semibold": expand })}>{props.taxonName}</p>
        <button
          onClick={() => setExpand((e) => !e)}
          className="h-5 w-5 text-gray-600"
        >
          {expand ? (
            <IconMinus className="h-3.5 w-3.5 text-gray-400" />
          ) : (
            <IconPlus className="h-3.5 w-3.5 text-gray-400" />
          )}
        </button>
      </div>
      {expand && (
        <div className="mt-2 space-y-2 pl-2 text-[0.8rem]">
          {props.children.map((c) => (
            <Link
              className="block"
              to="/products/*"
              params={{ "*": c.slug }}
              key={c.slug}
            >
              {c.taxonName}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
