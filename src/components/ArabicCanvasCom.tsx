"use client";
import { useEffect, useRef, useState } from "react";

export default function ArabicCanvasCom() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [isDrawing, setIsDrawing] = useState(false);
	const [prediction, setPrediction] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);

	// تهيئة اللوحة البيضاء عند التحميل
	useEffect(() => {
		clearCanvas();
	}, []);

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

		setIsLoading(true);

		try {
			// تحويل الرسم إلى صورة PNG
			const dataUrl = canvas.toDataURL("image/png");
			const blob = await (await fetch(dataUrl)).blob();

			const formData = new FormData();
			formData.append("image", blob, "drawing.png");

			const response = await fetch("http://localhost:8000/predict", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Network response was not ok");
			}

			const result = await response.json();

			if (result.error) {
				alert(`خطأ: ${result.error}`);
			} else if (result.character) {
				setPrediction(result.character);
			} else {
				alert("❌ لم يتم التعرف على الرقم!");
			}
		} catch (error) {
			console.error("Error:", error);
			alert("حدث خطأ أثناء الاتصال بالخادم");
		} finally {
			setIsLoading(false);
		}
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
		<div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
			<h1 className="mb-6 text-3xl font-bold text-gray-800">
				التعرف على الأرقام العربية المكتوبة بخط اليد
			</h1>

			<div className="rounded-lg bg-white p-6 shadow-lg">
				<canvas
					ref={canvasRef}
					width={400}
					height={400}
					className="mb-4 cursor-crosshair rounded-lg border-2 border-gray-300 bg-white"
					onMouseDown={startDrawing}
					onMouseMove={draw}
					onMouseUp={() => setIsDrawing(false)}
					onMouseLeave={() => setIsDrawing(false)}
				/>

				{prediction && (
					<div className="mb-4 rounded bg-blue-500 px-6 py-3 text-xl font-bold text-white shadow-lg">
						الرقم المتوقع: {prediction}
					</div>
				)}

				<div className="flex justify-center space-x-4">
					<button
						onClick={handlePredict}
						disabled={isLoading}
						className={`rounded px-6 py-2 text-white shadow-lg transition ${
							isLoading ? "bg-gray-500" : "bg-green-500 hover:bg-green-600"
						}`}
					>
						{isLoading ? "جاري المعالجة..." : "تعرف على الرقم"}
					</button>
					<button
						onClick={clearCanvas}
						className="rounded bg-red-500 px-6 py-2 text-white shadow-lg transition hover:bg-red-600"
					>
						مسح اللوحة
					</button>
				</div>
			</div>

			<div className="mt-6 text-gray-600">
				<p>
					ارسم رقمًا عربيًا (من 0 إلى 9) في المربع أعلاه ثم اضغط على "تعرف على
					الرقم"
				</p>
			</div>
		</div>
	);
}
// // "use client";

// // import { useState, useRef } from "react";

// // export default function Home() {
// // 	const [recording, setRecording] = useState<boolean>(false);
// // 	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
// // 	const [prediction, setPrediction] = useState<{
// // 		predicted_class: string;
// // 		probability: number;
// // 	} | null>(null);

// // 	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// // 	const audioChunksRef = useRef<Blob[]>([]);

// // 	const startRecording = async () => {
// // 		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
// // 	const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/ogg" });

// // 		mediaRecorderRef.current = mediaRecorder;
// // 		audioChunksRef.current = [];

// // 		mediaRecorder.ondataavailable = (event) => {
// // 			audioChunksRef.current.push(event.data);
// // 		};

// // 		mediaRecorder.onstop = () => {
// // 			const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
// // 			setAudioBlob(audioBlob);
// // 		};

// // 		mediaRecorder.start();
// // 		setRecording(true);
// // 	};

// // 	const stopRecording = () => {
// // 		if (mediaRecorderRef.current) {
// // 			mediaRecorderRef.current.stop();
// // 			setRecording(false);
// // 		}
// // 	};

// // 	const sendAudio = async () => {
// // 		if (!audioBlob) return;

// // 		const formData = new FormData();
// // 		formData.append("file", audioBlob, "recording.wav"); // تأكد من أن الاسم يحتوي على .wav

// // 		const response = await fetch("http://127.0.0.1:5000/predict", {
// // 			method: "POST",
// // 			body: formData,
// // 		});

// // 		const data = await response.json();
// // 		if (response.ok) {
// // 			setPrediction(data);
// // 		} else {
// // 			console.error("Error:", data.error);
// // 		}
// // 	};

