// pages/api/logout.ts
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

import { NextResponse } from "next/server";

export async function POST() {
	try {
		const sessionCookie = cookies().get(lucia.sessionCookieName);

		if (sessionCookie) {
			await lucia.invalidateSession(sessionCookie.value);
			const blankCookie = lucia.createBlankSessionCookie();
			cookies().set({
				name: lucia.sessionCookieName,
				value: "",
				expires: new Date(0),
			});
		}

		return;
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}
