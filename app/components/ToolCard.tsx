import Link from "next/link";
import { FC } from "react";

interface AIToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  urlPath: string;
}

const AIToolCard: FC<AIToolCardProps> = ({ icon, title, description, urlPath }) => {
  return (
    <div
      className="rounded-2xl p-6 shadow-lg border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:shadow-xl transition duration-300 flex flex-col justify-between h-full"
    >
      {/* Icon + Title */}
      <div className="flex items-center gap-4 mb-4">
        <div className="text-3xl text-white">{icon}</div>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 flex-grow mb-6">{description}</p>

      {/* Button */}
      <Link
        href={urlPath}
        className="mt-auto w-fit bg-white text-black font-medium py-2 px-4 rounded-md hover:bg-gray-200 transition"
      >
        Try Now
      </Link>
    </div>
  );
};

export default AIToolCard;
