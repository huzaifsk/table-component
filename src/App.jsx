import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
import ViewTable from "./ViewTable";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <ViewTable />
    </>
  );
}

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
      <App />
    </StrictMode>,
  );
}
