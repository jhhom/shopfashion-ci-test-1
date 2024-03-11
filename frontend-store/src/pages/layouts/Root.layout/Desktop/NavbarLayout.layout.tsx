import { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

import { Navbar } from "~/pages/layouts/Root.layout/Desktop/Navbar";
import { NavPopup } from "~/pages/layouts/Root.layout/Desktop/NavPopup";

import { useHover } from "@uidotdev/usehooks";

import { clsx as cx } from "clsx";
import { Outlet, useRouter } from "@tanstack/react-router";
import { Taxon } from "~/pages/layouts/Root.layout/types";
import { HomePage } from "~/pages/Home/page";

export function NavbarLayout({
  taxonTree,
  children,
}: React.PropsWithChildren<{ taxonTree: Taxon[] }>) {
  const [openNav, setOpenNav] = useState<
    | { open: false }
    | {
        open: true;
        taxonId: number;
      }
  >({ open: false });

  const navPopupRef = useClickAway<HTMLDivElement>(() => {
    setOpenNav({ open: false });
  });

  const [navPopupHoverRef, isHoveringNavPopup] = useHover<HTMLDivElement>();
  const [navbarHoverRef, isHoveringNavbar] = useHover<HTMLDivElement>();
  const pathname = useRouter().state.location.href;
  const p = window.location.href;

  useEffect(() => {
    if (!isHoveringNavPopup && !isHoveringNavbar) {
      setOpenNav({ open: false });
    }
  }, [isHoveringNavPopup, isHoveringNavbar]);

  return (
    <div className="relative">
      <div
        ref={navbarHoverRef}
        className="h-16 border-b border-gray-300 bg-white font-medium"
      >
        <Navbar
          rootTaxons={taxonTree.map((t) => ({
            taxonId: t.id,
            taxonName: t.taxonName,
          }))}
          onOpen={(t) => setOpenNav({ open: true, taxonId: t })}
        />
      </div>
      <div
        ref={navPopupRef}
        className={cx(
          "absolute top-16 z-10 h-64 w-full border-b border-gray-300 bg-white",
          { hidden: !openNav.open }
        )}
      >
        {openNav.open && (
          <div ref={navPopupHoverRef}>
            <NavPopup
              onClick={() => setOpenNav({ open: false })}
              taxonTree={
                taxonTree.find((t) => t.id === openNav.taxonId)?.children ?? []
              }
            />
          </div>
        )}
      </div>

      <div id="outlet-container" className="min-h-[calc(100vh-12rem-4rem)]">
        {children}
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <div className="bg-gray-700 px-12 pb-28 pt-8 text-white">
      <p className="block font-logo text-3xl font-medium underline decoration-teal-500 decoration-2">
        shopfashion
      </p>

      {/*
      <div className="mt-6 max-w-[640px]">
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
    */}
    </div>
  );
}

export function FooterLink(props: { href: string; text: string }) {
  return (
    <a
      target="_blank"
      className="text-blue-300 hover:underline"
      href={props.href}
    >
      {props.text}
    </a>
  );
}
