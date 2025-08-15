"use client";

import { useState } from "react";
import { loadVideo, chatWithVideo } from "@/utils/api";
import { removeThoughtTags } from "@/utils/formatResponse";
import { FaYoutube, FaPaperPlane } from "react-icons/fa";
import { AiOutlineRobot, AiOutlineUser } from "react-icons/ai";
import { formatChatbotResponse } from "@/utils/structuredResponse";
import '../globals.css'; // Ensure global styles are imported
interface Message {
  role: "user" | "bot";
  text: string;
}

export default function YouTubeChatPage() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");

  const handleLoadVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    alert('This tool is under development and may not work as expected. Please check back later.');
    if (!youtubeUrl) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "bot", text: "Loading video transcript..." }]);
    try {
      const data = await loadVideo(youtubeUrl);
      setSessionId(data.session_id);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "Video loaded successfully! You can now ask questions." },
      ]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "bot", text: `Error: ${err.message}` }]);
    }
    setLoading(false);
  };

  const handleSendQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query || !sessionId) return;
    setMessages((prev) => [...prev, { role: "user", text: query }]);
    setQuery("");
    setLoading(true);
    try {
      const data = await chatWithVideo(sessionId, query);
      setMessages((prev) => [...prev, { role: "bot", text: data.answer }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, { role: "bot", text: `Error: ${err.message}` }]);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-800 text-gray-100 relative">
      {/* AI background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,255,255,0.08),transparent_40%),radial-gradient(circle_at_bottom_right,rgba(255,0,255,0.08),transparent_40%)] pointer-events-none"></div>

      <header className=" backdrop-blur-lg p-4 text-center text-2xl font-bold border-b border-gray-700 shadow-lg">
        YouTube AI Chatbot
      </header>

      <main className="flex flex-col flex-1 max-w-4xl mx-auto w-full p-4">
        {/* YouTube URL input */}
        {!sessionId && (
          <form
            onSubmit={handleLoadVideo}
            className="flex gap-2 mb-4 bg-gray-900/80 backdrop-blur-lg p-3 rounded-xl border border-gray-700"
          >
            <FaYoutube className="text-red-500 text-2xl self-center" />
            <input
              type="text"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="Paste YouTube video URL..."
              className="flex-1 p-2 rounded bg-transparent text-gray-100 placeholder-gray-400 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors disabled:bg-gray-600"
              disabled={loading}
            >
              {loading ? "Loading..." : "Load"}
            </button>
          </form>
        )}

        {/* Chat messages */}
        <div
          className="overflow-y-auto bg-black/70 backdrop-blur-lg p-4 rounded-xl mb-4 border border-gray-700 space-y-4 scrollbarNone"
          style={{
            height: "calc(87vh - 200px)", // Adjust: 200px = navbar + footer + padding space
          }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${m.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              {m.role === "bot" && <AiOutlineRobot className="text-green-400 text-xl mt-1" />}
              {m.role === "user" && <AiOutlineUser className="text-blue-400 text-xl mt-1" />}
              <div
                className={`max-w-[80%] px-4 py-2 rounded-2xl ${m.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-gray-100"
                  }`}
                dangerouslySetInnerHTML={{
                  __html: formatChatbotResponse(removeThoughtTags(m.text)),
                }}
              />

            </div>
          ))}
        </div>

        {/* Query input */}
        {sessionId && (
          <form
            onSubmit={handleSendQuery}
            className="flex gap-2 bg-gray-900/80 backdrop-blur-lg p-3 rounded-xl border border-gray-700"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask something about the video..."
              className="flex-1 p-2 rounded bg-transparent text-gray-100 placeholder-gray-400 outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 p-3 rounded-full transition-colors disabled:bg-gray-600 flex items-center justify-center"
              disabled={loading}
            >
              <FaPaperPlane />
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
