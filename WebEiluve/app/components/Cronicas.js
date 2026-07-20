"use client";

import { useState } from "react";
import Image from "next/image";

export default function Cronicas({ noticias = [] }) {
  const [noticiaSeleccionada, setNoticiaSeleccionada] = useState(null);
  const [cerrandoModal, setCerrandoModal] = useState(false);
  const [startIndex, setStartIndex] = useState(0);

  const obtenerFechaObjeto = (c) => {
    if (!c.fecha) return new Date(0);
    if (/^\d{4}-\d{2}-\d{2}$/.test(c.fecha)) {
      return new Date(c.fecha);
    }
    const partes = c.fecha.trim().split(/\s+/);
    if (partes.length === 3) {
      const dia = parseInt(partes[0]);
      const meses = {
        ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
        JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
      };
      const mesStr = partes[1].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const mes = meses[mesStr.substring(0, 3)] ?? 5; // default June
      const anio = parseInt(partes[2]);
      return new Date(anio, mes, dia);
    }
    return new Date(2026, 5, 15); // default fallback
  };

  const noticiasOrdenadas = noticias;

  const verMasNuevas = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const verMasPasadas = () => {
    if (startIndex + 3 < noticiasOrdenadas.length) {
      setStartIndex(startIndex + 1);
    }
  };

  const cerrarConAnimacion = () => {
    setCerrandoModal(true);
    setTimeout(() => {
      setNoticiaSeleccionada(null);
      setCerrandoModal(false);
    }, 450);
  };

  return (
    <section id="cronicas" className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-[#060a13] border-t border-[#735f3d]/20 snap-start snap-always py-12 seccion-magica">
      {/* Elementos Mágicos del Bosque (Max 5) */}
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/35 left-[8%] top-[18%] select-none font-serif">ᚨ</div>
      <div className="elemento-magico-runa text-4xl text-[#d1b880]/40 right-[8%] top-[15%] select-none font-serif [animation-delay:2.5s]">ᚹ</div>
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/35 right-[10%] bottom-[20%] select-none font-serif [animation-delay:4s]">ᛃ</div>
      {/* Luces del Bosque (Espíritus) */}
      <div className="absolute left-[5%] top-[45%] w-6 h-6 rounded-full bg-teal-500/32 blur-md animate-pulse pointer-events-none z-0"></div>
      <div className="absolute right-[8%] top-[60%] w-8 h-8 rounded-full bg-emerald-500/25 blur-lg animate-pulse pointer-events-none z-0"></div>
      
      {/* Línea rúnica divisoria superior */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#735f3d]/30 to-transparent"></div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8 relative z-10">
        
        {/* Título de la Sección */}
        <div className="text-center mb-16 reveal">
          <h2 className="font-serif text-3xl md:text-4xl text-[#d1b880] tracking-widest uppercase mb-4">
            CRÓNICAS DEL BOSQUE
          </h2>
          <div className="w-24 h-[1px] bg-[#d1b880]/50 mx-auto mb-4"></div>
          <p className="text-[#dfdcd3] font-sans text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Últimas novedades, relatos de taberna y anuncios oficiales del clan.
          </p>
        </div>

        {/* Contenedor de Artículos con Deslizador (Escritorio: Muestra 3 a la vez, pasadas a la derecha, nuevas a la izquierda) */}
        <div className="hidden md:block relative py-4">
          {noticiasOrdenadas.length > 3 && (
            <>
              {/* Flecha Izquierda (Ver más nuevas) */}
              <button
                onClick={verMasNuevas}
                disabled={startIndex === 0}
                className={`absolute left-[-2.5rem] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-[#d1b880]/30 bg-black/75 text-[#d1b880] flex items-center justify-center transition-all hover:bg-[#d1b880] hover:text-black hover:border-[#d1b880] focus:outline-none ${
                  startIndex === 0 ? "opacity-25 cursor-not-allowed" : "cursor-pointer"
                }`}
                aria-label="Ver crónicas más recientes"
              >
                <i className="fas fa-chevron-left text-sm"></i>
              </button>

              {/* Flecha Derecha (Ver más antiguas/pasadas) */}
              <button
                onClick={verMasPasadas}
                disabled={startIndex + 3 >= noticiasOrdenadas.length}
                className={`absolute right-[-2.5rem] top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-[#d1b880]/30 bg-black/75 text-[#d1b880] flex items-center justify-center transition-all hover:bg-[#d1b880] hover:text-black hover:border-[#d1b880] focus:outline-none ${
                  startIndex + 3 >= noticiasOrdenadas.length ? "opacity-25 cursor-not-allowed" : "cursor-pointer"
                }`}
                aria-label="Ver crónicas pasadas"
              >
                <i className="fas fa-chevron-right text-sm"></i>
              </button>
            </>
          )}

          {/* Ventana de visualización */}
          <div className="overflow-hidden w-full">
            <div 
              className="flex gap-8 transition-transform duration-500 ease-in-out"
              style={{
                transform: `translateX(calc(-${startIndex} * (100% / 3 + 2rem / 3)))`
              }}
            >
              {noticiasOrdenadas.map((noticia) => (
                <article 
                  key={noticia.id}
                  className="w-[calc(100%/3-1.33rem)] flex-shrink-0 bg-[#0c1322]/65 backdrop-blur-md border border-[#d1b880]/20 hover:border-[#d1b880]/50 hover:shadow-[0_15px_30px_rgba(0,0,0,0.6)] transition-all duration-500 rounded-xl overflow-hidden flex flex-col justify-between group min-h-[440px]"
                >
                  {/* Imagen del artículo */}
                  <div className="h-44 relative overflow-hidden bg-black/30 border-b border-[#735f3d]/25 flex-shrink-0">
                    <Image
                      src={noticia.imagen}
                      alt={noticia.titulo}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 380px"
                    />
                    <span className="absolute top-4 left-4 bg-[#735f3d]/90 text-white text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-md uppercase backdrop-blur-sm border border-[#d1b880]/30">
                      {noticia.categoria}
                    </span>
                  </div>

                  {/* Contenido */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono tracking-wider mb-2">
                        <span>{noticia.fecha}</span>
                        <span className="text-[#d1b880]/90 font-mono text-[9px]">✍️ {noticia.autor || "Banda Eiluvë"}</span>
                      </div>
                      <h3 className="font-serif text-[#d1b880] text-base font-bold leading-snug mb-3 hover:text-white transition-colors line-clamp-2">
                        {noticia.titulo}
                      </h3>
                      <p className="text-gray-400 text-xs font-sans leading-relaxed mb-6 line-clamp-3">
                        {noticia.resumen}
                      </p>
                    </div>

                    {/* Botón leer crónica */}
                    <button
                      onClick={() => setNoticiaSeleccionada(noticia)}
                      className="w-full py-2 border border-[#d1b880]/30 hover:border-[#d1b880] text-[#d1b880] hover:bg-[#d1b880]/10 text-xs font-serif font-bold tracking-wider rounded-lg transition-all duration-300 uppercase"
                    >
                      Leer Crónica
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>

        {/* Lista Compacta de Crónicas (Móvil - Foto pequeña y ordenado por fecha de publicación) */}
        <div className="md:hidden flex flex-col space-y-4">
          {noticiasOrdenadas.map((noticia) => (
            <article 
              key={noticia.id}
              onClick={() => setNoticiaSeleccionada(noticia)}
              className="flex items-center gap-4 bg-[#0c1322]/65 backdrop-blur-md border border-[#d1b880]/20 hover:border-[#d1b880]/50 p-3 rounded-xl cursor-pointer hover:shadow-lg transition-all"
            >
              {/* Foto pequeña */}
              <div className="w-16 h-16 relative rounded-lg overflow-hidden flex-shrink-0 bg-black/35 border border-[#735f3d]/25">
                <Image
                  src={noticia.imagen}
                  alt={noticia.titulo}
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>

              {/* Título */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between text-[8px] text-[#735f3d] font-mono tracking-wider mb-1 uppercase font-bold">
                  <span>{noticia.categoria} • {noticia.fecha}</span>
                  <span className="text-[#d1b880]/80">✍️ {noticia.autor ? noticia.autor.split(" ")[0] : "Banda"}</span>
                </div>
                <h3 className="font-serif text-[#d1b880] text-xs font-bold leading-snug line-clamp-2 hover:text-white transition-colors">
                  {noticia.titulo}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Modal para lectura de noticias en detalle */}
      {noticiaSeleccionada && (
        <div 
          className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md ${cerrandoModal ? "animate-[fadeOut_0.45s_ease-out_forwards]" : "animate-[fadeIn_0.3s_ease-out]"}`}
          onClick={cerrarConAnimacion}
        >
          <div 
            className={`bg-[#0c1322] border border-[#d1b880]/30 rounded-xl overflow-hidden shadow-[0_25px_50px_-12px_rgba(0,0,0,0.9)] max-w-2xl w-full max-h-[85vh] flex flex-col relative select-text modal-magico-reveal ${cerrandoModal ? "modal-magico-close" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            
            {/* Cabecera del Modal con imagen */}
            <div className="h-64 relative flex-shrink-0">
              <Image
                src={noticiaSeleccionada.imagen}
                alt={noticiaSeleccionada.titulo}
                fill
                unoptimized
                className="object-cover"
                sizes="650px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-transparent to-black/50"></div>
              
              {/* Botón de Cierre */}
              <button
                onClick={cerrarConAnimacion}
                className="absolute top-4 right-4 text-white hover:text-[#d1b880] bg-black/50 hover:bg-black/80 rounded-full w-8 h-8 flex items-center justify-center transition-all focus:outline-none"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Contenido Escrito */}
            <div className="p-6 md:p-8 overflow-y-auto flex-1 font-sans">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <span className="bg-[#735f3d]/80 text-[#dfdcd3] text-[9px] font-bold tracking-wider px-2 py-0.5 rounded border border-[#d1b880]/30 uppercase">
                  {noticiaSeleccionada.categoria}
                </span>
                <span className="text-[10px] text-gray-400 font-mono">
                  📅 {noticiaSeleccionada.fecha}
                </span>
                <span className="text-[10px] text-[#fbbf24] font-mono ml-auto bg-black/50 px-2 py-0.5 rounded border border-[#735f3d]/30">
                  ✍️ Autor: {noticiaSeleccionada.autor || "Banda Eiluvë"}
                </span>
              </div>
              <h3 className="font-serif text-[#d1b880] text-2xl font-bold leading-tight mb-4" style={{ fontFamily: "'Cinzel', serif" }}>
                {noticiaSeleccionada.titulo}
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                {noticiaSeleccionada.contenido}
              </p>
            </div>
            
            {/* Pie del modal */}
            <div className="p-4 border-t border-[#735f3d]/20 bg-[#060a13] flex justify-end">
              <button
                onClick={cerrarConAnimacion}
                className="px-6 py-2 bg-[#735f3d]/30 hover:bg-[#735f3d]/60 border border-[#d1b880]/40 text-[#dfdcd3] text-xs font-bold tracking-wider rounded-lg transition-colors uppercase"
              >
                Cerrar Relato
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
