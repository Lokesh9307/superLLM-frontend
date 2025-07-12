"use client";
import { signIn } from "next-auth/react";
import '../../globals.css';
import Google from '@/public/icons/google.svg';
import GitHub from '@/public/icons/github.svg';
import Image from "next/image";

export default function SignInPage() {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-10 bg-black text-white">
      <div className="flex flex-col items-center justify-center bg-black text-white p-4 ring-2 ring-white md:px-20 md:py-10 px:10 py-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Sign in</h1>

        <button
          onClick={() => signIn("google")}
          className=" text-white px-6 py-2 rounded-lg mb-4 transition ring-2 cursor-pointer"
        >
          <Image src={Google} alt="Google Logo" width={20} height={20} className="inline-block mr-2" />
          Sign in with Google
        </button>

        <span>OR</span>

        <button
          onClick={() => signIn("github")}
          className="bg-white text-black px-6 py-2 rounded-lg transition cursor-pointer"
        >
          <Image src={GitHub} alt="GitHub Logo" width={20} height={20} className="inline-block mr-2" />
          Sign in with GitHub
        </button>

      </div>
    </div>
  );
}
