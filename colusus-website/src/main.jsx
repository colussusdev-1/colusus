import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "flag-icons/css/flag-icons.min.css";

import "./index.css";
import "./styles/reset.css";
import "./styles/variables.css";
import "./styles/global.css";
import "./styles/utilities.css";

import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);