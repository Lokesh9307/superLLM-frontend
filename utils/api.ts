import axios from "axios";

const PDF_API = `${process.env.NEXT_PUBLIC_PDF_QNA_API}/api/pdf`;

// 🧾 PDF QnA

export const sendPdfQuestion = async (pdf: File, question: string) => {
  const formData = new FormData();
  formData.append("pdf", pdf);
  formData.append("question", question);

  const res = await axios.post(`${PDF_API}/upload`, formData);
  return res.data;
};

// 📺 YouTube QnA

const YT_API = `${process.env.NEXT_PUBLIC_YOUTUBEAI_API_KEY}/api/youtube`;

export const processYouTubeVideo = async (url: string) => {
  const res = await axios.post(`${YT_API}/process`, { url });
  return res.data;
};

export const sendYouTubeQuestion = async (url: string, question: string, history: any[]) => {
  const res = await axios.post(`${YT_API}/chat`, { url, question, history });
  return res.data;
};


