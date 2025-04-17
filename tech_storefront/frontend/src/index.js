import React from "react";
import { createRoot } from "react-dom/client";
import App from "./components/App";
import CssBaseline from "@mui/material/CssBaseline";

const appDiv = document.getElementById("app");
const root = createRoot(appDiv);
root.render(
  <>
    <CssBaseline />
    <App />
  </>
);