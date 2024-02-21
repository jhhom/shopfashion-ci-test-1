import { useState, Fragment, ComponentProps } from "react";
import { clsx as cx } from "clsx";
import {
  IconCaretRight,
  IconAngleLeft,
  IconHorizontalDots,
  IconAddThick,
  IconPencil,
  IconThrashCan,
} from "~/pages/common/Icons";
import { AdminTaxonsResponse } from "~/api-contract/admin-api/types";
import { Menu, Transition } from "@headlessui/react";
import { Link } from "@tanstack/react-router";

type TaxonTreeNode = AdminTaxonsResponse["taxonTree"]["body"][number];

export function TaxonTree(props: {
  tree: AdminTaxonsResponse["taxonTree"]["body"];
  onDeleteTaxon: ComponentProps<typeof TaxonTreeNode>["onDeleteTaxon"];
}) {
  return (
    <ul className="text-sm">
      {(props.tree ?? []).map((n) => (
        <TaxonTreeNode
          key={n.taxonName}
          treeNode={n}
          onDeleteTaxon={props.onDeleteTaxon}
          level0
        />
      ))}
    </ul>
  );
}

function TaxonTreeNode(props: {
  treeNode: TaxonTreeNode;
  onDeleteTaxon: (taxonId: number) => void;
  level0?: boolean;
}) {
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

        <span className="font-medium text-teal-500 hover:underline">
          {props.treeNode.taxonName}
        </span>

        <Menu>
          <Menu.Button className="ml-auto h-5 w-5 rounded-full p-0.5">
            <IconHorizontalDots />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 top-8 z-10 mt-2 w-36 origin-top-right rounded-md bg-white  p-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/taxon/new/$taxonId"
                    params={{
                      taxonId: props.treeNode.id.toString(),
                    }}
                    className="flex h-10 w-full items-center rounded-md pl-1 text-left hover:bg-gray-100"
                  >
                    <span className="flex h-10 w-10 items-center justify-center">
                      <IconAddThick className="h-6 w-6 text-blue-500" />
                    </span>
                    <span className="pl-1">Create</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <Link
                    to="/taxon/$taxonId/edit"
                    params={{
                      taxonId: props.treeNode.id.toString(),
                    }}
                    className="flex h-10 w-full items-center rounded-md pl-1 text-left hover:bg-gray-100"
                  >
                    <span className="flex h-10 w-10 items-center justify-center">
                      <IconPencil className="h-[1.125rem] w-[1.125rem] text-gray-400" />
                    </span>
                    <span className="pl-1">Edit</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <MenuItemButton
                    onClick={() => props.onDeleteTaxon(props.treeNode.id)}
                    icon={<IconThrashCan className="h-4 w-4 text-red-500" />}
                    text="Delete"
                  />
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      {props.treeNode.children &&
        props.treeNode.children.length !== 0 &&
        showChildren && (
          <ul className="pl-6">
            {props.treeNode.children.map((n) => (
              <TaxonTreeNode
                onDeleteTaxon={props.onDeleteTaxon}
                key={n.taxonName}
                treeNode={n}
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
