import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { AUTH_COOKIES } from "@/src/core/auth/auth.constants";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

async function getAuthHeader(): Promise<Record<string, string>> {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIES.token)?.value;
    return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function GET() {
    if (!BASE_URL) {
        return NextResponse.json({ message: "Missing NEXT_PUBLIC_API_URL" }, { status: 500 });
    }

    try {
        const res = await fetch(`${BASE_URL}/appointments/clinic`, {
            method: "GET",
            headers: {
                Accept: "application/json",
                ...(await getAuthHeader()),
            },
            cache: "no-store",
        });

        const data = await res.json().catch(() => ({}));
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        return NextResponse.json(
            { message: "Upstream fetch failed", error: String(error) },
            { status: 502 }
        );
    }
}
