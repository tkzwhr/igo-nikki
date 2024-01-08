import { ApolloProvider } from '@apollo/client';
import { Button, Menu, Space, Spin } from 'antd';
import React, { createContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import AppLayout from '@/AppLayout';
import useAuth, { AuthState } from '@/hooks/auth';
import useGQLClient from '@/hooks/gqlclient';
import { PAGES } from '@/hooks/router';

type AppContextValueType = {
  userId: string;
  userName: string;
} | null;

export const AppContext = createContext<AppContextValueType>(null);

function Inner({
  children,
  authState,
}: {
  children: React.ReactNode;
  authState: AuthState;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const gqlClient = useGQLClient(
    !authState.loading ? authState.token : undefined,
  );

  const items = PAGES.filter(({ visibleOnMenu }) => visibleOnMenu).map(
    ({ path, label }) => ({ key: path, label }),
  );

  if (authState.loading) {
    return (
      <AppLayout header={<></>}>
        <Spin size="large">
          <div></div>
        </Spin>
      </AppLayout>
    );
  }

  if (authState.isAuthenticated && location.pathname === '/sign-in') {
    navigate('/', { replace: true });
    return <div></div>;
  }

  if (!authState.isAuthenticated && location.pathname !== '/sign-in') {
    navigate('/sign-in', { replace: true });
    return <div></div>;
  }

  const selectedKeys = PAGES.filter(
    ({ path }) => path === location.pathname,
  )?.map(({ path }) => path);

  let header: React.ReactNode;
  let appContextValue: AppContextValueType;
  if (authState.isAuthenticated) {
    header = (
      <>
        <Menu
          theme="dark"
          mode="horizontal"
          style={{ float: 'left' }}
          items={items}
          defaultSelectedKeys={selectedKeys}
          onClick={(item) => navigate(item.key, { replace: true })}
        />
        <Space className="actions">
          {authState.userName}
          <Button ghost onClick={() => authState.act()}>
            ログアウト
          </Button>
        </Space>
      </>
    );
    appContextValue = {
      userId: authState.userId,
      userName: authState.userName,
    };
  } else {
    header = (
      <Space className="actions">
        <Button ghost onClick={() => authState.act()}>
          ログイン
        </Button>
      </Space>
    );
    appContextValue = null;
  }

  return (
    <AppContext.Provider value={appContextValue}>
      <ApolloProvider client={gqlClient}>
        <AppLayout header={header}>{children}</AppLayout>
      </ApolloProvider>
    </AppContext.Provider>
  );
}

export function App({ children }: { children: React.ReactNode }) {
  const authState = useAuth();

  return <Inner authState={authState}>{children}</Inner>;
}

export function AppWithoutAuth0({ children }: { children: React.ReactNode }) {
  const authState: AuthState = {
    loading: false,
    isAuthenticated: true,
    userId: import.meta.env.VITE_DEV_USER,
    userName: `DEV USER ${import.meta.env.VITE_DEV_USER}`,
    act: () => Promise.resolve(),
  };

  return <Inner authState={authState}>{children}</Inner>;
}
