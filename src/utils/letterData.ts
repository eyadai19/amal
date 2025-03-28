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
		image: "../image/letters/alif/ALIF.png",
		end_image: "../image/letters/alif/alif-last.png",
		middle_image: "../image/letters/alif/alif-mid.png",
		start_image: "../image/letters/alif/alif-first.png",
		description:
			"حرف الألف هو أول حرف في اللغة العربية، وهو من الحروف الأساسية التي تُستخدم في تكوين العديد من الكلمات. يمكن أن يأتي في بداية الكلمة أو وسطها أو نهايتها",
		forms: {
			start: [
				{ word: "أمل", example: "كان لديه أمل كبير في النجاح" },
				{ word: "أرض", example: "سقطت التفاحة على الأرض" },
				{ word: "أزهار", example: "تفتحت الأزهار في الربيع" },
			],
			middle: [
				{ word: "مأساة", example: "كانت الحرب مأساة" },
				{ word: "مأمور", example: "كلف المأمور بتنفيذ الأوامر بدقة" },
				{ word: "مسألة", example: "كانت المسألة صعبة" },
			],
			end: [
				{ word: "دعا", example: "دعا الأب أبناءه إلى العشاء" },
				{ word: "رجا", example: "رجا الأب لابنه مستقبلاً مشرقًا" },
				{ word: "صفا", example: "صفا الماء في البحيرة بعد هدوء الرياح" },
			],
		},
	},
	baa: {
		title: "حرف الباء",
		image: "../image/letters/baa/BAA.png",
		end_image: "../image/letters/baa/baa-last.png",
		middle_image: "../image/letters/baa/baa-mid.png",
		start_image: "../image/letters/baa/baa-first.png",
		description:
			"حرف الباء هو ثاني حروف الهجاء العربية، ينطق عند اتصاله بحركة أو سكون، وهو من الحروف الشفوية التي تخرج من بين الشفتين.",
		forms: {
			start: [
				{ word: "باب", example: "فتح الولد باب المنزل بلطف" },
				{ word: "بحر", example: "سبحنا في البحر الصافي" },
				{ word: "بيت", example: "بيتنا الجديد واسع ومريح" },
			],
			middle: [
				{ word: "سبب", example: "كان السبب وراء نجاح المشروع هو التخطيط الجيد" },
				{ word: "شباب", example: "شباب اليوم طموحون ومجتهدون" },
				{ word: "محبوب", example: "كان دائماً شخصاً محبوباً لدى الجميع" },
			],
			end: [
				{ word: "قلب", example: "يجب أن نحافظ على صحة القلب" },
				{ word: "عتب", example: "لا يوجد عتب بين الأصدقاء الحقيقيين" },
				{ word: "حب", example: "أهديت أمي باقة من الورد تعبيرًا عن حبّي لها" },
			],
		},
	},
	taa: {
		title: "حرف التاء",
		image: "../image/letters/taa/TAA.png",
		end_image: "../image/letters/taa/taa-last.png",
		middle_image: "../image/letters/taa/taa-mid.png",
		start_image: "../image/letters/taa/taa-first.png",
		description:
			"حرف التاء هو ثالث حروف الهجاء العربية، ينطق بوضع طرف اللسان على الثنايا العليا، وهو من الحروف الأسلية.",
		forms: {
			start: [
				{ word: "تفاح", example: "التفاحة الحمراء لذيذة ومفيدة" },
				{ word: "تمر", example: "التمر غذاء صحي وغني بالطاقة" },
				{ word: "تاج", example: "وضع الملك التاج على رأسه" },
			],
			middle: [
				{ word: "كتاب", example: "وضعت الكتاب على الرف بعناية" },
				{ word: "مكتبة", example: "تحتوي المكتبة على آلاف الكتب القيمة" },
				{ word: "مجتهدة", example: "الفتاة المجتهدة تحقق أحلامها" },
			],
			end: [
				{ word: "بيت", example: "عدنا إلى بيتنا بعد رحلة طويلة" },
				{ word: "حسنت", example: "لقد حسنت أدائي بعد التدريب المكثف" },
				{ word: "حالت", example: "حالت الظروف دون تحقيق المشروع" },
			],
		},
	},
	thaa: {
		title: "حرف الثاء",
		image: "../image/letters/thaa/THAA.png",
		end_image: "../image/letters/thaa/thaa-last.png",
		middle_image: "../image/letters/thaa/thaa-mid.png",
		start_image: "../image/letters/thaa/thaa-first.png",
		description:
			"حرف الثاء هو رابع حروف الهجاء العربية، ينطق بوضع طرف اللسان بين الثنايا العليا والسفلى مع خروج صوت حاد.",
		forms: {
			start: [
				{ word: "ثعلب", example: "رأيت ثعلبًا في الغابة" },
				{ word: "ثمار", example: "قطفت ثمار الشجرة الناضجة" },
				{ word: "ثوب", example: "اشتريت ثوبًا جديدًا للعيد" },
			],
			middle: [
				{ word: "مثل", example: "هذا المثل يعبر عن الحكمة" },
				{ word: "كثبان", example: "تلال الرمال تسمى كثبان" },
				{ word: "مثمر", example: "كان الحوار مثمرًا بين الطرفين" },
			],
			end: [
				{ word: "بحث", example: "قمتُ بإجراء بحث علمي حول هذا الموضوع" },
				{ word: "حدث", example: "كان الحدث مهمًا للجميع" },
				{ word: "نفث", example: "نفث المدخن دخانه في الهواء" },
			],
		},
	},
	jeem: {
		title: "حرف الجيم",
		image: "../image/letters/jeem/JEEM.png",
		end_image: "../image/letters/jeem/jeem-last.png",
		middle_image: "../image/letters/jeem/jeem-mid.png",
		start_image: "../image/letters/jeem/jeem-first.png",
		description:
			"حرف الجيم هو خامس حروف الهجاء العربية، ينطق برفع وسط اللسان إلى الحنك الأعلى مع انحباس الصوت ثم إطلاقه.",
		forms: {
			start: [
				{ word: "جبل", example: "تسلقنا الجبل الشاهق" },
				{ word: "جمل", example: "رأيت جملاً في الصحراء" },
				{ word: "جوارب", example: "اشتريت جوارب دافئة للشتاء" },
			],
			middle: [
				{ word: "مجلة", example: "قرأت مقالاً في المجلة" },
				{ word: "حجاب", example: "الحجاب يحمي خصوصية المنزل" },
				{ word: "سجادة", example: "السجادة الفارسية جميلة" },
			],
			end: [
				{ word: "برج", example: "شاهدنا البرج العالي" },
				{ word: "حجاج", example: "عاد الحجاج من مكة" },
				{ word: "طازج", example: "أكلت الخبز الطازج" },
			],
		},
	},
	haa: {
		title: "حرف الحاء",
		image: "../image/letters/haa/HAA.png",
		end_image: "../image/letters/haa/haa-last.png",
		middle_image: "../image/letters/haa/haa-mid.png",
		start_image: "../image/letters/haa/haa-first.png",
		description:
			"حرف الحاء هو سادس حروف الهجاء العربية، ينطق من وسط الحلق مع انحباس النفس ثم إطلاقه.",
		forms: {
			start: [
				{ word: "حلم", example: "راودني حلم جميل الليلة" },
				{ word: "حقل", example: "زرع الفلاح الحقل بالقمح" },
				{ word: "حذاء", example: "اشتريت حذاءً جديدًا" },
			],
			middle: [
				{ word: "محاولة", example: "المحاولة هي الخطوة الأولى نحو النجاح" },
				{ word: "محبة", example: "المحبة أساس العلاقات" },
				{ word: "سحاب", example: "غطى السحاب السماء" },
			],
			end: [
				{ word: "فرح", example: "عم الفرح أرجاء المكان" },
				{ word: "فلاح", example: "يعمل الفلاح في الحقل" },
				{ word: "ملح", example: "أضفت قليلًا من الملح للطعام" },
			],
		},
	},
	khaa: {
		title: "حرف الخاء",
		image: "../image/letters/khaa/KHAA.png",
		end_image: "../image/letters/khaa/khaa-last.png",
		middle_image: "../image/letters/khaa/khaa-mid.png",
		start_image: "../image/letters/khaa/khaa-first.png",
		description:
			"حرف الخاء هو سابع حروف الهجاء العربية، ينطق من أقصى الحلق مع خروج صوت خشن.",
		forms: {
			start: [
				{ word: "خبز", example: "أكلت خبزًا طازجًا" },
				{ word: "خروف", example: "رأيت خروفًا في المزرعة" },
				{ word: "خريطة", example: "استخدمت الخريطة للوصول" },
			],
			middle: [
				{ word: "مخبز", example: "اشتريت الخبز من المخبز" },
				{ word: "أخضر", example: "اللون الأخضر جميل" },
				{ word: "سخان", example: "أصلحت السخان المعطوب" },
			],
			end: [
				{ word: "شيخ", example: "الشيخ معروف بحكمته ورجاحة عقله" },
				{ word: "صرخ", example: "صرخ الطفل عند رؤية الحشرة" },
				{ word: "فخ", example: "وقف الصياد على الفخ منتظرًا فريسته" },
			],
		},
	},
	dal: {
		title: "حرف الدال",
		image: "../image/letters/dal/DAL.png",
		end_image: "../image/letters/dal/dal-last.png",
		middle_image: "../image/letters/dal/dal-mid.png",
		start_image: "../image/letters/dal/dal-first.png",
		description:
			"حرف الدال هو ثامن حروف الهجاء العربية، ينطق بوضع طرف اللسان على الثنايا العليا مع خروج صوت واضح.",
		forms: {
			start: [
				{ word: "دار", example: "زرت دار الأيتام" },
				{ word: "دب", example: "رأيت دبًا في الغابة" },
				{ word: "دجاج", example: "أكلت دجاجًا مشويًا" },
			],
			middle: [
				{ word: "مدينة", example: "زرت مدينة جميلة" },
				{ word: "حديقة", example: "لعب الأطفال في الحديقة" },
				{ word: "هدوء", example: "الهدوء ضروري في المكتبات" },
			],
			end: [
				{ word: "عقد", example: "اشترت أمي عقدًا جميلاً" },
				{ word: "جسد", example: "يجب العناية بالجسد" },
				{ word: "وعد", example: "أوفى الرجل بوعده" },
			],
		},
	},
	thal: {
		title: "حرف الذال",
		image: "../image/letters/thal/THAL.png",
		end_image: "../image/letters/thal/thal-last.png",
		middle_image: "../image/letters/thal/thal-mid.png",
		start_image: "../image/letters/thal/thal-first.png",
		description:
			"حرف الذال هو تاسع حروف الهجاء العربية، ينطق مثل الدال لكن مع خروج صوت أكثر حدة.",
		forms: {
			start: [
				{ word: "ذهب", example: "اشتريت ذهبًا جديدًا" },
				{ word: "ذئب", example: "رأيت ذئبًا في الغابة" },
				{ word: "ذكرى", example: "حفظت ذكرى جميلة" },
			],
			middle: [
				{ word: "مذكرة", example: "كتبت الملاحظات في المذكرة" },
				{ word: "حذاء", example: "نظفت حذائي جيدًا" },
				{ word: "سذاجة", example: "تعجبني سذاجة الأطفال" },
			],
			end: [
				{ word: "مآخذ", example: "كان للمشروع عدة مآخذ تحتاج إلى إصلاح" },
				{ word: "مغذ", example: "الحليب مغذٍ للأطفال" },
				{ word: "حاذ", example: "حاذَ السائق سيارته بجانب الرصيف" },
			],
		},
	},
	raa: {
		title: "حرف الراء",
		image: "../image/letters/raa/RAA.png",
		end_image: "../image/letters/raa/raa-last.png",
		middle_image: "../image/letters/raa/raa-mid.png",
		start_image: "../image/letters/raa/raa-first.png",
		description:
			"حرف الراء هو عاشر حروف الهجاء العربية، ينطق برفع طرف اللسان نحو الحنك الأعلى مع اهتزازه.",
		forms: {
			start: [
				{ word: "رجل", example: "رأيت رجلاً طويلاً" },
				{ word: "رياح", example: "هبت رياح قوية" },
				{ word: "رسالة", example: "كتبت رسالة لصديقي" },
			],
			middle: [
				{ word: "مرح", example: "كان الجو مليئًا بالمرح" },
				{ word: "حرية", example: "الحرية حق للجميع" },
				{ word: "سراج", example: "أضاء السراج الغرفة" },
			],
			end: [
				{ word: "بحر", example: "سبحنا في البحر" },
				{ word: "زهر", example: "تفتح زهر الربيع" },
				{ word: "تفكير", example: "أعجبني تفكيرك" },
			],
		},
	},
	zay: {
		title: "حرف الزاي",
		image: "../image/letters/zay/ZAY.png",
		end_image: "../image/letters/zay/zay-last.png",
		middle_image: "../image/letters/zay/zay-mid.png",
		start_image: "../image/letters/zay/zay-first.png",
		description:
			"حرف الزاي هو حادي عشر حروف الهجاء العربية، ينطق مثل السين لكن مع خروج صوت أكثر حدة.",
		forms: {
			start: [
				{ word: "زهر", example: "قطفت زهرة جميلة" },
				{ word: "زيت", example: "استخدمت زيت الزيتون" },
				{ word: "زجاج", example: "كسرت قطعة من الزجاج" },
			],
			middle: [
				{ word: "مزرعة", example: "زرت مزرعة عمي" },
				{ word: "حزين", example: "بدا الطفل حزينًا" },
				{ word: "مزاج", example: "تحسن مزاجي اليوم" },
			],
			end: [
				{ word: "عز", example: "حافظ على عزتك" },
				{ word: "كنز", example: "اكتشف العلماء كنزًا أثريًا" },
				{ word: "جوز", example: "أكلت حبات من الجوز" },
			],
		},
	},
	seen: {
		title: "حرف السين",
		image: "../image/letters/seen/SEEN.png",
		end_image: "../image/letters/seen/seen-last.png",
		middle_image: "../image/letters/seen/seen-mid.png",
		start_image: "../image/letters/seen/seen-first.png",
		description:
			"حرف السين هو ثاني عشر حروف الهجاء العربية، ينطق بوضع طرف اللسان خلف الأسنان السفلى مع خروج صوت ساكن.",
		forms: {
			start: [
				{ word: "سمك", example: "أكلت سمكًا مشويًا" },
				{ word: "سحاب", example: "غطى السحاب السماء" },
				{ word: "ساعة", example: "اشتريت ساعة جديدة" },
			],
			middle: [
				{ word: "مسار", example: "سلكت السيارة مسارًا مختلفًا" },
				{ word: "مسجد", example: "صليت في المسجد" },
				{ word: "فسحة", example: "خرجنا في فسحة مدرسية" },
			],
			end: [
				{ word: "نفس", example: "النفس تحتاج إلى راحة" },
				{ word: "جلس", example: "جلس الطفل بجانب والديه" },
				{ word: "درس", example: "أكمل الطالب درسه بنجاح" },
			],
		},
	},
	sheen: {
		title: "حرف الشين",
		image: "../image/letters/sheen/SHEEN.png",
		end_image: "../image/letters/sheen/sheen-last.png",
		middle_image: "../image/letters/sheen/sheen-mid.png",
		start_image: "../image/letters/sheen/sheen-first.png",
		description:
			"حرف الشين هو ثالث عشر حروف الهجاء العربية، ينطق مثل السين لكن مع خروج صوت أكثر حدة.",
		forms: {
			start: [
				{ word: "شروق", example: "شروق الشمس منظر جميل" },
				{ word: "شركة", example: "الشركة نجحت في السوق المحلي" },
				{ word: "شباب", example: "الشباب هم أمل المستقبل" },
			],
			middle: [
				{ word: "مشهد", example: "كان المشهد رائعًا" },
				{ word: "حشرة", example: "رأيت حشرة على الجدار" },
				{ word: "عشب", example: "نما العشب في الحديقة" },
			],
			end: [
				{ word: "فراش", example: "نام الطفل على الفراش" },
				{ word: "نقاش", example: "جرى نقاش هادئ" },
				{ word: "رعش", example: "رعش الطفل من البرد القارس" },
			],
		},
	},
	sad: {
		title: "حرف الصاد",
		image: "../image/letters/sad/sad.png",
		end_image: "../image/letters/sad/sad-last.png",
		middle_image: "../image/letters/sad/sad-mid.png",
		start_image: "../image/letters/sad/sad-first.png",
		description:
			"حرف الصاد هو رابع عشر حروف الهجاء العربية، ينطق بإطباق اللسان على الحنك الأعلى مع خروج صوت مفخم.",
		forms: {
			start: [
				{ word: "صبر", example: "الصبر مفتاح الفرج" },
				{ word: "صلاة", example: "أديت الصلاة في وقتها" },
				{ word: "صديق", example: "زرت صديقي المريض" },
			],
			middle: [
				{ word: "مصباح", example: "أضاء المصباح الغرفة" },
				{ word: "حصان", example: "ركض الحصان بسرعة" },
				{ word: "عصفور", example: "غرد العصفور على الشجرة" },
			],
			end: [
				{ word: "حرص", example: "حرص المعلم على توضيح الدرس" },
				{ word: "خصص", example: "خصصت الشركة موارد إضافية" },
				{ word: "لص", example: "تم القبض على اللص أثناء محاولته الهروب" },
			],
		},
	},
	dad: {
		title: "حرف الضاد",
		image: "../image/letters/dad/DAD.png",
		end_image: "../image/letters/dad/dad-last.png",
		middle_image: "../image/letters/dad/dad-mid.png",
		start_image: "../image/letters/dad/dad-first.png",
		description:
			"حرف الضاد هو خامس عشر حروف الهجاء العربية، وهو الحرف الذي تتميز به اللغة العربية عن غيرها.",
		forms: {
			start: [
				{ word: "ضفدع", example: "قفز الضفدع في البركة" },
				{ word: "ضرس", example: "ألم في ضرسي" },
				{ word: "ضوء", example: "انبعث الضوء من المصباح" },
			],
			middle: [
				{ word: "مضرب", example: "أمسكت بالمضرب للعب" },
				{ word: "حضن", example: "احتضنت أمي طفليها" },
				{ word: "قضية", example: "نوقشت القضية بجدية" },
			],
			end: [
				{ word: "أرض", example: "الأرض مصدر الحياة" },
				{ word: "بيض", example: "أضفت البيض إلى الكعكة" },
				{ word: "قرض", example: "حصلت على قرض من البنك" },
			],
		},
	},
	tah: {
		title: "حرف الطاء",
		image: "../image/letters/tah/TAH.png",
		end_image: "../image/letters/tah/tah-last.png",
		middle_image: "../image/letters/tah/tah-mid.png",
		start_image: "../image/letters/tah/tah-first.png",
		description:
			"حرف الطاء هو سادس عشر حروف الهجاء العربية، ينطق بإطباق اللسان على الحنك الأعلى مع خروج صوت مفخم.",
		forms: {
			start: [
				{ word: "طائر", example: "حلق الطائر في السماء" },
				{ word: "طبيب", example: "زار المريض الطبيب" },
				{ word: "طريق", example: "سلكت الطريق الأقصر" },
			],
			middle: [
				{ word: "مطر", example: "هطل المطر بغزارة" },
				{ word: "حطب", example: "جمع الحطب للشتاء" },
				{ word: "عطش", example: "شعرت بالعطش الشديد" },
			],
			end: [
				{ word: "ربط", example: "يجب ربط الحزام أثناء القيادة" },
				{ word: "مخطط", example: "لدي مخطط واضح لأهدافي" },
				{ word: "قط", example: "لعب الطفل مع القط" },
			],
		},
	},
	zah: {
		title: "حرف الظاء",
		image: "../image/letters/zah/ZAH.png",
		end_image: "../image/letters/zah/zah-last.png",
		middle_image: "../image/letters/zah/zah-mid.png",
		start_image: "../image/letters/zah/zah-first.png",
		description:
			"حرف الظاء هو سابع عشر حروف الهجاء العربية، ينطق مثل الطاء لكن مع خروج صوت أكثر حدة.",
		forms: {
			start: [
				{ word: "ظل", example: "جلست تحت ظل الشجرة" },
				{ word: "ظهر", example: "ألم في ظهري" },
				{ word: "ظرف", example: "وضعت الأوراق في الظرف" },
			],
			middle: [
				{ word: "حظيرة", example: "أغلق الباب على الحظيرة" },
				{ word: "عظيم", example: "كان اليوم عظيمًا" },
				{ word: "مظهر", example: "كان مظهره أنيقًا" },
			],
			end: [
				{ word: "ملحظ", example: "كان الملحظ واضحًا" },
				{ word: "حفظ", example: "حفظ الطالب درسه جيدًا" },
				{ word: "حظ", example: "كان يومي مليئًا بالحظ" },
			],
		},
	},
	ayn: {
		title: "حرف العين",
		image: "../image/letters/ayn/AYN.png",
		end_image: "../image/letters/ayn/ayn-last.png",
		middle_image: "../image/letters/ayn/ayn-mid.png",
		start_image: "../image/letters/ayn/ayn-first.png",
		description:
			"حرف العين هو ثامن عشر حروف الهجاء العربية، ينطق من أقصى الحلق مع انحباس الصوت ثم إطلاقه.",
		forms: {
			start: [
				{ word: "عين", example: "شربت من عين الماء" },
				{ word: "عسل", example: "أكلت عسلاً طبيعيًا" },
				{ word: "عصفور", example: "غرد العصفور على الشجرة" },
			],
			middle: [
				{ word: "معلم", example: "المعلم يشرح الدرس" },
				{ word: "معرفة", example: "المعرفة تنير العقول" },
				{ word: "سعادة", example: "عمت السعادة المكان" },
			],
			end: [
				{ word: "منع", example: "منع التدخين في الأماكن العامة" },
				{ word: "طبع", example: "طبع الكتاب بتصميم أنيق" },
				{ word: "سمع", example: "سمع الطفل صوت الطيور في الصباح" },
			],
		},
	},
	ghayn: {
		title: "حرف الغين",
		image: "../image/letters/ghayn/GHAYN.png",
		end_image: "../image/letters/ghayn/ghayn-last.png",
		middle_image: "../image/letters/ghayn/ghayn-mid.png",
		start_image: "../image/letters/ghayn/ghayn-first.png",
		description:
			"حرف الغين هو تاسع عشر حروف الهجاء العربية، ينطق من أقصى الحلق مع خروج صوت غليظ.",
		forms: {
			start: [
				{ word: "غيم", example: "غطت الغيم السماء" },
				{ word: "غابة", example: "تجولنا في الغابة" },
				{ word: "غزال", example: "رأيت غزالاً في البرية" },
			],
			middle: [
				{ word: "مغامرة", example: "خضنا مغامرة مثيرة" },
				{ word: "أغنية", example: "استمعت إلى أغنية جميلة" },
				{ word: "مغزل", example: "استخدمت الجدة المغزل" },
			],
			end: [
				{ word: "بلغ", example: "بلغ الخبر الجميع بسرعة" },
				{ word: "صمغ", example: "استخدمت الصمغ في حصة الرسم" },
				{ word: "فرغ", example: "فرغ الإناء من الماء" },
			],
		},
	},
	faa: {
		title: "حرف الفاء",
		image: "../image/letters/faa/FAA.png",
		end_image: "../image/letters/faa/faa-last.png",
		middle_image: "../image/letters/faa/faa-mid.png",
		start_image: "../image/letters/faa/faa-first.png",
		description:
			"حرف الفاء هو العشرون في ترتيب الحروف الهجائية العربية، ينطق بوضع الشفة السفلى على الأسنان العليا.",
		forms: {
			start: [
				{ word: "فيل", example: "رأيت فيلاً في الغابة" },
				{ word: "فراشة", example: "حلقت الفراشة في الحديقة" },
				{ word: "فاكهة", example: "أكلت فاكهة طازجة" },
			],
			middle: [
				{ word: "مفتاح", example: "نسيت المفتاح في المنزل" },
				{ word: "حفلة", example: "حضرت حفلة ميلاد" },
				{ word: "سفينة", example: "ركبت السفينة للعبور" },
			],
			end: [
				{ word: "خوف", example: "شعرت بخوف شديد" },
				{ word: "صيف", example: "حل فصل الصيف" },
				{ word: "هدف", example: "حقق اللاعب هدفًا رائعًا" },
			],
		},
	},
	qaf: {
		title: "حرف القاف",
		image: "../image/letters/qaf/QAF.png",
		end_image: "../image/letters/qaf/qaf-last.png",
		middle_image: "../image/letters/qaf/qaf-mid.png",
		start_image: "../image/letters/qaf/qaf-first.png",
		description:
			"حرف القاف هو الحادي والعشرون في ترتيب الحروف الهجائية العربية، ينطق من أقصى اللسان مع الحنك الأعلى.",
		forms: {
			start: [
				{ word: "قمر", example: "أضاء القمر السماء" },
				{ word: "قلم", example: "كتبت بالقلم الجديد" },
				{ word: "قرد", example: "قفز القرد بين الأشجار" },
			],
			middle: [
				{ word: "مقعد", example: "جلست على المقعد" },
				{ word: "حقيبة", example: "حملت الحقيبة المدرسية" },
				{ word: "سقف", example: "رأيت عشًا على السقف" },
			],
			end: [
				{ word: "ورق", example: "كتبت على الورق" },
				{ word: "حق", example: "ناضل من أجل الحق" },
				{ word: "سبق", example: "سبق الطالب زملاءه في الإجابة" },
			],
		},
	},
	kaf: {
		title: "حرف الكاف",
		image: "../image/letters/kaf/KAF.png",
		end_image: "../image/letters/kaf/kaf-last.png",
		middle_image: "../image/letters/kaf/kaf-mid.png",
		start_image: "../image/letters/kaf/kaf-first.png",
		description:
			"حرف الكاف هو الثاني والعشرون في ترتيب الحروف الهجائية العربية، ينطق برفع مؤخرة اللسان نحو الحنك الأعلى.",
		forms: {
			start: [
				{ word: "كتاب", example: "قرأت كتابًا شيقًا" },
				{ word: "كلب", example: "لعبت مع الكلب" },
				{ word: "كوب", example: "شربت الماء من الكوب" },
			],
			middle: [
				{ word: "مكتب", example: "رتبت الأوراق على المكتب" },
				{ word: "حكاية", example: "حكت الجدة حكاية مسلية" },
				{ word: "سكر", example: "أضفت السكر للشاي" },
			],
			end: [
				{ word: "برك", example: "برك الماء تكونت بعد المطر" },
				{ word: "هلك", example: "هلك الجنود في المعركة" },
				{ word: "ملاك", example: "الطفل يملك قلبًا مثل الملاك" },
			],
		},
	},
	lam: {
		title: "حرف اللام",
		image: "../image/letters/lam/LAM.png",
		end_image: "../image/letters/lam/lam-last.png",
		middle_image: "../image/letters/lam/lam-mid.png",
		start_image: "../image/letters/lam/lam-first.png",
		description:
			"حرف اللام هو الثالث والعشرون في ترتيب الحروف الهجائية العربية، ينطق بوضع طرف اللسان على الثنايا العليا.",
		forms: {
			start: [
				{ word: "ليمون", example: "عصير الليمون" },
				{ word: "لوز", example: "أكلت حبات من اللوز" },
				{ word: "لعبة", example: "اشتريت لعبة جديدة" },
			],
			middle: [
				{ word: "ملعب", example: "لعب الأطفال في الملعب" },
				{ word: "حليب", example: "شربت كوبًا من الحليب" },
				{ word: "سلحفاة", example: "رأيت سلحفاة في الحديقة" },
			],
			end: [
				{ word: "جبل", example: "تسلقنا الجبل الشاهق" },
				{ word: "الحل", example: "وجد المهندس الحل للمشكلة" },
				{ word: "خيل", example: "شاهدت الخيل تركض" },
			],
		},
	},
	meem: {
		title: "حرف الميم",
		image: "../image/letters/meem/MEEM.png",
		end_image: "../image/letters/meem/meem-last.png",
		middle_image: "../image/letters/meem/meem-mid.png",
		start_image: "../image/letters/meem/meem-first.png",
		description:
			"حرف الميم هو الرابع والعشرون في ترتيب الحروف الهجائية العربية، ينطق بإطباق الشفتين مع خروج صوت أنفي.",
		forms: {
			start: [
				{ word: "ماء", example: "شربت كوبًا من الماء" },
				{ word: "مدرسة", example: "ذهبت إلى المدرسة" },
				{ word: "منزل", example: "عدت إلى المنزل مساءً" },
			],
			middle: [
				{ word: "كمبيوتر", example: "عملت على الكمبيوتر" },
				{ word: "جميل", example: "المنظر جميل جدًا" },
				{ word: "سمكة", example: "اصطدت سمكة كبيرة" },
			],
			end: [
				{ word: "العلم", example: "العلم أساس تقدم الأمم" },
				{ word: "قلم", example: "استخدمت القلم الأزرق" },
				{ word: "حكم", example: "حكم المباراة كان عادلًا" },
			],
		},
	},
	noon: {
		title: "حرف النون",
		image: "../image/letters/noon/NOON.png",
		end_image: "../image/letters/noon/noon-last.png",
		middle_image: "../image/letters/noon/noon-mid.png",
		start_image: "../image/letters/noon/noon-first.png",
		description:
			"حرف النون هو الخامس والعشرون في ترتيب الحروف الهجائية العربية، ينطق بوضع طرف اللسان خلف الأسنان العليا مع خروج صوت أنفي.",
		forms: {
			start: [
				{ word: "نهر", example: "جرى النهر بهدوء" },
				{ word: "نافذة", example: "فتحت النافذة للهواء" },
				{ word: "نحلة", example: "رأيت نحلة على الزهرة" },
			],
			middle: [
				{ word: "منزل", example: "عدت إلى المنزل مساءً" },
				{ word: "حنين", example: "شعرت بالحنين للوطن" },
				{ word: "سنارة", example: "أمسكت بالسنارة للصيد" },
			],
			end: [
				{ word: "اعلن", example: "أعلن المدير عن الخطة الجديدة" },
				{ word: "سكن", example: "سكن الطلاب كان مريحًا" },
				{ word: "حنين", example: "المغتربون يشعرون بالحنين الى وطنهم" },
			],
		},
	},
	ha: {
		title: "حرف الهاء",
		image: "../image/letters/ha/HA.png",
		end_image: "../image/letters/ha/ha-last.png",
		middle_image: "../image/letters/ha/ha-mid.png",
		start_image: "../image/letters/ha/ha-first.png",
		description:
			"حرف الهاء هو السادس والعشرون في ترتيب الحروف الهجائية العربية، ينطق من وسط الحلق مع خروج صوت خفيف.",
		forms: {
			start: [
				{ word: "هدهد", example: "رأيت هدهدًا في الحديقة" },
				{ word: "هلال", example: "ظهر الهلال مساءً" },
				{ word: "هواء", example: "شعرت بنسمات الهواء" },
			],
			middle: [
				{ word: "مهندس", example: "عمل المهندس بجد" },
				{ word: "انتهى", example: "انتهى الدرس بسرعة" },
				{ word: "سهل", example: "سار المسافر في السهل" },
			],
			end: [
				{ word: "فوه", example: "نطق الشيخ بالحكمة من فوه قلبه" },
				{ word: "اله", example: "لا اله الا الله" },
				{ word: "وجه", example: "كان وجه القمر مشرقًا في الليل" },
			],
		},
	},
	waw: {
		title: "حرف الواو",
		image: "../image/letters/waw/WAW.png",
		end_image: "../image/letters/waw/waw-last.png",
		middle_image: "../image/letters/waw/waw-mid.png",
		start_image: "../image/letters/waw/waw-first.png",
		description:
			"حرف الواو هو السابع والعشرون في ترتيب الحروف الهجائية العربية، ينطق بتقريب الشفتين مع خروج صوت مرقق.",
		forms: {
			start: [
				{ word: "وردة", example: "قطفت وردة جميلة" },
				{ word: "ولد", example: "لعب الولد في الحديقة" },
				{ word: "وقت", example: "الوقت ثمين" },
			],
			middle: [
				{ word: "موز", example: "أكلت موزة ناضجة" },
				{ word: "حوت", example: "سبح الحوت في المحيط" },
				{ word: "سور", example: "بنوا سورًا حول الحديقة" },
			],
			end: [
				{ word: "نحو", example: "اتجهت السيارة نحو المدينة" },
				{ word: "نمو", example: "النمو الاقتصادي ضروري للتقدم" },
				{ word: "سرو", example: "السرو شجرة دائمة الخضرة" },
			],
		},
	},
	ya: {
		title: "حرف الياء",
		image: "../image/letters/ya/YA.png",
		end_image: "../image/letters/ya/ya-last.png",
		middle_image: "../image/letters/ya/ya-mid.png",
		start_image: "../image/letters/ya/ya-first.png",
		description:
			"حرف الياء هو الثامن والعشرون في ترتيب الحروف الهجائية العربية، ينطق بتقريب وسط اللسان من الحنك الأعلى.",
		forms: {
			start: [
				{ word: "يمامة", example: "حلقت اليمامة في السماء" },
				{ word: "يد", example: "رفعت يدي للإجابة" },
				{ word: "يوم", example: "كان يومًا مشمسًا" },
			],
			middle: [
				{ word: "بيت", example: "عدت إلى البيت مساءً" },
				{ word: "حياة", example: "الحياة جميلة" },
				{ word: "سيارة", example: "قدت السيارة بسرعة" },
			],
			end: [
				{ word: "مضي", example: "مضي الوقت بسرعة اليوم" },
				{ word: "النهي", example: "النهي عن الكذب من القيم المهمة" },
				{ word: "سعي", example: "السعي وراء النجاح مطلوب" },
			],
		},
	},
};
