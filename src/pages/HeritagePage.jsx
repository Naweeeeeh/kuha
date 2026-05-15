import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, MapPin } from "lucide-react";

// Import images from your assets folder
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
      subtext: "Walk the very shores that breathed life into modern Cebuano fiction. Known reverently as the \"Father of Modern Cebuano Literature,\" Marcel Navarra transformed the quiet, sun-drenched landscapes of Tuyom into the backdrop for some of the most influential stories in the Philippine canon. His pioneering use of realism allowed the everyday struggles, triumphs, and humors of the local fisherfolk and farmers to take center stage, forever dignifying the Visayan identity on the printed page. To visit Tuyom is to walk through a living library, where the salt air and the rustle of the palms still echo the rhythmic prose of Navarra’s most cherished works.\n\nFor the literary traveler and the culturally curious, Tuyom offers a rare chance to see the world through a master storyteller’s eyes. As you explore the barangay's coastal stretches and heritage sites, you aren't just seeing a beach; you are experiencing the \"Tuyom\" of Navarra’s imagination—a place where tradition meets the complexities of the modern world. We invite you to sit by the water, open a collection of his stories, and feel the deep, intellectual pulse of a community that served as the muse for a literary revolution. Discover the soul of Cebuano letters in the place where it all began."
    },
    {
      id: 3,
      image: image3,
      category: "Heritage Site",
      heading: "Daanglungsod",
      subtext: "Step onto the hallowed grounds of Daanglungsod, the original heart of Carcar. Long before the city center moved inland, this coastal stretch in Tuyom served as the primary settlement for the early Carcaranons. Known as the \"Old Town,\" Daanglungsod is a landscape where history is etched into the very soil. It was here that the first community took root, braving the elements and the tides to establish a bustling seaside village. Today, walking through this area feels like a journey through time, offering visitors a rare glimpse into the foundational years of one of Cebu’s most storied cities.\n\nAs you wander through the quiet lanes of Daanglungsod, you are walking the same paths as the ancestors who built Carcar’s enduring legacy. This area is a living testament to resilience, marking the site where the community once thrived before relocating to seek refuge from the pirate raids of the colonial era. For history enthusiasts and cultural explorers, Daanglungsod provides a profound sense of place—a quiet, reflective corner of Tuyom where the echoes of the past meet the gentle sea breeze. It is a must-visit destination for anyone seeking to understand the true origins and the seafaring soul of the region."
    },
    {
      id: 4,
      image: image4,
      category: "Religious Heritage",
      heading: "The Inayangan Visita Ruins",
      subtext: "Nestled near the historic borders of Tuyom lies the Inayangan Visita Ruins, a site that whispers the stories of Carcar’s earliest spiritual awakening. These weathered foundations mark the location of one of the first visitas, or mission chapels, established by Augustinian friars in the late 16th century. Long before the grand stone cathedrals of the city center were even a blueprint, these humble walls served as the religious and social anchor for the coastal settlers of the \"Old Town.\" Today, the moss-covered stones stand as a sacred portal to the past, inviting visitors to reflect on the deep-rooted faith and endurance of a community that stood its ground against the tides of time and colonial transition.\n\nA visit to the Inayangan ruins is a journey into the \"hidden\" heritage of the region, offering a serene and contemplative atmosphere far from the usual tourist trails. As you stand among the remnants of this ancient sanctuary, you are touching the very bedrock of Cebuano history—a place where indigenous culture and Spanish influence first converged. For those who seek to discover the authentic, unvarnished soul of Tuyom, these ruins provide a powerful connection to the ancestors who gathered here for strength and solace. It is an essential stop for heritage seekers looking to uncover the foundational chapters of the Carcaranon narrative."
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
      subtext: "Embark on a culinary journey that captures the very essence of the Bohol Strait with the Sea-Inspired Cuisine of Tuyom. Here, the \"catch of the day\" is more than a meal—it is a celebration of the barangay’s deep-rooted maritime heritage. Local kitchens have perfected the art of the kinilaw and tinowa, using traditional methods that highlight the absolute freshness of the sea’s bounty. But the true star of the local table is the Tuyom (sea urchin), the very namesake of the barangay. Served fresh from the reefs, these \"jewels of the sea\" offer a delicate, buttery richness that has sustained and delighted locals for centuries, making every bite a direct connection to the coastal waters that define this community.\n\nDining in Tuyom is an invitation to slow down and savor the authentic spirit of the \"Old Town.\" As you enjoy a feast by the shore, you are participating in a timeless ritual that links the modern traveler to the generations of fisherfolk who first settled these banks. The unique flavors found here—salty, tangy, and profoundly fresh—reflect a culture that respects the ocean's rhythm and rewards those who live by its tides. For the adventurous foodie and the cultural explorer alike, a taste of Tuyom’s sea-inspired offerings provides a sensory map of the region’s history, served with the warm hospitality and seaside charm that only this historic barangay can provide."
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

  return (
    <div className="flex flex-col w-full bg-stone-900">
      <div className="relative w-full h-[600px] md:h-[700px] lg:h-[800px] overflow-hidden">
        
        {/* Background Image */}
        <img 
          src={slideData[currentIndex].image} 
          alt={slideData[currentIndex].heading}
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-700"
        />
        
        {/* Floating Text Box Overlay */}
        <div className="absolute right-4 sm:right-12 md:right-20 lg:right-32 top-8 bottom-8 md:top-12 md:bottom-12 w-[90%] sm:w-[75%] md:w-[50%] lg:w-[40%] bg-gradient-to-br from-emerald-500/60 to-emerald-800/70 backdrop-blur-md flex flex-col justify-start overflow-y-auto shadow-2xl rounded-2xl md:rounded-3xl transition-all duration-500 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          
          {/* Inner Content Wrapper for consistent padding */}
          <div className="p-8 md:p-10 flex flex-col w-full h-full">
            <div className="w-10 h-1.5 bg-emerald-300 rounded-full mb-5 shrink-0 mt-auto pt-4 md:pt-0"></div>
            <span className="inline-flex w-fit items-center gap-1.5 px-3 py-1 mb-4 text-[10px] font-black uppercase tracking-widest text-emerald-900 bg-emerald-100/90 rounded-md shrink-0">
              <MapPin size={12} strokeWidth={2.5} />
              {slideData[currentIndex].category}
            </span>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight mb-4 shrink-0 drop-shadow-sm">
              {slideData[currentIndex].heading}
            </h2>
            <p className="text-sm sm:text-base text-emerald-50 font-medium leading-relaxed whitespace-pre-line break-words drop-shadow-sm pb-4 md:pb-0 mb-auto">
              {slideData[currentIndex].subtext}
            </p>
          </div>
        </div>
        
        {/* Navigation */}
        <button 
          onClick={handlePrevious}
          className="absolute z-10 left-2 md:left-8 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors focus:outline-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-transform"
          aria-label="Previous"
        >
          <ArrowLeft size={48} strokeWidth={2.5} className="md:w-14 md:h-14" />
        </button>
        
        <button 
          onClick={handleNext}
          className="absolute z-10 right-2 md:right-8 top-1/2 -translate-y-1/2 p-2 text-white/80 hover:text-white transition-colors focus:outline-none drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] hover:scale-110 active:scale-95 transition-transform"
          aria-label="Next"
        >
          <ArrowRight size={48} strokeWidth={2.5} className="md:w-14 md:h-14" />
        </button>
        
      </div>
    </div>
  );
}