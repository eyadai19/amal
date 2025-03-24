import { ArabicLettersKeys } from "./arabicLetters";

export interface LetterData {
	title: string;
	image: string;
	description: string;
	examples: {
		start: string[];
		middle: string[];
		end: string[];
	};
}

// Record - Partial
export const lettersData: Partial<Record<ArabicLettersKeys, LetterData>> = {
	alif: {
		title: "حرف الألف",
		image: "../image/letters/A.png",
		description:
			"حرف الألف هو أول حرف في اللغة العربية، وهو من الحروف الأساسية التي تُستخدم في تكوين العديد من الكلمات. يمكن أن يأتي في بداية الكلمة أو وسطها أو نهايتها كما يلي",
		examples: {
			start: ["أمل", "أرض", "أزهار"],
			middle: ["سماء", "كتاب", "سؤال"],
			end: ["دعا", "بقاء", "خطأ"],
		},
	},
	baa: {
		title: "حرف الباء",
		image: "../image/letters/B.png",
		description: "حرف الباء هو ثاني حروف العربية...",
		examples: {
			start: ["باب", "بحر", "بيت"],
			middle: ["كتب", "شباب", "حب"],
			end: ["قلب", "عتب", "حب"],
		},
	},
	taa: {
		title: "حرف التاء",
		image: "../image/letters/T.png",
		description: "حرف التاء هو ثالث حروف العربية...",
		examples: {
			start: ["تفاح", "تمر", "تاج"],
			middle: ["كتاب", "شجرة", "فتاة"],
			end: ["بيت", "حياة", "خطأ"],
		},
	},
};
