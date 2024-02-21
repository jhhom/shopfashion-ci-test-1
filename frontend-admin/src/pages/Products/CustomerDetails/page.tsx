import { useQuery } from "@tanstack/react-query";
import { useParams } from "@tanstack/react-router";
import { client } from "~/external/api-client/client";
import { LoadingSpinnerOverlay } from "~/pages/common/components/LoadingSpinnerOverlay";
import { clsx as cx } from "clsx";

import {
  CustomerOrdersTable,
  Order,
} from "~/pages/Products/CustomerDetails/components";
import { UnexpectedErrorMessage } from "~/pages/common/components/Errors";
import { format } from "date-fns";
import { formatPrice } from "~/utils/utils";
import { useCustomerDetails } from "~/pages/Products/api";

const orders1: Order[] = [
  {
    date: new Date(),
    orderId: 2,
    paymentStatus: "PAID",
    shipmentStatus: "PROCESSING",
    totalPrice: 1000,
  },
  {
    date: new Date(),
    orderId: 3,
    paymentStatus: "PENDING_PAYMENT",
    shipmentStatus: "PROCESSING",
    totalPrice: 500,
  },
];

export function CustomerDetailsPage() {
  const customerId = Number.parseInt(
    useParams({ from: "/customers/$customerId" }).customerId
  );

  const customerQuery = useCustomerDetails(customerId);

  if (customerQuery.isError) {
    return (
      <UnexpectedErrorMessage
        intent="retrieve customer details"
        failed="load customer details data"
      />
    );
  }

  if (customerQuery.data === undefined) {
    return <LoadingSpinnerOverlay />;
  }

  return (
    <div>
      <CustomerSummary
        numberOfOrders={customerQuery.data.numberOfOrders}
        totalOrdersValue={customerQuery.data.totalOrdersValue}
        avgOrdersValue={customerQuery.data.avgOrdersValue}
      />

      <CustomerInfo
        email={customerQuery.data.customerEmail}
        customerSince={customerQuery.data.customerSince}
        className="mt-4"
      />

      <div className="mt-6">
        <p className="py-2.5 pl-2.5 text-lg font-medium">Customer orders</p>
        <div className="mt-1">
          <CustomerOrdersTable orders={customerQuery.data.orders} />
        </div>
      </div>
    </div>
  );
}

function CustomerInfo(props: {
  email: string;
  customerSince: Date;
  className?: string;
}) {
  return (
    <div
      className={cx(
        "border border-gray-300 bg-white px-4 py-4",
        props.className
      )}
    >
      <p className="text-lg font-medium">{props.email}</p>
      <p className="mt-0.5 text-sm text-gray-500">
        Customer since {format(props.customerSince, "MMM dd, yyyy, h:mm a")}
      </p>
    </div>
  );
}

function CustomerSummary(props: {
  numberOfOrders: number;
  totalOrdersValue: number;
  avgOrdersValue: number;
}) {
  return (
    <div className="flex border border-gray-300 bg-white">
      <div className="flex w-full flex-wrap gap-y-6 py-3 pt-6">
        <CustomerSummaryData
          data={props.numberOfOrders.toString()}
          title="orders"
        />
        <CustomerSummaryData
          data={`${formatPrice(props.totalOrdersValue)}`}
          title="total value of orders"
        />
        <CustomerSummaryData
          data={`${formatPrice(props.avgOrdersValue)}`}
          title="average order value"
        />
      </div>
    </div>
  );
}

function CustomerSummaryData(props: { data: string; title: string }) {
  return (
    <div className="basis-full border-b pb-4 text-center last:border-b-0 last:border-r-0 md:basis-1/3 md:border-b-0 md:border-r md:pb-0">
      <p className="text-5xl">{props.data}</p>
      <p className="mt-1 text-sm font-medium uppercase">{props.title}</p>
    </div>
  );
}
