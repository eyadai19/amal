// pages/api/logout.ts
import { lucia } from "@/lib/auth";
import { cookies } from "next/headers";

export default async function handler() {
	const sessionCookie = cookies().get(lucia.sessionCookieName);
	if (sessionCookie) {
		await lucia.invalidateSession(sessionCookie.value);
		cookies().set({
			name: lucia.sessionCookieName,
			value: "",
			expires: new Date(0),
		});
	}
}
