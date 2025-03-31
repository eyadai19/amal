"use client";

import { textToSpeech } from "@/utils/tts";
import { useEffect, useRef, useState } from "react";
import {
  FaCheck,
  FaMicrophone,
  FaPlay,
  FaPause,
  FaRedo,
  FaSearch,
} from "react-icons/fa";
import AmalNavbar from "./amalNavbar";

// Function to start speech-to-text (voice recognition)
const startVoiceRecognition = async (): Promise<string> => {
  return new Promise<string>((resolve, reject) => {
    const recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.lang = "ar-SA"; // Set the language to Arabic

    recognition.start();

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      resolve(transcript); // Return the recognized speech as text
    };

    recognition.onerror = (event) => {
      reject(event.error);
    };
  });
};

type Message = {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  answers?: string[];
  isFinalAnswer?: boolean;
};

const colors = {
  primary: "#D78448", // Color for question and bot response
  secondary: "#FFCB99", // Color for options and user responses
  accent: "#D78448", // Accent color for buttons
  text: "#333333", // Dark text color
  lightText: "#FFFFFF", // Light text color for button text
};

export default function LegalSupport({
  ChatbotExpAction,
}: {
  ChatbotExpAction: (
    question: string,
    answer: string,
  ) => Promise<
    | { question: string; answers: string[] }
    | { field: string; message: string }
    | { answer: string }
  >;
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false); // State to manage recording
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set());
  const [isPlaying, setIsPlaying] = useState(false); // State to manage audio playing
  const [speechInstance, setSpeechInstance] = useState<SpeechSynthesisUtterance | null>(null); // Speech instance
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
    startConversation();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const startConversation = async () => {
    setIsBotTyping(true);
    const initialResponse = await ChatbotExpAction("", "");
    setIsBotTyping(false);

    if ("question" in initialResponse) {
      setMessages([
        {
          id: Date.now().toString(),
          text: initialResponse.question,
          sender: "bot",
          timestamp: new Date(),
          answers: initialResponse.answers,
        },
      ]);
    }
  };

  const handleAnswerSelection = async (answer: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: answer,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);

    setIsBotTyping(true);
    const lastBotMessage = messages.findLast((m) => m.sender === "bot");
    const botResponse = await ChatbotExpAction(lastBotMessage?.text || "", answer);
    setIsBotTyping(false);

    if ("answer" in botResponse) {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse.answer,
        sender: "bot",
        timestamp: new Date(),
        isFinalAnswer: true,
      };
      setMessages((prev) => [...prev, botMessage]);
    } else if ("question" in botResponse) {
      const botMessage: Message = {
        id: Date.now().toString(),
        text: botResponse.question,
        sender: "bot",
        timestamp: new Date(),
        answers: botResponse.answers,
      };
      setMessages((prev) => [...prev, botMessage]);
    }
  };

  const handleResetConversation = () => {
    setMessages([]);
    setSelectedAnswers(new Set());
    setSearchQuery("");
    startConversation();
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
  };

  const playMessage = (text: string) => {
    if (isPlaying) {
      // Pause the speech if it's currently playing
      if (speechInstance) {
        speechSynthesis.pause();
        setIsPlaying(false);
      }
    } else {
      // Play the message using speech synthesis
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "ar-SA"; // Set the language to Arabic
      speechSynthesis.speak(utterance);

      // Save the speech instance for later control
      setSpeechInstance(utterance);

      // Update state to reflect that the speech is playing
      utterance.onstart = () => setIsPlaying(true);
      utterance.onend = () => setIsPlaying(false);
    }
  };

  // Handle the start/stop of voice recording
  const toggleRecording = async () => {
    setIsRecording((prev) => !prev); // Toggle recording state

    if (!isRecording) {
      try {
        const transcript = await startVoiceRecognition();
        const userMessage: Message = {
          id: Date.now().toString(),
          text: transcript,
          sender: "user",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, userMessage]);

        // Call the chatbot action with the recognized speech
        const lastBotMessage = messages.findLast((m) => m.sender === "bot");
        setIsBotTyping(true);
        const botResponse = await ChatbotExpAction(lastBotMessage?.text || "", transcript);
        setIsBotTyping(false);

        if ("answer" in botResponse) {
          const botMessage: Message = {
            id: Date.now().toString(),
            text: botResponse.answer,
            sender: "bot",
            timestamp: new Date(),
            isFinalAnswer: true,
          };
          setMessages((prev) => [...prev, botMessage]);
        } else if ("question" in botResponse) {
          const botMessage: Message = {
            id: Date.now().toString(),
            text: botResponse.question,
            sender: "bot",
            timestamp: new Date(),
            answers: botResponse.answers,
          };
          setMessages((prev) => [...prev, botMessage]);
        }
      } catch (err) {
        console.error("Error with voice recognition:", err);
      } finally {
        setIsRecording(false); // Stop recording after processing the speech
      }
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 pt-24">
      <AmalNavbar backgroundColor={"#D78448"} activeSection={"legal"} />

      {/* Messages container */}
      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-start" : "justify-end"} transition-all ease-in-out`}
          >
            <div className="w-full max-w-[90%] lg:max-w-[70%]">
              {/* Bot Question */}
              {message.sender === "bot" && (
                <div className="mb-4 space-y-3 text-right">
                  <div className="inline-block max-w-fit rounded-xl bg-white p-4 shadow-lg transform transition-all duration-500 hover:scale-105">
                    <div className="flex flex-col items-start gap-1">
                      <p className="text-lg font-medium text-gray-800">
                        {message.text}
                      </p>
                      <button
                        onClick={() => playMessage(message.text)}
                        className="self-end pt-2 text-[#D78448] hover:text-[#D78448] transition-colors duration-300"
                      >
                        {isPlaying ? <FaPause size={12} /> : <FaPlay size={12} />}
                      </button>
                    </div>
                  </div>

                  {/* Answer Options */}
                  {message.answers && (
                    <div className="flex flex-wrap justify-end gap-2">
                      {message.answers.map((answer, index) => (
                        <div key={index} className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              handleAnswerSelection(answer);
                              setSelectedAnswers(new Set([...selectedAnswers, answer]));
                            }}
                            className={`rounded-lg px-4 py-2 transition-all duration-300 transform ${selectedAnswers.has(answer) ? "bg-[#D78448] text-white" : "bg-[#FFCB99] text-gray-800 hover:bg-[#FFB37D] hover:scale-105"}`}
                          >
                            {answer}
                            <button
                              onClick={() => playMessage(answer)}
                              className="pl-3 text-[#D78448] hover:text-[#D78448]"
                            >
                              <FaPlay size={12} />
                            </button>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* User Answer */}
              {message.sender === "user" && (
                <div className="flex justify-start">
                  <div className="relative max-w-[80%] rounded-xl rounded-bl-none bg-[#FFCB99] p-3 shadow-sm transform transition-all duration-300 hover:scale-105">
                    <p className="font-medium text-[#D78448]">
                      {message.text}
                      <button
                        onClick={() => playMessage(message.text)}
                        className="pl-3 text-[#D78448] hover:text-[#D78448] transition-colors duration-300"
                      >
                        <FaPlay size={12} />
                      </button>
                    </p>
                    <div className="clip-triangle absolute bottom-0 -left-2 h-4 w-4 bg-[#FFCB99]" />
                  </div>
                </div>
              )}

              {/* Final Answer */}
              {message.isFinalAnswer && (
                <div className="mt-4 w-full rounded-xl border border-[#D78448] bg-[#FFCB99] p-4 text-right md:w-fit">
                  <div className="flex flex-col items-end gap-3 md:flex-row md:items-center md:justify-end">
                    {/* النص وعناصر التحكم */}
                    <div className="flex w-full items-center justify-end gap-2 md:w-auto">
                      <FaCheck className="hidden shrink-0 text-[#D78448] md:block" />
                      <p className="flex-1 font-medium text-[#D78448] md:flex-none">
                        {message.text}
                      </p>
                      <button
                        onClick={() => playMessage(message.text)}
                        className="text-[#D78448] hover:text-[#D78448] transition-colors duration-300"
                      >
                        {isPlaying ? <FaPause size={14} /> : <FaPlay size={14} />}
                      </button>
                    </div>

                    {/* زر إعادة المحادثة */}
                    <button
                      onClick={handleResetConversation}
                      className="w-full rounded-lg bg-[#D78448] px-3 py-2 text-white transition-colors hover:bg-[#D78448] md:w-auto"
                    >
                      <div className="flex items-center justify-center gap-2">
                        <FaRedo size={14} />
                        <span>إعادة المحادثة</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
        {isBotTyping && (
          <div className="flex justify-end">
            <div className="animate-pulse rounded-xl bg-white p-3">
              <div className="flex items-center gap-2 text-gray-500">
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-100" />
                <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 delay-200" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Action Bar */}
      <div className="w-full border-t border-gray-200 bg-white p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {/* Search Bar and Buttons */}
          <div className="flex flex-row items-center gap-2 sm:flex-1 sm:gap-4">
            {/* Search Bar */}
            <div className="relative flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث في الأسئلة..."
                className="w-full rounded-full bg-gray-100 py-2 pr-12 pl-4 text-right text-gray-700 outline-none focus:ring-2 focus:ring-[#D78448] transition-all"
              />
              <button
                onClick={handleSearch}
                className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full bg-[#D78448] p-2 text-white hover:bg-[#D78448]"
              >
                <FaSearch size={14} />
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 sm:hidden">
              <button
                onClick={handleResetConversation}
                className="rounded-lg bg-[#D78448] p-2 text-white transition-colors hover:bg-[#D78448]"
              >
                <FaRedo size={20} />
              </button>
              <button
                onClick={toggleRecording}
                className={`rounded-lg p-2 transition-colors ${isRecording ? "bg-[#D78448] text-white" : "bg-gray-100 text-[#D78448] hover:bg-[#FFCB99] hover:scale-105"}`}
              >
                <FaMicrophone size={20} />
              </button>
            </div>
          </div>

          {/* Large screen buttons */}
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={handleResetConversation}
              className="flex items-center gap-2 rounded-lg bg-[#D78448] px-3 py-2 text-white transition-colors hover:bg-[#D78448] hover:scale-105"
            >
              <FaRedo className="shrink-0" />
              <span>إعادة</span>
            </button>
            <button
              onClick={toggleRecording}
              className={`rounded-lg p-2 transition-colors ${isRecording ? "bg-[#D78448] text-white" : "bg-gray-100 text-[#D78448] hover:bg-[#FFCB99] hover:scale-105"}`}
            >
              <FaMicrophone size={20} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>
        {`
          .clip-triangle {
            clip-path: polygon(0 0, 0% 100%, 100% 0);
          }
        `}
      </style>
    </div>
  );
}
