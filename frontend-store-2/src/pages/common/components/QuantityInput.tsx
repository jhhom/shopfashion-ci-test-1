import { clsx as cx } from "clsx";
import React, { useState } from "react";
import { IconMinus, IconPlus, IconShoppingCart } from "~/pages/common/Icons";

export function QuantityInput({
  quantity,
  setQuantity,
  className,
  disabled,
}: {
  quantity: number;
  setQuantity: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  disabled?: boolean;
}) {
  const [error, setError] = useState<"reach-max" | "reach-min" | null>(null);

  return (
    <div>
      <div className={cx("flex", className)}>
        <button
          disabled={disabled}
          onClick={() => {
            setQuantity((q) => {
              if (q > 1) {
                setError(null);
                return q - 1;
              }
              setError("reach-min");

              return q;
            });
          }}
          className="border border-gray-300 bg-white px-3 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <IconMinus className="h-3.5 w-3.5" />
        </button>
        <input
          className="app-number-input w-[60px] border-y border-gray-300 px-4 py-2 text-center disabled:cursor-not-allowed disabled:text-gray-400"
          type="number"
          value={quantity}
          readOnly
          disabled={disabled}
        />
        <button
          disabled={disabled}
          onClick={() => {
            setQuantity((q) => {
              if (q < 10) {
                setError(null);
                return q + 1;
              }
              setError("reach-max");
              return q;
            });
          }}
          className="border border-gray-300 bg-white px-3 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <IconPlus className="h-3.5 w-3.5" />
        </button>
      </div>
      {error && (
        <p className="mt-1 font-normal text-red-500">
          You have reached {error === "reach-max" ? "maximum" : "minimum"}{" "}
          quantity
        </p>
      )}
    </div>
  );
}

export function QuantityInputSmall(props: {
  className?: string;
  quantity: number;
  setQuantity: (quantity: number) => void;
  disabled?: boolean;
}) {
  const { quantity, setQuantity, className } = props;
  const [error, setError] = useState<"reach-max" | "reach-min" | null>(null);

  return (
    <div>
      <div className={cx("flex", className)}>
        <button
          onClick={() => {
            props.setQuantity(props.quantity - 1);
          }}
          disabled={props.disabled}
          className="border border-gray-300 px-2.5 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <IconMinus className="h-3.5 w-3.5" />
        </button>
        <input
          className="app-number-input w-[40px] border-y border-gray-300 py-1 text-center disabled:cursor-not-allowed disabled:text-gray-400"
          type="number"
          value={quantity}
          readOnly
          disabled={props.disabled}
        />
        <button
          onClick={() => {
            props.setQuantity(props.quantity + 1);
          }}
          disabled={props.disabled}
          className="border border-gray-300 px-2.5 disabled:cursor-not-allowed disabled:text-gray-400"
        >
          <IconPlus className="h-3.5 w-3.5" />
        </button>
      </div>
      {error && (
        <p className="mt-1 font-normal text-red-500">
          You have reached {error === "reach-max" ? "maximum" : "minimum"}{" "}
          quantity
        </p>
      )}
    </div>
  );
}
