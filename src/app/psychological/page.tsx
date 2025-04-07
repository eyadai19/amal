import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_psychological_history } from "@/lib/schema";
import { and, eq, max } from "drizzle-orm";
import { nanoid } from "nanoid";
import PsychologicalSupport from "../../components/PsychologicalPage";

export default function PsychologicalPage() {
	return (
		<div>
			<PsychologicalSupport
				savePsychologicalConversationEntryAction={
					savePsychologicalConversationEntryAction
				}
				logoutAction={logoutAction}
			/>
		</div>
	);
}

export async function savePsychologicalConversationEntryAction(
	sessionId: string,
	question: string,
	answer: string,
): Promise<{ success: boolean } | { field: string; message: string }> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const lastEntry = await db.query.TB_psychological_history.findFirst({
			where: (history, { eq }) => eq(history.sessionId, sessionId),
			orderBy: (history, { desc }) => [desc(history.questionIndex)],
		});

		const lastIndex = lastEntry ? lastEntry.questionIndex + 1 : 0;

		await db.insert(TB_psychological_history).values({
			id: nanoid(),
			userId: user.id,
			answer: answer,
			question: question,
			sessionId: sessionId,
			questionIndex: lastIndex,
		});

		return { success: true };
	} catch (error) {
		return { field: "root", message: "Failed to save conversation entry." };
	}
}

export async function fetchPsychologicalConversationHistory(
	sessionId: string,
): Promise<
	| {
			questionsAndAnswers: { question: string; answer: string }[];
	  }
	| { field: string; message: string }
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const historyRecords = await db.query.TB_psychological_history.findMany({
			where: (record, { eq, and }) =>
				and(eq(record.sessionId, sessionId), eq(record.userId, user.id)),
		});

		if (!historyRecords || historyRecords.length === 0) {
			return { field: "root", message: "No entries found for this session." };
		}

		const questionsAndAnswers = historyRecords
			.filter((record) => record.question !== null)
			.map((record) => ({
				question: record.question!,
				answer: record.answer,
			}));

		return {
			questionsAndAnswers,
		};
	} catch (error) {
		return {
			field: "root",
			message: "Failed to fetch conversation history. Please try again.",
		};
	}
}

export async function fetchAllPsychologicalSessions(): Promise<
	| { sessions: { sessionId: string; lastQuestion: string }[] }
	| { field: string; message: string }
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		// استعلام فرعي لإيجاد آخر سؤال لكل جلسة (أعلى questionIndex)
		const subquery = db
			.select({
				sessionId: TB_psychological_history.sessionId,
				maxQuestionIndex: max(TB_psychological_history.questionIndex).as(
					"maxQuestionIndex",
				),
			})
			.from(TB_psychological_history)
			.where(eq(TB_psychological_history.userId, user.id))
			.groupBy(TB_psychological_history.sessionId)
			.as("subquery");

		// استرجاع آخر سؤال لكل جلسة
		const sessions = await db
			.select({
				sessionId: TB_psychological_history.sessionId,
				lastQuestion: TB_psychological_history.question,
			})
			.from(TB_psychological_history)
			.innerJoin(
				subquery,
				and(
					eq(TB_psychological_history.sessionId, subquery.sessionId),
					eq(TB_psychological_history.questionIndex, subquery.maxQuestionIndex),
				),
			)
			.where(eq(TB_psychological_history.userId, user.id));

		if (sessions.length === 0) {
			return { field: "root", message: "No sessions found for this user." };
		}

		return { sessions };
	} catch (error) {
		console.error("Error fetching psychological sessions:", error);
		return {
			field: "root",
			message: "Failed to fetch psychological sessions. Please try again.",
		};
	}
}

export async function deleteConversationSession(
	sessionId: string,
): Promise<{ success: boolean } | { field: string; message: string }> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		await db
			.delete(TB_psychological_history)
			.where(
				and(
					eq(TB_psychological_history.sessionId, sessionId),
					eq(TB_psychological_history.userId, user.id),
				),
			);

		return { success: true };
	} catch (error) {
		console.error("Error deleting session:", error);
		return { field: "root", message: "Failed to delete session." };
	}
}
