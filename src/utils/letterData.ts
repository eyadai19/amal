import { ArabicLettersKeys } from "./arabicLetters";

export interface LetterData {
	title: string;
	image: string;
	description: string;
	start_image: string;
	middle_image: string;
	end_image: string;
	forms: {
		start: {
			word: string;
			example: string;
		}[];
		middle: {
			word: string;
			example: string;
		}[];
		end: {
			word: string;
			example: string;
		}[];
	};
}

export const lettersData: Partial<Record<ArabicLettersKeys, LetterData>> = {
	alif: {
		title: "حرف الألف",
		image: "../image/letters/A.png",
		end_image: "",
		middle_image: "",
		start_image: "",
		description:
			"حرف الألف هو أول حرف في اللغة العربية، وهو من الحروف الأساسية التي تُستخدم في تكوين العديد من الكلمات. يمكن أن يأتي في بداية الكلمة أو وسطها أو نهايتها كما يلي",
		forms: {
			start: [
				{
					word: "أمل",
					example: "كان لديه أمل كبير في النجاح",
				},
				{
					word: "أرض",
					example: "سقطت التفاحة على الأرض",
				},
				{
					word: "أزهار",
					example: "تفتحت الأزهار في الربيع",
				},
			],
			middle: [
				{
					word: "سماء",
					example: "الطيور تحلق في السماء الزرقاء",
				},
				{
					word: "كتاب",
					example: "قرأت كتابًا مفيدًا اليوم",
				},
				{
					word: "سؤال",
					example: "طرح الطالب سؤالاً ذكياً",
				},
			],
			end: [
				{
					word: "دعا",
					example: "دعا الأب أبناءه إلى العشاء",
				},
				{
					word: "بقاء",
					example: "يعتمد بقاء النبات على الماء",
				},
				{
					word: "خطأ",
					example: "ارتكب الطفل خطأً بسيطًا",
				},
			],
		},
	},
	baa: {
		title: "حرف الباء",
		image: "../image/letters/B.png",
		end_image: "",
		middle_image: "",
		start_image: "",
		description:
			"حرف الباء هو ثاني حروف الهجاء العربية، ينطق عند اتصاله بحركة أو سكون، وهو من الحروف الشفوية التي تخرج من بين الشفتين.",
		forms: {
			start: [
				{
					word: "باب",
					example: "فتح الولد باب المنزل بلطف",
				},
				{
					word: "بحر",
					example: "سبحنا في البحر الصافي",
				},
				{
					word: "بيت",
					example: "بيتنا الجديد واسع ومريح",
				},
			],
			middle: [
				{
					word: "كتب",
					example: "كتب التلميذ الواجب بخط جميل",
				},
				{
					word: "شباب",
					example: "شباب اليوم طموحون ومجتهدون",
				},
				{
					word: "حب",
					example: "زرع الطفل حبًا في حديقة المنزل",
				},
			],
			end: [
				{
					word: "قلب",
					example: "يجب أن نحافظ على صحة القلب",
				},
				{
					word: "عتب",
					example: "لا يوجد عتب بين الأصدقاء الحقيقيين",
				},
				{
					word: "حب",
					example: "أهديت أمي باقة من الورد تعبيرًا عن حبّي لها",
				},
			],
		},
	},
	taa: {
		title: "حرف التاء",
		image: "../image/letters/T.png",
		end_image: "",
		middle_image: "",
		start_image: "",
		description:
			"حرف التاء هو ثالث حروف الهجاء العربية، ينطق بوضع طرف اللسان على الثنايا العليا، وهو من الحروف الأسلية.",
		forms: {
			start: [
				{
					word: "تفاح",
					example: "التفاحة الحمراء لذيذة ومفيدة",
				},
				{
					word: "تمر",
					example: "التمر غذاء صحي وغني بالطاقة",
				},
				{
					word: "تاج",
					example: "وضع الملك التاج على رأسه",
				},
			],
			middle: [
				{
					word: "كتاب",
					example: "وضعت الكتاب على الرف بعناية",
				},
				{
					word: "شجرة",
					example: "أوراق الشجرة خضراء ونضرة",
				},
				{
					word: "فتاة",
					example: "الفتاة المجتهدة تحقق أحلامها",
				},
			],
			end: [
				{
					word: "بيت",
					example: "عدنا إلى بيتنا بعد رحلة طويلة",
				},
				{
					word: "حياة",
					example: "الصحة نعمة في الحياة",
				},
				{
					word: "خطأ",
					example: "الاعتراف بالخطأ فضيلة",
				},
			],
		},
	},
};
