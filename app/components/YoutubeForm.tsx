"use client";

import { useState } from "react";
import { processYouTubeVideo, sendYouTubeQuestion } from "@/utils/api";
import { removeThoughtTags } from "@/utils/formatResponse";
import FormattedMessage from "./FormattedMessage";
import { FaUserAlt } from "react-icons/fa";
import { RiRobot3Fill } from "react-icons/ri";

type Message = { role: "user" | "assistant"; content: string };

export default function YoutubeForm() {
  const [url, setUrl] = useState("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Message[]>([]);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!url.trim() || !question.trim()) {
      setError("Please enter a valid YouTube video URL and your question.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ Call video processing API
      const processData = await processYouTubeVideo(url.trim());

      if (!processData.success) {
        throw new Error(processData.error || "Failed to process the video.");
      }

      // ✅ Send question to backend
      const res = await sendYouTubeQuestion(url.trim(), question.trim());

      const newUserMessage: Message = { role: "user", content: question };
      const newAssistantMessage: Message = {
        role: "assistant",
        content: removeThoughtTags(res.answer) || "No answer received.",
      };

      setHistory((prev) => [...prev, newUserMessage, newAssistantMessage]);
      setQuestion("");
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4 pb-32">
      {/* YouTube URL Input */}
      <input
        type="text"
        value={url}
        onChange={(e) => {
          setUrl(e.target.value);
          setError("");
        }}
        placeholder="Paste YouTube video URL"
        className="w-full border p-2 rounded mb-4"
      />

      {/* Error message */}
      {error && (
        <div className="mb-4 text-red-600 font-semibold">
          {error}
        </div>
      )}

      {/* Chat history */}
      {history.length > 0 && (
        <div className="space-y-4 ring-2 ring-slate-400 px-4 py-2 rounded-lg mb-16">
          {history.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-lg shadow ${
                  msg.role === "user"
                    ? "bg-blue-100 text-blue-900"
                    : "bg-gray-800 text-white"
                }`}
              >
                <div className="flex items-center gap-2 mb-1 text-sm font-semibold">
                  {msg.role === "user" ? <FaUserAlt /> : <RiRobot3Fill />}
                  {msg.role === "user" ? "You:" : "Assistant:"}
                </div>
                <FormattedMessage content={msg.content} />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom input */}
      <div className="fixed bottom-0 left-0 w-full bg-black text-white shadow-md p-4">
        <div className="flex flex-col items-center space-y-2">
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask a question about the video..."
            className="w-full lg:w-[60vw] border p-2 rounded resize-none text-white ring-1"
          />
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Processing..." : "Ask"}
          </button>
        </div>
      </div>
    </div>
  );
}
