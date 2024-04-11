import {
  Outlet,
  Link,
  LinkOptions,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { clsx as cx } from "clsx";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { IconBurgerMenu } from "~/pages/common/Icons";
import toast, { Toaster } from "react-hot-toast";
import { Breadcrumb } from "~/pages/common/components/Breadcrumb/Breadcrumb";
import { useUser } from "~/providers/user";
import { LoginPage } from "~/pages/Login/page";
import {
  storage,
  useLocalStorageAuth,
} from "~/external/browser/use-local-storage-auth";
import { useVerifyToken } from "~/pages/Home/api";
import { useAfterVerifyTokenNavigation } from "~/providers/after-verify-token-navigation";
import { DashboardPage } from "~/pages/Home/Dashboard/page";

export function HomePage() {
  const [openSidebar, setOpenSidebar] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();
  const pathname = useRouter().state.location.pathname;

  const { clearToken } = useLocalStorageAuth();

  const [user, setUser] = useUser();
  const [afterVerifyTokenNavigation, setAfterVerifyTokenNavigation] =
    useAfterVerifyTokenNavigation();

  const verifyTokenMutation = useVerifyToken({
    onError: () => {
      clearToken();
      // if token verification process fails, we reset any path the user will navigate to
      setAfterVerifyTokenNavigation(null);
    },
  });

  const token = storage.getToken();

  useEffect(() => {
    // @ts-ignore
    var _mtm = (window._mtm = window._mtm || []);
    _mtm.push({ "mtm.startTime": new Date().getTime(), event: "mtm.Start" });
    var d = document,
      g = d.createElement("script"),
      s = d.getElementsByTagName("script")[0];
    g.async = true;
    g.src = "https://matomo.joohom.dev/js/container_8MuMkugE.js";
    // @ts-ignore
    s.parentNode.insertBefore(g, s);
  }, []);

  useEffect(() => {
    if (user === null && token !== "" && token !== null) {
      verifyTokenMutation.mutate();
    }
  }, []);

  useEffect(() => {
    contentRef.current?.scrollTo(0, 0);
  }, [pathname]);

  // if user is logged-out
  if (user === null) {
    if (pathname !== "/") {
      // check if there is token, if there is we store the path user is navigating to
      // so that we can redirect to it later after the token verification process is done
      // after that we redirect to home page which will show the login form because user is logged-out

      if (token !== "" && token !== null) {
        setAfterVerifyTokenNavigation({ to: pathname });
      }
      navigate({ to: "/" });
    } else {
      return <LoginPage />;
    }
  }

  // when user is logged-in and `afterVerifyTokenNavigation` is set
  // it means user has successfully gone through the token verification process
  // so we redirect the user back to the page the user was visiting before the verification process
  if (afterVerifyTokenNavigation !== null) {
    // @ts-ignore
    navigate({ to: afterVerifyTokenNavigation.to });
    setAfterVerifyTokenNavigation(null);
  }

  return (
    <div>
      <div className="flex h-screen">
        <div
          className={cx(
            "min-h-screen max-w-[240px] basis-1/5 overflow-y-auto bg-gray-50",
            { hidden: !openSidebar }
          )}
        >
          <Sidebar
            onLogout={() => {
              clearToken();
              setAfterVerifyTokenNavigation(null);
              setUser(null);
              toast.success("Log out successfully", {
                position: "top-right",
              });
            }}
          />
        </div>
        {/* 
        Basis set to a fixed width (10px), otherwise overflow-x-auto won't work
        Reference: https://stackoverflow.com/questions/34154349/flexbox-and-overflow-hidden-not-working-properly
        */}
        <div className="flex-shrink flex-grow basis-[10px] overflow-x-auto">
          <div className="h-10 border-b border-gray-200 shadow-sm">
            <button
              onClick={() => setOpenSidebar(!openSidebar)}
              className="h-10 w-10 p-2 hover:bg-gray-100"
            >
              <IconBurgerMenu />
            </button>
          </div>
          <div
            ref={contentRef}
            className="relative h-[calc(100vh-2.5rem)] w-full overflow-y-auto bg-gray-50 px-5 pt-5"
          >
            <Breadcrumb />
            <div className="mt-4">
              {pathname === "/" ? <DashboardPage /> : <Outlet />}
            </div>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
}
function Sidebar(props: { onLogout: () => void }) {
  return (
    <div className="flex h-full flex-col bg-gray-700">
      <p className=" px-2 pb-4 pt-6 text-center font-logo text-2xl font-medium text-white underline decoration-teal-500 decoration-2">
        shopfashion
      </p>
      <div className="flex-grow text-white">
        <div className="mt-4 py-2 pr-4 text-sm">
          <SidebarLink options={{ to: "/", params: {} }} text="Dashboard" />
        </div>
        <div className="mt-4 py-4 text-sm">
          <p className="pl-4 font-semibold uppercase">Catalog</p>
          <ul className="mt-2 pr-4">
            <SidebarLink
              options={{ to: "/products", params: {} }}
              text="Products"
            />
            <SidebarLink
              options={{ to: "/options", params: {} }}
              text="Options"
            />
            <SidebarLink
              options={{ to: "/taxon/new", params: {} }}
              text="Taxons"
            />
          </ul>

          <p className="mt-8 pl-4 font-semibold uppercase">Sales</p>
          <ul className="mt-2 pr-4">
            <SidebarLink
              options={{ to: "/orders", params: {} }}
              text="Orders"
            />
            <SidebarLink
              options={{ to: "/customers", params: {} }}
              text="Customers"
            />
            <SidebarLink
              options={{ to: "/product-associations", params: {} }}
              text="Association types"
            />
          </ul>
        </div>
      </div>
      <div className="h-32 px-3">
        <button
          onClick={props.onLogout}
          className="w-full rounded-md bg-red-700 py-2.5 font-medium text-white hover:bg-red-600"
        >
          Log out
        </button>
      </div>
    </div>
  );
}

function SidebarLink(props: { text: string; options: LinkOptions }) {
  return (
    <Link
      className="block rounded-r-full py-2 pl-4"
      {...props.options}
      activeProps={{
        className: "bg-cyan-600 text-white font-semibold",
      }}
    >
      {props.text}
    </Link>
  );
}
