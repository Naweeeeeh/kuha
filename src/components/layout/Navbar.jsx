import React, { useState } from "react";
import { Menu, X, Lock } from "lucide-react";
import { NavLink, Link } from "react-router-dom";

export const KuhaLogo = ({ className = "w-9 h-9" }) => (
    <Link to="/" className="flex items-center gap-3 group transition-opacity hover:opacity-90 cursor-pointer">
        <svg
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            <rect width="40" height="40" rx="12" fill="#d1fae5" fillOpacity="0.8" />
            <rect x="0.5" y="0.5" width="39" height="39" rx="11.5" stroke="#34d399" strokeOpacity="0.4" />
            <path d="M14 10C12.8954 10 12 10.8954 12 12V28C12 29.1046 12.8954 30 14 30H26C27.1046 30 28 29.1046 28 28V16L22 10H14Z" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10V16H28" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M20 17V24M17 21L20 24L23 21" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="font-heading font-black text-xl tracking-tight text-stone-800">
            KUHA<span className="text-emerald-600">Portal</span>
        </span>
    </Link>
);

export default function Navbar({ isAdmin, onLogout }) {
    const [open, setOpen] = useState(false);

    const links = [
        { label: "Home", href: "/" },
        { label: "Heritage", href: "/heritage" },
        { label: "Vision & Mission", href: "/vision-mission" },
        { label: "Emergency Lines", href: "/emergency-lines" },
        { label: "Public Ledger", href: "/transactions" },
        ...(isAdmin ? [{ label: "Secretary Logs", href: "/admin" }] : []),
        { label: "Request Document", href: "/request", isCta: true },
    ];

    return (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200 shadow-sm flex flex-col transition-all">
            <div className="container max-w-6xl mx-auto px-6 py-2 flex items-center justify-between">

                <KuhaLogo/>

                <div className="hidden lg:flex flex-col items-end gap-1">
                    <div className="flex items-center gap-4">
              <span className="font-heading font-black text-[10px] bg-gradient-to-r from-emerald-800 to-emerald-500 bg-clip-text text-transparent tracking-widest uppercase mr-2">
                  Tuyom, City of Carcar, Cebu
              </span>

                        {isAdmin && (
                            <button onClick={onLogout} className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors bg-slate-50 px-2 py-1 rounded-md border border-slate-200 hover:border-red-200">
                                Admin
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-6">
                        {links.map((l) => (
                            <NavLink
                                key={l.href}
                                to={l.href}
                                className={({ isActive }) =>
                                    l.isCta
                                        ? `relative flex items-center gap-2 text-[10px] px-4 font-bold uppercase tracking-wider bg-emerald-500 text-white py-2 rounded-full hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98]`
                                        : `relative text-xs font-bold transition-colors ${isActive ? "text-emerald-700 border-b-2 border-emerald-500" : "text-stone-500 hover:text-emerald-600"}`
                                }
                            >                                {l.isCta && (
                                    <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-200 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-100"></span>
                  </span>
                                )}
                                {l.label}
                            </NavLink>
                        ))}
                    </div>
                </div>

                <button className="lg:hidden relative p-2 text-stone-800 hover:bg-emerald-50 rounded-xl" onClick={() => setOpen(!open)}>
                    {open ? <X size={26} /> : <Menu size={26} />}
                </button>
            </div>

            {open && (
                <div className="lg:hidden border-t border-stone-100 bg-white shadow-xl absolute top-full w-full p-4 space-y-1">
                    {links.map((l) => (
                        <NavLink
                            key={l.href}
                            to={l.href}
                            onClick={() => setOpen(false)}
                            className={({ isActive }) =>
                                l.isCta
                                    ? `flex items-center justify-center gap-3 w-full mt-4 mb-2 py-3.5 text-sm font-black uppercase tracking-widest bg-emerald-500 text-white rounded-xl shadow-lg active:scale-[0.95]`
                                    : `block px-4 py-3.5 text-sm font-bold rounded-xl transition-all ${isActive ? "text-emerald-700 bg-emerald-50" : "text-stone-600 hover:bg-stone-50"}`
                            }
                        >
                            {l.label}
                        </NavLink>
                    ))}
                    {isAdmin && (
                        <button onClick={() => { onLogout(); setOpen(false); }} className="w-full mt-2 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-emerald-100 bg-emerald-700 py-3 rounded-xl">
                            Admin
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
}