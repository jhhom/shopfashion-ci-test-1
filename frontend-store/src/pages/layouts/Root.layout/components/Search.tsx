import { IconSearch, IconBars, IconClose } from "~/pages/common/Icons";
import { client } from "~/external/api-client/client";

import { useEffect, useRef, useState } from "react";
import { Combobox } from "@headlessui/react";
import { useDebounce } from "@uidotdev/usehooks";
import { Link, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useKeyPress } from "react-use";
import Highlighter from "react-highlight-words";
import { useSearchAutocomplete } from "~/pages/layouts/api";
import { clsx as cx } from "clsx";

export function Search({
  showSearch,
  onSearch,
  onCloseSearch,
}: {
  showSearch: boolean;
  onSearch: (searchTerm: string) => void;
  onCloseSearch: () => void;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 400);
  const autocompleteQuery = useSearchAutocomplete(debouncedSearchTerm);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useKeyPress((e) => {
    if (e.key === "Enter" && showSearch && searchTerm !== "") {
      onSearch(searchTerm);
      setSearchTerm("");
    }
    if (e.key === "Escape" && showSearch) {
      onCloseSearch();
      setSearchTerm("");
    }
    return e.key === "Enter";
  });

  useEffect(() => {
    if (showSearch) {
      inputRef.current?.focus();
    }
  }, [showSearch]);

  return (
    <div className="flex w-full h-full items-center px-4">
      <div className="flex h-10 flex-grow items-center">
        <Combobox
          as={"div"}
          value={searchTerm}
          className="relative w-full"
          onChange={(p) => setSearchTerm(p)}
        >
          <Combobox.Input
            ref={inputRef}
            placeholder="Search by keyword"
            className="w-full border border-gray-400 px-2 py-1.5"
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Combobox.Options className="absolute top-12 z-50 min-h-4 w-full border border-gray-300 bg-white">
            {searchTerm.length > 0 && (
              <Combobox.Option
                className="cursor-pointer px-2 py-2 hover:bg-gray-100"
                value={searchTerm}
              >
                {searchTerm}
              </Combobox.Option>
            )}
            {(autocompleteQuery.data?.productNames ?? []).map((n) => (
              <Combobox.Option
                className={({ active }) =>
                  cx("cursor-pointer px-2 py-2 hover:bg-gray-100", {
                    "bg-teal-600 text-white": active,
                  })
                }
                key={n}
                value={n}
              >
                {({ active }) => (
                  <Highlighter
                    highlightClassName={cx("font-bold bg-transparent", {
                      "text-teal-600": !active,
                      "text-white": active,
                    })}
                    searchWords={[debouncedSearchTerm]}
                    textToHighlight={n}
                  />
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </Combobox>
        <button
          onClick={() => onSearch(searchTerm)}
          className="flex h-full w-10 items-center justify-center bg-teal-500 text-white"
        >
          <IconSearch className="h-6 w-6" />
        </button>
      </div>
      <div className="pl-4">
        <button
          onClick={() => {
            onCloseSearch();
            setSearchTerm("");
          }}
          className="flex h-8 w-8 items-center justify-center"
        >
          <IconClose className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
}
