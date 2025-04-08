import Profile from "@/components/ProfilePage";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import {
	deleteLegalSessionAction,
	fetchAllLegalSessionsAction,
} from "../legal/page";
import {
	deletePsychologicalSessionAction,
	fetchAllPsychologicalSessionsAction,
} from "../psychological/page";

export default function ProfilePage() {
	return (
		<div>
			<Profile
				logoutAction={logoutAction}
				getUserInfoAction={getUserInfoAction}
				fetchAllPsychologicalSessionsAction={
					fetchAllPsychologicalSessionsAction
				}
				fetchAllLegalSessionsAction={fetchAllLegalSessionsAction}
				deleteLegalSessionAction={deleteLegalSessionAction}
				deletePsychologicalSessionAction={deletePsychologicalSessionAction}
			/>
		</div>
	);
}

export interface UserInfo {
	id: string;
	username: string;
	firstName: string;
	lastName: string;
	photo: string | null;
	age: number | null;
	releaseDate: Date | null;
	sentenceDuration: number | null;
	createdTime: Date;
	lastUpdateTime: Date;
}
export async function getUserInfoAction(): Promise<
	UserInfo | { field: string; message: string }
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
			id: userInfo.id,
			username: userInfo.username,
			firstName: userInfo.firstName,
			lastName: userInfo.lastName,
			photo: userInfo.photo,
			age: userInfo.age,
			releaseDate: userInfo.releaseDate,
			sentenceDuration: userInfo.sentenceDuration,
			createdTime: userInfo.createdTime,
			lastUpdateTime: userInfo.lastUpdateTime,
		};
	} catch (error) {
		console.error("Error fetching user info:", error);
		return { field: "root", message: "Failed to fetch user info." };
	}
}
