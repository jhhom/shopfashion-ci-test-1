import {  QueryKey, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

export function LoadingSpinnerOverlay() {
  return (
    <div className="absolute left-1/2 top-1/2 z-20  flex  h-full w-full -translate-x-1/2 -translate-y-1/2 items-center justify-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-md bg-white shadow-o-md">
        <span className="loader"></span>
      </div>
    </div>
  );
}

export function _useQueryLoadingSpinner2(queryKeys: QueryKey[]) {
  const client = useQueryClient();

  // we want to check that `query.queryKey` matches either one of the queryKeys
  // if it doesn't match all of queryKeys, return false
  // if it matches one of the queryKeys, return true

  // how to check if it match: we need to compare query keys the same way as how React Query compares them
  // the way Tanstack Query does matching: https://github.com/TanStack/query/discussions/3316

  // how to check multiple query keys: use client.isFetching
  // Reference: https://github.com/TanStack/query/discussions/3339

  useEffect(() => {});
  client.isFetching({});
}
