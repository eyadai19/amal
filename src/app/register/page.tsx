import RegisterForm from "@/components/RegisterForm";
import { lucia } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user } from "@/lib/schema";
import { RegisterFormError, registerFormSchema } from "@/lib/types/authSchemas";
import hash from "@/lib/utils";
import { eq } from "drizzle-orm";
import { nanoid } from "nanoid";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
export const metadata: Metadata = {
	title: "SQLMentor - Register",
	icons: {
		icon: "/logo.ico",
		apple: "/logo.png",
	},
};

export default function RegisterPage() {
	return <RegisterForm registerAction={RegisterAction} />;
}
export async function RegisterAction(
	input: z.infer<typeof registerFormSchema>,
	photoUrl: string | null,
): Promise<RegisterFormError | undefined> {
	"use server";

	try {
		const { ...data } = await registerFormSchema.parseAsync(input);

		const newUser = {
			id: nanoid(),
			...data,
			password: hash(data.password),
			photo: null,
		};

		try {
			await db.insert(TB_user).values(newUser);
		} catch {
			return { field: "username", message: "Username is already taken" };
		}

		if (photoUrl) {
			try {
				await db
					.update(TB_user)
					.set({ photo: photoUrl })
					.where(eq(TB_user.id, newUser.id));
			} catch (uploadError) {
				console.error(
					"An error occurred while uploading the photo:",
					uploadError,
				);
				return { field: "photo", message: "Failed to upload profile photo" };
			}
		}

		const session = await lucia.createSession(newUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);

		redirect("/Profile");
	} catch (e) {
		console.error("Unexpected error:", e);
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
