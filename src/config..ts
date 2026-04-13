import pkg from "../package.json";

export const Config = {
    APP_VERSION: `${pkg.version}${import.meta.env.MODE !== "production" ? "-dev" : ""}`,
    API_BASE_URL: import.meta.env.VITE_API_BASE_URL as string,
};
