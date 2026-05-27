import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Roudah from "../Roudah.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Roudah />
  </StrictMode>
);
