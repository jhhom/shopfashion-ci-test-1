import { clsx as cx } from "clsx";
import { twMerge } from "tailwind-merge";

export function PriceFilterInput({
  className,
  placeholder,
}: {
  className?: string;
  placeholder?: string;
}) {
  return (
    <input
      type="number"
      className={cx(
        "app-number-input w-36 rounded-sm border border-gray-300 px-2 py-2.5",
        className,
      )}
      placeholder={placeholder}
    />
  );
}

export function PriceFilter(props: {
  containerClassName?: string;
  inputContainerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
}) {
  const {
    containerClassName,
    inputClassName,
    buttonClassName,
    inputContainerClassName,
  } = props;

  return (
    <div className={twMerge("mt-8 w-full text-sm", containerClassName)}>
      <p>Price Range</p>
      <div
        className={twMerge(
          "mt-8 flex justify-between rounded-sm text-sm",
          inputContainerClassName,
        )}
      >
        <input
          type="number"
          className={twMerge(
            "app-number-input w-36 rounded-sm border border-gray-300 px-2 py-2.5",
            inputClassName,
          )}
          placeholder="RM MIN"
        />
        <div className="flex w-[calc(100%-5rem-5rem)] items-center px-1.5">
          <hr className="w-full border-gray-300" />
        </div>
        <input
          type="number"
          className={twMerge(
            "app-number-input w-36 rounded-sm border border-gray-300 px-2 py-2.5",
            inputClassName,
          )}
          placeholder="RM MAX"
        />
      </div>
      <button
        className={twMerge(
          "mt-6 w-full rounded-md bg-teal-500 py-2.5 font-semibold uppercase text-white",
          buttonClassName,
        )}
      >
        Apply
      </button>
    </div>
  );
}
