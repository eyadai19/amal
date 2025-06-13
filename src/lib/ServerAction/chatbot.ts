"use server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API!);

const arabicPrompt = `
أنت شات بوت متخصص لدعم المساجين السابقين نفسيًا. مهمتك:

1. للرسائل السلبية (حزن/يأس):
   - قدم تعاطفًا حقيقيًا
   - ذكّر بأن الأيام الصعبة مؤقتة
   - مثال: "أعلم أن ما تمر به صعب، لكنك أقوى مما تظن"

2. للرسائل الإيجابية (أمل/تفاؤل):
   - قدم تشجيعًا وتحفيزًا
   - مثال: "هذا رائع! استمر في التقدم"

3. المطلوب:
   - التزم باللغة العربية
   - اجعل الردود قصيرة (1-3 جمل)
   - لا تقدم نصائح غير مرغوبة
   - تجنب المحتوى الديني أو السياسي
`;

export async function generateSupportResponseAction(
	input: string,
): Promise<string> {
	try {
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash", // أو gemini-2.5-flash إذا كان متاحًا
		});

		const result = await model.generateContent({
			contents: [
				{
					role: "user",
					parts: [{ text: input }],
				},
			],
			systemInstruction: {
				role: "system",
				parts: [{ text: arabicPrompt }],
			},
		});

		return result.response.text() || "أنا هنا لمساعدتك. كيف تشعر اليوم؟";
	} catch (e) {
		console.error("Error generating response:", e);
		return "حدث خطأ ما. يرجى المحاولة لاحقًا.";
	}
}

//////////////////////
const cvPrompt = `
أنت محول نصوص محترف لصياغة السير الذاتية. مهمتك:

1. تحويل الوصف غير الرسمي إلى صيغة احترافية مناسبة لـ CV
2. التركيز على المهارات والإنجازات دون ذكر مكان العمل إذا كان سجناً
3. استخدام لغة رسمية ومهنية محايدة
4. إضافة أفعال إنجاز مثل (طورت، قمت بإدارة، ساهمت في)
5. الإبقاء على المهارات الأساسية مع إعادة صياغتها بشكل احترافي

متطلبات صارمة:
- ممنوع ذكر أي إشارة إلى السجن أو المؤسسات الإصلاحية
- التزم باللغة العربية الفصحى المهنية
- اجعل الناتج جملة واحدة مركزة
- ركز على المهارات القابلة للتحويل (Transferable Skills)
- تجنب أي معلومات قد توحي بخلفية سجن

أمثلة:
المدخل: "كنت أعمل في السجن طباخ"
المخرجات: "خبرة في إعداد وتجهيز الوجبات اليومية لجماعات كبيرة وفق معايير الجودة والسلامة الغذائية"

المدخل: "كنت أشرف على النزلاء في السجن"
المخرجات: "خبرة في الإشراف وإدارة المجموعات مع الالتزام باللوائح والأنظمة المقررة"

تحذير: إذا تم كسر أي من هذه القواعد سيتم رفض النص بالكامل
`;

export async function convertToCvFormatAction(
	informalText: string,
): Promise<string> {
	try {
		const model = genAI.getGenerativeModel({
			model: "gemini-1.5-flash",
		});

		const result = await model.generateContent({
			contents: [
				{
					role: "user",
					parts: [{ text: informalText }],
				},
			],
			systemInstruction: {
				role: "system",
				parts: [{ text: cvPrompt }],
			},
		});

		return (
			result.response.text() ||
			"لا يمكن صياغة النص حالياً، يرجى المحاولة لاحقاً"
		);
	} catch (e) {
		console.error("Error converting text:", e);
		return "حدث خطأ أثناء تحويل النص، يرجى المحاولة لاحقاً";
	}
}
