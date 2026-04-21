import { useState } from "react";
import { Menu, X, ShieldCheck } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { label: "Home", href: "/" },
  { label: "Public Ledger", href: "/transactions" },
  { label: "Secretary Logs", href: "/admin-logs" },
  { label: "Request Document", href: "/request", isCta: true },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-[#8DA750]/20 shadow-sm flex flex-col transition-all">
      <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Branding */}
        <NavLink to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90">
          <div className="w-10 h-10 bg-[#E4EB9C]/40 rounded-xl flex items-center justify-center border border-[#8DA750]/20 text-[#2D5128]">
            <ShieldCheck size={24} strokeWidth={2.5} />
          </div>
          <span className="font-heading font-black text-2xl text-[#142C14] tracking-tight">
            Tuyom<span className="text-[#8DA750]">Portal</span>
          </span>
        </NavLink>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-col items-end gap-1.5">
          <span className="font-heading font-black text-sm bg-gradient-to-r from-[#142C14] to-[#537B2F] bg-clip-text text-transparent tracking-widest uppercase">
            City of Carcar, Cebu
          </span>
          <div className="flex items-center gap-6">
            {links.map((l) => (
              <NavLink
                key={l.href}
                to={l.href}
                className={({ isActive }) =>
                  l.isCta
                    ? `relative flex items-center gap-2 text-xs px-5 font-black uppercase tracking-wider bg-[#2D5128] text-white py-2.5 rounded-xl hover:bg-[#142C14] transition-all shadow-md shadow-[#142C14]/20 active:scale-[0.98]`
                    : `relative text-sm font-bold transition-colors ${isActive ? "text-[#2D5128] border-b-2 border-[#8DA750]" : "text-[#142C14]/70 hover:text-[#2D5128]"}`
                }
              >
                {l.isCta && (
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E4EB9C] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#E4EB9C]"></span>
                  </span>
                )}
                {l.label}
              </NavLink>
            ))}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button className="lg:hidden relative p-2 text-[#142C14] hover:bg-[#E4EB9C]/30 rounded-xl" onClick={() => setOpen(!open)}>
          {open ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-[#8DA750]/20 bg-white shadow-xl absolute top-full w-full p-4 space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.href}
              to={l.href}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                l.isCta
                  ? `flex items-center justify-center gap-3 w-full mt-4 mb-2 py-3.5 text-sm font-black uppercase tracking-widest bg-[#2D5128] text-white rounded-xl shadow-lg active:scale-[0.95]`
                  : `block px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${isActive ? "text-[#2D5128] bg-[#E4EB9C]/40" : "text-[#142C14]/80 hover:bg-[#E4EB9C]/20"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>
      )}
    </nav>
  );
}