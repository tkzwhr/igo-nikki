export function enableAuth0(): boolean {
  return import.meta.env.VITE_AUTH0 !== '0';
}

export function getApiHost(): string {
  return import.meta.env.VITE_API_HOST;
}

export function getDevUser(): string | null {
  return import.meta.env.VITE_DEV_USER;
}

export function getAuth0ClientId(): string {
  return import.meta.env.PROD
    ? 'qKlGozLJqeTFWz42jQ2Hkq2vEDtt84pI'
    : 'llt7XkgStntAhwjtH6euVr7izGI5C26P';
}
