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
			{ value: "١ شخص", context: "عدد الأشخاص" },
			{ value: "١ كتاب", context: "عدد الكتب" },
		],
	},
	two: {
		title: "اثنان",
		numeral: "٢",
		value: 2,
		english: "Two",
		description: "الرقم الذي يلي الواحد",
		examples: [
			{ value: "٢ عين", context: "عدد العيون" },
			{ value: "٢+٢=٤", context: "عملية حسابية" },
		],
	},
	three: {
		title: "ثلاثة",
		numeral: "٣",
		value: 3,
		english: "Three",
		description: "الرقم الذي يلي الاثنين",
		examples: [
			{ value: "٣ وجبات", context: "عدد الوجبات اليومية" },
			{ value: "٣ كرات", context: "عدد الكرات" },
		],
	},
	four: {
		title: "أربعة",
		numeral: "٤",
		value: 4,
		english: "Four",
		description: "الرقم الذي يلي الثلاثة",
		examples: [
			{ value: "٤ أرجل", context: "عدد أرجل الكرسي" },
			{ value: "٤ زوايا", context: "عدد زوايا المربع" },
		],
	},
	five: {
		title: "خمسة",
		numeral: "٥",
		value: 5,
		english: "Five",
		description: "الرقم الذي يلي الأربعة",
		examples: [
			{ value: "٥ أصابع", context: "عدد أصابع اليد" },
			{ value: "٥ نجوم", context: "تقييم فندق" },
		],
	},
	six: {
		title: "ستة",
		numeral: "٦",
		value: 6,
		english: "Six",
		description: "الرقم الذي يلي الخمسة",
		examples: [
			{ value: "٦ جوانب", context: "عدد جوانب المكعب" },
			{ value: "٦ أيام", context: "عدد أيام العمل في بعض البلدان" },
		],
	},
	seven: {
		title: "سبعة",
		numeral: "٧",
		value: 7,
		english: "Seven",
		description: "الرقم الذي يلي الستة",
		examples: [
			{ value: "٧ ألوان", context: "عدد ألوان قوس قزح" },
			{ value: "٧ أيام", context: "عدد أيام الأسبوع" },
		],
	},
	eight: {
		title: "ثمانية",
		numeral: "٨",
		value: 8,
		english: "Eight",
		description: "الرقم الذي يلي السبعة",
		examples: [
			{ value: "٨ أرجل", context: "عدد أرجل العنكبوت" },
			{ value: "٨ زوايا", context: "عدد زوايا المثمن" },
		],
	},
	nine: {
		title: "تسعة",
		numeral: "٩",
		value: 9,
		english: "Nine",
		description: "الرقم الذي يلي الثمانية",
		examples: [
			{ value: "٩ شهور", context: "مدة الحمل" },
			{ value: "٩ لاعبين", context: "عدد لاعبي البيسبول في الفريق" },
		],
	},
	ten: {
		title: "عشرة",
		numeral: "١٠",
		value: 10,
		english: "Ten",
		description: "أول عدد مكون من رقمين في النظام العشري",
		examples: [
		  { value: "١٠ أصابع", context: "عدد أصابع اليدين" },
		  { value: "١٠ سنوات", context: "عقد من الزمن" },
		],
	  },
	  twenty: {
		title: "عشرون",
		numeral: "٢٠",
		value: 20,
		english: "Twenty",
		description: "ضعف العشرة",
		examples: [
		  { value: "٢٠ دقيقة", context: "ثلث ساعة" },
		  { value: "٢٠ سؤالاً", context: "عدد الأسئلة في اختبار" },
		],
	  },
	  thirty: {
		title: "ثلاثون",
		numeral: "٣٠",
		value: 30,
		english: "Thirty",
		description: "ثلاثة أمثال العشرة",
		examples: [
		  { value: "٣٠ يومًا", context: "عدد أيام بعض الأشهر" },
		  { value: "٣٠ درجة", context: "درجة حرارة معتدلة" },
		],
	  },
	  forty: {
		title: "أربعون",
		numeral: "٤٠",
		value: 40,
		english: "Forty",
		description: "أربعة أمثال العشرة",
		examples: [
		  { value: "٤٠ يومًا", context: "مدة الاربعين" },
		  { value: "٤٠ درجة", context: "درجة حرارة مرتفعة" },
		],
	  },
	  fifty: {
		title: "خمسون",
		numeral: "٥٠",
		value: 50,
		english: "Fifty",
		description: "نصف المائة",
		examples: [
		  { value: "٥٠ دولة", context: "عدد الدول في اتحاد معين" },
		  { value: "٥٠ عامًا", context: "يوبيل ذهبي" },
		],
	  },
	  sixty: {
		title: "ستون",
		numeral: "٦٠",
		value: 60,
		english: "Sixty",
		description: "ستة أمثال العشرة",
		examples: [
		  { value: "٦٠ دقيقة", context: "ساعة واحدة" },
		  { value: "٦٠ ثانية", context: "دقيقة واحدة" },
		],
	  },
	  seventy: {
		title: "سبعون",
		numeral: "٧٠",
		value: 70,
		english: "Seventy",
		description: "سبعة أمثال العشرة",
		examples: [
		  { value: "٧٠ عامًا", context: "متوسط العمر في بعض البلدان" },
		  { value: "٧٠ درجة", context: "درجة حرارة عالية" },
		],
	  },
	  eighty: {
		title: "ثمانون",
		numeral: "٨٠",
		value: 80,
		english: "Eighty",
		description: "ثمانية أمثال العشرة",
		examples: [
		  { value: "٨٠ كيلومترًا", context: "سرعة مسموحة على الطريق" },
		  { value: "٨٠ صفحة", context: "عدد صفحات كتاب صغير" },
		],
	  },
	  ninety: {
		title: "تسعون",
		numeral: "٩٠",
		value: 90,
		english: "Ninety",
		description: "تسعة أمثال العشرة",
		examples: [
		  { value: "٩٠ درجة", context: "زاوية قائمة" },
		  { value: "٩٠ يومًا", context: "ربع سنة تقريبًا" },
		],
	  },
	  hundred: {
		title: "مائة",
		numeral: "١٠٠",
		value: 100,
		english: "One Hundred",
		description: "أول عدد مكون من ثلاثة أرقام",
		examples: [
		  { value: "١٠٠ عام", context: "قرن من الزمان" },
		  { value: "١٠٠٪", context: "نسبة مئوية كاملة" },
		],
	  },
	  thousand: {
		title: "ألف",
		numeral: "١٠٠٠",
		value: 1000,
		english: "One Thousand",
		description: "عشرة أمثال المائة",
		examples: [
		  { value: "١٠٠٠ متر", context: "كيلومتر واحد" },
		  { value: "١٠٠٠ عام", context: "ألفية" },
		],
	  },
	  million: {
		title: "مليون",
		numeral: "١٠٠٠٠٠٠",
		value: 1000000,
		english: "One Million",
		description: "ألف ألف",
		examples: [
		  { value: "١٠٠٠٠٠٠ نسمة", context: "عدد سكان مدينة صغيرة" },
		  { value: "١٠٠٠٠٠٠ دولار", context: "مبلغ كبير من المال" },
		],
	  },
	  billion: {
		title: "مليار",
		numeral: "١٠٠٠٠٠٠٠٠٠",
		value: 1000000000,
		english: "One Billion",
		description: "ألف مليون",
		examples: [
		  { value: "١٠٠٠٠٠٠٠٠٠ نجم", context: "عدد النجوم في مجرة صغيرة" },
		  { value: "١٠٠٠٠٠٠٠٠٠ ثانية", context: "حوالي 31.7 سنة" },
		],
	  },
};