import { clsx as cx } from "clsx";
import { IconThrashCan } from "~/pages/common/Icons";

export function DeleteButton(props: {
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      className={cx(
        "flex h-10 items-center rounded-md pl-1 pr-4 text-sm text-white disabled:cursor-not-allowed",
        { "bg-red-500": !props.disabled },
        { "bg-gray-300": props.disabled },
      )}
      type="button"
    >
      <span className="flex h-10 w-10 items-center justify-center">
        <IconThrashCan className="h-3.5 w-3.5" />
      </span>
      <span>Delete</span>
    </button>
  );
}
