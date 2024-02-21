import { Link } from "@tanstack/react-router";
import type { Taxon } from "@api-contract/common";

export function NavPopup(props: { onClick?: () => void; taxonTree: Taxon[] }) {
  return (
    <div
      onClick={props.onClick}
      className="flex space-x-20 px-28 pb-12 pt-6 text-sm"
    >
      {props.taxonTree.map((n) => (
        <div key={n.taxonName}>
          <div className="font-semibold uppercase">
            <p>{n.taxonName}</p>
          </div>
          <div className="mt-3 space-y-2">
            {n.children.map((t) => (
              <Link
                className="block"
                from="/"
                to={`products/${t.slug}` as any}
                key={t.slug}
              >
                {t.taxonName}
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
