"use client";
import { Button } from "@/components/ui/button";
import { ArabicLettersKeys } from "@/utils/arabicLetters";
import { lettersData } from "@/utils/letterData";
import { useEffect, useRef, useState } from "react";
import { FaPencilAlt, FaEraser, FaTimes } from "react-icons/fa";
import AmalNavbar from "../amalNavbar";

export default function LetterPage({
	params,
}: {
	params: { letter: ArabicLettersKeys };
}) {
	const [showPad, setShowPad] = useState(false);
	const [isErasing, setIsErasing] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const isDrawing = useRef(false);

	const currentLetter = lettersData[params.letter];

	useEffect(() => {
		if (showPad && canvasRef.current) {
			const canvas = canvasRef.current;
			canvas.width = 300;
			canvas.height = 200;
			const ctx = canvas.getContext("2d");

			if (ctx) {
				ctx.lineCap = "round";
				ctx.lineJoin = "round";
				ctx.strokeStyle = "#1E3A6E";
				ctx.lineWidth = 3;
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, canvas.width, canvas.height);
				ctxRef.current = ctx;
			}
		}
	}, [showPad]);

	const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
		if (!ctxRef.current) return;
		isDrawing.current = true;
		const { offsetX, offsetY } = getPosition(e);
		ctxRef.current.beginPath();
		ctxRef.current.moveTo(offsetX, offsetY);
	};

	const draw = (e: React.MouseEvent | React.TouchEvent) => {
		if (!isDrawing.current || !ctxRef.current) return;
		const { offsetX, offsetY } = getPosition(e);
		ctxRef.current.strokeStyle = isErasing ? "white" : "#1E3A6E";
		ctxRef.current.lineWidth = isErasing ? 15 : 3;
		ctxRef.current.lineTo(offsetX, offsetY);
		ctxRef.current.stroke();
	};

	const stopDrawing = () => {
		if (!ctxRef.current) return;
		isDrawing.current = false;
		ctxRef.current.closePath();
	};
	const getPosition = (e: any) => {
		const rect = canvasRef.current?.getBoundingClientRect();
		if (!rect) return { offsetX: 0, offsetY: 0 };

		if (e.nativeEvent.touches) {
			const touch = e.nativeEvent.touches[0];
			return {
				offsetX: touch.clientX - rect.left,
				offsetY: touch.clientY - rect.top,
			};
		}

		return { offsetX: e.nativeEvent.offsetX, offsetY: e.nativeEvent.offsetY };
	};
	if (!currentLetter) {
		return <div>بيانات الحرف غير متوفرة</div>;
	}
	return (
		<div className="flex min-h-screen flex-col items-center justify-center bg-[#D8E5F0] p-6 pt-10">
			<AmalNavbar backgroundColor="#283a5c" />

			<h1 className="mr-10 mb-20 self-end text-5xl font-bold text-[#1E3A6E] underline">
				:{currentLetter.title}
			</h1>

			<div className="flex w-full items-center justify-between">
				<img
					src={currentLetter.image}
					alt={currentLetter.title}
					className="ml-10 h-52 w-52 object-contain"
				/>

				<div className="mr-10 w-1/2 text-right">
					<p className="mt-2 mb-9 text-xl leading-relaxed text-[#344A72FF]">
						{currentLetter.description}
					</p>
					<ul className="mt-3 text-lg leading-relaxed text-[#344A72FF]">
						<li>
							<strong>في بداية الكلمة:</strong>{" "}
							{currentLetter.examples.start.map((ex, i) => (
								<span key={i} className="font-semibold text-[#1E3A6E]">
									{ex}
									{i < currentLetter.examples.start.length - 1 ? "، " : ""}
								</span>
							))}
						</li>
						<li className="mt-2">
							<strong>في وسط الكلمة:</strong>{" "}
							{currentLetter.examples.middle.map((ex, i) => (
								<span key={i} className="font-semibold text-[#1E3A6E]">
									{ex}
									{i < currentLetter.examples.middle.length - 1 ? "، " : ""}
								</span>
							))}
						</li>
						<li className="mt-2">
							<strong>في نهاية الكلمة:</strong>{" "}
							{currentLetter.examples.end.map((ex, i) => (
								<span key={i} className="font-semibold text-[#1E3A6E]">
									{ex}
									{i < currentLetter.examples.end.length - 1 ? "، " : ""}
								</span>
							))}
						</li>
					</ul>
					<Button
						className="mt-6 rounded-lg bg-[#1E3A6E] px-6 py-2 text-white transition-all hover:bg-[#3f5680]"
						onClick={() => setShowPad(true)}
					>
						!جرب الكتابة
					</Button>
				</div>
			</div>
			{showPad && (
				<div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-xl w-[320px] h-[240px] flex flex-col items-center justify-center border border-gray-300">
				<div className="flex justify-between w-full px-4 mb-2">
					<FaPencilAlt 
					className={`text-2xl cursor-pointer ${!isErasing ? "text-[#1E3A6E]" : "text-gray-400"}`} 
					onClick={() => setIsErasing(false)}
					/>
					
					<FaEraser 
					className={`text-2xl cursor-pointer ${isErasing ? "text-[#C7BA9F]" : "text-gray-400"}`} 
					onClick={() => setIsErasing(true)}
					/>

					<FaTimes 
					className="text-2xl cursor-pointer text-red-500"
					onClick={() => setShowPad(false)}
					/>
				</div>

				<canvas 
					ref={canvasRef}
					className="w-full h-full border border-gray-300"
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={stopDrawing}
					onMouseLeave={stopDrawing}
					onTouchStart={startDrawing}
					onTouchMove={draw}
					onTouchEnd={stopDrawing}
				/>
				</div>
			)}

		</div>
	);
}
