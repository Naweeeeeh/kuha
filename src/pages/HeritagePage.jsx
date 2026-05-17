import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";

import image1 from "../assets/tower.png";
import image2 from "../assets/navarra.png";
import image3 from "../assets/daanglungsod.png"; 
import image4 from "../assets/ruins.png";
import image5 from "../assets/fishing.png";
import image6 from "../assets/urchin.png";

export default function HeritagePage() {
  const slideData = [
    {
      id: 1,
      image: image1,
      category: "Historical Landmark",
      heading: "Bantayan sa Hari",
      subtext: "Standing as a silent witness to centuries of maritime history, the Bantayan sa Hari in Tuyom is more than just a ruin; it is a monument to the resilience of the Carcaranon people. Built during the Spanish colonial era as part of a strategic coastal defense system, this watchtower served as the eyes of the community, scanning the horizon for the sails of marauding pirates. Today, its weathered coral stone walls offer a poignant connection to the past, inviting visitors to step back in time and imagine the watchful sentinels who once protected these golden shores from the uncertainty of the sea.\n\nBeyond its historical significance, the Bantayan sa Hari offers a serene escape where heritage meets the natural beauty of the Cebuano coastline. As the sun rises over the Bohol Strait, the ancient structure is bathed in a warm glow, providing a picturesque backdrop for photographers, history buffs, and soul-seekers alike. Whether you are exploring the literary trails of the famous Cebuano writers who were inspired by these views or simply enjoying the rhythmic lap of the waves against the shore, a visit to this iconic landmark is a journey into the heart of Carcar’s enduring spirit."
    },
    {
      id: 2,
      image: image2,
      category: "Literary Heritage",
      heading: "The Legacy of Marcel Navarra",
      subtext: "Walk the very shores that breathed life into modern Cebuano fiction. Known reverently as the \"Father of Modern Cebuano Literature,\" Marcel Navarra transformed the quiet, sun-drenched landscapes of Tuyom into the backdrop for some of the most influential stories in the Philippine canon. His pioneering use of realism allowed the everyday struggles, triumphs, and humors of the local fisherfolk and farmers to take center stage, forever dignifying the Visayan identity on the printed page. To visit Tuyom is to walk through a living library, where the salt air and the rustle of the palms still echo the rhythmic prose of Navarra’s most cherished works.\n\nFor the literary traveler and the culturally curious, Tuyom offers a rare chance to see the world through a master storyteller’s eyes. As you explore the barangay's coastal stretches and heritage sites, you aren't just seeing a beach; you are experiencing the \"Tuyom\" of Navarra’s imagination, a place where tradition meets the complexities of the modern world. We invite you to sit by the water, open a collection of his stories, and feel the deep, intellectual pulse of a community that served as the muse for a literary revolution. Discover the soul of Cebuano letters in the place where it all began."
    },
    {
      id: 3,
      image: image3,
      category: "Heritage Site",
      heading: "Daanglungsod",
      subtext: "Step onto the hallowed grounds of Daanglungsod, the original heart of Carcar. Long before the city center moved inland, this coastal stretch in Tuyom served as the primary settlement for the early Carcaranons. Known as the \"Old Town,\" Daanglungsod is a landscape where history is etched into the very soil. It was here that the first community took root, braving the elements and the tides to establish a bustling seaside village. Today, walking through this area feels like a journey through time, offering visitors a rare glimpse into the foundational years of one of Cebu’s most storied cities.\n\nAs you wander through the quiet lanes of Daanglungsod, you are walking the same paths as the ancestors who built Carcar’s enduring legacy. This area is a living testament to resilience, marking the site where the community once thrived before relocating to seek refuge from the pirate raids of the colonial era. For history enthusiasts and cultural explorers, Daanglungsod provides a profound sense of place. A quiet, reflective corner of Tuyom where the echoes of the past meet the gentle sea breeze. It is a must-visit destination for anyone seeking to understand the true origins and the seafaring soul of the region."
    },
    {
      id: 4,
      image: image4,
      category: "Religious Heritage",
      heading: "The Inayangan Visita Ruins",
      subtext: "Nestled near the historic borders of Tuyom lies the Inayangan Visita Ruins, a site that whispers the stories of Carcar’s earliest spiritual awakening. These weathered foundations mark the location of one of the first visitas, or mission chapels, established by Augustinian friars in the late 16th century. Long before the grand stone cathedrals of the city center were even a blueprint, these humble walls served as the religious and social anchor for the coastal settlers of the \"Old Town.\" Today, the moss-covered stones stand as a sacred portal to the past, inviting visitors to reflect on the deep-rooted faith and endurance of a community that stood its ground against the tides of time and colonial transition.\n\nA visit to the Inayangan ruins is a journey into the \"hidden\" heritage of the region, offering a serene and contemplative atmosphere far from the usual tourist trails. As you stand among the remnants of this ancient sanctuary, you are touching the very bedrock of Cebuano history, a place where indigenous culture and Spanish influence first converged. For those who seek to discover the authentic, unvarnished soul of Tuyom, these ruins provide a powerful connection to the ancestors who gathered here for strength and solace. It is an essential stop for heritage seekers looking to uncover the foundational chapters of the Carcaranon narrative."
    },
    {
      id: 5,
      image: image5,
      category: "Maritime Culture",
      heading: "Traditional Fishing Artisanship",
      subtext: "Experience the heartbeat of the coast through the Traditional Fishing Artisanship of Tuyom, where the ancient rhythms of the sea are preserved by the hands of master craftsmen. For centuries, the identity of this barangay has been woven into the very nets cast upon its waters. Here, the art of pangisda is not merely a job, but a cherished heritage passed down through generations. Visitors can witness the meticulous skill of net-mending and the crafting of traditional outrigger boats, known as bangka, which continue to dot the horizon just as they did for the ancestors of the \"Old Town.\" It is a living exhibition of human ingenuity and a profound respect for the ocean’s bounty.\n\nBeyond the technical skill, Tuyom’s maritime culture offers a window into the soul of a community that lives in harmony with the tides. To observe the fishermen returning with their \"catch of the day\" is to see a vibrant tradition in motion, a culture defined by patience, resilience, and a deep, intuitive knowledge of the Bohol Strait. For the traveler seeking an authentic encounter with Cebuano life, engaging with Tuyom’s fishing traditions provides a sensory journey into the sights, sounds, and flavors of the sea. Come and discover the enduring legacy of a people whose lives are beautifully tethered to the water, offering a glimpse into the timeless maritime spirit of Carcar."
    },
    {
      id: 6,
      image: image6,
      category: "Culinary Heritage",
      heading: "The Sea-Inspired Flavors of Tuyom",
      subtext: "Embark on a culinary journey that captures the very essence of the Bohol Strait with the Sea-Inspired Cuisine of Tuyom. Here, the \"catch of the day\" is more than a meal, it is a celebration of the barangay’s deep-rooted maritime heritage. Local kitchens have perfected the art of the kinilaw and tinowa, using traditional methods that highlight the absolute freshness of the sea’s bounty. But the true star of the local table is the Tuyom (sea urchin), the very namesake of the barangay. Served fresh from the reefs, these \"jewels of the sea\" offer a delicate, buttery richness that has sustained and delighted locals for centuries, making every bite a direct connection to the coastal waters that define this community.\n\nDining in Tuyom is an invitation to slow down and savor the authentic spirit of the \"Old Town.\" As you enjoy a feast by the shore, you are participating in a timeless ritual that links the modern traveler to the generations of fisherfolk who first settled these banks. The unique flavors found here are salty, tangy, and profoundly fresh, reflects a culture that respects the ocean's rhythm and rewards those who live by its tides. For the adventurous foodie and the cultural explorer alike, a taste of Tuyom’s sea-inspired offerings provides a sensory map of the region’s history, served with the warm hospitality and seaside charm that only this historic barangay can provide."
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? slideData.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === slideData.length - 1 ? 0 : prevIndex + 1
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } 
    },
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-emerald-300 via-teal-200 to-white font-sans flex flex-col">

      <section className="relative flex flex-col justify-center pt-20">
        <div className="max-w-6xl mx-auto px-6 w-full">
          <motion.div
            initial="hidden"
            animate="show"
            variants={containerVariants}
            className="max-w-3xl"
          >
            <motion.p variants={itemVariants} className="text-emerald-800 font-extrabold text-lg uppercase tracking-widest mb-4">
              Our Legacy
            </motion.p>

            <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl lg:text-8xl font-black text-stone-900 tracking-tight leading-[1.05] mb-8 drop-shadow-sm">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-800 via-teal-700 to-emerald-900">
                Tuyom's
              </span> <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E17100] via-[#FF9F43] to-[#E17100]">
                Heritage
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-emerald-900 max-w-2xl leading-relaxed font-medium">
              Discover the rich history, vibrant culture, and timeless traditions that shape the soul of our coastal community.
            </motion.p>
          </motion.div>
        </div>
      </section>

      <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-transparent via-emerald-800 to-transparent my-25"
        ></motion.div>

      <section className="w-full flex flex-col relative pb-8">
        
        <div className="w-full flex-1 flex items-center justify-center relative px-16 md:px-24">

          <button 
            onClick={handlePrevious}
            className="absolute z-20 left-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-all focus:outline-none hover:scale-105 active:scale-95"
            aria-label="Previous"
          >
            <ArrowLeft size={32} strokeWidth={2.5} />
          </button>

          <div className="w-full max-w-7xl h-[65vh] flex flex-col md:flex-row gap-8 md:gap-12">

            <div className="w-full md:w-1/2 h-full rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white">
              <img 
                key={currentIndex} 
                src={slideData[currentIndex].image}
                alt={slideData[currentIndex].heading}
                className="w-full h-full object-cover transition-opacity duration-700"
              />
            </div>

            <div className="w-full md:w-1/2 h-full bg-white border-4 border-white rounded-3xl p-8 md:p-12 flex flex-col shadow-xl overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-stone-300 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 mb-6 text-xs font-bold uppercase tracking-widest text-emerald-700 bg-emerald-50 rounded-md">
                <MapPin size={14} strokeWidth={2.5} />
                {slideData[currentIndex].category}
              </span>
              
              <h2 className="text-3xl md:text-5xl font-black text-stone-900 tracking-tight mb-6 leading-tight">
                {slideData[currentIndex].heading}
              </h2>
              
              <p className="text-base md:text-lg text-stone-700 leading-relaxed whitespace-pre-line break-words text-justify">
                {slideData[currentIndex].subtext}
              </p>
            </div>

          </div>

          {/* Right Navigation Arrow */}
          <button 
            onClick={handleNext}
            className="absolute z-20 right-6 top-1/2 -translate-y-1/2 w-14 h-14 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white/90 hover:text-white transition-all focus:outline-none hover:scale-105 active:scale-95"
            aria-label="Next"
          >
            <ArrowRight size={32} strokeWidth={2.5} />
          </button>

        </div>

        {/* Carousel Indicators */}
        <div className="flex justify-center items-center h-16 mt-8 gap-3">
          {slideData.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`h-3 rounded-full transition-all duration-500 shadow-sm ${
                index === currentIndex 
                  ? 'bg-stone-800 w-10' 
                  : 'bg-white hover:bg-stone-400 w-3'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
        
      </section>

    </div>
  );
}