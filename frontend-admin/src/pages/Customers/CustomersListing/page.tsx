import React, { useEffect, useMemo, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { IconMagnifyingGlass, IconUsers } from "~/pages/common/Icons";

import { PageTitle } from "~/pages/common/components/PageTitle";
import { PaginationParameters } from "~/utils/pagination";
import { useQuery } from "@tanstack/react-query";
import { client } from "~/external/api-client/client";
import { format } from "date-fns";

import {
  PageSizeSelect,
  Pagination,
  TablePagination,
  useTablePagination,
} from "~/pages/common/components/Table/TablePagination/Pagination";
import { Select } from "~/pages/common/components/Select";
import {
  TableFilterAccordion,
  FilterInputField,
} from "~/pages/common/components/Table/TableFilter";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { Table } from "~/pages/common/components/Table/Table";
import { Link } from "@tanstack/react-router";

import { QUERY_KEY } from "~/pages/Customers/api";

type Customer = {
  id: number;
  email: string;
  registeredAt: Date;
};

const columnHelper = createColumnHelper<Customer>();

const columns = [
  columnHelper.accessor("email", {
    id: "Email",
    cell: (info) => info.getValue(),
    header: () => <span>Email</span>,
    meta: {
      headerProps: {
        className: "w-[37.5%]",
      },
      cellProps: {
        className: "w-[37.5%]",
      },
    },
  }),
  columnHelper.accessor("registeredAt", {
    id: "Registered at",
    cell: (info) => format(info.getValue(), "dd-MM-yyyy HH:mm"),
    header: () => <span>Registered at</span>,
    meta: {
      headerProps: {
        className: "w-[37.5%]",
      },
      cellProps: {
        className: "w-[37.5%]",
      },
    },
  }),
  columnHelper.display({
    id: "Actions",
    cell: (i) => (
      <Link
        to="/customers/$customerId"
        params={{ customerId: i.row.original.id.toString() }}
        className="flex h-9 w-fit items-center rounded-md bg-gray-200 pl-1 pr-4 text-sm text-gray-500 hover:bg-gray-300"
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconMagnifyingGlass className="h-3.5 w-3.5" />
        </span>
        Show
      </Link>
    ),
    header: () => <span>Actions</span>,
    meta: {
      headerProps: {
        className: "w-[25%]",
      },
      cellProps: {
        className: "w-[25%]",
      },
    },
  }),
];

export function CustomersListingPage() {
  const [searchEmail, setSearchEmail] = useState("");

  const pagination = useTablePagination({
    pageNumber: 1,
    pageSize: 10,
  });

  const customersQuery = useQuery({
    queryKey: [
      QUERY_KEY.list_customers,
      JSON.stringify(pagination.pagination),
      searchEmail,
    ],
    queryFn: async () => {
      const r = await client.customers.customers({
        query: {
          filter: {
            email: searchEmail,
          },
          pagination: pagination.pagination,
        },
      });
      if (r.status !== 200) {
        throw r.body;
      }
      return {
        ...r.body,
        results: r.body.results.map((result) => ({
          ...result,
          registeredAt: new Date(result.registeredAt),
        })),
      };
    },
  });

  if (customersQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="list customers"
        failed="load customers' data"
      />
    );
  }

  if (customersQuery.data === undefined) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <div className="flex items-end justify-between">
        <PageTitle
          title={"Customers"}
          description="Manage your customers"
          icon={<IconUsers className="h-7 w-7 text-teal-500" />}
        />
      </div>

      <TableFilterAccordion
        marginTop="mt-8"
        onFilter={(email) => setSearchEmail(email)}
        defaultFilter={""}
      >
        {(email, setEmail) => {
          return (
            <FilterInputField
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="text"
            />
          );
        }}
      </TableFilterAccordion>

      <TablePagination
        className="flex-grow py-7"
        pageSizeSelectClassName="w-[140px]"
        totalPages={customersQuery?.data.paginationMeta.totalPages ?? 0}
        currentPage={pagination.currentPage}
        onGoToPage={pagination.onGotoPage}
        onPreviousPage={pagination.onPreviousPage}
        onNextPage={pagination.onNextPage}
        pageSize={pagination.pageSize}
        onChangePageSize={pagination.onChangePageSize}
      />

      <Table
        data={customersQuery.data?.results ?? []}
        columns={columns}
        className="mt-2 pb-10"
      />
    </div>
  );
}
