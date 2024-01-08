import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { useMemo } from 'react';

import { enableAuth0, getApiHost, getDevUser } from '@/feature';

export default function useGQLClient(authToken: string | undefined) {
  return useMemo(() => {
    const apolloHttpLink = createHttpLink({ uri: getApiHost() });

    let authHeaders: Record<string, string>;
    if (enableAuth0()) {
      authHeaders = {
        authorization: authToken ? `Bearer ${authToken}` : '',
      };
    } else {
      authHeaders = {
        'x-hasura-admin-secret': 'hasura',
        'x-hasura-role': 'user',
        'x-hasura-user-id': getDevUser()!,
      };
    }

    const authLink = setContext((_, { headers }) => {
      return {
        headers: {
          ...headers,
          ...authHeaders,
        },
      };
    });

    return new ApolloClient({
      link: authLink.concat(apolloHttpLink),
      cache: new InMemoryCache(),
    });
  }, [authToken]);
}
