import { useQuery } from "@tanstack/react-query";
import { useLocalStorageAuth } from "~/external/browser/local-storage/use-auth.hook";
import { useAppStore } from "~/stores/stores";

import { QUERY_KEY } from "~/pages/Membership/query";
import { client } from "~/external/api-client/client";
import { Outlet, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import { useProfile } from "~/pages/Membership/api";

export function ProfileSubpage() {
  const appStore = useAppStore();
  const authStorage = useLocalStorageAuth();
  const navigate = useNavigate();

  const profileQuery = useProfile();

  return (
    <div className="rounded-md border border-gray-300 px-5 pb-5 pt-5">
      <div className="flex-grow">
        <div className="pb-6">
          <p className="text-xl font-medium">Profile</p>
          <p className="mt-4 text-sm font-semibold">Email Address</p>
          <p className="mt-1 text-sm">{profileQuery.data?.email ?? ""}</p>
        </div>
        <button
          onClick={() => {
            authStorage.clearToken();
            appStore.setAuthenticated(false);
            appStore.setNavigateTo(null);
            navigate({ to: "/" });
            toast.success("You are logged-out", {
              position: "top-center",
              duration: 2000,
            });
          }}
          className="mt-12 w-[240px] rounded-md bg-red-500 py-2.5 text-white"
        >
          Log out
        </button>
      </div>
    </div>
  );
}
