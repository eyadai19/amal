'use server';

import { db } from '@/lib/db';
import { TB_psychological_history } from '@/db/schema';
import { nanoid } from 'nanoid';
import { getUser } from '@/lib/auth';
import { eq ,and} from 'drizzle-orm';

export async function savePsychologicalConversationEntry(
	sessionId: string,
	question: string | null,
	answer: string,
	questionIndex: number
): Promise<{ success: boolean } | { field: string; message: string }> {
	try {
		const user = await getUser();
		if (!user) return { field: "root", message: "User not authenticated." };

		const userInfo = await db.query.TB_user.findFirst({
			where: (searchUser, { eq }) => eq(searchUser.id, user.id),
		});
		if (!userInfo) return { field: "root", message: "User not found" };

		await db.insert(TB_psychological_history).values({
			id: nanoid(),
			userId: user.id,
			sessionId,
			question,
			answer,
			questionIndex,
		});

		return { success: true };
	} catch (error) {
		console.error("Error saving conversation entry:", error);
		return { field: "root", message: "Failed to save conversation entry." };
	}
}

export async function fetchPsychologicalConversationHistory(
	sessionId: string
): Promise<{
	questionsAndAnswers: { question: string; answer: string }[];
	lastAnswer: string;
} | { field: string; message: string }> {
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

		// استخراج الأسئلة والإجابات من السجلات
		const questionsAndAnswers = historyRecords
			.filter(record => record.question !== null)
			.map(record => ({
				question: record.question!,
				answer: record.answer,
			}));

		// الحصول على آخر إجابة
		const lastEntry = historyRecords[historyRecords.length - 1];

		return {
			questionsAndAnswers,
			lastAnswer: lastEntry.answer,
		};
	} catch (error) {
		console.error("Error fetching conversation history:", error);
		return {
			field: "root",
			message: "Failed to fetch conversation history. Please try again.",
		};
	}
}


/////////إرجاع الأسئلة والإجابات مع آخر إجابة
export async function fetchConversationHistory(
	sessionId: string
): Promise<{
	questionsAndAnswers: { question: string; answer: string }[];
	lastAnswer: string;
} | { field: string; message: string }> {
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
			.filter(record => record.question !== null)
			.map(record => ({
				question: record.question!,
				answer: record.answer,
			}));

		const lastEntry = historyRecords[historyRecords.length - 1];

		return {
			questionsAndAnswers,
			lastAnswer: lastEntry.answer,
		};
	} catch (error) {
		console.error("Error fetching conversation history:", error);
		return {
			field: "root",
			message: "Failed to fetch conversation history. Please try again.",
		};
	}
}


////////حذف الجلسة عن طريق رقمها

export async function deleteConversationSession(sessionId: string) {
  try {
    const user = await getUser();
    if (!user) return { field: "root", message: "User not authenticated." };

    await db
      .delete(TB_psychological_history)
      .where(
        and(
          eq(TB_psychological_history.sessionId, sessionId),
          eq(TB_psychological_history.userId, user.id)
        )
      );

    return { success: true };
  } catch (error) {
    console.error("Error deleting session:", error);
    return { field: "root", message: "Failed to delete session." };
  }
}


