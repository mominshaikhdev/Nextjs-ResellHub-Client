import { createAuthClient } from "better-auth/client";
import { oauthPopupClient } from "better-auth/client/plugins";

const getAuthBaseURL = () => {
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 
    process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") || 
    "http://localhost:3000";
};

const authClient = createAuthClient({
  baseURL: getAuthBaseURL(),
  basePath: "/api/auth",
  credentials: "include",
  plugins: [
    oauthPopupClient(),
  ],
});

export default authClient;
