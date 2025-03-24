import { ArabicNumeralsKeys } from "./arabicNumerals";

export interface NumberData {
	title: string;
	numeral: string;
	value: number;
	english: string;
	description: string;
	examples: Array<{
		value: string;
		context: string;
	}>;
}

export const numbersData: Partial<Record<ArabicNumeralsKeys, NumberData>> = {
	zero: {
		title: "صفر",
		numeral: "٠",
		value: 0,
		english: "Zero",
		description: "الرقم الأساسي الذي يعبر عن عدم وجود كمية",
		examples: [
			{ value: "٠٧٧٧٧٧٧", context: "رقم هاتف" },
			{ value: "٠°", context: "درجة حرارة" },
		],
	},
	one: {
		title: "واحد",
		numeral: "١",
		value: 1,
		english: "One",
		description: "الرقم الأساسي الذي يعبر عن الوحدة",
		examples: [
			{ value: "١٠٠", context: "مائة" },
			{ value: "١/٤", context: "ربع" },
		],
	},
	two: {
		title: "اثنان",
		numeral: "٢",
		value: 2,
		english: "Two",
		description: "الرقم الذي يلي الواحد",
		examples: [
			{ value: "٢٠٢٣", context: "سنة" },
			{ value: "٢×٢", context: "عملية ضرب" },
		],
	},
	// أضف بقية الأرقام بنفس النمط
	// ...
	hundred: {
		title: "مائة",
		numeral: "١٠٠",
		value: 100,
		english: "Hundred",
		description: "الرقم الذي يعبر عن مائة وحدة",
		examples: [
			{ value: "١٠٠٪", context: "نسبة مئوية" },
			{ value: "١٠٠ سم", context: "متر واحد" },
		],
	},
	thousand: {
		title: "ألف",
		numeral: "١٠٠٠",
		value: 1000,
		english: "Thousand",
		description: "الرقم الذي يعبر عن ألف وحدة",
		examples: [
			{ value: "١٠٠٠ دينار", context: "مبلغ مالي" },
			{ value: "١٠٠٠ م", context: "مسافة" },
		],
	},
	// ... إلخ لجميع المفاتيح
};
