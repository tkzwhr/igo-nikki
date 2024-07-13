export function enableAuth0(): boolean {
  return import.meta.env.VITE_AUTH0 !== "0";
}

export function getApiHost(): string {
  return import.meta.env.VITE_API_HOST;
}

export function getDevUser(): string | null {
  return import.meta.env.VITE_DEV_USER;
}
