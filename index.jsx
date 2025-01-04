import React from "react";
import ReactDOM from "react-dom/client"; // Use the new `react-dom/client` package
import { BrowserRouter } from "react-router-dom";
import App from "./App";

// Get the root element from your HTML
const rootElement = document.getElementById("root");

// Create a root for React 18
const root = ReactDOM.createRoot(rootElement);

// Render the app
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
