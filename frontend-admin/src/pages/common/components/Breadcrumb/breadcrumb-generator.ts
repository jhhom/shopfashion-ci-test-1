import {
  removeCrumbs,
  removeCrumbsFromEndIdx,
  removeLinks,
  removeLinksFromEndIdx,
  replaceLinks,
  replaceLinksFromEndIdx,
} from "~/pages/common/components/Breadcrumb/breadcrumb-modifier";
import { Crumb } from "~/pages/common/components/Breadcrumb/types";

type BreadcrumbTitleGetter = (
  param: "productId" | "productVariantId",
  value: string,
) => Promise<string | null>;

export type BreadcrumbModifier = {
  removeCrumbs?: {
    type: "start" | "end";
    idx: number[];
  };
  removeLinks?: {
    type: "start" | "end";
    idx: number[];
  };
  replaceLinks?: {
    type: "start" | "end";
    links: {
      idx: number;
      link: string | null;
    }[];
  };
};

export async function generateBreadcrumbFromRoute(
  routeId: string,
  params: { [paramName: string]: string },
  getCrumbTitleOfParam: BreadcrumbTitleGetter,
  routeBreadcrumbModifiers: Map<string, BreadcrumbModifier>,
) {
  let breadcrumbs = await generateBreadcrumb(
    routeId,
    params,
    getCrumbTitleOfParam,
  );
  if (breadcrumbs === null) {
    return null;
  }
  const modifier = routeBreadcrumbModifiers.get(routeId);
  if (modifier) {
    // ! CAUTION: we need to remove links first before remove crumbs
    // REASON: remove crumbs will change the index of the array
    // causing remove links to may not remove links at expected indexes
    if (modifier.removeLinks && modifier.removeLinks.idx.length != 0) {
      if (modifier.removeLinks.type === "start") {
        breadcrumbs = removeLinks(modifier.removeLinks.idx, breadcrumbs);
      } else {
        breadcrumbs = removeLinksFromEndIdx(
          modifier.removeLinks.idx,
          breadcrumbs,
        );
      }
    }
    if (modifier.replaceLinks && modifier.replaceLinks.links.length != 0) {
      if (modifier.replaceLinks.type === "start") {
        breadcrumbs = replaceLinks(modifier.replaceLinks.links, breadcrumbs);
      } else {
        breadcrumbs = replaceLinksFromEndIdx(
          modifier.replaceLinks.links,
          breadcrumbs,
        );
      }
    }
    if (modifier.removeCrumbs && modifier.removeCrumbs.idx.length != 0) {
      if (modifier.removeCrumbs.type === "start") {
        breadcrumbs = removeCrumbs(modifier.removeCrumbs.idx, breadcrumbs);
      } else {
        breadcrumbs = removeCrumbsFromEndIdx(
          modifier.removeCrumbs.idx,
          breadcrumbs,
        );
      }
    }
  }
  return breadcrumbs;
}

async function generateBreadcrumb(
  routeId: string,
  params: { [paramName: string]: string },
  getCrumbTitleOfParam: BreadcrumbTitleGetter,
): Promise<Crumb[] | null> {
  const crumbs: Crumb[] = [];
  let pathBuilt = "";

  const _split = routeId.split("/");
  if (_split.length > 0 && _split[0] === "") {
    _split.shift();
  }

  if (_split.length > 0 && _split[0] === "home") {
    crumbs.push({ title: "Administration", path: "/" });
    _split.shift();
  }
  const split = _split.filter((s) => s !== "");

  for (const [i, segment] of split.entries()) {
    if (segment.length > 0 && segment[0] === "$") {
      const param = segment.substring(1);
      const value = params[param];

      const title = await getCrumbTitleOfParam(param as any, value);
      if (title === null) {
        return null;
      }

      pathBuilt += "/" + value;
      crumbs.push({ title, path: i === split.length - 1 ? null : pathBuilt });
    } else {
      pathBuilt += "/" + segment;
      crumbs.push({
        title: segment.charAt(0).toUpperCase() + segment.slice(1),
        path: i === split.length - 1 ? null : pathBuilt,
      });
    }
  }

  return crumbs;
}
