"use client";

import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { useRef, useState } from "react";

const ffmpeg = createFFmpeg({ log: true });

export default function det() {
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

		mediaRecorder.onstop = async () => {
			const webmBlob = new Blob(audioChunksRef.current, { type: "audio/webm" });
			const wavBlob = await convertWebMtoWav(webmBlob);
			setAudioBlob(wavBlob);
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

	const convertWebMtoWav = async (webmBlob: Blob) => {
		await ffmpeg.load();
		ffmpeg.FS("writeFile", "input.webm", await fetchFile(webmBlob));
		await ffmpeg.run(
			"-i",
			"input.webm",
			"-acodec",
			"pcm_s16le",
			"-ar",
			"16000",
			"-ac",
			"1",
			"output.wav",
		);

		const data = ffmpeg.FS("readFile", "output.wav");
		return new Blob([data.buffer], { type: "audio/wav" });
	};

	const sendAudio = async () => {
		if (!audioBlob) return;

		const formData = new FormData();
		formData.append("file", audioBlob, "recording.wav");

		try {
			const response = await fetch("http://127.0.0.1:5000/predict", {
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
