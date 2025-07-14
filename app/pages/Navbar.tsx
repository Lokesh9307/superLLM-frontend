import { getServerSession } from "next-auth";
import { authConfig } from "../lib/auth.config";
import { formatUsernameAsName } from "../components/EmailFormatter";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import Link from "next/link";
import Home from "./Home";

export default async function Navbar() {
  const session = await getServerSession(authConfig);
  const email = session?.user?.email;
  const displayName = session?.user?.name || formatUsernameAsName(email || "");

  return (
    <nav className="flex items-center justify-between px-6 py-4 
      bg-black/30 backdrop-blur-md border border-white/20 
      shadow-xl rounded-2xl text-white mx-4 mt-4">
      
      {/* Left Logo Section */}
      <Link href='/home-page' className="flex items-center space-x-3">
        <Image src={Logo} alt="SuperLLM Logo" width={40} height={40} />
        <h1 className="md:text-2xl text-lg font-bold">SuperLLM</h1>
      </Link>

      {/* Right Auth Section */}
      {session ? (
        <div className="flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20 shadow-sm">
          <span className="w-8 h-auto p-1 flex items-center justify-center rounded-full ring-2 ring-[#bde0fe] text-sm font-bold bg-black/20">
            {displayName.charAt(0)}
          </span>
          <p className="md:text-sm text-xs font-medium">{displayName}</p>
        </div>
      ) : (
        <Link href="/auth/signin" className="text-sm text-blue-400">
          Sign in
        </Link>
      )}
    </nav>
  );
}
