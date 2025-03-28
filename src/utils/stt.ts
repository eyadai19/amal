// lib/stt.ts

// تعريف واجهة لأنواع SpeechRecognition
interface SpeechRecognitionEvent extends Event {
	results: {
		[key: number]: {
			[key: number]: {
				transcript: string;
				confidence: number;
			};
		};
	};
}

interface SpeechRecognitionErrorEvent extends Event {
	error: string;
}

declare global {
	interface Window {
		SpeechRecognition: new () => SpeechRecognition;
		webkitSpeechRecognition: new () => SpeechRecognition;
	}

	interface SpeechRecognition extends EventTarget {
		lang: string;
		interimResults: boolean;
		maxAlternatives: number;
		ended: any;
		onresult: (event: SpeechRecognitionEvent) => void;
		onerror: (event: SpeechRecognitionErrorEvent) => void;
		start: () => void;
		stop: () => void;
		abort: () => void;
	}
}
export const startVoiceRecognition = (lang = "ar-SA"): Promise<string> => {
	return new Promise<string>(async (resolve, reject) => {
		try {
			// التحقق من دعم المتصفح
			if (
				!("webkitSpeechRecognition" in window) &&
				!("SpeechRecognition" in window)
			) {
				throw new Error("المتصفح غير مدعوم");
			}

			// طلب إذن الميكروفون أولاً
			await navigator.mediaDevices.getUserMedia({ audio: true });

			const SpeechRecognition =
				window.SpeechRecognition || window.webkitSpeechRecognition;
			const recognition = new SpeechRecognition();

			recognition.lang = lang;
			recognition.interimResults = false;
			recognition.maxAlternatives = 1;

			recognition.onresult = (event: SpeechRecognitionEvent) => {
				const transcript = event.results[0][0].transcript;
				resolve(transcript);
			};

			recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
				let errorMessage = "حدث خطأ أثناء التعرف على الصوت";
				if (event.error === "no-speech") {
					errorMessage = "لم يتم اكتشاف أي كلام. حاول مرة أخرى";
				} else if (event.error === "not-allowed") {
					errorMessage = "تم رفض الإذن باستخدام الميكروفون";
				}
				reject(errorMessage);
			};

			recognition.start();

			// إيقاف تلقائي بعد 10 ثواني إذا لم يتم الكلام
			setTimeout(() => {
				if (!recognition.ended) {
					recognition.stop();
					reject("انتهى الوقت المحدد دون اكتشاف كلام");
				}
			}, 10000);
		} catch (err) {
			reject(err instanceof Error ? err.message : "حدث خطأ غير متوقع");
		}
	});
};
