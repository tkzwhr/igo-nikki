import useAuth from '@/hooks/auth';
import HomePage from '@/pages/Home.page';
import SignInPage from '@/pages/SignIn.page';
import {
  ApolloClient,
  ApolloProvider,
  createHttpLink,
  InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Auth0Provider } from '@auth0/auth0-react';
import { Button, Layout, Menu, Space, Spin, theme, Typography } from 'antd';
import React from 'react';
import { createRoot } from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';

import 'antd/dist/reset.css';

const AUTH0_DOMAIN = 'igo-nikki.jp.auth0.com';
const AUTH0_CLIENT_ID = 'qKlGozLJqeTFWz42jQ2Hkq2vEDtt84pI';

const apiHost = import.meta.env.PROD
  ? 'https://igo-nikki-api.teruru.net'
  : 'http://localhost:20180';
const apolloHttpLink = createHttpLink({
  uri: `${apiHost}/v1/graphql`,
});
const apolloCache = new InMemoryCache();

type PageKey = 'home' | 'sign-in';

const PAGES: { key: PageKey; path: string; name: string }[] = [
  {
    key: 'home',
    path: '/',
    name: 'ホーム',
  },
  {
    key: 'sign-in',
    path: '/sign-in',
    name: 'サインイン',
  },
];

const MENUS = PAGES.filter((p) => p.key !== 'sign-in').map((p) => ({
  key: p.path,
  label: p.name,
}));

const PAGE_COMPONENTS = PAGES.map((p) => {
  switch (p.key) {
    case 'home':
      return {
        path: p.path,
        element: (
          <App>
            <HomePage />
          </App>
        ),
      };
    case 'sign-in':
      return {
        path: p.path,
        element: (
          <App>
            <SignInPage />
          </App>
        ),
      };
  }
});

const Styled = styled(Layout)`
  height: 100vh;

  .header {
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
      margin: 16px 0px 16px 24px;
      color: whitesmoke;
      line-height: 31px;
    }
  }

  .content {
    padding: 24px 50px;

    .inner {
      padding: 24px;
    }
  }
`;

function App({ children }: { children: React.ReactNode }) {
  const authState = useAuth();

  const location = useLocation();
  const navigate = useNavigate();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  if (authState.loading) {
    return (
      <Styled>
        <Layout.Header className="header">
          <Typography.Title className="title" level={4}>
            囲碁日記
          </Typography.Title>
        </Layout.Header>
        <Layout.Content className="content">
          <div className="inner">
            <Spin size="large">
              <div></div>
            </Spin>
          </div>
        </Layout.Content>
      </Styled>
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

  const authLink = setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: authState.token ? `Bearer ${authState.token}` : '',
      },
    };
  });

  const client = new ApolloClient({
    link: authLink.concat(apolloHttpLink),
    cache: apolloCache,
  });

  const navigatePage = (a: any) => {
    navigate(a.key, { replace: true });
  };

  const selectedKeys = MENUS.filter((m) => m.key === location.pathname)?.map(
    (m) => m.key,
  );
  const bgColorStyle = { background: colorBgContainer };

  return (
    <ApolloProvider client={client}>
      <Styled>
        <Layout.Header className="header">
          <Typography.Title className="title" level={4}>
            囲碁日記
          </Typography.Title>
          {authState.isAuthenticated && (
            <Menu
              theme="dark"
              mode="horizontal"
              style={{ float: 'left' }}
              items={MENUS}
              defaultSelectedKeys={selectedKeys}
              onClick={navigatePage}
            />
          )}
          <Space className="actions">
            {authState.isAuthenticated ? authState.userName : ''}
            <Button ghost onClick={() => authState.act()}>
              {authState.isAuthenticated ? 'ログアウト' : 'ログイン'}
            </Button>
          </Space>
        </Layout.Header>
        <Layout.Content className="content">
          <div className="inner" style={bgColorStyle}>
            {children}
          </div>
        </Layout.Content>
      </Styled>
    </ApolloProvider>
  );
}

const router = createBrowserRouter(PAGE_COMPONENTS);
const rootContainer = document.getElementById('root');
const root = createRoot(rootContainer!);
root.render(
  <Auth0Provider
    domain={AUTH0_DOMAIN}
    clientId={AUTH0_CLIENT_ID}
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
  >
    <RouterProvider router={router} />
  </Auth0Provider>,
);
