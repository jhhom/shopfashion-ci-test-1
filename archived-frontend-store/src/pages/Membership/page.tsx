import {
  Link,
  Outlet,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { match } from "ts-pattern";
import { useAppStore } from "~/stores/stores";

export function MembershipPage() {
  const rs = useRouterState();

  const authenticated = useAppStore((s) => s.authenticated);

  const navigate = useNavigate({ from: "/" });

  useEffect(() => {
    if (!authenticated) {
      navigate({ to: "/login" });
    }
  }, [authenticated, navigate]);

  return (
    <div className="px-4 pt-8 md:px-12">
      <h1 className="text-xl font-semibold">
        {match(rs.location.pathname)
          .with("/member", () => "Membership")
          .with("/member/purchases", () => "Purchase history")
          .otherwise(() => "Membership")}
      </h1>

      <div className="block md:mt-8 md:flex">
        <ul
          className="mt-8 flex items-center space-x-2 rounded-md
         bg-gray-50 px-1 py-1 text-left text-sm md:mt-0 md:block
          md:basis-[220px] md:space-x-0 md:space-y-2 md:rounded-none md:bg-white md:px-0 md:py-0 md:pt-8"
        >
          <li>
            <Link
              to="/member"
              activeOptions={{ exact: true }}
              className="block rounded-md px-4 py-2.5"
              activeProps={{
                className: "text-teal-600 bg-teal-100 hover:bg-teal-100",
              }}
              inactiveProps={{
                className: "hover:bg-gray-100",
              }}
            >
              Profile
            </Link>
          </li>
          <li>
            <Link
              className="block rounded-md px-4 py-2.5"
              activeOptions={{
                includeSearch: false,
              }}
              activeProps={{
                className: "text-teal-600 bg-teal-100",
              }}
              inactiveProps={{
                className: "hover:bg-gray-100",
              }}
              to="/member/purchases"
              search={{ status: "TO_RECEIVE" }}
            >
              Purchase History
            </Link>
          </li>
        </ul>

        <div className="mt-8 basis-[calc(100%-220px)] md:mt-0 md:pl-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
