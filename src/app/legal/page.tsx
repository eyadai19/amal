import LegalSupport from "@/components/legalPage";
import { ChatbotExpAction } from "@/lib/ServerAction/chatbotExpLegal";
import { db } from "@/lib/db";
import { TB_legal_history, TB_legal_history_answer } from "@/lib/schema";
import { eq, max } from "drizzle-orm";

export default function lettersPage() {
	return (
		<div>
			<LegalSupport ChatbotExpAction={ChatbotExpAction} />
		</div>
	);
}

export async function saveConversationEntry(data) {
	try {
		// ✅ تأكد أن البيانات ليست فارغة
		if (!data) {
			console.error("❌ لم يتم تمرير أي بيانات إلى `saveConversationEntry`!");
			throw new Error("لم يتم تمرير أي بيانات!");
		}

		console.log("✅ Received Data:", data); // ✅ طباعة البيانات للتحقق

		const { question, answer, sessionId, exception = null, userId } = data;

		// ✅ تحقق من القيم المطلوبة
		if (!sessionId) {
			console.error("❌ sessionId مفقود!");
			throw new Error("sessionId مفقود!");
		}
		if (!answer) {
			console.error("❌ answer مطلوب!");
			throw new Error("answer مطلوب!");
		}

		if (question && answer) {
			// ✅ جلب أعلى index للجلسة الحالية
			const lastEntry = await db
				.select({ maxIndex: max(TB_legal_history.questionIndex) })
				.from(TB_legal_history)
				.where(eq(TB_legal_history.sessionId, sessionId));

			console.log("🔹 آخر إدخال موجود:", lastEntry);

			const newIndex = lastEntry[0]?.maxIndex !== null ? lastEntry[0].maxIndex + 1 : 0;

			console.log(`✅ سيتم إدراج السؤال الجديد باندكس: ${newIndex}`);

			// ✅ إدراج السؤال والجواب مع تحديد الـ index
			await db.insert(TB_legal_history).values({
				id: crypto.randomUUID(),
				userId: userId || "defaultUser",
				question,
				answer,
				questionIndex: newIndex,
				sessionId,
			});
		} else {
			// ✅ إدراج الجواب والاستثناء (إن وجد) في جدول legal_history_answer
			console.log("✅ إدراج إجابة فقط في `TB_legal_history_answer`");
			await db.insert(TB_legal_history_answer).values({
				id: crypto.randomUUID(),
				sessionId,
				answer,
				exception,
			});
		}

		console.log("✅ تم حفظ البيانات بنجاح!");
		return { success: true };
	} catch (error) { // ✅ استخدام error بدلاً من err
		console.error("❌ خطأ أثناء تسجيل المحادثة:", error.message);
		return { success: false, error: error.message };
	}
}
