import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50 selection:bg-[#E4EB9C] selection:text-[#142C14]">
      <Navbar />
      <main className="flex-1 flex flex-col relative w-full">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/texture.png')] bg-repeat mix-blend-overlay pointer-events-none z-0"></div>
        <div className="relative z-10 flex-1 flex flex-col">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
