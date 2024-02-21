// Imports
// ========================================================
import React from "react";
import ReactDOM from "react-dom/client";
import RootProvider from "./providers";
import App from "./App";

import "./index.css";
import "@smastrom/react-rating/style.css";

// Render
// ========================================================
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RootProvider>
      <App />
    </RootProvider>
  </React.StrictMode>,
);
