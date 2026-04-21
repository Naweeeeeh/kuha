import { Link } from 'react-router-dom';
import { ArrowRight, Building, Target, PhoneCall, ShieldCheck } from "lucide-react";

export default function Home() {
  const cards = [
    {
      icon: Building,
      title: "Our History",
      desc: "Discover the rich history and cultural heritage of our beloved barangay in Carcar City."
    },
    {
      icon: Target,
      title: "Vision & Mission",
      desc: "A progressive community promoting sustainable development and inclusivity."
    },
    {
      icon: PhoneCall,
      title: "Emergency Contact",
      desc: "Reach the Punong Barangay office directly for immediate assistance and public safety cases."
    },
  ];

  return (
    <div className="flex flex-col flex-grow bg-white pb-24">
      {/* Hero Section */}
      <section className="bg-white pb-16 md:pb-24 pt-16 overflow-hidden relative border-b border-[#8DA750]/20">
        <div className="container px-4 max-w-5xl mx-auto text-center">
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700 py-4 flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E4EB9C]/40 text-[#2D5128] text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <ShieldCheck size={14} /> Official Portal
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl leading-tight">
              <span className="font-extrabold text-slate-800 tracking-tight">
                Welcome to
              </span>
              <br />
              <span
                className="font-black tracking-tighter bg-gradient-to-r from-[#142C14] to-[#537B2F] bg-clip-text text-transparent"
                style={{ WebkitTextStroke: "1.2px transparent" }}
              >
                Barangay Tuyom.
              </span>
            </h1>

            <p className="text-muted-foreground text-lg max-w-2xl leading-relaxed text-slate-500 font-medium">
              We are committed to delivering accessible, fast, and transparent services. Request your <strong className="text-slate-900 font-black">Certificate of Indigency</strong> and other official documents digitally.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 justify-center w-full">
              <Link
                to="/request"
                className="relative group w-full sm:w-[280px] h-14 inline-flex items-center justify-center rounded-xl bg-[#2D5128] text-white font-bold transition-all hover:bg-[#142C14] hover:shadow-xl hover:shadow-[#142C14]/20 active:scale-[0.98]"
              >
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 border-2 border-white bg-red-500 shadow-sm"></span>
                </span>
                Request Document
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <a
                href="#services"
                className="w-full sm:w-[280px] h-14 inline-flex items-center justify-center rounded-xl border-2 border-[#2D5128] text-[#2D5128] font-bold transition-all hover:bg-[#E4EB9C]/30 hover:border-[#142C14] hover:text-[#142C14] active:scale-[0.98]"
              >
                View Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Grid Section matching the exact overlapping badge style */}
      <section id="services" className="container max-w-7xl mx-auto px-4 mt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((c) => (
            <div
              key={c.title}
              className="group relative bg-white rounded-[2.5rem] p-5 md:p-6 flex flex-col shadow-2xl transition-all duration-300 hover:-translate-y-2 hover:shadow-[#142C14]/50 cursor-pointer"
            >
              {/* Visual Container (Replaces Image) */}
              <div className="relative w-full h-48 mb-12 rounded-[1.8rem] overflow-hidden bg-slate-50 flex items-center justify-center border border-slate-100">
                <c.icon size={80} className="text-[#E4EB9C] opacity-50 group-hover:scale-110 transition-transform duration-700" />

                {/* Overlapping Badge */}
                <div className="absolute bottom-2 left-6 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg border-[6px] border-white z-10 group-hover:-translate-y-1 transition-transform duration-300">
                  <div className="w-full h-full bg-[#E4EB9C]/30 rounded-xl flex items-center justify-center text-[#2D5128] transition-colors group-hover:bg-[#2D5128] group-hover:text-[#E4EB9C]">
                    <c.icon size={22} strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="px-3 pb-2 flex-1 flex flex-col">
                <h3 className="font-heading font-black text-[#142C14] text-xl mb-3 leading-tight group-hover:text-[#2D5128] transition-colors">
                  {c.title}
                </h3>
                <p className="text-sm text-[#142C14]/70 leading-relaxed font-medium flex-1">
                  {c.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}