import type React from "react";
import { useMemo } from "react";
import { createBrowserRouter } from "react-router-dom";

import { App, AppWithoutAuth0 } from "@/App";
import { enableAuth0 } from "@/feature";
import HomePage from "@/pages/Home.page";
import SignInPage from "@/pages/SignIn.page";

type PageKey = "home" | "sign-in";

export const PAGES: {
  key: PageKey;
  path: string;
  label: string;
  visibleOnMenu: boolean;
}[] = [
  {
    key: "home",
    path: "/",
    label: "ホーム",
    visibleOnMenu: true,
  },
  {
    key: "sign-in",
    path: "/sign-in",
    label: "サインイン",
    visibleOnMenu: false,
  },
];

export default function useRouter() {
  return useMemo(() => {
    const components = PAGES.map(({ key, path }) => {
      const createElement = (node: React.ReactNode) =>
        enableAuth0() ? (
          <App>{node}</App>
        ) : (
          <AppWithoutAuth0>{node}</AppWithoutAuth0>
        );

      let element = <div key={key} />;
      switch (key) {
        case "home":
          element = createElement(<HomePage />);
          break;
        case "sign-in":
          element = createElement(<SignInPage />);
          break;
      }

      return {
        path,
        element,
      };
    });
    return createBrowserRouter(components);
  }, []);
}
