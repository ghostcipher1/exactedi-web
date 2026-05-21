import { Outlet } from "react-router-dom";
import Navbar from "@/pages/home/components/Navbar";
import Footer from "@/pages/home/components/Footer";

export default function DevDocsLayout() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Outlet />
      <Footer />
    </main>
  );
}