// // 	return (
// // 		<div className="flex flex-col items-center space-y-4 p-6">
// // 			<h1 className="text-2xl font-bold">التعرف على الحروف الهجائية</h1>
// // 			<button
// // 				className={`rounded px-4 py-2 text-white ${recording ? "bg-red-500" : "bg-green-500"}`}
// // 				onClick={recording ? stopRecording : startRecording}
// // 			>
// // 				{recording ? "إيقاف التسجيل" : "بدء التسجيل"}
// // 			</button>
// // 			{audioBlob && (
// // 				<button
// // 					className="rounded bg-blue-500 px-4 py-2 text-white"
// // 					onClick={sendAudio}
// // 				>
// // 					إرسال الصوت للتحليل
// // 				</button>
// // 			)}
// // 			{prediction && (
// // 				<p className="text-lg">
// // 					التوقع: {prediction.predicted_class} - النسبة:{" "}
// // 					{prediction.probability.toFixed(2)}%
// // 				</p>
// // 			)}
// // 		</div>
// // 	);
// // }

// // // // // "use client";

// // // // // import { useRef, useState } from "react";

// // // // // export default function Det() {
// // // // // 	const [recording, setRecording] = useState<boolean>(false);
// // // // // 	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
// // // // // 	const [prediction, setPrediction] = useState<{
// // // // // 		predicted_class: string;
// // // // // 		probability: number;
// // // // // 	} | null>(null);

// // // // // 	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
// // // // // 	const audioChunksRef = useRef<Blob[]>([]);

// // // // // 	const startRecording = async () => {
// // // // // 		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
// // // // // 			alert("المتصفح لا يدعم التسجيل الصوتي.");
// // // // // 			return;
// // // // // 		}

// // // // // 		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

// // // // // 		if (!MediaRecorder.isTypeSupported("audio/webm")) {
// // // // // 			console.error("WebM غير مدعوم في هذا المتصفح.");
// // // // // 			return;
// // // // // 		}

// // // // // 		const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

// // // // // 		mediaRecorderRef.current = mediaRecorder;
// // // // // 		audioChunksRef.current = [];

// // // // // 		mediaRecorder.ondataavailable = (event) => {
// // // // // 			if (event.data.size > 0) {
// // // // // 				audioChunksRef.current.push(event.data);
// // // // // 			}
// // // // // 		};

// // // // // 		mediaRecorder.onstop = () => {
// // // // // 			const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });

// // // // // 			setAudioBlob(webmBlob);
// // // // // 		};

// // // // // 		mediaRecorder.start();
// // // // // 		setRecording(true);
// // // // // 	};

// // // // // 	const stopRecording = () => {
// // // // // 		if (mediaRecorderRef.current) {
// // // // // 			mediaRecorderRef.current.stop();
// // // // // 			setRecording(false);
// // // // // 		}
// // // // // 	};

// // // // // 	const sendAudio = async () => {
// // // // // 		if (!audioBlob) return;

// // // // // 		const formData = new FormData();
// // // // // 		formData.append("file", audioBlob, "recording.webm");

// // // // // 		try {
// // // // // 			const response = await fetch("http://127.0.0.1:8000/predict", {
// // // // // 				method: "POST",
// // // // // 				body: formData,
// // // // // 			});

// // // // // 			const data = await response.json();
// // // // // 			if (response.ok) {
// // // // // 				setPrediction(data);
// // // // // 			} else {
// // // // // 				console.error("Error:", data.error);
// // // // // 			}
// // // // // 		} catch (error) {
// // // // // 			console.error("❌ خطأ أثناء إرسال الملف:", error);
// // // // // 		}
// // // // // 	};

// // // // // 	return (
// // // // // 		<div className="flex flex-col items-center space-y-4 p-6">
// // // // // 			<h1 className="text-2xl font-bold">التعرف على الحروف الهجائية</h1>
// // // // // 			<button
// // // // // 				className={`rounded px-4 py-2 text-white ${recording ? "bg-red-500" : "bg-green-500"}`}
// // // // // 				onClick={recording ? stopRecording : startRecording}
// // // // // 			>
// // // // // 				{recording ? "إيقاف التسجيل" : "بدء التسجيل"}
// // // // // 			</button>
// // // // // 			{audioBlob && (
// // // // // 				<button
// // // // // 					className="rounded bg-blue-500 px-4 py-2 text-white"
// // // // // 					onClick={sendAudio}
// // // // // 				>
// // // // // 					إرسال الصوت للتحليل
// // // // // 				</button>
// // // // // 			)}
// // // // // 			{prediction && (
// // // // // 				<p className="text-lg">
// // // // // 					التوقع: {prediction.predicted_class} - النسبة:{" "}
// // // // // 					{prediction.probability.toFixed(2)}%
// // // // // 				</p>
// // // // // 			)}
// // // // // 		</div>
// // // // // 	);
// // // // // }
