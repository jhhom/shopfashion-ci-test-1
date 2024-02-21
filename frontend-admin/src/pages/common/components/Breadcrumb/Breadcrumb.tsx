import { useRouter, RouterState, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { client } from "~/external/api-client/client";
import { generateBreadcrumbFromRoute } from "~/pages/common/components/Breadcrumb/breadcrumb-generator";
import { catchAllRoute } from "~/routes/routes";
import { routeBreadcrumbModifiers } from "~/routes/routes";

import {
  Breadcrumbs,
  Breadcrumb as AriaBreadcrumb,
} from "react-aria-components";
import { IconChevronRight } from "~/pages/common/Icons";

export function Breadcrumb() {
  const h = useRouter();

  const [breadcrumb, setBreadcrumb] = useState<
    | {
        title: string;
        path: string | null;
      }[]
    | null
  >([]);

  const matchedPath: RouterState["matches"][number] | null =
    h.state.matches.length > 0
      ? h.state.matches[h.state.matches.length - 1]
      : null;

  useEffect(() => {
    generateBreadcrumbFromRoute(
      matchedPath?.routeId,
      matchedPath?.params,
      getTitleOfParam,
      routeBreadcrumbModifiers
    ).then((c) => {
      setBreadcrumb(c);
    });
  }, [matchedPath?.routeId, matchedPath?.params]);

  if (matchedPath?.routeId === catchAllRoute.id) {
    return null;
  }

  return (
    <Breadcrumbs className="flex">
      {breadcrumb?.map((c, i) => (
        <AriaBreadcrumb
          className="flex items-center text-sm text-gray-600"
          key={`${c.path}-${c.title}`}
        >
          {c.path === null ? (
            <span className="rounded-md px-1 py-1">{c.title}</span>
          ) : (
            <Link
              className="rounded-md px-1 py-1 hover:bg-gray-100"
              to={c.path as any}
              params={{}}
            >
              {c.title}
            </Link>
          )}
          {i !== breadcrumb.length - 1 && (
            <div className="flex h-4 w-4 items-center justify-center">
              <IconChevronRight className="h-3 w-3 text-gray-400" />
            </div>
          )}
        </AriaBreadcrumb>
      ))}
    </Breadcrumbs>
  );
}

async function getTitleOfParam(
  param: string,
  value: string
): Promise<string | null> {
  const r = await client.breadcrumb.getBreadcrumbTitleOfRouteParameter({
    params: {
      value,
      param,
    },
  });
  if (r.status !== 200) {
    return null;
  }
  return r.body.title;
}
