import { PageTitle } from "~/pages/common/components/PageTitle";
import {
  IconCubes,
  IconHouse,
  IconShoppingCart,
  IconUsers,
} from "~/pages/common/Icons";
import { SalesSummary } from "~/pages/Home/Dashboard/_components/SalesSummary";
import { Link, LinkOptions } from "@tanstack/react-router";
import { useState } from "react";
import { SalesGraphPeriod } from "~/api-contract/common";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";

import {
  NewCustomerList,
  NewOrders,
} from "~/pages/Home/Dashboard/_components/NewDataList";
import { useDashboardGraph, useDashboardRecentData } from "~/pages/Home/api";

export function DashboardPage() {
  const [period, setPeriod] = useState<SalesGraphPeriod>("YEAR");
  const [date, setDate] = useState(new Date());

  const dashboardQuery = useDashboardGraph(date, period);

  const newDataQuery = useDashboardRecentData();

  return (
    <div className="pb-8">
      <PageTitle
        title="Dashboard"
        description="Overview of your store"
        icon={<IconHouse className="h-7 w-7 text-teal-500" />}
      />

      {dashboardQuery.data ? (
        <SalesSummary
          period={period}
          setPeriod={setPeriod}
          date={date}
          setDate={setDate}
          className="mt-8"
          data={dashboardQuery.data}
        />
      ) : (
        <LoadingSpinnerOverlay />
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-3 py-6 md:gap-y-0">
        <DashboardShortcutButton
          icon={<IconCubes className="h-5 w-5 text-gray-500" />}
          text="Products"
          linkProps={{ to: "/products", params: {} }}
        />
        <DashboardShortcutButton
          icon={<IconShoppingCart className="h-5 w-5 text-gray-500" />}
          text="Orders"
          linkProps={{ to: "/orders", params: {} }}
        />
        <DashboardShortcutButton
          icon={<IconUsers className="h-5 w-5 text-gray-500" />}
          text="Customers"
          linkProps={{ to: "/customers", params: {} }}
        />
      </div>

      {newDataQuery.data ? (
        <div className="mt-6 block w-full gap-x-6 md:flex">
          <NewCustomerList
            newCustomers={newDataQuery.data.customers}
            className="flex-1"
          />
          <NewOrders
            orders={newDataQuery.data.orders}
            className="mt-8 flex-1 md:mt-0"
          />
        </div>
      ) : (
        <LoadingSpinnerOverlay />
      )}
    </div>
  );
}

function DashboardShortcutButton(props: {
  icon: JSX.Element;
  text: string;
  linkProps: LinkOptions;
}) {
  return (
    <Link
      {...props.linkProps}
      className="flex basis-full justify-center rounded-sm border border-gray-300 py-2.5
    transition-colors duration-300 hover:border-gray-400 hover:bg-white md:flex-grow md:basis-auto"
    >
      <div className="flex items-center">
        <span>{props.icon}</span>
        <span className="ml-3">{props.text}</span>
      </div>
    </Link>
  );
}
