import { Link } from 'react-router-dom';
import { motion } from "framer-motion";
import { ArrowRight, Target, Heart, Leaf, Users, Shield, Zap } from "lucide-react";
import missionVisionImg from "../assets/mission-vision-img.jpg";

export default function VisionMission() {
  const visionPoints = [
    {
      icon: Target,
      title: "Community-Centered",
      desc: "A barangay where the voices of every resident matter in shaping our collective future.",
      color: "text-emerald-600",
      bg: "bg-emerald-100/80"
    },
    {
      icon: Leaf,
      title: "Sustainable Growth",
      desc: "Balancing economic development with environmental stewardship for generations to come.",
      color: "text-teal-600",
      bg: "bg-teal-100/80"
    },
    {
      icon: Heart,
      title: "Inclusive & Equitable",
      desc: "Ensuring every resident has access to opportunities, services, and support.",
      color: "text-rose-600",
      bg: "bg-rose-100/80"
    }
  ];

  const missionPoints = [
    {
      icon: Users,
      title: "Strengthen Community Bonds",
      desc: "Foster unity and cooperation through active community programs and events."
    },
    {
      icon: Shield,
      title: "Ensure Safety & Security",
      desc: "Maintain peace and order while protecting the rights and welfare of all residents."
    },
    {
      icon: Zap,
      title: "Drive Sustainable Development",
      desc: "Implement programs that promote economic growth while protecting our environment."
    },
    {
      icon: Leaf,
      title: "Promote Environmental Care",
      desc: "Lead initiatives for clean water, green spaces, and climate action."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-stone-50 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* HERO SECTION */}
      <section className="relative min-h-[80vh] flex flex-col justify-center overflow-hidden bg-[#0A2318]">
        <div className="absolute inset-0 z-0">
          <img
            src={missionVisionImg}
            alt="Vision & Mission"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A2318] via-[#0A2318]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2318]/95 via-[#0A2318]/50 to-transparent"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 w-full relative z-10 pt-8 pb-32">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.p variants={itemVariants} className="text-emerald-300 font-bold text-lg uppercase tracking-wider mb-4">
              Our Direction
            </motion.p>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-white tracking-tight leading-[1.05] mb-6">
              Vision & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-100">
                Mission
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-emerald-50 max-w-2xl leading-relaxed mb-10 font-medium">
              Guided by our commitment to progress, we envision a barangay where every resident thrives in a safe, inclusive, and sustainable community.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4">
              <Link
                to="/request"
                className="group relative inline-flex items-center justify-center gap-3 bg-emerald-500 text-white px-8 py-4 rounded-full font-bold text-lg overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(16,185,129,0.4)] focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-[#0A2318]"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                <span className="relative z-10">Learn More</span>
                <ArrowRight size={22} className="relative z-10 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-24">

        {/* VISION SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-32"
        >
          <div className="mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-emerald-600 font-bold text-lg uppercase tracking-wider mb-3"
            >
              Our Vision
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-extrabold text-stone-800 tracking-tight mb-6"
            >
              A Progressive & Inclusive Barangay Tuyom
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-stone-600 leading-relaxed max-w-3xl"
            >
              We envision Barangay Tuyom as a thriving community where sustainable development, environmental stewardship, and social inclusivity converge. A place where every resident is empowered to contribute, where opportunities abound, and where our shared commitment to progress creates lasting positive change for generations to come.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {visionPoints.map((point) => (
              <motion.div
                key={point.title}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-stone-100 overflow-hidden p-8 group cursor-default transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-2xl ${point.bg} flex items-center justify-center ${point.color} mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <point.icon size={32} strokeWidth={2} />
                </div>
                <h3 className="font-extrabold text-stone-800 text-2xl mb-3 group-hover:text-emerald-600 transition-colors">
                  {point.title}
                </h3>
                <p className="text-stone-600 text-base leading-relaxed">
                  {point.desc}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* DIVIDER */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent my-24"
        ></motion.div>

        {/* MISSION SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <div className="mb-12">
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-amber-600 font-bold text-lg uppercase tracking-wider mb-3"
            >
              Our Mission
            </motion.p>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-5xl md:text-6xl font-extrabold text-stone-800 tracking-tight mb-6"
            >
              Serbisyo Para Sa Tanan
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-xl text-stone-600 leading-relaxed max-w-3xl"
            >
              To serve all residents with integrity, transparency, and dedication. We commit to delivering responsive public services, promoting community engagement, and implementing programs that address the needs of every family while fostering pride in our barangay.
            </motion.p>
          </div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {missionPoints.map((point) => (
              <motion.div
                key={point.title}
                variants={itemVariants}
                whileHover={{ x: 8 }}
                className="bg-white rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] border border-stone-100 overflow-hidden p-8 group cursor-default transition-all duration-300"
              >
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <point.icon size={28} strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-stone-800 text-xl mb-2 group-hover:text-emerald-600 transition-colors">
                      {point.title}
                    </h3>
                    <p className="text-stone-600 text-base leading-relaxed">
                      {point.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* CTA SECTION */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="relative bg-stone-900 rounded-[3rem] p-10 md:p-16 overflow-hidden shadow-2xl mt-24"
        >
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(circle_at_top_right,_rgba(16,185,129,0.15),_transparent_60%)] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.1),_transparent_50%)] translate-y-1/3 -translate-x-1/4"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="text-center md:text-left max-w-2xl">
              <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-5 leading-tight">
                Help us achieve our vision
              </h3>
              <p className="text-stone-400 text-lg md:text-xl leading-relaxed">
                Every voice matters. Participate in community programs, share your ideas, and help us build a better barangay together.
              </p>
            </div>

            <Link
              to="/request"
              className="group w-full md:w-auto flex items-center justify-center gap-3 bg-emerald-500 text-white py-5 px-10 rounded-full font-bold text-xl shadow-[0_8px_30px_0_rgba(16,185,129,0.3)] transition-all hover:scale-105 hover:bg-emerald-400 shrink-0"
            >
              <span>Get Involved</span>
              <ArrowRight size={26} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
