import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

interface Props {
  urlPath: string;
  icon: React.ReactNode;
  title: string;
  image: string;
  descriprion: string;
}

const ToolCard = ({ urlPath, icon, title, image, descriprion }: Props) => {
  return (
    <Link href={urlPath} className="inlineblock h-auto overflow-hidden shadow-lg ring-2 ring-white rounded-2xl ">
      <div className="relative w-[300px] h-[200px] overflow-hidden">
        {/* Background Image */}
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover z-0 overflow-hidden"
          priority
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/20 backdrop-blur-xs flex flex-col items-center justify-center text-white overflow-hidden px-4 text-center z-10">
          <div className="text-3xl mb-2">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
          <p className="text-sm mt-2">{descriprion}</p>
        </div>
      </div>
    </Link>
  );
};

export default ToolCard;
