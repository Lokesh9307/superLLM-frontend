// api.ts - UPDATED (core service file)
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_PDFAI_API_URL;

// Send PDF + question using multipart/form-data
export const sendPdfQuestion = async (pdf: File, question: string) => {
  const formData = new FormData();
  formData.append("pdf", pdf);
  formData.append("question", question);

  const response = await axios
    .post(`${API_BASE}/api/chat/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .catch((err) => {
      console.error("API Error:", err.response?.data || err.message);
      throw err;
    });
  console.log(response.data)
  return response.data;
};


// Youtube Chat API
export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export interface LoadVideoResponse {
  session_id: string;
  n_chunks: number;
}

export interface ChatResponse {
  answer: string;
  retrieved_count: number;
}

export async function loadVideo(url: string): Promise<LoadVideoResponse> {
  const res = await fetch(`${backendUrl}/load_video`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to load video");
  }
  return res.json();
}

export async function chatWithVideo(sessionId: string, query: string): Promise<ChatResponse> {
  const res = await fetch(`${backendUrl}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, query }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Failed to get answer");
  }
  return res.json();
}
