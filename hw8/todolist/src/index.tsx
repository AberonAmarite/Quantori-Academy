import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import Root from "./reducers";

const domNode = document.getElementById("root");
if (domNode) {
  const root = createRoot(domNode);
  root.render(
    <StrictMode>
      <Root></Root>
    </StrictMode>
  );
}
