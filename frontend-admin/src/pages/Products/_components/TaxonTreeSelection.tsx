import { useState, Fragment, ComponentProps } from "react";
import { clsx as cx } from "clsx";
import {
  IconFolderOutlined,
  IconFolderFilled,
  IconFolderOpen,
} from "~/pages/common/Icons";
import { AdminTaxonsResponse } from "@api-contract/admin-api/types";

type TaxonTreeNode = AdminTaxonsResponse["taxonTree"]["body"][number];

export type Taxon = {
  id: number;
  taxonName: string;
  children: Taxon[];
};

export function TaxonTreeSelection(props: {
  tree: Taxon[];
  checkedTaxonIds: Set<number>;
  setCheckedTaxonIds: React.Dispatch<React.SetStateAction<Set<number>>>;
}) {
  return (
    <ul className="pr-4 text-sm">
      {props.tree.map((n) => (
        <TaxonTreeNode
          key={n.id}
          checkedTaxonIds={props.checkedTaxonIds}
          setCheckedTaxonIds={props.setCheckedTaxonIds}
          treeNode={n}
          level0
        />
      ))}
    </ul>
  );
}

function TaxonTreeNode(props: {
  treeNode: Taxon;
  level0?: boolean;
  checkedTaxonIds: Set<number>;
  setCheckedTaxonIds: React.Dispatch<React.SetStateAction<Set<number>>>;
}) {
  const [showChildren, setShowChildren] = useState(true);

  const hasChildren =
    props.treeNode.children && props.treeNode.children.length !== 0;

  return (
    <li className="relative">
      <div className="flex cursor-pointer items-center rounded-md pl-1 pr-4 transition-colors duration-100">
        <div
          onClick={() => setShowChildren(!showChildren)}
          className="flex cursor-pointer items-center rounded-md  py-1 pl-1 pr-1 hover:bg-gray-100"
        >
          {hasChildren ? (
            <span className="flex h-6 w-6 items-center justify-center pb-1">
              {showChildren ? (
                <IconFolderOpen className="mt-0.5 h-3.5 w-3.5" />
              ) : (
                <IconFolderFilled className="mt-0.5 h-3.5 w-3.5" />
              )}
            </span>
          ) : (
            !props.level0 && (
              <span className="text-gray600 flex h-6 w-6 items-center justify-center pb-0.5 text-gray-600">
                <IconFolderOutlined className="mt-0.5 h-3.5 w-3.5" />
              </span>
            )
          )}

          <span className="font-medium text-gray-600">
            {props.treeNode.taxonName}
          </span>
        </div>
        <div className="pl-0.5">
          <input
            type="checkbox"
            className="cursor-pointer"
            checked={props.checkedTaxonIds.has(props.treeNode.id)}
            onChange={(e) =>
              props.setCheckedTaxonIds((s) => {
                if (e.target.checked) {
                  s.add(props.treeNode.id);
                } else {
                  s.delete(props.treeNode.id);
                }
                return new Set(s);
              })
            }
          />
        </div>
      </div>
      {props.treeNode.children &&
        props.treeNode.children.length !== 0 &&
        showChildren && (
          <ul className="pl-6">
            {props.treeNode.children.map((n) => (
              <TaxonTreeNode
                key={n.id}
                treeNode={n}
                checkedTaxonIds={props.checkedTaxonIds}
                setCheckedTaxonIds={props.setCheckedTaxonIds}
              />
            ))}
          </ul>
        )}
    </li>
  );
}

function MenuItemButton(props: {
  icon: JSX.Element;
  text: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={props.onClick}
      className="flex h-10 w-full items-center rounded-md pl-1 text-left hover:bg-gray-100"
    >
      <span className="flex h-10 w-10 items-center justify-center">
        {props.icon}
      </span>
      <span className="pl-1">{props.text}</span>
    </button>
  );
}
