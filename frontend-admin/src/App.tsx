import { RouterProvider } from "@tanstack/react-router";
import QueryProvider from "~/providers/query";
import { router } from "~/routes/routes";

import { RowData } from "@tanstack/react-table";

import { User, UserContext } from "~/providers/user";
import React, { useState } from "react";
import {
  AfterVerifyTokenNavigation,
  AfterVerifyTokenNavigationContext,
} from "~/providers/after-verify-token-navigation";
import { ErrorBoundary } from "~/components/ErrorBoundary";

// Create the router using your route tree
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    headerProps?: {
      className?: string;
    };
    cellProps?: {
      className?: string;
    };
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [afterLoginNavigation, setAfterLoginNavigation] =
    useState<AfterVerifyTokenNavigation | null>(null);

  return (
    <AfterVerifyTokenNavigationContext.Provider
      value={[afterLoginNavigation, setAfterLoginNavigation]}
    >
      <UserContext.Provider value={[user, setUser]}>
        <QueryProvider>
          <RouterProvider router={router} />
        </QueryProvider>
      </UserContext.Provider>
    </AfterVerifyTokenNavigationContext.Provider>
  );
}

export default App;
