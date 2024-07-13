/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HASURA_URI: string;
  readonly VITE_AUTH0_DOMAIN: string;
  readonly VITE_AUTH0_CLIENT_ID: string;
  readonly VITE_AUTH0_AUDIENCE: string;
}
