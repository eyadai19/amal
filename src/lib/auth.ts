import { db } from "@/lib/db";
import { TB_session, TB_user } from "@/lib/schema";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { Lucia, User } from "lucia";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import "server-only";
import { UserView } from "./types/userSchema";

const adapter = new DrizzlePostgreSQLAdapter(db, TB_session, TB_user);

export const lucia = new Lucia(adapter, {
	sessionCookie: {
		expires: false,
		attributes: {
			secure: process.env.NODE_ENV === "production",
		},
	},
	getUserAttributes: (attributes) => {
		return {
			...attributes,
		};
	},
});

const users = {} as Record<
	string,
	{
		user: User;
		expires_at: number;
	}
>;

export const getUser = cache(async () => {
	const sessionId =
		(await cookies()).get(lucia.sessionCookieName)?.value ?? null;

	if (!sessionId) {
		return null;
	}

	const cachedUser = users[sessionId];

	if (cachedUser && cachedUser.expires_at > Date.now()) {
		return cachedUser.user;
	}

	const { user, session } = await lucia.validateSession(sessionId);

	try {
		if (session && session.fresh) {
			const sessionCookie = lucia.createSessionCookie(session.id);
			(await cookies()).set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}

		if (!session) {
			const sessionCookie = lucia.createBlankSessionCookie();
			(await cookies()).set(
				sessionCookie.name,
				sessionCookie.value,
				sessionCookie.attributes,
			);
		}
	} catch {}

	if (user) {
		users[sessionId] = { user, expires_at: Date.now() + 60 * 1000 };
	}

	return user;
});

export async function logoutAction() {
	"use server";

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

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: UserView;
	}
}
