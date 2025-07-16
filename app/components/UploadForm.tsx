"use client";
import { useState } from "react";
import { FaUpload, FaRegPaperPlane, FaUserCircle } from "react-icons/fa";
import { BsRobot } from "react-icons/bs";
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
    <div className="flex flex-col items-center justify-center min-h-auto bg-black text-white font-sans px-4 py-10">
      <div className="relative flex flex-col w-full max-w-4xl min-h-auto bg-white/10 backdrop-blur-xl rounded-xl shadow-2xl border border-white/10 overflow-hidden">
        <p className='text-red-600 text-xs text-center'>*File must be within 10mb*</p>
        <div className="flex justify-center p-4 border-b border-white/10 bg-white/5">
          <label htmlFor="pdf-upload" className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-black hover:ring-white/70 rounded-full transition-all text-sm font-medium ring-1 ring-white/30 text-white">
            <FaUpload />
            {pdf ? pdf.name : "Upload PDF"}
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

        <div className="flex-1 overflow-y-auto space-y-4 px-6 py-4 max-h-[500px] custom-scrollbar scrollbarNone">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "user" ? (
                <FaUserCircle className="text-2xl text-indigo-400 mt-1" />
              ) : (
                <BsRobot className="text-2xl text-green-400 mt-1" />
              )}
              <MessageBubble
                text={msg.content}
                isUser={msg.role === "user"}
              />
            </div>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white/5 backdrop-blur-md border-t border-white/10 p-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask your AI about the PDF..."
              className="flex-1 rounded-xl bg-white/10 border border-white/20 text-white px-4 py-2 text-sm focus:outline-none focus:ring focus:border-indigo-500 placeholder-gray-300"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
            <button
              onClick={handleSubmit}
              disabled={loading || !pdf || !question.trim()}
              className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all flex items-center gap-2 ${
                loading || !pdf || !question.trim()
                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                  : "bg-indigo-600 hover:bg-indigo-700 text-white"
              }`}
            >
              {loading ? (
                <BsRobot className="animate-spin text-lg" />
              ) : (
                <>
                  <FaRegPaperPlane />
                  Ask
                </>
              )}
            </button>
          </div>
        </div>       
      </div>
    </div>
  );
}
