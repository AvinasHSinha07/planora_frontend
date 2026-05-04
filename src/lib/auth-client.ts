import { createAuthClient } from "better-auth/react"

const isClient = typeof window !== "undefined";
const baseURL = isClient ? window.location.origin : (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000");

export const authClient = createAuthClient({
    baseURL,
    basePath: "/api/v1/auth",
})
