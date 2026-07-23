"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

// =========================================================================
// 🎛️ AJUSTE MANUAL DE UN SOLO USO: TEXTO Y DISPOSICIÓN DEL HERO (PRESENTACIÓN)
// =========================================================================
// Edita estos valores para ajustar con precisión la columna de textos del Hero.
const CONFIG_TEXTO = {
  alineacionHorizontal: "left",    // Alineación: 'left' (izquierda), 'center' (centro), 'right' (derecha)
  desplazamientoTop: "0px",        // Ajuste vertical del bloque
  desplazamientoLeft: "10px",      // Ajuste horizontal del bloque
  anchoMaximo: "440px",            // Bloque más estrecho y elegante para mejor lectura
  sombraTexto: "0 4px 12px rgba(0,0,0,0.9)", // Sombra para legibilidad cinematográfica
  espaciadoLetras: "0.2em",        // Espaciado celta amplio (tracking)
  interlineado: "1.2"              // Line-height
};

export default function Presentacion({ presentacion, heroBg, activeCover, socialLinks = {} }) {
  const [activo, setActivo] = useState(false);
  const [modalFotoAbierto, setModalFotoAbierto] = useState(false);
  const [mostrarFondo, setMostrarFondo] = useState(false);

  const data = presentacion || {
    titulo: "BIENVENIDOS SEAN AL INICIO DEL CAMINO....",
    subtitulo1: "BUENA COMPAÑÍA, ARTE",
    subtitulo2: "SUEÑOS Y MELODÍAS",
    descripcion: "Eiluvë es folk metal, es cuento y es tormenta. Melodías ancestrales, instrumentos de leyenda y la fuerza del metal se unen en cada historia."
  };

  useEffect(() => {
    // Añadir un pequeño retraso para activar la animación en cascada tras la carga
    const temporizador = setTimeout(() => {
      setActivo(true);
    }, 100);
    return () => clearTimeout(temporizador);
  }, []);

  // Determinar la alineación de flexbox para los botones según la alineación del texto
  const alineacionBotones = 
    CONFIG_TEXTO.alineacionHorizontal === "center" 
      ? "justify-center" 
      : CONFIG_TEXTO.alineacionHorizontal === "right" 
        ? "justify-end" 
        : "justify-start";

  return (
    <>
      {/* VISTA ESCRITORIO (md y superior) - SIN CAMBIOS */}
      <div
        className="hidden md:flex flex-col space-y-4"
        style={{
          textAlign: CONFIG_TEXTO.alineacionHorizontal,
          marginTop: CONFIG_TEXTO.desplazamientoTop,
          marginLeft: CONFIG_TEXTO.desplazamientoLeft,
          maxWidth: CONFIG_TEXTO.anchoMaximo,
        }}
      >
        {/* 1. Logotipo Integrado con Entrada Elegante (Desenfoque, escala y fade) */}
        <div 
          className={`transition-all duration-1200 cubic-bezier(0.25, 1, 0.5, 1) flex ${
            CONFIG_TEXTO.alineacionHorizontal === "center" 
              ? "justify-center" 
              : CONFIG_TEXTO.alineacionHorizontal === "right" 
                ? "justify-end" 
                : "justify-start"
          } ${
            activo ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-95 blur-md"
          }`}
        >
          <div className="relative w-[240px] h-[95px] mb-1">
            <Image
              src="/logo_eiluve.png"
              alt="Eiluvë Logo"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>
        </div>

        {/* 2. Título Principal "FOLK METAL" */}
        <div 
          className={`transition-all duration-1000 delay-150 cubic-bezier(0.25, 1, 0.5, 1) ${
            activo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <h1
            className="font-serif text-3xl md:text-4xl lg:text-[44px] font-bold text-[#d1b880] leading-none uppercase"
            style={{
              textShadow: CONFIG_TEXTO.sombraTexto,
              fontFamily: "'Cinzel', serif",
              letterSpacing: CONFIG_TEXTO.espaciadoLetras,
            }}
          >
            {data.titulo}
          </h1>
        </div>

        {/* 3. Subtítulos "Desde el Bosque" / "Para el Mundo" */}
        <div 
          className={`transition-all duration-1000 delay-300 cubic-bezier(0.25, 1, 0.5, 1) space-y-1 ${
            activo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
          style={{ textShadow: CONFIG_TEXTO.sombraTexto }}
        >
          <span className="font-serif text-gray-300 text-lg md:text-[20px] tracking-[0.18em] block uppercase">
            {data.subtitulo1}
          </span>
          <span className="font-serif text-[#735f3d] text-sm md:text-base tracking-[0.25em] block uppercase">
            {data.subtitulo2}
          </span>
        </div>

        {/* 4. Descripción / Párrafo */}
        <div 
          className={`transition-all duration-1000 delay-[450ms] cubic-bezier(0.25, 1, 0.5, 1) ${
            activo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-[#dfdcd3]/85 text-xs md:text-sm font-sans leading-relaxed drop-shadow-md pr-4">
            {data.descripcion}
          </p>
        </div>

        {/* 5. Botones Forjados Metálicos con Transiciones Lentas */}
        <div 
          className={`flex flex-col sm:flex-row gap-4 pt-4 ${alineacionBotones} transition-all duration-1000 delay-600 cubic-bezier(0.25, 1, 0.5, 1) ${
            activo ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <a
            href="#ritual"
            className="boton-forjado-premium px-8 py-3 text-[10px] md:text-xs tracking-[0.2em] font-serif font-bold flex items-center justify-center gap-2 uppercase rounded-lg"
          >
            ESCUCHA AHORA <i className="fas fa-play text-[9px] opacity-70"></i>
          </a>
          <a
            href="#tour"
            className="boton-forjado-premium px-8 py-3 text-[10px] md:text-xs tracking-[0.2em] font-serif font-bold flex items-center justify-center uppercase rounded-lg"
          >
            PRÓXIMOS CONCIERTOS
          </a>
        </div>
      </div>

      {/* VISTA MÓVIL ALTERNATIVA (Oculta nav, logo al centro, redes horizontales al centro y miniatura interactiva) */}
      <div className="md:hidden flex flex-col items-center justify-start space-y-5 w-full text-center mt-2 px-4 select-none animate-fade-in">
        {/* Logo al Centro */}
        <div className="relative w-[210px] h-[85px] select-none pointer-events-none mb-1">
          <Image
            src="/logo_eiluve.png"
            alt="Eiluvë Logo"
            fill
            className="object-contain"
            priority
            unoptimized
          />
        </div>

        {/* Enlaces de Redes Horizontales al Centro */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          {socialLinks.facebook && (
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/85 flex items-center justify-center text-[#d1b880] hover:text-white"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f text-sm"></i>
            </a>
          )}
          {socialLinks.instagram && (
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/85 flex items-center justify-center text-[#d1b880] hover:text-white"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram text-sm"></i>
            </a>
          )}
          {socialLinks.youtube && (
            <a
              href={socialLinks.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/85 flex items-center justify-center text-[#d1b880] hover:text-white"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube text-sm"></i>
            </a>
          )}
          {socialLinks.spotify && (
            <a
              href={socialLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/85 flex items-center justify-center text-[#d1b880] hover:text-white"
              aria-label="Spotify"
            >
              <i className="fab fa-spotify text-sm"></i>
            </a>
          )}
          {socialLinks.tiktok && (
            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/85 flex items-center justify-center text-[#d1b880] hover:text-white"
              aria-label="TikTok"
            >
              <i className="fab fa-tiktok text-sm"></i>
            </a>
          )}
        </div>

        {/* Separador fino */}
        <div className="w-[60%] max-w-[150px] h-[1px] bg-gradient-to-r from-transparent via-[#735f3d]/40 to-transparent my-1"></div>

        {/* Recuadro de la Portada CD (Ventana de la portada ordenada y elegante) */}
        <div className="flex flex-col items-center space-y-3">
          <div
            onClick={() => setModalFotoAbierto(true)}
            className="w-[200px] h-[200px] bg-black/65 border-2 border-[#d1b880]/30 rounded-lg p-2.5 shadow-[0_0_25px_rgba(0,0,0,0.85)] cursor-pointer hover:border-[#fbbf24] hover:scale-103 active:scale-97 transition-all duration-500 relative group overflow-hidden animate-pulse"
            style={{ animationDuration: "3.5s" }}
            title="Toca para ampliar o ver el fondo"
          >
            <div className="relative w-full h-full rounded overflow-hidden border border-[#735f3d]/25">
              <Image
                src={activeCover || "/Somos todos.jpg"}
                alt="Portada La Taberna y el Bosque"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-1000"
                unoptimized
              />
            </div>
            
            {/* Overlay interactivo premium */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <div className="bg-[#0c1322]/90 px-3 py-1.5 rounded border border-[#fbbf24]/50 text-[9px] text-[#fbbf24] font-mono uppercase tracking-wider shadow-lg">
                AMPLIAR ARTE <i className="fas fa-search-plus ml-1 text-[8px]"></i>
              </div>
            </div>
          </div>
          <span className="text-[10px] text-[#735f3d] font-serif uppercase tracking-[0.2em] font-semibold">
            LA TABERNA Y EL BOSQUE
          </span>
        </div>

        {/* Separador fino */}
        <div className="w-[40%] max-w-[100px] h-[1px] bg-gradient-to-r from-transparent via-[#735f3d]/30 to-transparent my-1"></div>

        {/* Textos de la presentacion (debajo de la portada CD) */}
        <div className="flex flex-col items-center space-y-4 max-w-sm mt-3 px-3">
          {/* Título Principal */}
          <h2
            className="font-serif text-lg sm:text-xl font-bold text-[#d1b880] uppercase leading-tight tracking-wider"
            style={{
              fontFamily: "'Cinzel', serif",
              textShadow: "0 2px 4px rgba(0,0,0,0.9)"
            }}
          >
            {data.titulo}
          </h2>

          {/* Subtítulos */}
          <div className="space-y-1">
            <span className="font-serif text-gray-300 text-[10px] sm:text-xs tracking-[0.18em] block uppercase font-bold">
              {data.subtitulo1}
            </span>
            <span className="font-serif text-[#735f3d] text-[8px] sm:text-[9px] tracking-[0.25em] block uppercase font-semibold">
              {data.subtitulo2}
            </span>
          </div>

          {/* Descripción */}
          <p className="text-[#dfdcd3]/85 text-[11px] font-sans leading-relaxed px-2 drop-shadow-md">
            {data.descripcion}
          </p>
        </div>
      </div>

      {/* Visor de Arte a Pantalla Completa para Móvil */}
      {modalFotoAbierto && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fade-in select-text"
          onClick={() => setModalFotoAbierto(false)}
        >
          <div 
            className="relative w-full max-w-sm bg-[#0c1322] border border-[#d1b880]/40 rounded-xl overflow-hidden shadow-2xl flex flex-col p-5 space-y-4 modal-magico-reveal"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón de Cierre */}
            <button
              onClick={() => setModalFotoAbierto(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white text-xl z-20 focus:outline-none"
              aria-label="Cerrar Visor"
            >
              <i className="fas fa-times text-sm"></i>
            </button>

            <h3 className="font-serif text-sm text-[#d1b880] uppercase tracking-wider text-center pt-2" style={{ fontFamily: "'Cinzel', serif" }}>
              Nuevo Lanzamiento
            </h3>

            {/* Visor de Imagen */}
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border border-[#735f3d]/30 bg-black/45 flex items-center justify-center">
              <Image
                src="/Portada.jpg"
                alt="Portada Oficial"
                fill
                unoptimized
                className="object-contain"
              />
            </div>

            <button
              onClick={() => setModalFotoAbierto(false)}
              className="w-full py-2.5 bg-[#d1b880] text-[#060a13] font-bold text-center tracking-widest uppercase hover:bg-white transition-all duration-300 rounded-lg text-xs"
            >
              Volver al Bosque
            </button>
          </div>
        </div>
      )}
    </>
  );
}
