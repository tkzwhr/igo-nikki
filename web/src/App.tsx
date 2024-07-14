import BasePage from "@/pages/Base.page.tsx";
import HasuraWithAuth0 from "@tkzwhr/react-hasura-auth0";
import React, { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

const HomePage = lazy(() => import("@/pages/Home.page.tsx"));
const SignInPage = lazy(() => import("@/pages/SignIn.page.tsx"));

type Props = {
  hasuraUri: string;
  auth0Domain: string;
  auth0ClientId: string;
  auth0Audience: string;
};

export default function App(props: Props) {
  return (
    <React.StrictMode>
      <Suspense fallback={<div>Loading...</div>}>
        <HasuraWithAuth0
          bypassAuth0={false}
          hasuraUri={props.hasuraUri}
          auth0Domain={props.auth0Domain}
          auth0ClientId={props.auth0ClientId}
          auth0RedirectUri={window.location.origin}
          auth0Audience={props.auth0Audience}
          auth0Scope="openid profile email"
        >
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<BasePage />}>
                <Route index element={<HomePage />} />
                <Route path="/sign-in" element={<SignInPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </HasuraWithAuth0>
      </Suspense>
    </React.StrictMode>
  );
}
