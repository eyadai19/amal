"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function HomePage() {
  const categories=[
    {
      title: "القسم التعليمي",
      description: "!تعلّم معنا",
      bgColor: "bg-[#D8E5F0]",
      textColor: "text-[#1E3A6E]",
      href: "/literacy",
    },
    {
      title: "القسم المهني",
      description: "!مسارك المهني",
      bgColor: "bg-[#E49B97]",
      textColor: "text-[#B84941]",
      href: "/career",
    },
    {
      title: "القسم النفسي",
      description: "!صحتك النفسية",
      bgColor: "bg-[#E2C8D3]",
      textColor: "text-[#582C5E]",
      href: "/psychological",
    },
    {
      title: "القسم القانوني",
      description: "!ثق بنا واسألنا ما تريد",
      bgColor: "bg-[#FFCB99]",
      textColor: "text-[#D78448]",
      href: "/legal",
    },
  ];

  return (
    <div className="h-670 bg-[#E1D9D1] flex flex-col scroll-smooth">
      <nav className="bg-[#234330] text-white py-1 shadow-md fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center px-6">
          <img
            src="../image/authImage/LOGO.png"
            alt="أمل Logo"
            className="w-28 h-17 object-contain"
          />
          <ul className="flex justify-around w-full max-w-2xl">
            <li className="flex-grow text-center">
              <a
                href="#"
                className="text-lg font-semibold hover:text-[#C7BA9F] transition duration-300 block w-full"
              >
                الصفحة الرئيسية
              </a>
            </li>
            <li className="flex-grow text-center">
              <a
                href="#about"
                className="text-lg font-semibold hover:text-[#C7BA9F] transition duration-300 block w-full"
              >
                من نحن
              </a>
            </li>
            <li className="flex-grow text-center">
              <a
                href="#services"
                className="text-lg font-semibold hover:text-[#C7BA9F] transition duration-300 block w-full"
              >
                خدماتنا
              </a>
            </li>
            <li className="flex-grow text-center">
              <a
                href="#contact"
                className="text-lg font-semibold hover:text-[#C7BA9F] transition duration-300 block w-full"
              >
                تواصل معنا
              </a>
            </li>
          </ul>
        </div>
      </nav>

      <div id="home" className="flex-1 flex justify-center items-center p-10 pt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full">
          <motion.img
            src="../image/authImage/LOGO.png"
            alt="أمل Logo"
            className="m-9 w-70"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-150">
            {categories.map((category, index) => (
              <a key={index} href={category.href}>
                <div
                  className={`p-9 rounded-xl shadow-lg cursor-pointer transition-transform transform hover:scale-105 duration-300 ${category.bgColor} ${category.textColor} w-full`}
                >
                  <div className="flex flex-col justify-center items-center h-full">
                    <h2 className="text-3xl font-bold text-center">{category.title}</h2>
                    <p className="text-xl mt-4 text-center">{category.description}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      <section id="about" className="py-20 px-10 bg-[#E1D9D1] text-center">
  <h2 className="text-4xl font-bold text-[#234330]">من نحن</h2>
  <div className="mt-15 text-xl text-gray-700 leading-loose text-right">
    <p>نحن <strong>أمل</strong> منصة رقمية ذكية تعتمد على تقنيات الذكاء الاصطناعي لدعم المفرج عنهم حديثًا في رحلتهم نحو إعادة الاندماج في المجتمع. نهدف إلى تمكين الأفراد من خلال تقديم حلول مبتكرة في مجالات التعليم، التوجيه المهني، الدعم النفسي، والمساعدة القانونية، لضمان بداية جديدة وحياة مستقرة.

من خلال واجهة تفاعلية متعددة اللغات، نوفر برامج لمحو الأمية عبر دروس القراءة والكتابة، ونساعد في تطوير المهارات المهنية من خلال تقييم القدرات وربط المستخدمين بفرص التدريب والعمل. كما نقدم دعمًا نفسيًا ذكيًا من خلال تحليل المشاعر واستشارات الصحة النفسية، بالإضافة إلى توفير قاعدة بيانات قانونية متكاملة وخدمات استشارية تسهم في تعزيز الحقوق القانونية للمستخدمين.

نؤمن بأن لكل فرد فرصة ثانية لبناء مستقبل أفضل، ونعمل جاهدين على تسخير التكنولوجيا لخلق بيئة داعمة تسهم في تحقيق هذا الهدف</p>
  </div>
</section>

<section id="services" className="py-20 px-10 bg-[#E1D9D1] text-center">
  <h2 className="text-4xl font-bold text-[#234330]">خدماتنا</h2>
  <div className="mt-15 text-xl text-gray-700 leading-loose text-right">
    <p>في أمل، نقدم مجموعة متكاملة من الخدمات المصممة خصيصًا لدعم المفرج عنهم حديثًا وتمكينهم من تحقيق اندماج ناجح في المجتمع، وذلك من خلال الذكاء الاصطناعي والتقنيات التفاعلية</p>
    <p><strong>التعليم ومحو الأمية</strong></p>
    <p>نساعد المستخدمين على تطوير مهارات القراءة والكتابة من خلال دروس تفاعلية تدعم الصوت والكتابة اليدوية، مما يسهل التعلم بأساليب مبتكرة.</p>

    <p><strong>التوجيه المهني وتطوير المهارات</strong></p>
    <p>نقدم اختبارات تقييم المهارات باستخدام أنظمة خبراء، ونوفر توصيات للتدريب المهني وربط المستخدمين بفرص تعليمية في مجالات مثل الحرف اليدوية والوظائف التقنية.</p>

    <p><strong>الدعم النفسي الذكي</strong></p>
    <p>نوفر دردشة ذكية تعتمد على معالجة اللغة الطبيعية (NLP) لتحليل المشاعر وتقديم استشارات للصحة النفسية، مع إمكانية الكشف المبكر عن علامات الاكتئاب والتوتر.</p>

    <p><strong>المساعدة القانونية</strong></p>
    <p>نقدم قاعدة بيانات قانونية محلية مزودة بمحرك بحث ذكي، بالإضافة إلى إمكانية التواصل مع محامين عند الحاجة لتقديم الاستشارات القانونية اللازمة.</p>

    <p><strong>واجهة تفاعلية متعددة اللغات</strong></p>
    <p>تصميم مريح وسهل الاستخدام، مع دعم للغة العربية كلغة أساسية، لتوفير تجربة سلسة تلبي احتياجات المستخدمين المختلفة.</p>

    <p>نحن هنا لمساعدتكم في بناء مستقبل جديد بثقة واستقرار!</p>
  </div>
</section>

<section id="contact" className="py-20 px-10 bg-[#E1D9D1] text-center">
  <h2 className="text-4xl font-bold text-[#234330]">تواصل معنا</h2>
  <div className="mt-15 text-xl text-gray-700 leading-loose text-right">
    <p>نحن هنا لدعمكم والإجابة على جميع استفساراتكم! يمكنكم التواصل معنا عبر القنوات التالية:</p>
    <strong>: البريد الإلكتروني 📧</strong><p> Amal@gmail.com</p>
    <strong>:رقم الهاتف 📞</strong><p> +963 991 647 194</p>
    <strong>:الموقع الإلكتروني 🌍</strong><p> Amal.com</p>
    <strong>:العنوان 📍</strong><p> Damascus, Syria</p>
    <p>كما يمكنكم متابعتنا على وسائل التواصل الاجتماعي للبقاء على اطلاع بآخر التحديثات والخدمات التي نقدمها.</p>
    <p>💙 !لا تترددوا في التواصل معنا، فنحن دائمًا هنا لمساعدتكم</p>
  </div>
</section>

    </div>
  );
}
