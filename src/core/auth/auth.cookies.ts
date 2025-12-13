import { cookies } from "next/headers";
import { AUTH_COOKIES } from "./auth.constants";

export async function setAccessTokenCookie(token: string) {
    const store = await cookies();
    store.set(AUTH_COOKIES.accessToken, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
    });
}

export async function setUserRoleCookie(role: string) {
    const store = await cookies();
    store.set(AUTH_COOKIES.role, role, {
        httpOnly: true, // recomendado (no lo necesitas en client)
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60,
    });
}

export async function clearAuthCookies() {
    const store = await cookies();
    store.set(AUTH_COOKIES.accessToken, "", { path: "/", maxAge: 0 });
    store.set(AUTH_COOKIES.role, "", { path: "/", maxAge: 0 });
}

export async function getAccessToken() {
    const store = await cookies();
    return store.get(AUTH_COOKIES.accessToken)?.value;
}

export async function getUserRole() {
    const store = await cookies();
    return store.get(AUTH_COOKIES.role)?.value;
}
