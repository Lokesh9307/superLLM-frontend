// app/pages/Home.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authConfig } from "../lib/auth.config";
import { formatUsernameAsName } from "../components/EmailFormatter";
import './style.css';
import '../globals.css';
import ToolCard from "../components/ToolCard";
import Tooldata from "@/utils/toolData";

export default async function HomePage() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect("/auth/signin");
  }

  const email = session.user?.email ?? "";

  return (
    <section className="h-auto p-5 flex flex-col md:justify-start justify-center items-center flex-wrap md:gap-5 gap-3">
      <div>
        <p>Welcome, {formatUsernameAsName(email)}</p>
      </div>
      <br />
      <div className="grid md:grid-cols-3 grid-cols-1 gap-4 w-full">
        {
          Tooldata.map((tool, index) => (
            <ToolCard
              key={index}
              urlPath={tool.urlPath}
              icon={tool.icon}
              title={tool.title}
              image={tool.image}
              descriprion={tool.description}
            />
          ))
        }
      </div>
    </section>
  );
}
