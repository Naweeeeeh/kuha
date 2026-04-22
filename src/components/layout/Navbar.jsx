import React, { useState } from "react";
import { Menu, X, Lock } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export const KuhaLogo = ({ className = "w-10 h-10" }) => (
    <Link to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90 cursor-pointer">
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="40" height="40" rx="12" fill="#E4EB9C" fillOpacity="0.4" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="11.5" stroke="#8DA750" strokeOpacity="0.2" />
            <path d="M14 10C12.8954 10 12 10.8954 12 12V28C12 29.1046 12.8954 30 14 30H26C27.1046 30 28 29.1046 28 28V16L22 10H14Z" stroke="#2D5128" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10V16H28" stroke="#2D5128" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 17V24M17 21L20 24L23 21" stroke="#8DA750" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-heading font-black text-2xl tracking-tight text-[#142C14]">
            KUHA<span className="text-[#8DA750]">Portal</span>
        </span>
    </Link>
);

export default function Navbar({ isAdmin, onLogout }) {
    const [open, setOpen] = useState(false);

    // Dynamically build links based on Admin Status
    const links = [
        { label: "Home", href: "/" },
        { label: "Public Ledger", href: "/transactions" },
        ...(isAdmin ? [{ label: "Secretary Logs", href: "/admin-logs" }] : []),
        { label: "Request Document", href: "/request", isCta: true },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-[#8DA750]/20 shadow-sm flex flex-col transition-all">
            <div className="container max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

                <KuhaLogo/>

                <div className="hidden lg:flex flex-col items-end gap-1.5">
                    <div className="flex items-center gap-4">
              <span className="font-heading font-black text-sm bg-gradient-to-r from-[#142C14] to-[#537B2F] bg-clip-text text-transparent tracking-widest uppercase mr-2">
                  Tuyom, City of Carcar, Cebu
              </span>

                        {/* Admin Lock Button */}
                        {isAdmin && (
                            <button onClick={onLogout} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors bg-slate-50 px-2 py-1 rounded-md border border-slate-200 hover:border-red-200">
                                <Lock size={12} /> Lock System
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-6 mt-1">
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

                <button className="lg:hidden relative p-2 text-[#142C14] hover:bg-[#E4EB9C]/30 rounded-xl" onClick={() => setOpen(!open)}>
                    {open ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

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
                    {isAdmin && (
                        <button onClick={() => { onLogout(); setOpen(false); }} className="w-full mt-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-red-500 bg-red-50 py-3 rounded-xl">
                            <Lock size={14} /> Lock System
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}