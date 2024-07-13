import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const rootContainer = document.getElementById("root");

if (rootContainer) {
  const root = createRoot(rootContainer);
  root.render(
    <App
      hasuraUri={import.meta.env.VITE_HASURA_URI}
      auth0Domain={import.meta.env.VITE_AUTH0_DOMAIN}
      auth0ClientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
      auth0Audience={import.meta.env.VITE_AUTH0_AUDIENCE}
    />,
  );
}
