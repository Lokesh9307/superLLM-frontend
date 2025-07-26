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

  return response.data;
};


// Youtube Chat API
export async function askYouTubeQuestion(youtubeUrl: string, question: string): Promise<string> {
  const response = await axios.post('http://localhost:5000/youtube/chat', {
    youtubeUrl,
    question
  });

  return response.data.answer;
}

