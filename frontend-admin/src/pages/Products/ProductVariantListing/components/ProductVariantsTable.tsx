import { useMemo, useState } from "react";
import { IconPencil, IconThrashCan } from "~/pages/common/Icons";
import { clsx as cx } from "clsx";
import { createColumnHelper } from "@tanstack/react-table";
import { Link } from "@tanstack/react-router";

import { setHasAllElements } from "~/utils/utils";
import { Table } from "~/pages/common/components/Table/Table";

type ProductVariant = {
  id: number;
  name: string;
  position: number;
  optionValues: string;
};

const columnHelper = createColumnHelper<ProductVariant>();

export function ProductVariantsTable(props: {
  productId: number;
  variants: ProductVariant[];
  onDelete: (productVariantId: number) => void;
}) {
  const [selectedRows, setSelectedRows] = useState(new Set<number>());

  const columns = useMemo(
    () => [
      columnHelper.display({
        id: "select",
        cell: (info) => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              checked={selectedRows.has(info.row.original.id)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRows((s) => {
                    s.add(info.row.original.id);
                    const newSet = new Set(s);
                    return newSet;
                  });
                } else {
                  setSelectedRows((s) => {
                    s.delete(info.row.original.id);
                    const newSet = new Set(s);
                    return newSet;
                  });
                }
              }}
            />
          </div>
        ),
        header: () => (
          <div className="flex items-center justify-center">
            <input
              type="checkbox"
              disabled={props.variants.length === 0}
              checked={
                setHasAllElements(
                  selectedRows,
                  props.variants.map((d) => d.id),
                ) && props.variants.length !== 0
              }
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedRows((s) => {
                    props.variants.forEach((d) => {
                      s.add(d.id);
                    });
                    const n = new Set(s);
                    return n;
                  });
                } else {
                  setSelectedRows((s) => {
                    return new Set();
                  });
                }
              }}
            />
          </div>
        ),
        meta: {
          headerProps: {
            className: "w-[80px] pl-1",
          },
          cellProps: {
            className: "w-[80px] pl-1",
          },
        },
      }),
      columnHelper.accessor("name", {
        id: "Name",
        cell: (info) => info.getValue(),
        header: () => <span>Name</span>,
        meta: {
          headerProps: {
            className: "w-[18.5%]",
          },
          cellProps: {
            className: "w-[18.5%]",
          },
        },
      }),
      columnHelper.accessor("optionValues", {
        id: "OptionValues",
        cell: (info) => info.getValue(),
        header: () => <span>Options</span>,
        meta: {
          headerProps: {
            className: "w-[18.5%]",
          },
          cellProps: {
            className: "w-[18.5%]",
          },
        },
      }),
      columnHelper.accessor("position", {
        id: "Position",
        cell: (info) => info.getValue(),
        header: () => <span>Position</span>,
        meta: {
          headerProps: {
            className: "w-[100px]",
          },
          cellProps: {
            className: "w-[100px]",
          },
        },
      }),
      columnHelper.display({
        id: "actions",
        cell: (i) => (
          <div>
            <ButtonGroup
              productId={props.productId}
              productVariantId={i.row.original.id}
              onDelete={() => props.onDelete(i.row.original.id)}
            />
          </div>
        ),
        header: () => <span>Actions</span>,
        meta: {
          headerProps: {
            className: "w-[63%-80px-100px]",
          },
          cellProps: {
            className: "w-[63%-80px-100px]",
          },
        },
      }),
    ],
    [selectedRows, props.variants],
  );

  return <Table className="py-2" data={props.variants} columns={columns} />;
}

function ButtonGroup(props: {
  productId: number;
  productVariantId: number;
  onDelete: () => void;
}) {
  return (
    <div className="flex">
      <Link
        to="/products/$productId/variants/$productVariantId/edit"
        params={{
          productId: props.productId.toString(),
          productVariantId: props.productVariantId.toString(),
        }}
        className={
          "flex h-9 items-center rounded-l-md bg-gray-200 pl-1 pr-4 text-sm text-gray-500 hover:bg-gray-300"
        }
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconPencil className="h-3.5 w-3.5" />
        </span>
        <span>Edit</span>
      </Link>
      <button
        className={cx(
          "flex h-9 items-center rounded-r-md bg-red-500 pl-1 pr-4 text-sm text-white",
        )}
        onClick={props.onDelete}
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconThrashCan className="h-3.5 w-3.5" />
        </span>
        <span>Delete</span>
      </button>
    </div>
  );
}
