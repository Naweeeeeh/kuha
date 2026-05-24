import React from 'react';

import { motion } from 'framer-motion';
import carcarImg from '../assets/carcar.jpg';

export default function EmergencyLines() {
  const emergencyContacts = [
    {
      id: 1,
      department: "Tuyom Barangay Hall",
      description: "For local barangay emergencies, tanod assistance, and general inquiries.",
      numbers: ["(049) 357 5689", "0929 444 7161"],
      colorClass: "text-emerald-600 bg-emerald-50",
      borderClass: "border-emerald-100",
    },
    {
      id: 2,
      department: "Carcar City Police Station",
      description: "For crime reporting, accidents, and urgent security concerns.",
      numbers: ["(032) 487 8886", "(032) 266 9191"],
      colorClass: "text-blue-600 bg-blue-50",
      borderClass: "border-blue-100",
    },
    {
      id: 3,
      department: "Carcar Fire Station",
      description: "For fire emergencies, rescue operations, and hazardous material incidents.",
      numbers: ["0995 367 7872"],
      colorClass: "text-red-600 bg-red-50",
      borderClass: "border-red-100",
    },
    {
      id: 4,
      department: "Carcar Provincial Hospital",
      description: "For medical emergencies, ambulance requests, and urgent care.",
      numbers: ["(032) 487-8120", "(032) 487-8125"],
      colorClass: "text-teal-600 bg-teal-50",
      borderClass: "border-teal-100",
    },
    {
      id: 5,
      department: "CDRRMO Carcar",
      description: "City Disaster Risk Reduction and Management Office for natural disasters.",
      numbers: ["(032) 345 6423", "0929 444 7161"],
      colorClass: "text-orange-600 bg-orange-50",
      borderClass: "border-orange-100",
    }
  ];

  // Framer Motion Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-stone-50 to-emerald-100/50 font-sans selection:bg-emerald-200 selection:text-emerald-900">

      {/* Hero Image Section */}
      <div className="w-full h-[40vh] md:h-[50vh] relative mb-16">
        <img
          src={carcarImg}
          alt="Emergency Lines"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-stone-900/60 flex flex-col items-center justify-center text-center p-6">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-400 font-bold text-sm uppercase tracking-widest mb-3"
          >
            Quick Response
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4"
          >
            Emergency Hotlines
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-stone-200 max-w-2xl mx-auto text-lg"
          >
            In case of an emergency, please contact the appropriate department immediately.
            Always ensure your safety first and provide clear information when calling for help.
          </motion.p>
        </div>
      </div>

      {/* Grid Section */}
      <div className="max-w-7xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {emergencyContacts.map((contact) => (
            <motion.div
              key={contact.id}
              variants={cardVariants}
              className={`bg-white rounded-2xl p-8 border-5 ${contact.borderClass} shadow-sm hover:shadow-md transition-shadow duration-300 flex flex-col`}
            >
              {/* Card Header */}
              <div className="flex items-center gap-4 mb-6">
                <h2 className="text-xl font-bold text-stone-800 leading-tight">
                  {contact.department}
                </h2>
              </div>

              {/* Description */}
              <p className="text-stone-600 text-sm mb-6 flex-1">
                {contact.description}
              </p>

              {/* Phone Numbers Map */}
              <div className="space-y-3">
                {contact.numbers.map((number, index) => (
                  <a
                    key={index}
                    href={`tel:${number.replace(/[^0-9]/g, '')}`}
                    className="group flex items-center justify-between p-4 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors duration-200"
                  >
                    <span className="font-bold text-stone-700 tracking-wide">
                      {number}
                    </span>
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200 text-emerald-600 text-xs font-bold uppercase tracking-widest">
                      Call
                    </div>
                  </a>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  );
}