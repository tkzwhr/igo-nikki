import { PAGES } from "@/pages/pages.ts";
import { AuthContext } from "@tkzwhr/react-hasura-auth0";
import { Button, Menu, Space, Spin, Typography } from "antd";
import type React from "react";
import { useCallback } from "react";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-use";
import styled from "styled-components";

const StyledDiv = styled.div`
position: sticky;
top: 0;
z-index: 1;

.title {
  float: left;
  width: 100px;
  height: 31px;
  margin: 16px 24px 16px 0;
  color: whitesmoke;
}

.actions {
  float: right;
  height: 31px;
  margin: 16px 0 16px 24px;
  color: whitesmoke;
  line-height: 31px;
}
`;

export default function HeaderContainer() {
  const authState = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  const signIn = useCallback(() => {
    if (authState.mode !== "auth0") {
      return;
    }

    authState.auth0.client.loginWithPopup().then(() => {
      window.location.href = "/";
    });
  }, [authState]);

  let actions: React.ReactNode = <div />;
  if (authState.mode === "auth0") {
    if (authState.auth0.isAuthenticated) {
      const items = PAGES.filter(({ visibleOnMenu }) => visibleOnMenu).map(
        ({ path, label }) => ({ key: path, label }),
      );

      const selectedKeys = PAGES.filter(
        ({ path }) => path === location.pathname,
      )?.map(({ path }) => path);

      actions = (
        <>
          <Menu
            theme="dark"
            mode="horizontal"
            style={{ float: "left" }}
            items={items}
            defaultSelectedKeys={selectedKeys}
            onClick={(item) => navigate(item.key, { replace: true })}
          />
          <Space className="actions">
            {authState.auth0.user?.name ?? "Dev User"}
            <Button ghost onClick={() => authState.auth0.client.logout()}>
              サインアウト
            </Button>
          </Space>
        </>
      );
    } else {
      actions = (
        <Space className="actions">
          <Button ghost onClick={signIn}>
            サインイン
          </Button>
        </Space>
      );
    }
  }

  return (
    <StyledDiv>
      <Typography.Title className="title" level={4}>
        囲碁日記
      </Typography.Title>
      {actions}
    </StyledDiv>
  );
}
