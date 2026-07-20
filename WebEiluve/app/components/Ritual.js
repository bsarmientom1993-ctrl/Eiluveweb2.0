"use client";

import { useState } from "react";
import Image from "next/image";

function obtenerEmbedYoutubeId(url) {
  if (!url) return "iijKLHCQw5g"; // Video ID por defecto
  let id = "iijKLHCQw5g";
  try {
    if (url.includes("youtube.com/embed/")) {
      id = url.split("youtube.com/embed/")[1].split("?")[0].split("&")[0];
    } else if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      id = urlObj.searchParams.get("v") || "iijKLHCQw5g";
    } else if (url.includes("youtu.be/")) {
      id = url.split("youtu.be/")[1].split("?")[0].split("&")[0];
    } else {
      id = url.trim();
    }
  } catch (e) {
    id = "iijKLHCQw5g";
  }
  return id;
}

export default function Ritual({ videoLink }) {
  const [modalAbierto, setModalAbierto] = useState(false);
  const videoId = obtenerEmbedYoutubeId(videoLink);

  const abrirVideo = () => {
    setModalAbierto(true);
  };

  const cerrarVideo = () => {
    setModalAbierto(false);
  };

  return (
    <section id="ritual" className="min-h-screen flex flex-col justify-center bg-[#03060a] relative overflow-hidden snap-start snap-always py-12 seccion-magica">
      {/* Elementos Mágicos del Bosque (Max 5) */}
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/35 left-[8%] top-[15%] select-none font-serif">ᚦ</div>
      <div className="elemento-magico-runa text-4xl text-[#d1b880]/40 right-[8%] top-[20%] select-none font-serif [animation-delay:1.5s]">ᚲ</div>
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/35 left-[10%] bottom-[30%] select-none font-serif [animation-delay:3.5s]">ᛉ</div>
      {/* Resplandores del Ritual */}
      <div className="absolute left-[15%] top-[45%] w-5 h-5 rounded-full bg-purple-500/32 blur-md animate-pulse pointer-events-none z-0"></div>
      <div className="absolute right-[15%] bottom-[20%] w-7 h-7 rounded-full bg-orange-600/25 blur-lg animate-pulse pointer-events-none z-0"></div>

      {/* Separador de línea mágica */}
      <div className="section-divider">
        <div className="magic-line"></div>
        <i className="fas fa-fire magic-rune"></i>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-10">
        <div className="text-center mb-16 reveal">
          <h2
            className="font-serif text-4xl text-[#d1b880] mb-4 tracking-wide"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            El Ritual
          </h2>
          <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#8da382] to-transparent mx-auto"></div>
        </div>

        {/* Miniatura de Video (Dispara el Modal) */}
        <div
          onClick={abrirVideo}
          className="aspect-video bg-[#0a1120] border border-[#735f3d]/40 rounded-sm flex items-center justify-center relative group cursor-pointer hover:border-[#d1b880] transition-all duration-500 overflow-hidden reveal-scale"
        >
          {/* Icono de Reproducción Brillante */}
          <i className="fas fa-play-circle text-7xl text-[#d1b880] opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 z-10 drop-shadow-[0_0_15px_rgba(229,193,88,0.8)]"></i>
          
          {/* Imagen de Fondo */}
          <div className="absolute inset-0 opacity-30 mix-blend-luminosity group-hover:opacity-50 transition-opacity duration-500">
            <Image
              src="/ritual_concert.jpg"
              alt="Concierto ritual de folk metal"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 1024px"
            />
          </div>
        </div>
      </div>

      {/* Modal del Reproductor de Video */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-6xl bg-black border border-[#d1b880]/30 rounded overflow-hidden shadow-2xl">
            {/* Botón de Cerrar */}
            <button
              onClick={cerrarVideo}
              className="absolute top-2 right-2 text-gray-400 hover:text-white text-2xl z-20 focus:outline-none"
              aria-label="Cerrar Video"
            >
              <i className="fas fa-times"></i>
            </button>
            
            {/* Contenedor adaptativo de proporción de aspecto del iframe */}
            <div className="aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
                title="Eiluvë Live Ritual Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-none"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
