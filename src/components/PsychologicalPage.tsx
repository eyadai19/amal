"use client";

import { startVoiceRecognition } from "@/utils/stt";
import { textToSpeech } from "@/utils/tts";
import { useEffect, useState } from "react";
import { FaMicrophone, FaPaperPlane, FaStop, FaVolumeUp } from "react-icons/fa";
import AmalNavbar from "./amalNavbar"; // Importing the navbar component

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
  const [error, setError] = useState("");

  const getPsychologicalResponse = async (userMessage: string): Promise<string> => {
    const userFeeling = userMessage.toLowerCase().includes("حزين") ? "حزين" : "جيد";
    const responses = {
      حزين: "أشعر بما تمر به. هل ترغب في التحدث عن ذلك؟",
      جيد: "أنت بخير، ولكن هل هناك شيء ترغب في مشاركته؟",
      default: "أنا هنا للاستماع إليك. كيف يمكنني مساعدتك؟",
    };

    await new Promise((resolve) => setTimeout(resolve, 1000 + Math.random() * 2000)); // Simulate delay
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

  // New function to read aloud the message text when the sound icon is clicked
  const readMessageAloud = (messageId: string) => {
    const message = messages.find((m) => m.id === messageId);
    if (message) {
      textToSpeech(message.text);
    }
  };

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

  useEffect(() => {
    return () => {
      // Clean up resources if needed
    };
  }, []);

  return (
    <div className="flex h-screen flex-col bg-gradient-to-b from-[#F1E0D6] to-[#E2C8D3] pt-24 font-sans">
      {/* Updated Navbar (Same as LiteracyPage, with different background color) */}
      <AmalNavbar backgroundColor="#582C5E" activeSection={"psychological"} />

      {/* Message Section */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"}`}
          >
            <div
              className={`max-w-xs p-4 rounded-xl shadow-lg transition-transform duration-300 ${
                message.sender === "user"
                  ? "bg-gradient-to-r from-[#F1F0F0] to-[#E0E0E0] text-[#582C5E]"
                  : "bg-[#582C5E] text-white"
              }`}
            >
              <p>{message.text}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-xs opacity-80">
                  {message.timestamp.toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                {/* Sound button */}
                <button
                  onClick={() => readMessageAloud(message.id)}
                  className="rounded-full p-1 bg-white text-[#582C5E] hover:bg-[#582C5E] hover:text-white transition-all"
                >
                  <FaVolumeUp size={14} />
                </button>
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
            className={`mr-3 rounded-full p-2 ${isRecording ? "bg-[#582C5E] text-white" : "bg-white text-[#582C5E]"}`}
          >
            {isRecording ? <FaStop size={20} /> : <FaMicrophone size={20} />}
          </button>
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="اكتب رسالتك هنا أو استخدم التسجيل الصوتي..."
            className="flex-1 resize-none bg-transparent text-[#582C5E] placeholder-[#E2C8D3] outline-none focus:ring-2 focus:ring-[#582C5E] transition-all rounded-lg shadow-md p-3"
            rows={1}
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim()}
            className={`ml-3 rounded-full p-2 ${inputText.trim() ? "bg-[#582C5E] text-white hover:bg-[#4F2345]" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
          >
            <FaPaperPlane size={20} />
          </button>
        </div>
        {error && <p className="mt-2 text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleResetConversation}
          className="mt-4 ml-4 bg-red-500 text-white px-4 py-2 rounded-full"
        >
          إعادة تعيين المحادثة
        </button>
        {isVoiceRecognizing && <div className="spinner">...</div>}
      </div>
    </div>
  );
}
