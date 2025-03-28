"use client";
import { motion } from "framer-motion";
import { useState } from "react";
import { FaVolumeUp } from "react-icons/fa";
import AmalNavbar from "./amalNavbar";

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const playAudio = (audioPath: string) => {
    const audio = new Audio(audioPath);
    audio.play();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const categories = [
    {
      title: "القسم التعليمي",
      description: "!تعلّم معنا",
      bgColor: "bg-[#D8E5F0]",
      textColor: "text-[#1E3A6E]",
      href: "/literacy",
      audio: "../audio/home/1.mp3",
    },
    {
      title: "القسم المهني",
      description: "!مسارك المهني",
      bgColor: "bg-[#E49B97]",
      textColor: "text-[#B84941]",
      href: "/career",
      audio: "../audio/home/2.mp3",
    },
    {
      title: "القسم النفسي",
      description: "!صحتك النفسية",
      bgColor: "bg-[#E2C8D3]",
      textColor: "text-[#582C5E]",
      href: "/psychological",
      audio: "../audio/home/3.mp3",
    },
    {
      title: "القسم القانوني",
      description: "!ثق بنا واسألنا ما تريد",
      bgColor: "bg-[#FFCB99]",
      textColor: "text-[#D78448]",
      href: "/legal",
      audio: "../audio/home/4.mp3",
    },
  ];

  return (
    <div className="flex h-screen flex-col scroll-smooth bg-[#E1D9D1] font-sans">
      <AmalNavbar backgroundColor="#234330" activeSection={null} />

      <div id="home" className="flex flex-1 items-center justify-center p-10 pt-20">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-10 pt-15 md:grid-cols-2">
          <motion.img
            src="../image/logo/LOGO.png"
            alt="أمل Logo"
            className="m-9 w-70"
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            whileHover={{ scale: 1.1 }}
          />

          <div className="relative grid w-full grid-cols-1 gap-6 md:grid-cols-2">
            {categories.map((category, index) => (
              <div key={index} className="relative">
                <FaVolumeUp
                  className={`absolute -top-6 right-6 translate-x-1/2 cursor-pointer text-2xl ${category.textColor}`}
                  onClick={() => playAudio(category.audio)}
                />
                <motion.a
                  href={category.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  viewport={{ once: true }}
                >
                  <div
                    className={`transform cursor-pointer rounded-xl p-6 shadow-lg transition-transform duration-300 hover:scale-105 ${category.bgColor} ${category.textColor} w-full`}
                  >
                    <div className="flex h-full flex-col items-center justify-center">
                      <h2 className="text-center text-2xl font-semibold md:text-3xl">
                        {category.title}
                      </h2>
                      <p className="mt-2 text-center text-lg md:mt-4 md:text-xl">
                        {category.description}
                      </p>
                    </div>
                  </div>
                </motion.a>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section id="about" className="bg-[#E1D9D1] px-10 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#234330]">من نحن</h2>
          <FaVolumeUp
            className="ml-2 inline-block cursor-pointer"
            onClick={() => playAudio("../audio/home/16.mp3")}
          />
          <div className="mx-auto mt-15 max-w-4xl text-right text-xl leading-loose text-gray-700">
            <p>
              نحن <strong>أمل</strong> منصة رقمية ذكية تعتمد على تقنيات الذكاء
              الاصطناعي لدعم المفرج عنهم حديثًا في رحلتهم نحو إعادة الاندماج في
              المجتمع. نهدف إلى تمكين الأفراد من خلال تقديم حلول مبتكرة في
              مجالات التعليم، التوجيه المهني، الدعم النفسي، والمساعدة القانونية،
              لضمان بداية جديدة وحياة مستقرة.
            </p>
            <p className="mt-4">
              من خلال واجهة تفاعلية متعددة اللغات، نوفر برامج لمحو الأمية عبر
              دروس القراءة والكتابة، ونساعد في تطوير المهارات المهنية من خلال
              تقييم القدرات وربط المستخدمين بفرص التدريب والعمل. كما نقدم دعمًا
              نفسيًا ذكيًا من خلال تحليل المشاعر واستشارات الصحة النفسية، بالإضافة
              إلى توفير قاعدة بيانات قانونية متكاملة وخدمات استشارية تسهم في تعزيز
              الحقوق القانونية للمستخدمين.
            </p>
            <p className="mt-4">
              نؤمن بأن لكل فرد فرصة ثانية لبناء مستقبل أفضل، ونعمل جاهدين على
              تسخير التكنولوجيا لخلق بيئة داعمة تسهم في تحقيق هذا الهدف.
            </p>
          </div>
        </motion.div>
      </section>

      <section id="services" className="bg-[#E1D9D1] px-10 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#234330]">خدماتنا</h2>
          <FaVolumeUp
            className="ml-2 inline-block cursor-pointer"
            onClick={() => playAudio("../audio/home/18.mp3")}
          />
          <div className="mx-auto mt-15 max-w-4xl text-right text-xl leading-loose text-gray-700">
            <p>
              في أمل، نقدم مجموعة متكاملة من الخدمات المصممة خصيصًا لدعم المفرج
              عنهم حديثًا وتمكينهم من تحقيق اندماج ناجح في المجتمع، وذلك من خلال
              الذكاء الاصطناعي والتقنيات التفاعلية.
            </p>
            <div className="mt-8 space-y-8">
              <div>
                <h3 className="text-2xl font-semibold text-[#234330]">التعليم ومحو الأمية</h3>
                <p className="mt-2">
                  نساعد المستخدمين على تطوير مهارات القراءة والكتابة من خلال
                  دروس تفاعلية تدعم الصوت والكتابة اليدوية، مما يسهل التعلم
                  بأساليب مبتكرة.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#234330]">التوجيه المهني وتطوير المهارات</h3>
                <p className="mt-2">
                  نقدم اختبارات تقييم المهارات باستخدام أنظمة خبراء، ونوفر
                  توصيات للتدريب المهني وربط المستخدمين بفرص تعليمية في مجالات
                  مثل الحرف اليدوية والوظائف التقنية.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#234330]">الدعم النفسي الذكي</h3>
                <p className="mt-2">
                  نوفر دردشة ذكية تعتمد على معالجة اللغة الطبيعية (NLP) لتحليل
                  المشاعر وتقديم استشارات للصحة النفسية، مع إمكانية الكشف المبكر
                  عن علامات الاكتئاب والتوتر.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#234330]">المساعدة القانونية</h3>
                <p className="mt-2">
                  نقدم قاعدة بيانات قانونية محلية مزودة بمحرك بحث ذكي، بالإضافة
                  إلى إمكانية التواصل مع محامين عند الحاجة لتقديم الاستشارات
                  القانونية اللازمة.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#234330]">واجهة تفاعلية متعددة اللغات</h3>
                <p className="mt-2">
                  تصميم مريح وسهل الاستخدام، مع دعم للغة العربية كلغة أساسية،
                  لتوفير تجربة سلسة تلبي احتياجات المستخدمين المختلفة.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      <section id="contact" className="bg-[#E1D9D1] px-10 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-[#234330]">تواصل معنا</h2>
          <div className="mx-auto mt-15 max-w-4xl text-right text-xl leading-loose text-gray-700">
            <p>
              نحن هنا لدعمكم والإجابة على جميع استفساراتكم! يمكنكم التواصل معنا
              عبر القنوات التالية:
            </p>
            <div className="mt-8 space-y-4">
              <p>
                <strong>البريد الإلكتروني 📧:</strong> Amal@gmail.com
              </p>
              <p>
                <strong>رقم الهاتف 📞:</strong> +963 991 647 194
              </p>
              <p>
                <strong>الموقع الإلكتروني 🌍:</strong> Amal.com
              </p>
              <p>
                <strong>العنوان 📍:</strong> دمشق، سوريا
              </p>
            </div>
            <p className="mt-8">
              كما يمكنكم متابعتنا على وسائل التواصل الاجتماعي للبقاء على اطلاع
              بآخر التحديثات والخدمات التي نقدمها.
            </p>
            <p className="mt-4">
              💙 !لا تترددوا في التواصل معنا، فنحن دائمًا هنا لمساعدتكم
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
