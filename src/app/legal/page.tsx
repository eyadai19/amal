import LegalSupport from "@/components/legalPage";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExpLegal";
import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_legal_history, TB_legal_history_answer } from "@/lib/schema";
import { nanoid } from "nanoid";

export default function lettersPage() {
	return (
		<div>
			<LegalSupport ChatbotExpAction={ChatbotExpAction} />
		</div>
	);
}

export async function saveQuestionLegalAction(
	question: string,
	answer: string,
	sessionId: string,
): Promise<{ field: string; message: string } | undefined> {
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const lastEntry = await db.query.TB_legal_history.findFirst({
			where: (history, { eq }) => eq(history.sessionId, sessionId),
			orderBy: (history, { desc }) => [desc(history.questionIndex)],
		});

		const lastIndex = lastEntry ? lastEntry.questionIndex : 0;

		await db.insert(TB_legal_history).values({
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

export async function saveAnswerLegalAction(
	exception: string | null,
	answer: string,
	sessionId: string,
): Promise<{ field: string; message: string } | undefined> {
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		await db.insert(TB_legal_history_answer).values({
			id: nanoid(),
			userId: user.id,
			exception: exception,
			answer,
			sessionId,
		});
	} catch (error) {
		return {
			field: "root",
			message: "An unexpected error occurred, please try again later",
		};
	}
}
