import { Toaster } from "react-hot-toast";
import { PropsWithChildren, useEffect, useState } from "react";
import { useClickAway } from "@uidotdev/usehooks";

import { Navbar } from "~/pages/Home/components/Navbar";
import { NavPopup } from "~/pages/Home/components/NavPopup";

import { useHover } from "@uidotdev/usehooks";

import { Outlet } from "@tanstack/react-router";

export function UserLoginRootLayout() {
  return (
    <div className="relative">
      <div className="h-16 border-b border-gray-300 bg-white">
        <Navbar rootTaxons={[]} onOpen={(t) => {}} />
      </div>

      <Outlet />
    </div>
  );
}
