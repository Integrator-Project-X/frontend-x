import { cookies } from "next/headers";
import { AUTH_COOKIES } from "./auth.constants";

export async function setAccessTokenCookie(token: string) {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIES.accessToken, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60, // 1 hora
    });
}

export async function clearAuthCookies() {
    const cookieStore = await cookies()
    cookieStore.set(AUTH_COOKIES.accessToken, "", { path: "/", maxAge: 0 });
}

export async function getAccessToken() {
    const cookieStore = await cookies()
    return cookieStore.get(AUTH_COOKIES.accessToken)?.value;
}
