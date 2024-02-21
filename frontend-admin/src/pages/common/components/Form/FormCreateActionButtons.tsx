import { Link, LinkOptions } from "@tanstack/react-router";
import { clsx as cx } from "clsx";

import { IconAddThick } from "~/pages/common/Icons";

export function FormCreateActionButtons(props: {
  linkProps: LinkOptions;
  className?: string;
  disableCreate?: boolean;
}) {
  return (
    <div className={cx("flex", props.className)}>
      <button
        type="submit"
        className="flex h-9 items-center rounded-l-md bg-teal-500 pl-1 pr-4 text-sm text-white disabled:cursor-not-allowed disabled:bg-teal-500/50"
        disabled={props.disableCreate}
      >
        <span className="flex h-9 w-9 items-center justify-center">
          <IconAddThick className="h-5 w-5" />
        </span>
        <span>Create</span>
      </button>
      <Link
        className="flex h-9 items-center rounded-r-md bg-gray-200 px-5"
        {...props.linkProps}
      >
        <span>Cancel</span>
      </Link>
    </div>
  );
}
