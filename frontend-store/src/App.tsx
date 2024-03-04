import { RouterProvider } from "@tanstack/react-router";
import QueryProvider from "~/providers/query";
import { router } from "~/routes/routes";

function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}

export default App;
