"use client";
import { useState } from "react";
import { FaUpload, FaRegPaperPlane, FaUserCircle, FaFilePdf } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import MessageBubble from "./MessageBubble";
import { sendPdfQuestion } from "@/utils/api";
import { removeThoughtTags } from "@/utils/formatResponse";
import "../globals.css";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function UploadForm() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSubmit = async () => {
    if (!pdf || !question.trim()) return;

    setLoading(true);
    setMessages(prev => [...prev, { role: "user", content: question }]);

    try {
      const { answer } = await sendPdfQuestion(pdf, question);
      const cleanAnswer = removeThoughtTags(answer);
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: cleanAnswer },
      ]);
      setQuestion("");
    } catch {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Error processing your request." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gray-800/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gray-700/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gray-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-4xl h-[80vh] flex flex-col bg-gray-900/80 backdrop-blur-2xl border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex flex-col items-center p-6 bg-gray-800/50 border-b border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gray-700 rounded-xl">
              <HiSparkles className="text-gray-300 text-xl" />
            </div>
            <h1 className="text-2xl font-bold text-white">PDF AI Assistant</h1>
          </div>
          
          {/* File Upload */}
          <div className="w-full max-w-md">
            <label 
              htmlFor="pdf-upload" 
              className={`cursor-pointer flex items-center justify-center gap-3 p-4 rounded-xl transition-all duration-300 border-2 border-dashed ${
                pdf 
                  ? 'border-green-500/50 bg-green-500/10 text-green-400' 
                  : 'border-gray-600 bg-gray-800/50 hover:border-gray-500 hover:bg-gray-700/50 text-gray-300'
              }`}
            >
              {pdf ? (
                <>
                  <FaFilePdf className="text-xl" />
                  <div className="text-center">
                    <div className="font-medium truncate max-w-48">{pdf.name}</div>
                    <div className="text-xs opacity-70">File uploaded successfully</div>
                  </div>
                </>
              ) : (
                <>
                  <FaUpload className="text-xl" />
                  <div className="text-center">
                    <div className="font-medium">Upload your PDF</div>
                    <div className="text-xs opacity-70">Max file size: 10MB</div>
                  </div>
                </>
              )}
            </label>
            <input
              type="file"
              id="pdf-upload"
              accept="application/pdf"
              className="hidden"
              onChange={(e) => setPdf(e.target.files?.[0] || null)}
              name="pdf"
            />
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 custom-scrollbar scrollbarNone">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="p-6 bg-gray-800/50 rounded-2xl border border-gray-700 max-w-md">
                <BsRobot className="text-4xl text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-200 mb-2">Ready to help!</h3>
                <p className="text-gray-400 text-sm">Upload a PDF and ask me anything about its content. I'll analyze and provide detailed answers.</p>
              </div>
            </div>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                  msg.role === "user" 
                    ? 'bg-gray-700' 
                    : 'bg-gray-600'
                }`}>
                  {msg.role === "user" ? (
                    <FaUserCircle className="text-white text-lg" />
                  ) : (
                    <BsRobot className="text-white text-lg" />
                  )}
                </div>
                
                {/* Message */}
                <div className={`flex-1 max-w-[80%] ${msg.role === "user" ? "text-right" : "text-left"}`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    msg.role === "user" 
                      ? 'bg-gray-700 text-gray-200 rounded-br-md' 
                      : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-bl-md'
                  }`}>
                    <MessageBubble
                      text={msg.content}
                      isUser={msg.role === "user"}
                    />
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                    {msg.role === "user" ? "You" : "AI Assistant"}
                  </div>
                </div>
              </div>
            ))
          )}
          
          {/* Loading indicator */}
          {loading && (
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center">
                <BsRobot className="text-gray-300 text-lg" />
              </div>
              <div className="flex-1 max-w-[80%]">
                <div className="inline-block p-4 rounded-2xl rounded-bl-md bg-gray-800 border border-gray-700">
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                    <span className="text-sm">Analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gray-900/80 backdrop-blur-sm border-t border-gray-700">
          <div className="flex items-center gap-3 bg-gray-800 rounded-xl p-2 border border-gray-700 focus-within:border-gray-600 focus-within:bg-gray-700/50 transition-all duration-300">
            <input
              type="text"
              placeholder="Ask your AI about the PDF..."
              className="flex-1 bg-transparent text-gray-200 px-3 py-2 focus:outline-none placeholder-gray-500 text-sm"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !pdf || !question.trim()}
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300 flex items-center gap-2 ${
                loading || !pdf || !question.trim()
                  ? "bg-gray-700 cursor-not-allowed text-gray-500"
                  : "bg-gray-600 hover:bg-gray-500 text-gray-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              }`}
            >
              {loading ? (
                <BsRobot className="animate-spin text-lg" />
              ) : (
                <>
                  <FaRegPaperPlane />
                  Send
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}