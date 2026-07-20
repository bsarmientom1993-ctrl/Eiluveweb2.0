"use client";

export default function PiePagina() {
  return (
    <footer className="bg-[#03060a] py-10 border-t border-[#735f3d]/20 text-center relative mt-auto">
      {/* SVG decorativo de filigrana celta */}
      <div className="flex justify-center mb-6">
        <svg
          width="100"
          height="30"
          viewBox="0 0 100 30"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="opacity-70"
        >
          <path
            d="M50 0C50 0 45 15 25 15C5 15 0 30 0 30"
            stroke="#735f3d"
            strokeWidth="1"
          />
          <path
            d="M50 0C50 0 55 15 75 15C95 15 100 30 100 30"
            stroke="#735f3d"
            strokeWidth="1"
          />
          <circle cx="50" cy="15" r="4" fill="#735f3d" />
        </svg>
      </div>

      <div className="flex flex-col md:flex-row justify-center items-center text-[10px] md:text-xs text-gray-500 tracking-[0.2em] gap-4 md:gap-10 px-4">
        <span>© 2026 EILUVË. TODOS LOS DERECHOS RESERVADOS.</span>
        <div className="flex gap-4 border-t md:border-t-0 md:border-l border-gray-800 pt-4 md:pt-0 md:pl-10">
          <a
            href="#aviso-legal"
            className="hover:text-[#d1b880] transition-colors"
          >
            AVISO LEGAL
          </a>
          <span>|</span>
          <a
            href="#politica-privacidad"
            className="hover:text-[#d1b880] transition-colors"
          >
            POLÍTICA DE PRIVACIDAD
          </a>
          <span>|</span>
          <button
            onClick={() => window.dispatchEvent(new Event("abrir-dashboard"))}
            className="hover:text-[#d1b880] transition-colors uppercase bg-transparent border-none p-0 cursor-pointer font-sans text-[10px] md:text-xs tracking-[0.2em]"
          >
            🔒 Portal Banda
          </button>
        </div>
      </div>

      <div className="text-[9px] md:text-[10px] text-gray-600 tracking-[0.25em] uppercase mt-4">
        PÁGINA DESARROLLADA POR <span className="text-[#735f3d] font-bold hover:text-[#d1b880] transition-colors cursor-pointer">BSM</span>
      </div>
    </footer>
  );
}
