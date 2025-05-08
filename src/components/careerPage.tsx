"use client";
import { useState } from "react";
import AmalNavbar from "./amalNavbar";

export default function CareerPage({
  logoutAction,
}: {
  logoutAction: () => Promise<void>;
}) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const careerSteps = [
    {
      title: "تقييم المهارات",
      description:
        "اكتشف نقاط قوتك ومهاراتك من خلال اختبارات تقييم شاملة تساعدك في تحديد المسار المهني المناسب",
      icon: "📊",
    },
    {
      title: "التدريب والتطوير",
      description:
        "احصل على فرص تدريبية متخصصة وورش عمل لتنمية مهاراتك وتطوير قدراتك المهنية",
      icon: "🎓",
    },
    {
      title: "البحث عن فرص عمل",
      description:
        "استفد من قاعدة بيانات واسعة للوظائف وفرص العمل المتاحة في مختلف المجالات",
      icon: "💼",
    },
  ];

  const careerTips = [
    {
      title: "بناء السيرة الذاتية",
      description:
        "تعلم كيفية كتابة سيرة ذاتية احترافية تعرض مهاراتك وخبراتك بشكل جذاب",
      icon: "📝",
    },
    {
      title: "مهارات المقابلات",
      description:
        "اكتسب المهارات اللازمة لإجراء مقابلات عمل ناجحة وتقديم نفسك بشكل احترافي",
      icon: "🗣️",
    },
    {
      title: "التواصل المهني",
      description:
        "تعلم كيفية بناء شبكة علاقات مهنية فعالة وتطوير مهارات التواصل في بيئة العمل",
      icon: "🤝",
    },
  ];

  const assessmentQuestions = [
    {
      question: "ما هي اهتماماتك الرئيسية؟",
      options: [
        "العمل اليدوي والبناء",
        "إصلاح وصيانة الأجهزة",
        "التصميم والرسم",
        "الزراعة والطبيعة",
        "الطبخ والطهي",
        "التعليم والتدريس",
        "التجارة والمبيعات",
        "الخدمات الاجتماعية",
      ],
    },
    {
      question: "ما هي المهارات التي تفضلها؟",
      options: [
        "استخدام الأدوات اليدوية",
        "حل المشكلات التقنية",
        "الإبداع والتصميم",
        "العمل في الهواء الطلق",
        "إعداد وتقديم الطعام",
        "التواصل مع الآخرين",
        "التفاوض والتسويق",
        "مساعدة ورعاية الناس",
      ],
    },
    {
      question: "ما هو مستوى تعليمك؟",
      options: [
        "ثانوي",
        "دبلوم",
        "بكالوريوس",
        "ماجستير أو أعلى",
        "دورات تدريبية متخصصة",
      ],
    },
    {
      question: "ما هي بيئة العمل المفضلة لديك؟",
      options: [
        "ورشة عمل",
        "مختبر أو مركز صيانة",
        "استوديو أو مكتب تصميم",
        "مزرعة أو حديقة",
        "مطبخ أو مطعم",
        "مدرسة أو مركز تدريب",
        "متجر أو سوق",
        "مستشفى أو مركز رعاية",
      ],
    },
    {
      question: "ما هي المهارات التي تمتلكها؟",
      options: [
        "مهارات يدوية دقيقة",
        "فهم الأجهزة الإلكترونية",
        "حس فني وإبداعي",
        "معرفة بالنباتات والحيوانات",
        "مهارات طهي متقدمة",
        "قدرة على الشرح والتوضيح",
        "مهارات بيع وتسويق",
        "قدرة على التعامل مع الناس",
      ],
    },
    {
      question: "ما هو مستوى نشاطك البدني المفضل؟",
      options: [
        "نشاط بدني عالي",
        "نشاط بدني متوسط",
        "نشاط بدني خفيف",
        "جلوس معظم الوقت",
      ],
    },
    {
      question: "ما هي ساعات العمل المفضلة لديك؟",
      options: [
        "ساعات منتظمة (صباحاً)",
        "ساعات مرنة",
        "ساعات متغيرة",
        "عمل ليلي",
      ],
    },
  ];

  const careerSuggestions = {
    "العمل اليدوي والبناء": [
      "نجار",
      "حداد",
      "بناء",
      "سباك",
      "كهربائي",
      "مبلط",
      "دهان",
      "ميكانيكي سيارات",
      "ميكانيكي دراجات نارية",
      "ميكانيكي معدات ثقيلة",
    ],
    "إصلاح وصيانة الأجهزة": [
      "فني صيانة أجهزة كهربائية",
      "فني صيانة هواتف",
      "فني صيانة أجهزة منزلية",
      "فني صيانة أجهزة طبية",
      "فني صيانة أجهزة تبريد",
      "فني صيانة أجهزة كمبيوتر",
      "فني صيانة شبكات",
      "فني صيانة طابعات",
    ],
    "التصميم والرسم": [
      "مصمم ديكور",
      "مصمم أثاث",
      "مصمم أزياء",
      "مصمم جرافيك",
      "رسام جدران",
      "رسام كاريكاتير",
      "مصور فوتوغرافي",
      "مصمم مجوهرات",
    ],
    "الزراعة والطبيعة": [
      "مزارع",
      "بستاني",
      "مربي حيوانات",
      "عامل في مشاتل",
      "عامل في تربية النحل",
      "عامل في تربية الأسماك",
      "عامل في تربية الدواجن",
      "عامل في تربية المواشي",
    ],
    "الطبخ والطهي": [
      "طاهي",
      "خباز",
      "حلواني",
      "عامل في صناعة المخللات",
      "عامل في صناعة المربى",
      "عامل في صناعة الأجبان",
      "عامل في صناعة الحلويات",
      "عامل في صناعة المعجنات",
    ],
    "التعليم والتدريس": [
      "معلم",
      "مدرب حرفي",
      "مدرب قيادة",
      "مدرب لغة",
      "مدرب حاسب آلي",
      "مدرب رياضة",
      "مدرب فنون",
      "مدرب مهارات حياتية",
    ],
    "التجارة والمبيعات": [
      "بائع",
      "مندوب مبيعات",
      "مسوق",
      "مدير متجر",
      "وكيل تجاري",
      "مستورد",
      "مصدر",
      "وسيط تجاري",
    ],
    "الخدمات الاجتماعية": [
      "ممرض",
      "مساعد طبي",
      "عامل رعاية مسنين",
      "عامل رعاية أطفال",
      "عامل نظافة",
      "حارس أمن",
      "سائق",
      "موظف استقبال",
    ],
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...answers, answerIndex];
    setAnswers(newAnswers);

    if (currentQuestion < assessmentQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const getCareerSuggestions = () => {
    const mainInterest = assessmentQuestions[0].options[answers[0]];
    return (
      careerSuggestions[mainInterest as keyof typeof careerSuggestions] || []
    );
  };

  const resetAssessment = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen bg-[#fbdcdc82]">
      <AmalNavbar
        logoutAction={logoutAction}
        backgroundColor="#7D1B14FF"
        activeSection={"career"}
      />
      <div className="mx-auto max-w-7xl px-4 pt-24 pb-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-800">دليلك المهني</h1>
          <p className="mb-12 text-xl text-gray-600">
            اكتشف مسارك المهني وتطور في حياتك العملية مع دليلنا الشامل
          </p>
        </div>

        {!showResult ? (
          <div className="mb-16 rounded-2xl bg-white p-8 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-24 rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-[#7D1B14FF] transition-all duration-300"
                    style={{
                      width: `${((currentQuestion + 1) / assessmentQuestions.length) * 100}%`,
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-600">
                  {currentQuestion + 1}/{assessmentQuestions.length}
                </span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800">
                اختبار المهارات المهنية
              </h2>
            </div>
            <div className="mb-8">
              <div className="flex justify-end mb-6">
                <p className="text-2xl font-semibold text-gray-800">
                  {assessmentQuestions[currentQuestion].question}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {assessmentQuestions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full rounded-lg border border-gray-300 bg-gray-50 py-3 text-lg text-gray-700 transition-all hover:bg-[#ffd4d482] text-center"
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-16 rounded-2xl bg-white p-8 shadow-xl">
            <div className="flex justify-end mb-4">
              <h2 className="text-3xl font-bold text-gray-800">
                توصيات مسارك المهني
              </h2>
            </div>
            <div className="flex justify-end mb-8">
              <p className="text-lg text-gray-600">
                بناءً على إجاباتك، إليك بعض المهن التي قد تكون مناسبة لك:
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {getCareerSuggestions().map((suggestion, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center rounded-lg border border-gray-300 bg-gray-50 p-4 text-lg text-gray-700"
                >
                  <p>{suggestion}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-8">
            <div className="flex justify-end mt-8">
              <button
                onClick={resetAssessment}
                className="rounded-lg bg-[#972820FF] py-2 px-6 hover:bg-red-600 text-white"
              >
                إعادة الاختبار
              </button>
              <button
                onClick={() => {
                  window.location.href = "/cvbuilder";
                }}
                className="ml-4 rounded-lg border border-[#972820FF] bg-white py-2 px-6 text-[#972820FF] hover:bg-[#ffd4d482] transition-all"
              >
                انشئ السيرة الذاتية خاصتك
              </button>
            </div>

            </div>
          </div>

        )}

        <div className="mb-16 text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-800">
            خطواتك التالية
          </h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {careerSteps.map((step, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center justify-center p-8 rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
              >
                <span className="text-4xl">{step.icon}</span>
                <h3 className="mt-4 text-xl font-semibold text-gray-800">{step.title}</h3>
                <p className="mt-2 text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mb-16 text-center">
          <h2 className="mb-8 text-3xl font-bold text-gray-800">نصائح إضافية</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {careerTips.map((tip, index) => (
              <div
                key={index}
                className="group relative flex flex-col items-center justify-center p-8 rounded-xl bg-white shadow-lg transition-all hover:shadow-xl"
              >
                <span className="text-4xl">{tip.icon}</span>
                <h3 className="mt-4 text-xl font-semibold text-gray-800">{tip.title}</h3>
                <p className="mt-2 text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
