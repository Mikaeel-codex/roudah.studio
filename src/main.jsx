import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Roudah from "../Roudah.jsx";
import "./index.css";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

window.scrollTo(0, 0);
window.addEventListener("pageshow", () => {
  window.scrollTo(0, 0);
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Roudah />
  </StrictMode>
);
