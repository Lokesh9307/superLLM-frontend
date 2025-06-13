// app/pages/Home.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "../lib/auth.config";
import { formatUsernameAsName } from "../components/EmailFormatter";
import Link from "next/link";
import './style.css'; // Ensure you have a styles.css file for custom styles
import { FaYoutube } from "react-icons/fa";
import { FaFilePdf } from "react-icons/fa";

export default async function Home() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/auth/signin");
  }

  const email = session.user?.email ?? "";

  return (
    <section className="p-6 w-full h-[70vh] flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold"></h1>
      <p>Welcome, {formatUsernameAsName(email)}</p>

      <div className="mt-6 w-full h-full max-w-4xl p-4 bg-gray-900 text-white rounded-lg shadow-lg">
        <h1 className="text-center text-2xl">Tools</h1>
        <div className="flex items-center justify-center flex-wrap gap-10 mt-4">      
            <Link href="/pdf-chat" className="flex flex-col items-center justify-center p-4  text-black rounded-lg shadow-md transition-ring ring-2 hover:scale-110 text-center tool1 ring-[#fbf8cc]">
              <h2 className="font-semibold flex items-center gap-2"><span className="text-2xl text-red-500"><FaFilePdf /></span> PDF Chat</h2>
              <p>Chat with your PDF documents</p>
            </Link>  

            <Link href="/youtube-chat" className="flex flex-col items-center justify-center p-4 text-black rounded-lg shadow-md hover: transition-ring ring-2  hover:scale-110 text-center tool2 ring-[#ffa5ab]">
              <h2 className="font-semibold flex items-center gap-2"><span className="text-2xl text-red-500"><FaYoutube /></span> YouTube Chat</h2>
              <p>Chat with your YouTube videos</p>
            </Link>
        </div>
      </div>
            <p>More to come soon...</p>
    </section>
  );
}
