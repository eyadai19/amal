import { getUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { TB_user_cv } from "@/lib/schema";
import { sections } from "@/utils/sectionsCareer";
import { eq } from "drizzle-orm";

// Define the career section type
export type CareerSection = {
	id: string;
	name: string;
	questions: CareerQuestion[];
	careers: Career[];
};

// Define the career question type
export type CareerQuestion = {
	id: string;
	text: string;
	affectsCareers: string[]; // Array of career IDs that this question affects
	cvText: string;
};

// Define the career type
export type Career = {
	id: string;
	name: string;
};

// Function to get questions for a specific section
export async function getSectionQuestionsAction(
	sectionId: string,
): Promise<CareerQuestion[]> {
	"use server";
	const section = sections.find((s) => s.id === sectionId);
	if (!section) {
		throw new Error("Section not found");
	}

	return section.questions;
}

// Function to process answers and determine the best career match
export async function processCareerAnswersAction(
	sectionId: string,
	answers: { questionId: string; answer: boolean }[],
): Promise<{ bestCareer: Career; allScores: Record<string, number> }> {
	"use server";
	const section = sections.find((s) => s.id === sectionId);
	if (!section) {
		throw new Error("Section not found");
	}

	// Initialize scores for each career
	const careerScores: Record<string, number> = {};
	section.careers.forEach((career) => {
		careerScores[career.id] = 0;
	});

	// Process each answer
	answers.forEach(({ questionId, answer }) => {
		const question = section.questions.find((q) => q.id === questionId);
		if (question && answer) {
			// If answer is yes, increment score for affected careers
			question.affectsCareers.forEach((careerId) => {
				const career = section.careers.find((c) => c.name === careerId);
				if (career) {
					careerScores[career.id] = (careerScores[career.id] || 0) + 1;
				}
			});
		}
	});

	// Find the career with the highest score
	let bestCareer = section.careers[0];
	let highestScore = careerScores[bestCareer.id];

	section.careers.forEach((career) => {
		if (careerScores[career.id] > highestScore) {
			highestScore = careerScores[career.id];
			bestCareer = career;
		}
	});

	// If all scores are 0, return null or a default career
	if (highestScore === 0) {
		return {
			bestCareer: section.careers[0],
			allScores: careerScores,
		};
	}

	return {
		bestCareer,
		allScores: careerScores,
	};
}

// Function to collect CV texts from selected questions and combine with existing text
export async function collectCvTextsAction(
	sectionId: string,
	questionIds: string[],
): Promise<{ success: boolean; message: string }> {
	"use server";
	try {
		const user = await getUser();
		if (!user) {
			return { success: false, message: "User not authenticated" };
		}

		// جلب السيرة الذاتية الحالية
		const existingCv = await db.query.TB_user_cv.findFirst({
			where: (table, { eq }) => eq(table.userId, user.id),
		});

		if (!existingCv) {
			return { success: false, message: "CV not found" };
		}

		const section = sections.find((s) => s.id === sectionId);
		if (!section) {
			return { success: false, message: "Section not found" };
		}

		// جمع نصوص CV من الأسئلة المحددة
		const cvTexts = questionIds
			.map((questionId) => {
				const question = section.questions.find((q) => q.id === questionId);
				return question?.cvText || "";
			})
			.filter((text) => text !== ""); // إزالة النصوص الفارغة

		// دمج النصوص مع النص الموجود
		const existingSkills = existingCv.skills || "";
		const combinedText = [existingSkills, ...cvTexts]
			.filter((text) => text !== "") // إزالة النصوص الفارغة
			.join("\n\n"); // فصل النصوص بأسطر فارغة

		// تحديث النص في قاعدة البيانات
		await db
			.update(TB_user_cv)
			.set({ skills: combinedText })
			.where(eq(TB_user_cv.userId, user.id));

		return { success: true, message: "تم تحديث المهارات بنجاح" };
	} catch (error) {
		console.error("Error updating CV skills:", error);
		return { success: false, message: "حدث خطأ أثناء تحديث المهارات" };
	}
}
