'use client';
import React from 'react';
import '../globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { IoIosArrowForward } from "react-icons/io";

const Home = () => {
  const url = "https://ucarecdn.com/25c9aa63-5402-489d-9ac8-fefa13bb1cef/hero.jpg";

  return (
    <div className="h-screen w-full flex md:flex-row flex-col items-center justify-center relative">

      {/* ✅ Background Image only on mobile */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat md:hidden"
        style={{ backgroundImage: `url(${url})` }}
      >
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* ✅ Desktop Left Space (blank or optional image) */}
      <div className="hidden md:flex items-center justify-center">
        <Image
          src={url}
          alt="Background Image"
          className="object-cover h-full"
          width={300}
          height={300}
        />
      </div>

      {/* ✅ Text Content */}
      <div className="z-10 px-4 md:w-1/2 flex flex-col gap-3 justify-center items-center md:items-start text-center md:text-left">
        <h1 className="md:text-5xl text-3xl font-bold text-white">𝔗𝔥𝔢 𝔣𝔲𝔱𝔲𝔯𝔢 𝔥𝔞𝔰 𝔠𝔬𝔪𝔢</h1>
        <p className="md:text-2xl text-xl mt-4 text-white">
          <span className="custom-gradient px-2 py-1 rounded-xl text-black">SυρҽɾLLM</span> 𝔦𝔰 𝔞 𝔭𝔩𝔞𝔱𝔣𝔬𝔯𝔪 𝔱𝔥𝔞𝔱 𝔞𝔩𝔩𝔬𝔴𝔰 𝔶𝔬𝔲 𝔱𝔬 𝔪𝔞𝔨𝔢 𝔶𝔬𝔲𝔯 𝔩𝔦𝔣𝔢 𝔰𝔪𝔞𝔯𝔱 𝔞𝔫𝔡 𝔢𝔞𝔰𝔶.
        </p>
        <span className="mt-5 flex items-center">
          <Link
            href="/home-page"
            className="w-auto text-xl px-4 py-2 ring-2 ring-white/50 rounded-xl text-white bg-white/10 backdrop-blur"
          >
            Let's Explore <IoIosArrowForward className="inline ml-2" />
          </Link>
        </span>
      </div>
    </div>
  );
};

export default Home;
