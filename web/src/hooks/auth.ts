import { useAuth0 } from "@auth0/auth0-react";
import { useAsync } from "react-use";

type AuthBasis = {
  loading: false;
  token?: string;
  act: () => Promise<void>;
};

export type AuthState =
  | { loading: true }
  | (AuthBasis & { isAuthenticated: false })
  | (AuthBasis & { isAuthenticated: true; userId: string; userName: string });

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
        audience: "jp.tkzwhr.igo-nikki",
      },
    });
  }, [user]);

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
    userId: user?.sub ?? "",
    userName: user?.name ?? "",
    act: logout,
  };
}
