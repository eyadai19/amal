"use client";
import { useRef, useState } from "react";

export default function ArabicCanvasCom() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [prediction, setPrediction] = useState<string | null>(null);

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

	const handlePredict = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		canvas.toBlob(async (blob) => {
			if (!blob) return;

			const formData = new FormData();
			formData.append("image", blob, "drawing.png");

			try {
				const response = await fetch("http://127.0.0.1:8000/predict", {
					method: "POST",
					body: formData,
				});

				const result = await response.json();
				if (result.character) {
					setPrediction(result.character);
				} else {
					alert("❌ لم يتم التعرف على الحرف!");
				}
			} catch (error) {
				console.error("Error:", error);
			}
		}, "image/png");
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

	return (
		<div className="flex h-screen flex-col items-center justify-center text-center">
			<canvas
				ref={canvasRef}
				width={400}
				height={400}
				className="mb-4 rounded-lg border-2 border-black bg-white"
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={() => setIsDrawing(false)}
				onMouseLeave={() => setIsDrawing(false)}
			/>

			{prediction && (
				<div className="mb-4 rounded bg-blue-500 px-6 py-3 text-xl font-bold text-white shadow-lg">
					الحرف المتوقع: {prediction}
				</div>
			)}

			<div className="flex space-x-4">
				<button
					onClick={handlePredict}
					className="rounded bg-green-500 px-6 py-2 text-white shadow-lg transition hover:bg-green-600"
				>
					موافق
				</button>
				<button
					onClick={clearCanvas}
					className="rounded bg-red-500 px-6 py-2 text-white shadow-lg transition hover:bg-red-600"
				>
					مسح
				</button>
			</div>
		</div>
	);
}
