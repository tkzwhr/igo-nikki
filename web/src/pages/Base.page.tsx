import HeaderContainer from "@/containers/Header.container.tsx";
import { AuthContext } from "@tkzwhr/react-hasura-auth0";
import { Layout, Skeleton } from "antd";
import React, { Suspense } from "react";
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
