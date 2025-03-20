// "use client";
// import { useRef, useState } from "react";

// export default function ArabicCanvasCom() {
// 	const canvasRef = useRef<HTMLCanvasElement>(null);
// 	const [isDrawing, setIsDrawing] = useState(false);
// 	const [prediction, setPrediction] = useState<string | null>(null);

// 	const startDrawing = (e: React.MouseEvent) => {
// 		const canvas = canvasRef.current;
// 		if (!canvas) return;

// 		const ctx = canvas.getContext("2d");
// 		if (!ctx) return;

// 		ctx.beginPath();
// 		ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
// 		setIsDrawing(true);
// 	};

// 	const draw = (e: React.MouseEvent) => {
// 		if (!isDrawing) return;

// 		const canvas = canvasRef.current;
// 		if (!canvas) return;

// 		const ctx = canvas.getContext("2d");
// 		if (!ctx) return;

// 		ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
// 		ctx.strokeStyle = "#000000";
// 		ctx.lineWidth = 15;
// 		ctx.lineCap = "round";
// 		ctx.stroke();
// 	};

// 	const handlePredict = async () => {
// 		const canvas = canvasRef.current;
// 		if (!canvas) return;

// 		canvas.toBlob(async (blob) => {
// 			if (!blob) return;

// 			const formData = new FormData();
// 			formData.append("image", blob, "drawing.png");

// 			try {
// 				const response = await fetch("http://127.0.0.1:8000/predict", {
// 					method: "POST",
// 					body: formData,
// 				});

// 				const result = await response.json();
// 				if (result.character) {
// 					setPrediction(result.character);
// 				} else {
// 					alert("❌ لم يتم التعرف على الحرف!");
// 				}
// 			} catch (error) {
// 				console.error("Error:", error);
// 			}
// 		}, "image/png");
// 	};

// 	const clearCanvas = () => {
// 		const canvas = canvasRef.current;
// 		if (!canvas) return;

// 		const ctx = canvas.getContext("2d");
// 		if (!ctx) return;

// 		ctx.fillStyle = "#ffffff";
// 		ctx.fillRect(0, 0, canvas.width, canvas.height);
// 		setPrediction(null);
// 	};

// 	return (
// 		<div className="flex h-screen flex-col items-center justify-center text-center">
// 			<canvas
// 				ref={canvasRef}
// 				width={400}
// 				height={400}
// 				className="mb-4 rounded-lg border-2 border-black bg-white"
// 				onMouseDown={startDrawing}
// 				onMouseMove={draw}
// 				onMouseUp={() => setIsDrawing(false)}
// 				onMouseLeave={() => setIsDrawing(false)}
// 			/>

// 			{prediction && (
// 				<div className="mb-4 rounded bg-blue-500 px-6 py-3 text-xl font-bold text-white shadow-lg">
// 					الحرف المتوقع: {prediction}
// 				</div>
// 			)}

// 			<div className="flex space-x-4">
// 				<button
// 					onClick={handlePredict}
// 					className="rounded bg-green-500 px-6 py-2 text-white shadow-lg transition hover:bg-green-600"
// 				>
// 					موافق
// 				</button>
// 				<button
// 					onClick={clearCanvas}
// 					className="rounded bg-red-500 px-6 py-2 text-white shadow-lg transition hover:bg-red-600"
// 				>
// 					مسح
// 				</button>
// 			</div>
// 		</div>
// 	);
// }
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

"use client";

import { useRef, useState } from "react";

export default function Det() {
	const [recording, setRecording] = useState<boolean>(false);
	const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
	const [prediction, setPrediction] = useState<{
		predicted_class: string;
		probability: number;
	} | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const audioChunksRef = useRef<Blob[]>([]);

	const startRecording = async () => {
		if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
			alert("المتصفح لا يدعم التسجيل الصوتي.");
			return;
		}

		const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

		if (!MediaRecorder.isTypeSupported("audio/webm")) {
			console.error("WebM غير مدعوم في هذا المتصفح.");
			return;
		}

		const mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

		mediaRecorderRef.current = mediaRecorder;
		audioChunksRef.current = [];

		mediaRecorder.ondataavailable = (event) => {
			if (event.data.size > 0) {
				audioChunksRef.current.push(event.data);
			}
		};

		mediaRecorder.onstop = () => {
			const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
			
			setAudioBlob(webmBlob);
		};

		mediaRecorder.start();
		setRecording(true);
	};

	const stopRecording = () => {
		if (mediaRecorderRef.current) {
			mediaRecorderRef.current.stop();
			setRecording(false);
		}
	};

	const sendAudio = async () => {
		if (!audioBlob) return;

		const formData = new FormData();
		formData.append("file", audioBlob, "recording.webm");
		

		try {
			const response = await fetch("http://127.0.0.1:8000/predict", {
				method: "POST",
				body: formData,
			});

			const data = await response.json();
			if (response.ok) {
				setPrediction(data);
			} else {
				console.error("Error:", data.error);
			}
		} catch (error) {
			console.error("❌ خطأ أثناء إرسال الملف:", error);
		}
	};

	return (
		<div className="flex flex-col items-center space-y-4 p-6">
			<h1 className="text-2xl font-bold">التعرف على الحروف الهجائية</h1>
			<button
				className={`rounded px-4 py-2 text-white ${recording ? "bg-red-500" : "bg-green-500"}`}
				onClick={recording ? stopRecording : startRecording}
			>
				{recording ? "إيقاف التسجيل" : "بدء التسجيل"}
			</button>
			{audioBlob && (
				<button
					className="rounded bg-blue-500 px-4 py-2 text-white"
					onClick={sendAudio}
				>
					إرسال الصوت للتحليل
				</button>
			)}
			{prediction && (
				<p className="text-lg">
					التوقع: {prediction.predicted_class} - النسبة:{" "}
					{prediction.probability.toFixed(2)}%
				</p>
			)}
		</div>
	);
}
