import "./globals.css";
import Home from "./pages/Home";

export default function HomePage({children}: {children: React.ReactNode}) {
  return (
    <main className="min-h-screen">
      <Home />
    </main>
  );
}
