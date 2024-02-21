import { useState, ComponentProps } from "react";
import { clsx as cx } from "clsx";
import { IconCaretRight, IconAngleLeft } from "~/pages/common/Icons";
import { AdminTaxonsResponse } from "@api-contract/admin-api/types";
import { Link } from "@tanstack/react-router";

type TaxonTreeNode = AdminTaxonsResponse["taxonTree"]["body"][number];

export function TaxonTree(props: {
  tree: AdminTaxonsResponse["taxonTree"]["body"];
}) {
  return (
    <ul className="text-sm">
      {(props.tree ?? []).map((n) => (
        <TaxonTreeNode key={n.taxonName} treeNode={n} level0 />
      ))}
    </ul>
  );
}

function TaxonTreeNode(props: { treeNode: TaxonTreeNode; level0?: boolean }) {
  const [showChildren, setShowChildren] = useState(true);

  const hasChildren =
    props.treeNode.children && props.treeNode.children.length !== 0;

  return (
    <li className="relative">
      <div className="flex cursor-pointer items-center py-1 pl-2 transition-colors duration-100 hover:bg-gray-100">
        {hasChildren ? (
          <span
            onClick={() => setShowChildren(!showChildren)}
            className="flex h-6 w-6 items-center justify-center pb-1 pr-1"
          >
            <IconCaretRight
              className={cx("h-3.5 w-3.5  transition-transform", {
                "rotate-90": showChildren,
              })}
            />
          </span>
        ) : (
          !props.level0 && (
            <span className="flex h-6 w-6 items-center justify-center pb-0.5 pr-0.5 text-gray-400/60">
              <IconAngleLeft className="h-3.5 w-3.5 -rotate-45" />
            </span>
          )
        )}

        <Link
          className="font-medium text-teal-500 hover:underline"
          to="/products/taxon/$taxonId"
          params={{ taxonId: props.treeNode.id.toString() }}
        >
          {props.treeNode.taxonName}
        </Link>
      </div>
      {props.treeNode.children &&
        props.treeNode.children.length !== 0 &&
        showChildren && (
          <ul className="pl-6">
            {props.treeNode.children.map((n) => (
              <TaxonTreeNode key={n.taxonName} treeNode={n} />
            ))}
          </ul>
        )}
    </li>
  );
}
