"use client";
import { Button } from "@/components/ui/button";
import { ArabicLettersKeys } from "@/utils/arabicLetters";
import { lettersData } from "@/utils/letterData";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
import { motion } from "framer-motion";
import AmalNavbar from "../amalNavbar"; // Assuming AmalNavbar is a reusable component

export default function LetterPage({
  params,
}: {
  params: { letter: ArabicLettersKeys };
}) {
  const [showPad, setShowPad] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const [accuracyResult, setAccuracyResult] = useState<{
    correct: boolean;
    accuracy: number;
    feedback?: string;
  } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  const currentLetter = lettersData[params.letter];

  useEffect(() => {
    if (showPad && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      const ctx = canvas.getContext("2d");

      if (ctx) {
        ctx.scale(2, 2);
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.strokeStyle = "#1E3A6E";
        ctx.lineWidth = 3;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctxRef.current = ctx;
      }
      setAccuracyResult(null);
    }
  }, [showPad]);

  const startDrawing = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.beginPath();
    ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 15;
    ctx.lineCap = "round";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!ctxRef.current) return;
    setIsDrawing(false);
    ctxRef.current.closePath();
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setPrediction(null);
  };

  const handleSubmitDrawing = () => {
    const randomAccuracy = Math.floor(Math.random() * 30) + 70;
    const isCorrect = randomAccuracy > 80;

    setAccuracyResult({
      correct: isCorrect,
      accuracy: randomAccuracy,
      feedback: isCorrect
        ? "رسمة ممتازة! استمر في الممارسة"
        : "حاول مرة أخرى وركز على الشكل الصحيح",
    });
  };

  if (!currentLetter) {
    return <div>بيانات الحرف غير متوفرة</div>;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#D8E5F0] to-[#A3B7D6] py-8 px-4 font-sans">
      {/* Navbar with colors like LiteracyPage */}
      <AmalNavbar backgroundColor="#283a5c" activeSection={"literacy"} />

      <motion.div
        className="container mx-auto max-w-6xl mt-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header with back button */}
        <div className="mb-8 flex flex-col items-center gap-4 md:flex-row md:justify-between">
          <Link
            href="/letters"
            className="flex items-center text-[#1E3A6E] hover:text-[#3f5680]"
          >
            <FaArrowLeft className="mr-2" />
            <span className="text-sm md:text-base">العودة إلى الحروف</span>
          </Link>
          <h1 className="text-center text-3xl font-extrabold text-[#1E3A6E] md:text-5xl">
            {currentLetter.title}
          </h1>
          <div className="hidden md:block md:w-8"></div>
        </div>

        {/* Main content */}
        <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Letter image and description */}
          <motion.div
            className="rounded-2xl bg-white p-6 shadow-lg"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex h-48 w-48 items-center justify-center mb-4">
              <img
                src={currentLetter.image}
                alt={currentLetter.title}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <p className="text-right text-base text-[#344A72FF] md:text-lg">
              {currentLetter.description}
            </p>
            <Button
              className="w-full mt-4 bg-[#1E3A6E] text-white hover:bg-[#3f5680] transition-all"
              onClick={() => setShowPad(true)}
            >
              !جرب كتابة الحرف بنفسك
            </Button>
          </motion.div>

          {/* Letter forms */}
          <motion.div
            className="space-y-4 lg:col-span-1"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Initial form */}
            <div className="rounded-2xl bg-white p-4 shadow-lg md:p-6">
              <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-lg border border-[#1E3A6E]/20 bg-[#F5F9FF] md:h-40 md:w-40">
                  {currentLetter.start_image ? (
                    <img
                      src={currentLetter.start_image}
                      alt="شكل الحرف في البداية"
                      className="h-16 w-16 md:h-23 md:w-20"
                    />
                  ) : (
                    <span className="text-4xl text-[#1E3A6E] md:text-5xl">
                      {currentLetter.forms.start[0].word.charAt(0)}
                    </span>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-right text-xl font-bold text-[#1E3A6E] md:mb-3 md:text-2xl">
                    :في بداية الكلمة
                  </h3>
                  <div className="text-right">
                    {currentLetter.forms.start.map((ex, i) => (
                      <div key={i} className="mb-2 last:mb-0">
                        <p className="text-base text-[#344A72FF] md:text-xl">
                          <span className="font-bold text-[#1E3A6E]">{ex.word}</span>
                          <span className="mx-2 text-gray-400">-</span>
                          <span className="text-gray-500">{ex.example}</span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Repeat for middle and end forms */}
            {/* Similar layout for middle and end */}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
