"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

// =========================================================================
// 🎛️ AJUSTE MANUAL DE UN SOLO USO: SECCIÓN "LA LEYENDA" (BIOGRAFÍA)
// =========================================================================
// Edita fácilmente todos los textos, imágenes y destacados de la biografía aquí:
const CONFIG_LEYENDA = {
  titulo: "La Leyenda",
  imagenRuta: "/biografia/Bio1.jpg",
  imagenAlt: "Banda Eiluvë en el bosque",
  cita: `"Cuentos de esqueletos, tabernas escondidas y magos del bosque."`,
  historia: `Invocamos la furia del metal pesado y la entrelazamos con la magia de la zanfoña, el misticismo del violín y el eco ancestral de las gaitas. Nuestro sonido es un ritual que abre portales a mundos olvidados, donde los lobos aúllan junto a tambores bestiales.`,
  // Los recuadros informativos en la parte inferior
  destacados: [
    {
      titulo: "Esqueletos Reales",
      subtitulo: "Cuerdas y Hechizos",
      colorBorde: "#735f3d"
    },
    {
      titulo: "El Bestiario",
      subtitulo: "Batería Jurásica",
      colorBorde: "#8da382"
    }
  ]
};

export default function Biografia({ bio, galeria = [], destacados = [] }) {
  const data = bio || CONFIG_LEYENDA;
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cerrandoModal, setCerrandoModal] = useState(false);

  const galeriaFotos = galeria && galeria.length > 0 ? galeria : [
    data.imagenRuta || "/biografia/Bio1.jpg",
    "/biografia/Bio2.jpg",
    "/biografia/Bio3.jpg",
    "/biografia/Bio4.jpg"
  ];

  const destacadosLista = destacados && destacados.length > 0 ? destacados : (data.destacados || []);

  const [fotoPrincipal, setFotoPrincipal] = useState(galeriaFotos[0]);
  const [imgAnim, setImgAnim] = useState(false);
  const modalContentRef = useRef(null);

  // Sincronizar foto principal cuando cambia la galería o la imagen
  useEffect(() => {
    if (galeriaFotos.length > 0) {
      setFotoPrincipal(galeriaFotos[0]);
    }
  }, [galeria, data.imagenRuta]);

  // Animación al cambiar de foto
  useEffect(() => {
    setImgAnim(true);
    const timer = setTimeout(() => setImgAnim(false), 300);
    return () => clearTimeout(timer);
  }, [fotoPrincipal]);

  // Carrusel automático para la galería cuando el modal está abierto
  useEffect(() => {
    if (!modalAbierto || galeriaFotos.length <= 1) return;

    const interval = setInterval(() => {
      setFotoPrincipal((prev) => {
        const index = galeriaFotos.indexOf(prev);
        const nextIndex = (index + 1) % galeriaFotos.length;
        return galeriaFotos[nextIndex];
      });
    }, 4000); // Rotar cada 4 segundos

    return () => clearInterval(interval);
  }, [modalAbierto, galeriaFotos]);

  // Resetear scroll a la parte superior cuando se abre el modal
  useEffect(() => {
    if (modalAbierto && modalContentRef.current) {
      modalContentRef.current.scrollTop = 0;
    }
  }, [modalAbierto]);

  const cerrarConAnimacion = () => {
    setCerrandoModal(true);
    setTimeout(() => {
      setModalAbierto(false);
      setCerrandoModal(false);
    }, 450);
  };

  return (
    <section id="leyenda" className="min-h-screen h-auto md:h-screen flex flex-col justify-start md:justify-center bg-[#060a13] relative overflow-y-visible md:overflow-hidden snap-start snap-always pt-16 pb-28 md:py-10 seccion-magica">
      {/* Elementos Mágicos del Bosque (Max 5) */}
      <div className="elemento-magico-runa text-4xl text-[#d1b880]/45 left-[8%] top-[18%] select-none font-serif">ᛇ</div>
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/40 right-[10%] bottom-[25%] select-none font-serif [animation-delay:2s]">ᛟ</div>
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/35 right-[8%] top-[15%] select-none font-serif [animation-delay:4s]">ᚠ</div>
      {/* Fuego Fatuo (Espíritus del Bosque) */}
      <div className="absolute left-[12%] top-[55%] w-6 h-6 rounded-full bg-emerald-500/32 blur-md animate-pulse pointer-events-none z-0"></div>
      <div className="absolute right-[15%] top-[70%] w-8 h-8 rounded-full bg-amber-500/25 blur-lg animate-pulse pointer-events-none z-0"></div>

      {/* Separador de línea mágica */}
      <div className="section-divider">
        <div className="magic-line"></div>
        <i className="fas fa-leaf magic-rune"></i>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-4 md:mt-6 w-full">
        {/* Título de la sección */}
        <div className="text-center mb-6 md:mb-8 reveal">
          <h2
            className="font-serif text-4xl text-[#d1b880] mb-2 tracking-wide"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            {data.titulo}
          </h2>
          <div className="h-[1px] w-40 bg-gradient-to-r from-transparent via-[#735f3d] to-transparent mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
          {/* Izquierda: Imagen promocional con marco de metal */}
          <div className="border border-[#735f3d]/30 p-2 rounded relative group reveal-left w-full">
            <div className="absolute inset-0 bg-[#8da382]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl"></div>
            <div className="relative aspect-[16/10] md:max-h-[300px] w-full overflow-hidden mx-auto">
              <Image
                src={data.imagenRuta || "/biografia/Bio1.jpg"}
                alt={data.imagenAlt}
                fill
                unoptimized
                className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>

          {/* Derecha: Historia y descripción */}
          <div className="space-y-4 text-gray-300 font-sans leading-relaxed reveal-right">
            {data.cita && (
              <p className="text-lg md:text-xl font-serif text-[#d1b880] italic leading-snug">
                {data.cita}
              </p>
            )}
            
            <div className="relative">
              <p className="text-gray-300 text-sm md:text-base leading-relaxed line-clamp-4">
                {data.historia}
              </p>
              {data.historia && data.historia.length > 200 && (
                <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-[#060a13] to-transparent pointer-events-none"></div>
              )}
            </div>

            {data.historia && data.historia.length > 200 && (
              <button
                onClick={() => setModalAbierto(true)}
                className="text-xs text-[#d1b880] hover:text-white font-mono uppercase tracking-wider flex items-center gap-2 border border-[#735f3d]/30 hover:border-[#fbbf24]/50 bg-black/40 hover:bg-black/70 px-4 py-2 rounded-lg transition-all select-none"
              >
                Seguir Leyendo Biografía ▼
              </button>
            )}
            
            {/* Destacados / Integrantes */}
             <div className="pt-2 pb-6 grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
               {destacadosLista && destacadosLista.map((item, index) => (
                 <div 
                   key={index} 
                   className="pl-3"
                   style={{ borderLeft: `2px solid ${item.colorBorde || "#735f3d"}` }}
                 >
                   <p className="font-bold text-white text-sm md:text-base leading-tight">{item.titulo}</p>
                   <p className="text-xs text-[#735f3d]">{item.subtitulo}</p>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Modal de Biografía Completa */}
      {modalAbierto && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md ${cerrandoModal ? "animate-[fadeOut_0.45s_ease-out_forwards]" : "animate-[fadeIn_0.3s_ease-out]"}`}
          onClick={cerrarConAnimacion}
        >
          <div 
            className={`bg-[#0c1322] border border-[#d1b880]/30 rounded-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] max-w-2xl w-full max-h-[85vh] flex flex-col relative select-text modal-magico-reveal ${cerrandoModal ? "modal-magico-close" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Modal */}
            <div className="p-4 border-b border-[#735f3d]/25 bg-[#060a13]/85 flex justify-between items-center z-10">
              <h3 className="font-serif text-[#d1b880] text-sm md:text-base font-bold uppercase tracking-wider" style={{ fontFamily: "'Cinzel', serif" }}>
                {data.titulo}
              </h3>
              {/* Botón de Cierre */}
              <button
                onClick={cerrarConAnimacion}
                className="text-gray-400 hover:text-[#d1b880] transition-all duration-300 w-8 h-8 flex items-center justify-center rounded-full bg-black/45 hover:bg-black/85"
                aria-label="Cerrar Biografía"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Contenido de la Historia */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans" ref={modalContentRef}>
              {/* Foto de la Banda fully visible con animación cross-fade */}
              <div className="relative aspect-[16/10] md:aspect-[16/9] w-full mb-3 rounded-lg overflow-hidden border border-[#735f3d]/30 shadow-lg bg-black/40">
                <Image
                  src={fotoPrincipal}
                  alt={data.imagenAlt}
                  fill
                  unoptimized
                  className={`object-cover object-center transition-all duration-300 ${imgAnim ? "scale-95 blur-md opacity-30" : "scale-100 blur-0 opacity-100"}`}
                  sizes="650px"
                  priority
                />
              </div>

              {/* Mini Galería (solo visible dentro de la ventana de lectura / modal) */}
              <div className="grid grid-cols-4 gap-2 mb-6">
                {galeriaFotos.map((foto, idx) => (
                  <button
                    key={idx}
                    onClick={() => setFotoPrincipal(foto)}
                    className={`relative aspect-[4/3] rounded overflow-hidden border transition-all duration-300 ${fotoPrincipal === foto ? "border-[#fbbf24] shadow-[0_0_10px_rgba(251,191,36,0.5)] scale-95" : "border-[#735f3d]/30 hover:border-[#fbbf24]/50 hover:scale-105"}`}
                  >
                    <Image
                      src={foto}
                      alt={`Galería ${idx + 1}`}
                      fill
                      unoptimized
                      className="object-cover filter contrast-125 hover:brightness-110"
                      sizes="100px"
                    />
                  </button>
                ))}
              </div>

              {data.cita && (
                <p className="text-base font-serif text-[#d1b880] italic border-l-2 border-[#735f3d] pl-4 mb-4">
                  {data.cita}
                </p>
              )}
              <p className="text-gray-300 text-sm md:text-base leading-relaxed whitespace-pre-line mb-8">
                {data.historia}
              </p>

              {/* Integrantes en el Modal */}
              <div className="border-t border-[#735f3d]/20 pt-6">
                <h4 className="font-serif text-[#d1b880] text-sm md:text-base font-bold mb-4 tracking-wider uppercase" style={{ fontFamily: "'Cinzel', serif" }}>
                  Integrantes del Clan
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {destacadosLista && destacadosLista.map((item, index) => (
                    <div 
                      key={index} 
                      className="pl-3"
                      style={{ borderLeft: `2px solid ${item.colorBorde || "#735f3d"}` }}
                    >
                      <p className="font-bold text-white text-xs md:text-sm leading-tight">{item.titulo}</p>
                      <p className="text-xs text-[#735f3d]">{item.subtitulo}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Pie del modal */}
            <div className="p-4 border-t border-[#735f3d]/20 bg-[#060a13] flex justify-end">
              <button
                onClick={cerrarConAnimacion}
                className="px-6 py-2 bg-[#735f3d]/30 hover:bg-[#735f3d]/60 border border-[#d1b880]/40 text-[#dfdcd3] text-xs font-bold tracking-wider rounded-lg transition-colors uppercase font-mono"
              >
                Cerrar Leyenda
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
