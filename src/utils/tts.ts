// lib/tts.ts
let voicesReady = false;

export const initializeVoices = () => {
	return new Promise<void>((resolve) => {
		if (voicesReady) return resolve();

		const voices = window.speechSynthesis.getVoices();
		if (voices.length > 0) {
			voicesReady = true;
			return resolve();
		}

		window.speechSynthesis.onvoiceschanged = () => {
			voicesReady = true;
			resolve();
		};
	});
};

export const textToSpeech = async (text: string) => {
	if (!("speechSynthesis" in window)) {
		throw new Error("Text-to-Speech غير مدعوم في هذا المتصفح");
	}

	await initializeVoices();

	const utterance = new SpeechSynthesisUtterance(text);
	utterance.lang = "ar-SA";

	// اختيار أفضل صوت عربي متاح
	const voices = window.speechSynthesis.getVoices();
	const arabicVoices = voices.filter(
		(voice) => voice.lang.startsWith("ar") || voice.lang === "ar-SA",
	);

	if (arabicVoices.length > 0) {
		utterance.voice = arabicVoices[0]; // استخدام أول صوت عربي متاح
	}

	return new Promise<void>((resolve) => {
		utterance.onend = () => resolve();
		utterance.onerror = (event) => {
			resolve();
		};

		window.speechSynthesis.speak(utterance);
	});
};
