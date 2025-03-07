import { LoginForm } from "@/components/LoginForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { LoginFormError, loginFormSchema } from "@/lib/types/authSchemas";
import hash from "@/lib/utils";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

export const metadata: Metadata = {
	title: "SQLMentor - Login",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function LoginPage() {
	return <LoginForm loginAction={LoginAction} />;
}

async function LoginAction(
	input: z.infer<typeof loginFormSchema>,
): Promise<LoginFormError | undefined> {
	"use server";

	try {
		const data = await loginFormSchema.parseAsync(input);

		const user = await db.query.TB_user.findFirst({
			where: (user, { eq }) => eq(user.username, data.username),
		});

		if (!user || user.password != hash(data.password)) {
			return { field: "root", message: "Email or password is incorrect" };
		}

		const session = await lucia.createSession(user.id, {});

		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	} catch (e) {
		return {
			field: "root",
			message: "An unexpected error occured, please try again later",
		};
	}

	redirect("/basic/dataType");
}
