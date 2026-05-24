export default function Footer() {
  return (
    <footer className="bg-[#142C14] py-10 border-t-4 border-[#2D5128] mt-auto">
      <div className="container max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="font-heading font-black text-2xl tracking-tight text-[#E4EB9C]">
            Barangay Tuyom
          </p>
          <p className="text-sm font-medium text-[#E4EB9C]/70 mt-1">
            Delivering accessible, fast, and transparent digital services.
          </p>
        </div>
        <div className="text-center md:text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8DA750] mb-1">
            Carcar City, Cebu
          </p>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#8DA750] mb-1">
            © {new Date().getFullYear()} Official Portal
          </p>
        </div>
      </div>
    </footer>
  );
}
