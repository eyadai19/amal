"use client";
import { useRef, useState } from "react";

export function ArabicCanvasCom() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);

	const startDrawing = (e: React.MouseEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.beginPath();
		ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		setIsDrawing(true);
	};

	// الرسم
	const draw = (e: React.MouseEvent) => {
		if (!isDrawing) return;

		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
		ctx.strokeStyle = "#ffffff";
		ctx.lineWidth = 15;
		ctx.lineCap = "round";
		ctx.stroke();
	};

	// إرسال الصورة
	const handlePredict = async () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		// تحويل الصورة إلى Blob
		canvas.toBlob(async (blob) => {
			if (!blob) return;

			const formData = new FormData();
			formData.append("image", blob, "drawing.png");

			try {
				const response = await fetch("http://localhost:8000/predict", {
					method: "POST",
					body: formData,
				});

				const result = await response.json();
				alert(`الحرف المتوقع: ${result.character}`);
			} catch (error) {
				console.error("Error:", error);
			}
		}, "image/png");
	};

	// مسح اللوحة
	const clearCanvas = () => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, canvas.width, canvas.height);
	};

	return (
		<div className="text-center">
			<canvas
				ref={canvasRef}
				width={400}
				height={400}
				className="rounded-lg border-2 border-white bg-black"
				onMouseDown={startDrawing}
				onMouseMove={draw}
				onMouseUp={() => setIsDrawing(false)}
				onMouseLeave={() => setIsDrawing(false)}
			/>
			<div className="mt-4 space-x-4">
				<button
					onClick={handlePredict}
					className="rounded bg-green-500 px-4 py-2 text-white"
				>
					موافق
				</button>
				<button
					onClick={clearCanvas}
					className="rounded bg-red-500 px-4 py-2 text-white"
				>
					مسح
				</button>
			</div>
		</div>
	);
}
