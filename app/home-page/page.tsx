import './style.css';
import '../globals.css';
import Tooldata from "@/utils/toolData";
import AIToolCard from "../components/ToolCard";
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authConfig } from '../lib/auth.config';

export default async function HomePage() {
  // Uncomment when auth is needed
   const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <main className="min-h-screen w-full bg-black px-6 py-12 text-white">
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold">AI Tools</h1>
        <p className="text-lg text-gray-400 mt-2">
          Supercharge your workflow with intelligent tools
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {Tooldata.map((tool, index) => (
          <AIToolCard
            key={index}
            icon={tool.icon}
            title={tool.title}
            description={tool.description}
            urlPath={tool.urlPath}
          />
        ))}
      </div>
    </main>
  );
}
