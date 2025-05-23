import { CareerSection } from "@/lib/ServerAction/careerExp";

export const sections: CareerSection[] = [
	{
		id: "1",
		name: "الزراعة والعمل البيئي",
		questions: [
			{
				id: "1_1",
				text: "هل تحب العمل في الهواء الطلق؟",
				affectsCareers: ["عامل بيئي", "مزارع"],
			},
			{
				id: "1_2",
				text: "هل تفضل العناية بالنباتات او الحيوانات؟",
				affectsCareers: ["راعي", "مزارع"],
			},
			{
				id: "1_3",
				text: "هل يمكنك العمل تحت الشمس لساعات؟",
				affectsCareers: ["مزارع", "عامل بيئي"],
			},
			{
				id: "1_4",
				text: "هل زرعت او حرثت الارض؟",
				affectsCareers: ["مزارع"],
			},
			{
				id: "1_5",
				text: "هل تعتني بالحيوانات؟",
				affectsCareers: ["راعي"],
			},
			{
				id: "1_6",
				text: "هل تهتم بالحماية البيئية او تنظيف الاماكن العامة؟",
				affectsCareers: ["عامل بيئي"],
			},
		],
		careers: [
			{
				id: "1_1",
				name: "عامل بيئي",
			},
			{
				id: "1_2",
				name: "راعي",
			},
			{
				id: "1_3",
				name: "مزارع",
			},
		],
	},
	{
		id: "2",
		name: "الإدارة والمحاسبة",
		questions: [
			{
				id: "2_1",
				text: "هل تفضل تنظيم المهام؟",
				affectsCareers: ["مدير مشروع", "مساعد إداري"],
			},
			{
				id: "2_2",
				text: "هل لديك مهارة في الأرقام أو الجدولة؟",
				affectsCareers: ["محاسب", "مساعد إداري"],
				cvText: "مهارة في الأرقام أو الجدولة",
			},
			{
				id: "2_3",
				text: "هل تستطيع إدارة فريق أو مشروع صغير؟",
				affectsCareers: ["مدير مشروع"],
			},
			{
				id: "2_4",
				text: "هل تعرف Excel أو Word؟",
				affectsCareers: ["محاسب"],
			},
			{
				id: "2_5",
				text: "هل تملك مهارات تواصل مكتوبة ومنظمة؟",
				affectsCareers: ["مساعد إداري"],
			},
			{
				id: "2_6",
				text: "هل سب أن أدرت مشروعاً؟",
				affectsCareers: ["مدير مشروع"],
			},
		],
		careers: [
			{
				id: "2_1",
				name: "مدير مشروع",
			},
			{
				id: "2_2",
				name: "مساعد إداري",
			},
			{
				id: "2_3",
				name: "محاسب",
			},
		],
	},
];
