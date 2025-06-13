"use client";

import { sendPdfQuestion } from "@/utils/api";
import { useState } from "react";
import FormattedMessage from "./FormattedMessage";
import { FaUpload } from "react-icons/fa";

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
    if (!pdf || !question) return;

    const newMessages: Message[] = [...messages, { role: "user", content: question }];
    setMessages(newMessages);
    setQuestion("");
    setLoading(true);

    try {
      const data = await sendPdfQuestion(pdf, question);
      setMessages((prev) => [...prev, { role: "assistant", content: data.answer }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: "assistant", content: "Something went wrong." }]);
    }

    setLoading(false);
  };

  return (
    <div className="w-full h-full mx-auto p-4 flex flex-col items-center space-y-4">
      {/* File upload section */}
      <input
        type="file"
        id="pdf-upload"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => setPdf(e.target.files?.[0] || null)}
      />
      <label
        htmlFor="pdf-upload"
        className="flex items-center gap-2 px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded cursor-pointer transition"
      >
        <FaUpload />
        {pdf ? pdf.name : "Upload PDF"}
      </label>

      {/* Chat messages */}
      <div className="w-full max-w-4xl flex-1 overflow-y-auto space-y-4 mt-4 mb-50 ring-2 ring-slate-600 px-4 py-2 rounded-lg">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.role === "user" ? "justify-start" : "justify-end"
            }`}
          >
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                msg.role === "user"
                  ? "bg-gray-200 text-black"
                  : "bg-blue-200 text-black"
              }`}
            >
              {msg.role === "assistant" ? (
                <FormattedMessage content={msg.content} />
              ) : (
                msg.content
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Question input fixed at bottom */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white shadow-md p-4">
        <div className="flex flex-col items-center space-y-2">
          <textarea
            className="w-full lg:w-[60vw] border p-2 rounded resize-none text-white ring-2"
            placeholder="Ask your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Loading..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
