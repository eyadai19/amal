import LegalSupport from "@/components/legalPage";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExpLegal";
import { getUser, logoutAction } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_legal_history, TB_legal_history_answer } from "@/lib/schema";
import { and, eq, max } from "drizzle-orm";
import { nanoid } from "nanoid";

export default function LegalSupportPage() {
	return (
		<div>
			<LegalSupport
				logoutAction={logoutAction}
				ChatbotExpAction={ChatbotExpAction}
				saveAnswerLegalAction={saveAnswerLegalAction}
				saveQuestionLegalAction={saveQuestionLegalAction}
				deleteLegalSessionAction={deleteLegalSessionAction}
				fetchAllLegalSessionsAction={fetchAllLegalSessionsAction}
			/>
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

		const lastEntry = await db.query.TB_legal_history.findFirst({
			where: (history, { eq, and }) =>
				and(eq(history.sessionId, sessionId), eq(history.userId, user.id)),
			orderBy: (history, { desc }) => [desc(history.questionIndex)],
		});

		const lastIndex = lastEntry ? lastEntry.questionIndex + 1 : 0;

		await db.insert(TB_legal_history).values({
			id: nanoid(),
			userId: user.id,
			question: question,
			answer: answer,
			questionIndex: lastIndex,
			sessionId: sessionId,
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
	"use server";
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

export async function fetchLegalConversationHistoryAction(
	sessionId: string,
): Promise<
	| {
			questionsAndAnswers: { question: string; answer: string }[];
			lastAnswer: string;
			exception: string | null;
	  }
	| { field: string; message: string }
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		// البحث عن الأسئلة والأجوبة المرتبطة بهذه الجلسة
		const historyRecords = await db.query.TB_legal_history.findMany({
			where: (history, { eq, and }) =>
				and(eq(history.sessionId, sessionId), eq(history.userId, user.id)),
			orderBy: (history, { asc }) => asc(history.questionIndex),
		});

		if (!historyRecords || historyRecords.length === 0) {
			return { field: "root", message: "No questions found for this session." };
		}

		// تحويل البيانات إلى الشكل المطلوب
		const questionsAndAnswers = historyRecords.map((record) => ({
			question: record.question,
			answer: record.answer,
		}));

		// جلب آخر جواب والاستثناء من جدول legal_history_answer
		const lastAnswer = await db.query.TB_legal_history_answer.findFirst({
			where: (answer, { eq, and }) =>
				and(eq(answer.sessionId, sessionId), eq(answer.userId, user.id)),
			orderBy: (answer, { desc }) => desc(answer.id),
		});

		if (!lastAnswer) {
			return { field: "root", message: "No answers found for this session." };
		}

		return {
			questionsAndAnswers, // مصفوفة الأسئلة والأجوبة بعد التحويل
			lastAnswer: lastAnswer.answer, // آخر جواب
			exception: lastAnswer.exception,
		};
	} catch (error) {
		return {
			field: "root",
			message: "Failed to fetch conversation history. Please try again.",
		};
	}
}

//  إرجاع أرقام الجلسات وآخر سؤال في كل جلسة
export async function fetchAllLegalSessionsAction(): Promise<
	| { sessions: { sessionId: string; lastQuestion: string }[] }
	| { field: string; message: string }
> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		// استعلام فرعي للعثور على أحدث سؤال لكل جلسة
		const subquery = db
			.select({
				sessionId: TB_legal_history.sessionId,
				maxQuestionIndex: max(TB_legal_history.questionIndex).as(
					"maxQuestionIndex",
				),
			})
			.from(TB_legal_history)
			.where(eq(TB_legal_history.userId, user.id))
			.groupBy(TB_legal_history.sessionId)
			.as("subquery");

		// استرجاع آخر سؤال لكل جلسة
		const sessions = await db
			.select({
				sessionId: TB_legal_history.sessionId,
				lastQuestion: TB_legal_history.question,
			})
			.from(TB_legal_history)
			.innerJoin(
				subquery,
				and(
					eq(TB_legal_history.sessionId, subquery.sessionId),
					eq(TB_legal_history.questionIndex, subquery.maxQuestionIndex),
				),
			)
			.where(eq(TB_legal_history.userId, user.id));

		if (sessions.length === 0) {
			return { field: "root", message: "No sessions found for this user." };
		}

		return { sessions };
	} catch (error) {
		return {
			field: "root",
			message: "Failed to fetch sessions. Please try again.",
		};
	}
}

// حذف جميع البيانات المرتبطة بجلسة معينة للمستخدم الحالي
export async function deleteLegalSessionAction(
	sessionId: string,
): Promise<{ success: boolean } | { field: string; message: string }> {
	"use server";
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		await db
			.delete(TB_legal_history)
			.where(
				and(
					eq(TB_legal_history.sessionId, sessionId),
					eq(TB_legal_history.userId, user.id),
				),
			);

		await db
			.delete(TB_legal_history_answer)
			.where(
				and(
					eq(TB_legal_history_answer.sessionId, sessionId),
					eq(TB_legal_history_answer.userId, user.id),
				),
			);

		return { success: true };
	} catch (error) {
		return { field: "root", message: "Failed to delete session." };
	}
}
