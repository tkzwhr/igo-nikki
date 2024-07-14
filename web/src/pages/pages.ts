type PageKey = "home" | "sign-in";

type Pages = {
  key: PageKey;
  path: string;
  label: string;
  visibleOnMenu: boolean;
};

export const PAGES: Pages[] = [
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
