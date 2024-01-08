import { Auth0Provider } from '@auth0/auth0-react';
import React from 'react';

import { enableAuth0, getAuth0ClientId } from '@/feature';

const AUTH0_DOMAIN = 'igo-nikki.jp.auth0.com';

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  if (enableAuth0()) {
    return (
      <Auth0Provider
        domain={AUTH0_DOMAIN}
        clientId={getAuth0ClientId()}
        authorizationParams={{
          redirect_uri: window.location.origin,
        }}
      >
        {children}
      </Auth0Provider>
    );
  } else {
    return children;
  }
}
