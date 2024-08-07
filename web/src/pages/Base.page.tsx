import HeaderContainer from "@/containers/Header.container.tsx";
import { AuthContext } from "@tkzwhr/react-hasura-auth0";
import { Layout, Skeleton } from "antd";
import { Suspense, useEffect, useState } from "react";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useLocation } from "react-use";
import styled from "styled-components";

import "antd/dist/reset.css";

const StyledLayout = styled(Layout)`
  height: 100vh;

  .content {
    padding: 24px 50px;

    .inner {
      padding: 24px;
    }
  }
`;

export default function BasePage() {
  const authState = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authState.mode !== "auth0") {
      setLoading(false);
      return;
    }

    const userId = authState.auth0.user?.sub;
    if (!userId) {
      setLoading(false);
      return;
    }

    (async () => {
      if (import.meta.env.DEV) {
        const { registerUser } = await import("@/utils/dev");
        await registerUser(userId, authState.auth0.user?.name ?? "Dev User");
      }

      setLoading(false);
    })();
  }, [authState]);

  if (
    authState.mode === "auth0" &&
    !authState.auth0.isAuthenticated &&
    location.pathname !== "/sign-in"
  ) {
    return <Navigate replace to="/sign-in" />;
  }

  // サインイン状態であればサインイン画面に遷移させない
  if (
    (authState.mode === "jwt" || authState.auth0.isAuthenticated) &&
    location.pathname === "/sign-in"
  ) {
    return <Navigate replace to="/" />;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <StyledLayout>
      <Layout.Header>
        <HeaderContainer />
      </Layout.Header>
      <Layout.Content className="content">
        <div className="inner">
          <Suspense fallback={<Skeleton />}>
            <Outlet />
          </Suspense>
        </div>
      </Layout.Content>
    </StyledLayout>
  );
}
