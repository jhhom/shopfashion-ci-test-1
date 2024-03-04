import React, { PropsWithChildren, useEffect, useState } from "react";

import {
  IconFavourite,
  IconPerson,
  IconShoppingCart,
} from "~/pages/common/Icons";

import { clsx as cx } from "clsx";
import { Link, LinkProps, Outlet, useRouter } from "@tanstack/react-router";

import { MobileSidebar } from "~/pages/layouts/Root.layout/Mobile/MobileSidebar";
import { Navbar } from "~/pages/layouts/Root.layout/Mobile/Navbar";
import { Taxon } from "~/pages/layouts/Root.layout/types";

import { FooterLink } from "~/pages/layouts/Root.layout/Desktop/NavbarLayout.layout";

export function NavbarLayout({
  taxonTree,
  children,
}: React.PropsWithChildren<{ taxonTree: Taxon[] }>) {
  const [openMobileSidebar, setOpenMobileSidebar] = useState(false);
  const pathname = useRouter().state.location.pathname;

  return (
    <div>
      <Navbar onOpenSidebar={() => setOpenMobileSidebar(true)} />
      <div className="min-h-[calc(100vh-4rem-8rem)] pt-16">{children}</div>
      <Footer />
      <NavigationButtons />
      <MobileSidebar
        open={openMobileSidebar}
        setOpen={setOpenMobileSidebar}
        taxonTree={taxonTree}
        onTaxonNavigation={() => setOpenMobileSidebar(false)}
      />
    </div>
  );
}

function NavigationButtons() {
  return (
    <div className="fixed bottom-0 left-0 z-10 h-16 w-full">
      <div className="flex h-full w-full border-t border-gray-300 bg-white shadow-o-md">
        <NavigationButton
          to="/member"
          text="Membership"
          icon={<IconPerson className="h-5 w-5 text-gray-500" />}
          search={{}}
          params={{}}
        />
        <NavigationButton
          text="Shopping Cart"
          icon={<IconShoppingCart className="h-5 w-5 text-gray-500" />}
          to="/cart"
          search={{}}
          params={{}}
        />
      </div>
    </div>
  );
}

function NavigationButton({
  text,
  icon,
  className,
  ...props
}: { text: string; icon: JSX.Element } & LinkProps) {
  return (
    <Link
      className={cx(
        "block h-full basis-1/2 border-r text-center text-sm text-gray-600 last:border-r-0",
        className
      )}
      {...props}
    >
      <div className="flex h-8 justify-center pt-3">{icon}</div>
      <p className="h-8 pt-1">{text}</p>
    </Link>
  );
}

function Footer() {
  return (
    <div className="bg-gray-700 px-6 pb-32 pt-8 text-white">
      <p className="block font-logo text-3xl font-medium underline decoration-teal-500 decoration-2">
        shopfashion
      </p>

      <div className="mt-6">
        <p>
          shopfashion is a fashion e-commerce website developed by Joo Hom as a
          portfolio project using ReactJS, TypeScript, Tailwind CSS, and Java
          Spring.
        </p>

        <p className="mt-4">
          If you're interested, check out my other portfolio projects at{" "}
          <FooterLink
            href="https://github.com/jhhom"
            text="GitHub: jhhom"
          ></FooterLink>
        </p>

        <p className="mt-4">
          Inspiration for the project is taken from the awesome{" "}
          <FooterLink
            href="https://sylius.com/"
            text="Sylius e-commerce platform"
          />
          . Some UI inspiration is also taken by referring various works on{" "}
          <FooterLink href="https://sylius.com/" text="Behance" /> and websites
          like <FooterLink href="https://sylius.com/" text="Shopee" /> and{" "}
          <FooterLink href="https://sylius.com/" text="Amazon" />. All photos
          for the sample products are taken from{" "}
          <FooterLink href="https://unsplash.com/" text="Unsplash" />.
        </p>

        <p className="mt-4">
          shopfashion brand is a brand that I made up myself.
        </p>
      </div>
    </div>
  );
}
