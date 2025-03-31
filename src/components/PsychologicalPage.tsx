"use client";

import { startVoiceRecognition } from "@/utils/stt";
import { textToSpeech } from "@/utils/tts";
import { useEffect, useRef, useState } from "react";
import { FaMicrophone, FaPaperPlane, FaPause, FaPlay, FaStop } from "react-icons/fa";
import AmalNavbar from "./amalNavbar";

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

export default function PsychologicalSupport() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "مرحباً بك في منصة أمل للدعم النفسي. كيف يمكنني مساعدتك اليوم؟",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false); // Bot typing indicator
  const [isVoiceRecognizing, setIsVoiceRecognizing] = useState(false); // Voice recognition loading state
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});
  const [error, setError] = useState("");

  const getPsychologicalResponse = async (userMessage: string): Promise<string> => {
    const userFeeling = userMessage.toLowerCase().includes("حزين") ? "حزين" : "جيد";
    const responses = {
      حزين: "أشعر بما تمر به. هل ترغب في التحدث عن ذلك؟",
      جيد: "أنت بخير، ولكن هل هناك شيء ترغب في مشاركته؟",
      default: "أنا هنا للاستماع إليك. كيف يمكنني مساعدتك؟",
    };

    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 2000)
    ); // Simulate delay
    return responses[userFeeling] || responses.default;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");

    setIsBotTyping(true); // Show typing indicator while bot is thinking
    const botResponseText = await getPsychologicalResponse(inputText);
    setIsBotTyping(false); // Hide typing indicator once bot response is received

    const botMessage: Message = {
      id: Date.now().toString(),
      text: botResponseText,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, botMessage]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = async () => {
    setError("");
    try {
      setIsRecording(true);
      // طلب إذن الميكروفون أولاً
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setIsVoiceRecognizing(true); // Show loading spinner for voice recognition
      await navigator.mediaDevices.getUserMedia({ audio: true });
      const transcript = await startVoiceRecognition();
      setInputText(transcript);
    } catch (err) {
      setError("يجب منح الإذن لاستخدام الميكروفون");
      console.error("خطأ في الوصول للميكروفون:", err);
    } finally {
      setIsRecording(false);
      setIsVoiceRecognizing(false); // Hide loading spinner
    }
  };

  const toggleAudioPlayback = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (!message) return;

    if (activeAudioId === messageId && isPlaying) {
      window.speechSynthesis.cancel();
      setIsPlaying(false);
      setActiveAudioId(null);
    } else {
      setIsPlaying(true);
      setActiveAudioId(messageId);
      await textToSpeech(message.text);
      setIsPlaying(false);
      setActiveAudioId(null);
    }
  };

  useEffect(() => {
    return () => {
      Object.values(audioRefs.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
    };
  }, []);

  // Function to reset the conversation
  const handleResetConversation = () => {
    setMessages([
      {
        id: "1",
        text: "مرحباً بك في منصة أمل للدعم النفسي. كيف يمكنني مساعدتك اليوم؟",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100 pt-24">
      <AmalNavbar backgroundColor="#582C5E" activeSection={"psychological"} />

      {/* Message Section */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs p-4 rounded-xl shadow-lg transition-transform duration-300 ${
                message.sender === "user"
                  ? "bg-white text-[#582C5E]"
                  : "bg-[#582C5E] text-white"
              } font-serif`} // Ensure this is the same font used in AmalNavbar
            >
              <p className="text-lg">{message.text}</p> {/* Increased font size */}
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs opacity-80">
                  {message.timestamp.toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {message.sender === "user" && (
                  <button
                    onClick={() => toggleAudioPlayback(message.id)}
                    className={`rounded-full p-1 ${
                      activeAudioId === message.id && isPlaying
                        ? "bg-white text-[#582C5E]"
                        : "bg-[#582C5E] text-white"
                    }`}
                  >
                    {activeAudioId === message.id && isPlaying ? (
                      <FaPause size={12} />
                    ) : (
                      <FaPlay size={12} />
                    )}
                  </button>
                )}
                {message.sender === "bot" && (
                  <button
                    onClick={() => toggleAudioPlayback(message.id)}
                    className={`rounded-full p-1 ${
                      activeAudioId === message.id && isPlaying
                        ? "bg-white text-[#582C5E]"
                        : "bg-[#582C5E] text-white"
                    }`}
                  >
                    {activeAudioId === message.id && isPlaying ? (
                      <FaPause size={12} />
                    ) : (
                      <FaPlay size={12} />
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex justify-end">
            <div className="max-w-xs rounded-lg p-5 shadow-lg bg-[#F1F0F0] text-[#582C5E]">
              <p>...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="border-t border-gray-300 bg-white p-6 shadow-md">
        <div className="flex items-center rounded-lg bg-[#F1F0F0] p-3 shadow-lg transition-all">
          <button
            onClick={toggleRecording}
            className={`mr-3 rounded-full p-2 ${
              isRecording ? "bg-[#582C5E] text-white" : "bg-white text-[#582C5E]"
            }`}
          >
            {isRecording ? <FaStop size={16} /> : <FaMicrophone size={16} />}
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك هنا أو استخدم التسجيل الصوتي..."
            className="flex-1 resize-none bg-transparent text-[#582C5E] placeholder-[#E2C8D3] outline-none focus:ring-2 focus:ring-[#582C5E] transition-all rounded-lg shadow-md p-3 font-serif text-lg" // Increased font size here
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`ml-3 rounded-full p-2 ${
              inputText.trim()
                ? "bg-[#582C5E] text-white hover:bg-[#4F2345]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <FaPaperPlane size={16} />
          </button>
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}

        {/* Reset Conversation Button */}
        <div className="flex justify-end mt-4">
          <button
            onClick={handleResetConversation}
            className="bg-red-500 text-white px-4 py-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
          >
            محادثة جديدة
          </button>
        </div>

        {isVoiceRecognizing && <div className="spinner">...</div>}
      </div>
    </div>
  );
}
