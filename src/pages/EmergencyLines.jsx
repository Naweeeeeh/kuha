import React from 'react';
import { Phone, ShieldAlert, Flame, Stethoscope, Building2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function EmergencyLines() {
  // Pre-filled with standard categories for a Barangay/City level
  const emergencyContacts = [
    {
      id: 1,
      department: "Barangay Tuyom Hall",
      description: "For local barangay emergencies, tanod assistance, and general inquiries.",
      numbers: ["(032) 123-4567", "0912-345-6789"],
      icon: Building2,
      colorClass: "text-emerald-600 bg-emerald-50",
      borderClass: "border-emerald-100",
    },
    {
      id: 2,
      department: "Carcar City Police Station",
      description: "For crime reporting, accidents, and urgent security concerns.",
      numbers: ["117", "(032) 487-9111"],
      icon: ShieldAlert,
      colorClass: "text-blue-600 bg-blue-50",
      borderClass: "border-blue-100",
    },
    {
      id: 3,
      department: "Carcar Fire Station",
      description: "For fire emergencies, rescue operations, and hazardous material incidents.",
      numbers: ["(032) 487-9911", "0998-765-4321"],
      icon: Flame,
      colorClass: "text-red-600 bg-red-50",
      borderClass: "border-red-100",
    },
    {
      id: 4,
      department: "Carcar Provincial Hospital",
      description: "For medical emergencies, ambulance requests, and urgent care.",
      numbers: ["(032) 487-8888"],
      icon: Stethoscope,
      colorClass: "text-teal-600 bg-teal-50",
      borderClass: "border-teal-100",
    },
    {
      id: 5,
      department: "CDRRMO Carcar",
      description: "City Disaster Risk Reduction and Management Office for natural disasters.",
      numbers: ["(032) 487-1234"],
      icon: AlertTriangle,
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
    <div className="w-full min-h-screen bg-stone-50 py-16 px-6 font-sans">
      
      {/* Header Section */}
      <div className="max-w-7xl mx-auto text-center mb-16">
        <motion.p 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-600 font-bold text-sm uppercase tracking-widest mb-3"
        >
          Quick Response
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl md:text-5xl font-black text-stone-900 tracking-tight mb-4"
        >
          Emergency Hotlines
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-stone-500 max-w-2xl mx-auto text-lg"
        >
          In case of an emergency, please contact the appropriate department immediately. 
          Always ensure your safety first and provide clear information when calling for help.
        </motion.p>
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
              {/* Card Header with Icon */}
              <div className="flex items-center gap-4 mb-6">
                <div className={`p-4 rounded-xl ${contact.colorClass}`}>
                  <contact.icon size={28} strokeWidth={2.5} />
                </div>
                <h2 className="text-xl font-bold text-stone-800 leading-tight">
                  {contact.department}
                </h2>
              </div>
              
              {/* Description */}
              <p className="text-stone-500 text-sm mb-6 flex-1">
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
                    <div className="bg-white p-2 rounded-lg shadow-sm group-hover:scale-110 transition-transform duration-200 text-emerald-600">
                      <Phone size={16} strokeWidth={2.5} />
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