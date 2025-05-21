import CVBuilder from "@/components/cvbuilder";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";

export default function CVBuilderPage() {
	return (
		<div>
			<CVBuilder getUserCvInfoAction={getUserCvInfoAction} />
		</div>
	);
}

export type UserCvInfo = {
	name: string;
	photo: string | null;
	age?: number;
};

export async function getUserCvInfoAction(): Promise<
	UserCvInfo | { field: string; message: string }
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const userInfo = await db.query.TB_user.findFirst({
			where: (table, { eq }) => eq(table.id, user.id),
		});

		if (!userInfo) return { field: "root", message: "User not found." };

		return {
			name: userInfo.firstName + " " + userInfo.lastName,
			photo: userInfo.photo,
			age: userInfo.age || undefined,
		};
	} catch (error) {
		return { field: "root", message: "Failed to fetch user info." };
	}
}
