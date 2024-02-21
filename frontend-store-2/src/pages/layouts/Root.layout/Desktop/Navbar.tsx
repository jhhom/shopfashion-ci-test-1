import { useState } from "react";
import { clsx as cx } from "clsx";
import { Link, LinkProps, useNavigate } from "@tanstack/react-router";
import { Search } from "~/pages/layouts/Root.layout/components/Search";

import {
  IconPerson,
  IconSearch,
  IconShoppingCart,
  IconClose,
} from "~/pages/common/Icons";

export function Navbar(props: {
  onOpen: (taxonId: number) => void;
  rootTaxons: { taxonId: number; taxonName: string }[];
}) {
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="flex h-full w-full justify-between px-12">
      {showSearch ? (
        <Search
          showSearch={showSearch}
          onSearch={(searchTerm: string) => {
            navigate({ to: "/search", search: { search: searchTerm } });
            setShowSearch(false);
          }}
          onCloseSearch={() => setShowSearch(false)}
        />
      ) : (
        <>
          <div className="flex items-center">
            <a
              href="/"
              className="block px-2 py-2 font-logo text-2xl font-medium underline decoration-teal-500 decoration-2"
            >
              shopfashion
            </a>
            <div className="flex pl-10 text-sm  uppercase">
              {props.rootTaxons.map((t) => (
                <NavLink
                  key={t.taxonId}
                  text={t.taxonName}
                  onMouseEnter={() => props.onOpen(t.taxonId)}
                  onClick={() => props.onOpen(t.taxonId)}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              icon={<IconSearch className="h-[1.625rem] w-[1.625rem]" />}
              onClick={() => {
                setShowSearch(true);
              }}
            />
            <NavButton
              icon={<IconPerson className="h-[1.625rem] w-[1.625rem]" />}
              to="/member"
              search={{}}
              params={{}}
            />
            <NavButton
              icon={<IconShoppingCart className="h-[1.625rem] w-[1.625rem]" />}
              to="/cart"
              search={{}}
              params={{}}
            />
          </div>
        </>
      )}
    </div>
  );
}

function NavLink(props: {
  text?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
}) {
  return (
    <button
      className="px-4 uppercase decoration-blue-500 decoration-[3px] underline-offset-[6px] hover:underline"
      onClick={props.onClick}
      onMouseEnter={props.onMouseEnter}
    >
      {props.text}
    </button>
  );
}

function Button({
  className,
  icon,
  onClick,
}: {
  className?: string;
  icon: JSX.Element;
  onClick: () => void;
}) {
  return (
    <button
      className={cx("flex h-9 w-9 items-center justify-center", className)}
      onClick={onClick}
    >
      {icon}
    </button>
  );
}

function NavButton({
  className,
  ...props
}: {
  icon: JSX.Element;
} & LinkProps) {
  return (
    <Link
      {...props}
      className={cx("flex h-9 w-9 items-center justify-center", className)}
    >
      {props.icon}
    </Link>
  );
}

function Search1(props: {
  searchTerm: string;
  onSearchTermChange: (newSearchTerm: string) => void;
  onSearch: () => void;
}) {
  return (
    <div className="flex h-10 flex-grow items-center">
      <input
        type="text"
        autoFocus
        placeholder="Search by keyword"
        className="h-full flex-grow border border-gray-300 px-3 text-sm"
        value={props.searchTerm}
        onChange={(e) => {
          props.onSearchTermChange(e.target.value);
        }}
      />
      <button
        onClick={props.onSearch}
        className="flex h-full w-10 items-center justify-center bg-teal-500 text-white"
      >
        <IconSearch className="h-6 w-6" />
      </button>
    </div>
  );
}
