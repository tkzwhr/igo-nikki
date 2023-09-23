import { useAuth0 } from '@auth0/auth0-react';
import { useAsync } from 'react-use';

type AuthBasis = {
  loading: false;
  token?: string;
  act: () => Promise<void>;
};

type AuthState =
  | { loading: true }
  | (AuthBasis & { isAuthenticated: false })
  | (AuthBasis & { isAuthenticated: true; userName: string });

export default function useAuth(): AuthState {
  const {
    user,
    isAuthenticated,
    isLoading,
    loginWithRedirect,
    logout,
    getAccessTokenSilently,
  } = useAuth0();
  const tokenState = useAsync(async () => {
    return await getAccessTokenSilently({
      authorizationParams: {
        audience: 'jp.tkzwhr.igo-nikki',
      },
    });
  }, [user]);

  if (import.meta.env.VITE_BYPASS_AUTH0) {
    return {
      loading: false,
      isAuthenticated: true,
      token: import.meta.env.VITE_HASURA_TOKEN,
      userName: 'Test User',
      act: () => Promise.resolve(),
    };
  }

  if (isLoading || tokenState.loading) {
    return { loading: true };
  }

  if (!isAuthenticated || tokenState.value === undefined) {
    return {
      loading: false,
      isAuthenticated: false,
      act: loginWithRedirect,
    };
  }

  return {
    loading: false,
    isAuthenticated: true,
    token: tokenState.value,
    userName: user?.name ?? '',
    act: logout,
  };
}
