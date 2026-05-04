import HomeClient from "@/components/modules/Home/HomeClient";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HomeClient />
      </main>
      <Footer />
    </div>
  );
}
