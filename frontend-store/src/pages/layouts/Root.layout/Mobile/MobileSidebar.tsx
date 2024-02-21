import { Transition, Dialog } from "@headlessui/react";
import { Link } from "@tanstack/react-router";
import { Fragment, useState } from "react";
import { IconClose } from "~/pages/common/Icons";

import type { Taxon } from "~/pages/layouts/Root.layout/types";

export function MobileSidebar({
  open,
  setOpen,
  taxonTree,
  onTaxonNavigation,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  taxonTree: Taxon[];
  onTaxonNavigation: () => void;
}) {
  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10 md:hidden" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                          Categories
                        </Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <button
                            type="button"
                            className="relative rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            onClick={() => setOpen(false)}
                          >
                            <span className="absolute -inset-2.5" />
                            <span className="sr-only">Close panel</span>
                            <IconClose className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="relative mt-6 flex-1 px-4 font-medium sm:px-6">
                      <div className="space-y-8">
                        {taxonTree.map((t) => (
                          <Taxon
                            key={t.id}
                            {...t}
                            onTaxonNavigation={onTaxonNavigation}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function Taxon(props: Taxon & { onTaxonNavigation: () => void }) {
  return (
    <div>
      <p className="mt-2 uppercase">{props.taxonName}</p>
      <div className="space-y-4">
        {props.children.map((c) => (
          <div key={c.id}>
            <p className="mt-2">{c.taxonName}</p>
            <div className="mt-2 space-y-1 pl-4 text-sm">
              {c.children.map((cc) => (
                <Link
                  className="block"
                  key={cc.id}
                  to={"/products/*"}
                  params={{ "*": cc.slug }}
                  onClick={props.onTaxonNavigation}
                >
                  {cc.taxonName}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
