import type { Crumb } from "~/pages/common/components/Breadcrumb/types";

export function removeCrumbs(idxToRemove: number[], crumbs: Crumb[]): Crumb[] {
  const filtered: Crumb[] = [];

  for (let i = 0; i < crumbs.length; i++) {
    if (!idxToRemove.includes(i)) {
      filtered.push(crumbs[i]);
    }
  }
  return filtered;
}

export function removeLinks(idxToRemove: number[], crumbs: Crumb[]): Crumb[] {
  for (const i of idxToRemove) {
    if (i < crumbs.length) {
      crumbs[i].path = null;
    }
  }
  return crumbs;
}

export function replaceLinks(
  linksToReplace: { idx: number; link: string | null }[],
  crumbs: Crumb[],
): Crumb[] {
  for (const { idx, link } of linksToReplace) {
    if (idx < crumbs.length) {
      crumbs[idx].path = link;
    }
  }
  return crumbs;
}

/**
 *
 * @param endIdxToRemove indexes of items to remove, the indexes count from the end. E.g [5, 6, 7, 8], 8 would have idx 0, 7 would have idx 1
 * @param crumbs
 */
export function removeLinksFromEndIdx(
  endIdxToRemove: number[],
  crumbs: Crumb[],
): Crumb[] {
  const lastIdx = crumbs.length - 1;

  for (const endIdx of endIdxToRemove) {
    const idx = lastIdx - endIdx;
    if (idx < 0 || idx > lastIdx) {
      continue;
    }
    crumbs[idx].path = null;
  }

  return crumbs;
}

/**
 *
 * @param endIdxToRemove indexes of items to remove, the indexes count from the end. E.g [5, 6, 7, 8], 8 would have idx 0, 7 would have idx 1
 * @param crumbs
 */
export function removeCrumbsFromEndIdx(
  endIdxToRemove: number[],
  crumbs: Crumb[],
): Crumb[] {
  const filtered: Crumb[] = [];
  const lastIdx = crumbs.length - 1;

  const idxToRemove = endIdxToRemove
    .map((endIdx) => lastIdx - endIdx)
    .filter((i) => !(i < 0 || i > lastIdx));

  for (let i = 0; i < crumbs.length; i++) {
    if (!idxToRemove.includes(i)) {
      filtered.push(crumbs[i]);
    }
  }
  return filtered;
}

export function replaceLinksFromEndIdx(
  linksToReplace: { idx: number; link: string | null }[],
  crumbs: Crumb[],
) {
  const lastIdx = crumbs.length - 1;

  for (const { idx: endIdx, link } of linksToReplace) {
    const idx = lastIdx - endIdx;
    if (idx < 0 || idx > lastIdx) {
      continue;
    }
    crumbs[idx].path = link;
  }

  return crumbs;
}
