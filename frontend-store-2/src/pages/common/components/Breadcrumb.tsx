import { Link, LinkProps } from "@tanstack/react-router";
import { clsx as cx } from "clsx";

export type Crumb = {
  id: number;
  name: string;
  link: string;
};

export function Breadcrumb(props: {
  crumbs: Crumb[];
  lastCrumb: {
    name: string;
  } | null;
}) {
  return (
    <div className="flex items-center py-4 text-sm text-gray-500">
      {props.crumbs.map((c, i) => (
        <div className="flex items-center" key={c.id}>
          {c.link ? (
            <Link
              to={c.link}
              className={cx(
                "cursor-pointer rounded-md px-1 py-0.5 hover:bg-gray-100"
              )}
            >
              {c.name}
            </Link>
          ) : (
            <span className="block px-1 py-0.5 last:font-medium last:text-teal-600">
              {c.name}
            </span>
          )}
          {i !== props.crumbs.length - 1 && (
            <span className={"mx-1 text-xl text-gray-500"}>/</span>
          )}
        </div>
      ))}
      {props.lastCrumb && (
        <>
          {props.crumbs.length > 0 && (
            <span className={"mx-1 text-xl text-gray-500"}>/</span>
          )}
          <span className="block px-1 py-0.5 last:font-medium last:text-teal-600">
            {props.lastCrumb.name}
          </span>
        </>
      )}
    </div>
  );
}
