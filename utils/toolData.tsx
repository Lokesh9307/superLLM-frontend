import { FaYoutube, FaFilePdf } from "react-icons/fa";
import { VscGraph } from "react-icons/vsc";
const Tooldata = [
  {
    urlPath: "/pdf-chat",
    icon: <FaFilePdf className="text-red-400 text-3xl" />,
    title: "AI PDF",
    description: "AI PDF summarizer",
  },
  {
    urlPath: "/youtube-chat",
    icon: <FaYoutube className="text-red-600 text-3xl" />,
    title: "AI YouTube",
    description: "AI YouTube video summarizer",
  },
  {
    urlPath: "/analysis-ai",
    icon: <VscGraph className="text-blue-400 text-3xl" />,
    title: "Analysis AI",
    description: "AI Analysis tool",
  },
];

export default Tooldata;
