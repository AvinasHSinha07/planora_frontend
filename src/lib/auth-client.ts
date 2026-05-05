import { createAuthClient } from "better-auth/react"

const isClient = typeof window !== "undefined";
const isProduction = process.env.NODE_ENV === "production";

// In production, we use the same origin to leverage the Vercel proxy (/api/v1/*)
// In development, we use the NEXT_PUBLIC_API_URL (localhost:5000)
const rawURL = isProduction && isClient 
    ? window.location.origin 
    : (process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:5000");

// Ensure baseURL doesn't include the api path twice
const baseURL = rawURL.replace(/\/api\/v1\/?$/, "");

// On server-side (Next.js Server Components), localhost can sometimes fail to resolve or point to IPv6 (::1)
// while the backend is on IPv4. We override to 127.0.0.1 only for server-side internal calls.
const finalBaseURL = isClient ? baseURL : (baseURL.includes("localhost") ? baseURL.replace("localhost", "127.0.0.1") : baseURL);

export const authClient = createAuthClient({
    baseURL: finalBaseURL,
    basePath: "/api/v1/auth",
})
