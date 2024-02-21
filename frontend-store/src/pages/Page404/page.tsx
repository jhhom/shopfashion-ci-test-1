import { Navbar } from "~/pages/Home/components/Navbar";

import { Outlet } from "@tanstack/react-router";
import { PageDoesNotExist } from "~/pages/common/ErrorContents";

export function Page404Page() {
  return (
    <div className="relative">
      <div className="h-16 border-b border-gray-300 bg-white">
        <Navbar rootTaxons={[]} onOpen={(t) => {}} />
      </div>

      <div className="flex h-[calc(100vh-4rem-12rem)] items-center justify-center">
        <PageDoesNotExist />
      </div>

      <div className="h-48 bg-gray-100 px-8 pt-8">
        Fashion-ly is a cool project.
      </div>
    </div>
  );
}
