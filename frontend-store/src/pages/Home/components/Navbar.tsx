import { ComponentProps, useState } from "react";
import {
  IconFavourite,
  IconPerson,
  IconSearch,
  IconShoppingCart,
  IconClose,
} from "~/pages/common/Icons";
import { clsx as cx } from "clsx";
import { Link, LinkPropsOptions, LinkOptions } from "@tanstack/react-router";
import { useAppStore } from "~/stores/stores";

export function Navbar(props: {
  onOpen: (taxonId: number) => void;
  rootTaxons: { taxonId: number; taxonName: string }[];
}) {
  const appStore = useAppStore();

  return (
    <div className="flex h-full w-full justify-between px-12">
      <>
        <div className="flex items-center">
          <Link
            to="/"
            className="block font-logo text-2xl font-medium underline decoration-teal-500 decoration-2"
          >
            shopfashion
          </Link>
          <div className="flex pl-10 text-sm font-semibold uppercase">
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
          <NavButton
            href={appStore.authenticated ? "/member" : "/login"}
            icon={<IconPerson className="h-[1.625rem] w-[1.625rem]" />}
          />
          <NavButton
            icon={<IconFavourite className="h-[1.625rem] w-[1.625rem]" />}
          />
          <NavButton
            href="/cart"
            icon={<IconShoppingCart className="h-[1.625rem] w-[1.625rem]" />}
          />
        </div>
      </>
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

function NavButton(props: {
  icon: JSX.Element;
  className?: string;
  onClick?: () => void;
  href?: LinkPropsOptions["to"];
}) {
  return (
    <Link
      to={props.href}
      onClick={props.onClick}
      className={cx(
        "flex h-9 w-9 items-center justify-center",
        props.className,
      )}
    >
      {props.icon}
    </Link>
  );
}
