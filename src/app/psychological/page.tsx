import PsychologicalSupport from "@/components/PsychologicalPage";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { nanoid } from "nanoid";
import { TB_psychological_history } from "../../lib/schema";

export default function PsychologicalSupportPage() {
	return (
		<div>
			<PsychologicalSupport />
		</div>
	);
}

export async function saveQuestionLegalAction(
	question: string,
	answer: string,
	sessionId: string,
): Promise<{ field: string; message: string } | undefined> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const lastEntry = await db.query.TB_psychological_history.findFirst({
			where: (history, { eq }) => eq(history.sessionId, sessionId),
			orderBy: (history, { desc }) => [desc(history.questionIndex)],
		});

		const lastIndex = lastEntry ? lastEntry.questionIndex : 0;

		await db.insert(TB_psychological_history).values({
			id: nanoid(),
			userId: user.id,
			question,
			answer,
			questionIndex: lastIndex,
			sessionId,
		});
	} catch (error) {
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
