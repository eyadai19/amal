import { sections } from "@/utils/sectionsCareer";

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
