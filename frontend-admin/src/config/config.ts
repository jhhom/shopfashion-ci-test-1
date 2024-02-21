export const SERVER_PORT = 9800;

const PRODUCTION_SERVER_URL = "https://shopfashion-server.joohom.dev";
const LOCAL_SERVER_URL = `http://localhost:${SERVER_PORT}`;

export const config = {
  SERVER_URL:
    import.meta.env.VITE_APP_ENV === "production"
      ? PRODUCTION_SERVER_URL
      : LOCAL_SERVER_URL,
};
