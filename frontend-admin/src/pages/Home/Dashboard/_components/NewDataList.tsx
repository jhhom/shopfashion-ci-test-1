import { AdminDashboardResponse } from "~/api-contract/admin-api/types";
import { Link } from "@tanstack/react-router";
import { clsx as cx } from "clsx";
import { IconMagnifyingGlass } from "~/pages/common/Icons";
import { formatPrice } from "~/utils/utils";

export function NewCustomerList({
  newCustomers,
  className,
}: {
  newCustomers: { id: number; email: string }[];
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-sm border border-gray-200 bg-white text-sm",
        className
      )}
    >
      <div className="border-b border-gray-200 px-6 py-4 font-medium">
        New customers
      </div>
      <div className="px-6 pb-8 pt-6">
        <p className="text-gray-500">Name</p>
        <ul className="mt-4">
          {newCustomers.map((e) => (
            <NewCustomerListItem key={e.id} customerId={e.id} email={e.email} />
          ))}
        </ul>
      </div>
    </div>
  );
}

export function NewOrders({
  orders,
  className,
}: {
  orders: AdminDashboardResponse["recentCustomersOrders"]["body"]["orders"];
  className?: string;
}) {
  return (
    <div
      className={cx(
        "rounded-sm border border-gray-200 bg-white text-sm",
        className
      )}
    >
      <div className="border-b px-6 py-4 font-medium">New orders</div>
      <div className="px-6 pt-4">
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-gray-400">
              <th className="py-2.5">Order</th>
              <th className="py-2.5">Items</th>
              <th className="py-2.5">Total</th>
              <th className="py-2.5"></th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <NewOrderListItem
                key={o.id}
                id={o.id}
                email={o.email}
                numOfItems={o.numOfItems}
                totalPrice={o.totalPrice}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NewOrderListItem(props: {
  id: number;
  email: string;
  numOfItems: number;
  totalPrice: number;
}) {
  return (
    <tr className="border-b">
      <td className="py-4">{props.email}</td>
      <td className="py-4">{props.numOfItems}</td>
      <td className="py-4">RM {formatPrice(props.totalPrice)}</td>
      <td className="w-16 py-4">
        <Link
          to="/orders/$orderId"
          params={{ orderId: props.id.toString() }}
          className="block w-16 rounded-md bg-gray-100 py-2 text-center"
        >
          Show
        </Link>
      </td>
    </tr>
  );
}

function NewCustomerListItem(props: { customerId: number; email: string }) {
  return (
    <li className="flex items-center justify-between border-t border-gray-200 py-3.5">
      <p className="text-gray-500">{props.email}</p>
      <Link
        to="/customers/$customerId"
        params={{ customerId: props.customerId.toString() }}
        className="flex rounded-md bg-gray-100 py-2.5 pl-3 pr-4 text-gray-600 hover:bg-gray-200"
      >
        <span className="flex h-5 w-5 items-center justify-center">
          <IconMagnifyingGlass className="h-3.5 w-3.5 text-gray-600" />
        </span>
        <span className="ml-2">Show</span>
      </Link>
    </li>
  );
}
