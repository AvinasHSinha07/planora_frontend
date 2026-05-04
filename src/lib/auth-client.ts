import { createAuthClient } from "better-auth/react"

const isClient = typeof window !== "undefined";
const rawURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
// Ensure baseURL doesn't include the api path twice
const baseURL = rawURL.replace(/\/api\/v1\/?$/, "");

export const authClient = createAuthClient({
    baseURL,
    basePath: "/api/v1/auth",
})
