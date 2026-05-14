import { Link } from 'react-router-dom';
import { ArrowRight, Building, Target, PhoneCall, FileText, ChevronDown, MapPin, Users, Heart } from "lucide-react";
import { motion } from "framer-motion";
import barangayLandscape from '../assets/barangaylandscape.png';

export default function Home() {
  const cards = [
    {
      icon: Building,
      title: "Our Heritage",
      desc: "Explore the rich history and cultural landmarks of our beloved barangay.",
      imgUrl: "https://images.unsplash.com/photo-1518998053401-b264d50ebf92?q=80&w=600&auto=format&fit=crop",
      iconColor: "text-emerald-600",
      iconBg: "bg-emerald-100/80",
      href: "/heritage"
    },
    {
      icon: Target,
      title: "Vision & Mission",
      desc: "A progressive community promoting sustainable development and inclusivity.",
      imgUrl: "https://images.unsplash.com/photo-1523531294919-4bab31a28a38?q=80&w=600&auto=format&fit=crop",
      iconColor: "text-amber-600",
      iconBg: "bg-amber-100/80"
    },
    {
      icon: PhoneCall,
      title: "Emergency Lines",
      desc: "Reach the Punong Barangay office directly for immediate assistance.",
      imgUrl: "https://images.unsplash.com/photo-1584061806338-79549f425bce?q=80&w=600&auto=format&fit=crop",
      iconColor: "text-rose-600",
      iconBg: "bg-rose-100/80"
    },
  ];

  const stats = [
    { label: "Residents", value: "12,450+", icon: Users },
    { label: "Puroks", value: "8", icon: MapPin },
    { label: "Community Programs", value: "24+", icon: Heart },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans pb-24 selection:bg-emerald-200 selection:text-emerald-900">

      {/* HERO SECTION */}
      <section className="relative min-h-[85vh] flex flex-col justify-center overflow-hidden bg-[#0A2318]">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src={barangayLandscape}
            alt="Barangay Landscape"
            className="w-full h-full object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2318] via-[#0A2318]/70 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2318]/90 via-[#0A2318]/40 to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 w-full relative z-10 pt-8 pb-32">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              Maayong Adlaw, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-100">
                Barangay Tuyom
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-emerald-50 max-w-xl leading-relaxed mb-10 font-medium">
              Serbisyo para sa tanan. Experience a progressive, inclusive, and sustainable community where every resident matters.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <Link
                to="/request"
                className="group relative inline-flex items-center justify-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0A2318]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <FileText size={22} className="relative z-10" />
                <span className="relative z-10">Request Document</span>
                <ArrowRight size={22} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={24} />
          </motion.div>
        </motion.div>
      </section>

      {/* STATS SECTION (Floating over hero transition) */}
      <div className="max-w-6xl mx-auto px-6 relative z-20 -mt-16 mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white/95 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] border border-white flex items-center gap-6 transition-transform hover:-translate-y-1">
              <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0 shadow-inner">
                <stat.icon size={32} strokeWidth={2} />
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-extrabold text-stone-800 tracking-tight">{stat.value}</div>
                <div className="text-sm font-semibold text-stone-500 uppercase tracking-wider mt-1">{stat.label}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* MAIN CONTENT AREA */}
      <div className="max-w-6xl mx-auto px-6">

        {/* QUICK ACTION CARD (Moved near top for easy access) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7 }}
          className="relative bg-stone-900 rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl mb-24"
        >
          {/* Decorative background elements */}
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.15),_transparent_60%)] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.1),_transparent_50%)] translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
                Need official documents?
              </h2>
              <p className="text-stone-400 text-lg md:text-xl leading-relaxed">
                Request your barangay clearance, indigency, and residency online without the hassle. Fast, secure, and ready when you are.
              </p>
            </div>

            <Link
              to="/request"
              className="group w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 text-white py-5 px-10 rounded-full font-bold text-xl shadow-[0_8px_30px_0_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:bg-emerald-400 shrink-0"
            >
              <FileText size={26} className="group-hover:scale-110 transition-transform" />
              <span>Start Request</span>
              <ArrowRight size={26} className="ml-1 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

        {/* EXPLORE SECTION */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-3 mb-4"
              >
                <span className="w-10 h-[2px] bg-emerald-500"></span>
                <h2 className="text-sm font-bold text-emerald-600 uppercase tracking-widest">
                  Discover
                </h2>
              </motion.div>
              <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl md:text-5xl font-extrabold text-stone-800 tracking-tight"
              >
                Explore Barangay Tuyom
              </motion.h3>
            </div>
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-emerald-600 font-bold hover:text-emerald-700 flex items-center gap-2 group transition-colors text-lg"
            >
              View all programs
              <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
            </motion.button>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {cards.map((c, i) => (
              <motion.div key={c.title} variants={itemVariants} whileHover={{ y: -8 }}>
                {c.href ? (
                  <Link
                    to={c.href}
                    className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-stone-100 overflow-hidden flex flex-col group cursor-pointer transition-shadow duration-300"
                  >
                    <div className="h-64 w-full relative overflow-hidden bg-stone-200">
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <img
                        src={c.imgUrl}
                        alt={c.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-5 right-5 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl z-20 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                        <div className={`${c.iconColor}`}>
                          <c.icon size={26} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1 relative bg-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150 opacity-50"></div>

                      <h4 className="font-extrabold text-stone-800 text-2xl mb-3 group-hover:text-emerald-600 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-stone-500 text-base leading-relaxed flex-1">
                        {c.desc}
                      </p>

                      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-stone-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">
                        Learn more
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-stone-100 overflow-hidden flex flex-col group cursor-pointer transition-shadow duration-300">
                    <div className="h-64 w-full relative overflow-hidden bg-stone-200">
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity duration-500"></div>
                      <img
                        src={c.imgUrl}
                        alt={c.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute top-5 right-5 p-3.5 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl z-20 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                        <div className={`${c.iconColor}`}>
                          <c.icon size={26} strokeWidth={2.5} />
                        </div>
                      </div>
                    </div>

                    <div className="p-8 flex flex-col flex-1 relative bg-white">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-stone-50 rounded-bl-full -z-10 transition-transform duration-700 group-hover:scale-150 opacity-50"></div>

                      <h4 className="font-extrabold text-stone-800 text-2xl mb-3 group-hover:text-emerald-600 transition-colors">
                        {c.title}
                      </h4>
                      <p className="text-stone-500 text-base leading-relaxed flex-1">
                        {c.desc}
                      </p>

                      <div className="mt-8 flex items-center gap-2 text-sm font-bold text-stone-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest">
                        Learn more
                        <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
}