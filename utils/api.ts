import axios from "axios";

const API_BASE = "http://localhost:5000/api";

// Existing PDF functions
export const sendPdfQuestion = async (pdf: File, question: string) => {
  const formData = new FormData();
  formData.append("pdf", pdf);
  formData.append("question", question);

  const res = await axios.post(`${API_BASE}/pdf/upload`, formData);
  return res.data;
};



export const processYouTubeVideo = async (url: string) => {
  const res = await axios.post(`${API_BASE}/youtube/process`, { url });
  return res.data;
};



export const checkVideoCaptions = async (url: string) => {
  const res = await axios.post(`${API_BASE}/youtube/process`, { url });
  return res.data;
};



// frontend/utils/api.ts

export async function sendYouTubeQuestion(url: string, question: string, history: any[]) {
  const response = await fetch("http://localhost:5000/api/youtube/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url, question, history }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Chat error: ${errorText}`);
  }

  return await response.json();
}


