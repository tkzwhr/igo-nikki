import { Layout, Typography } from 'antd';
import React from 'react';
import styled from 'styled-components';

const StyledLayout = styled(Layout)`
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
      margin: 16px 0 16px 24px;
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

export default function AppLayout({
  children,
  header,
}: {
  children: React.ReactNode;
  header: React.ReactNode;
}) {
  return (
    <StyledLayout>
      <Layout.Header className="header">
        <Typography.Title className="title" level={4}>
          囲碁日記
        </Typography.Title>
        {header}
      </Layout.Header>
      <Layout.Content className="content">
        <div className="inner">{children}</div>
      </Layout.Content>
    </StyledLayout>
  );
}
