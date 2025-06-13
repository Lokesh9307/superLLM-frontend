import "./globals.css";
import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import Footer from "./pages/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Home />
      <div className="fixed bottom-10 left-0 w-full">
        <Footer />
      </div>
    </main>
  );
}
