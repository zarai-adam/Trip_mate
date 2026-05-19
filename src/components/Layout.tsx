import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { motion, AnimatePresence } from "motion/react";
import { useLocation } from "react-router-dom";

export default function Layout() {
  const location = useLocation();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-mesh selection:bg-forest selection:text-white">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
