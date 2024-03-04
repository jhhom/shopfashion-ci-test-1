import {
  Outlet,
  RouterProvider,
  Link,
  Router,
  Route,
  RootRoute,
  redirect,
} from "@tanstack/react-router";
import QueryProvider from "~/providers/query";
import { router } from "~/routes/routes";

import "./markdown-content.css";

// Create the router using your route tree

const App = () => {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
};

export default App;
