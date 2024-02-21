import { OrderLineItemStatus } from "@api-contract/common";
import { OrderStatus } from "@api-contract/common";
import { clsx as cx } from "clsx";
import { match } from "ts-pattern";
import {
  IconCheck,
  IconCheckThick,
  IconClock,
  IconPlane,
  IconX,
} from "~/pages/common/Icons";

export function OrderPaymentStatus(props: { status: OrderStatus }) {
  return (
    <span
      className={cx(
        "flex w-fit items-center rounded-md px-1.5 py-1 pr-2.5 capitalize text-white",
        {
          "bg-green-500": props.status === "PAID",
          "bg-red-500": props.status === "CANCELLED",
        },
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        {match(props.status)
          .with("PAID", () => (
            <IconCheckThick className="h-3.5 w-3.5 text-white" />
          ))
          .otherwise(() => (
            <IconX className="h-3 w-3 text-white" />
          ))}
      </div>
      <span className="ml-0.5">{props.status}</span>
    </span>
  );
}

export function OrderShippingStatus(props: { status: OrderLineItemStatus }) {
  return (
    <span
      className={cx(
        "flex w-fit items-center rounded-md px-1.5 py-1 pr-2.5 capitalize text-white",
        {
          "bg-green-500": props.status === "COMPLETED",
          "bg-blue-500": props.status === "TO_RECEIVE",
          "bg-amber-500":
            props.status === "TO_SHIP" || props.status === "PROCESSING",
        },
      )}
    >
      <div className="flex h-5 w-5 items-center justify-center">
        {match(props.status)
          .with("COMPLETED", () => (
            <IconCheckThick className="h-3.5 w-3.5 text-white" />
          ))
          .with("PROCESSING", () => (
            <IconClock className="h-3.5 w-3.5 text-white" />
          ))
          .with("TO_RECEIVE", () => (
            <IconPlane className="h-3.5 w-3.5 text-white" />
          ))
          .otherwise(() => (
            <IconClock className="h-3 w-3 text-white" />
          ))}
      </div>
      <span className="ml-0.5">{props.status}</span>
    </span>
  );
}
