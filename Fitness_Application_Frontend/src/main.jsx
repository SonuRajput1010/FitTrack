import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import App from "./App.jsx";
import { ColorModeProvider } from "./context/ColorModeContext.jsx";
import ErrorBoundary from "./components/common/ErrorBoundary.jsx";
import keycloak from "./api/keycloak.js";

keycloak
  .init({
    onLoad: "check-sso",
    pkceMethod: "S256",
    checkLoginIframe: false,
  })
  .then((authenticated) => {
    if (authenticated) {
      localStorage.setItem("token", keycloak.token);
      localStorage.setItem("refreshToken", keycloak.refreshToken || "");
      localStorage.setItem("userId", keycloak.tokenParsed?.sub || "demo-user");
    }

    ReactDOM.createRoot(document.getElementById("root")).render(
      <React.StrictMode>
        <ErrorBoundary>
          <BrowserRouter>
            <ColorModeProvider>
              <App />
              <ToastContainer position="top-right" autoClose={3000} />
            </ColorModeProvider>
          </BrowserRouter>
        </ErrorBoundary>
      </React.StrictMode>
    );
  });