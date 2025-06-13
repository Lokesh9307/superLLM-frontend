import { getServerSession } from "next-auth";
import { authConfig } from "../lib/auth.config";
import { formatUsernameAsName } from "../components/EmailFormatter";
import Image from "next/image";
import Logo from "@/public/images/logo.png";
import Link from "next/link";

export default async function Navbar() {
  const session = await getServerSession(authConfig);
  const email = session?.user?.email;
  const displayName = session?.user?.name || formatUsernameAsName(email || "");

  return (
    <nav className="flex items-center justify-between p-4 bg-gray-900 text-white border-b-2 rounded-xl shadow-lg">
      <div className="flex items-center">
        <Image src={Logo} alt="SuperLLM Logo" width={50} height={50} />
        <h1 className="text-xl font-bold">SuperLLM</h1>
      </div>
      {session ? (
        <div className="flex items-center md:space-x-4 space-x-1 login-bg text-white md:p-2 p-1 rounded-md">
          <span className="md:py-2 md:px-4 py-1 px-3 rounded-[50%] ring-2 ring-[#bde0fe] md:text-md text-[0.8rem] font-bold">{displayName.charAt(0)}</span>
          <p className="md:text-sm text-[0.7rem] font-semibold">{displayName}</p>
        </div>
      ) : (
        <Link href="/auth/signin" className="underline text-sm">
          Sign in
        </Link>
      )}
    </nav>
  );
}
