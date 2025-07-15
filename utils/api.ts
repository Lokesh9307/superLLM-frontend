// api.ts - UPDATED (core service file)
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_PDFAI_API_URL;

// Send PDF + question using multipart/form-data
export const sendPdfQuestion = async (pdf: File, question: string) => {
  const formData = new FormData();
  formData.append("pdf", pdf);
  formData.append("question", question);

  console.log("Sending to:", `${API_BASE}/api/chat/upload`);

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

  return response.data;
};


// YouTube functions (can remove if not needed)
export const processYouTubeVideo = async (url: string) => {
  const res = await axios.post(`${API_BASE}/api/youtube/process`, { url });
  return res.data;
};

export const sendYouTubeQuestion = async (url: string, question: string) => {
  const res = await axios.post(`${API_BASE}/api/youtube/chat`, {
    url,
    question,
  });
  return res.data;
};
