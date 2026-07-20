"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function BarraNavegacion() {
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [seccionActiva, setSeccionActiva] = useState("home");

  const alternarMenuMovil = () => {
    setMenuMovilAbierto(!menuMovilAbierto);
  };

  const cerrarMenuMovil = () => {
    setMenuMovilAbierto(false);
  };

  // Escuchar la sección activa vía IntersectionObserver para encoger la barra flotante de forma robusta
  useEffect(() => {
    const secciones = ["home", "leyenda", "ritual", "cronicas", "tour", "contacto"];
    
    const observadorSecciones = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            const id = entrada.target.id;
            setSeccionActiva(id);
            if (id === "home") {
              setScrolled(false);
            } else {
              setScrolled(true);
            }
          }
        });
      },
      { 
        threshold: 0.25 
      }
    );

    secciones.forEach((sec) => {
      const el = document.getElementById(sec);
      if (el) observadorSecciones.observe(el);
    });

    return () => {
      secciones.forEach((sec) => {
        const el = document.getElementById(sec);
        if (el) observadorSecciones.unobserve(el);
      });
    };
  }, []);

  const isMobileHomeHidden = seccionActiva === "home";

  return (
    <>
      <nav 
        className={`fixed left-1/2 -translate-x-1/2 z-50 nav-flotante flex items-center justify-between transition-all duration-500 max-lg:!bg-transparent max-lg:!border-none max-lg:!backdrop-blur-none max-lg:!shadow-none ${
          scrolled 
            ? "top-3 py-2.5 scrolled px-6 md:px-8 w-[92%] max-w-[1300px]" 
            : "top-6 py-3.5 px-6 w-[88%] md:w-[70%] lg:w-[60%] max-w-[800px]"
        } ${isMobileHomeHidden ? "max-lg:opacity-0 max-lg:pointer-events-none" : "max-lg:opacity-100"}`}
      >
        {/* Logotipo Flotante Adaptativo (Inactivo/Solo visual al hacer scroll, oculto en móviles para evitar colisiones con títulos) */}
        <div 
          className="hidden lg:flex transition-all duration-500 items-center overflow-hidden flex-shrink-0"
          style={{
            width: scrolled ? "120px" : "0px",
            opacity: scrolled ? 1 : 0,
            marginRight: scrolled ? "16px" : "0px"
          }}
        >
          <div 
            className="relative select-none" 
            style={{
              width: "120px",
              height: "50px"
            }}
          >
            <Image
              src="/logo_eiluve.png"
              alt="Eiluvë Logo"
              fill
              className="object-contain"
              unoptimized
              priority
            />
          </div>
        </div>

        {/* Menú Central (Escritorio - Mayor Separación) */}
        <div className="hidden lg:flex space-x-8 xl:space-x-10 items-center justify-center flex-1">
          <a
            href="#home"
            className={`menu-link text-[#dfdcd3] font-serif text-[11px] xl:text-xs tracking-[0.25em] transition-colors uppercase ${
              seccionActiva === "home" ? "active text-[#d1b880]" : ""
            }`}
          >
            INICIO
          </a>
          <a
            href="#leyenda"
            className={`menu-link text-[#dfdcd3] font-serif text-[11px] xl:text-xs tracking-[0.25em] transition-colors uppercase ${
              seccionActiva === "leyenda" ? "active text-[#d1b880]" : ""
            }`}
          >
            BANDA
          </a>
          <a
            href="#ritual"
            className={`menu-link text-[#dfdcd3] font-serif text-[11px] xl:text-xs tracking-[0.25em] transition-colors uppercase ${
              seccionActiva === "ritual" ? "active text-[#d1b880]" : ""
            }`}
          >
            EL RITUAL
          </a>
          <a
            href="#cronicas"
            className={`menu-link text-[#dfdcd3] font-serif text-[11px] xl:text-xs tracking-[0.25em] transition-colors uppercase ${
              seccionActiva === "cronicas" ? "active text-[#d1b880]" : ""
            }`}
          >
            CRÓNICAS
          </a>
          <a
            href="#tour"
            className={`menu-link text-[#dfdcd3] font-serif text-[11px] xl:text-xs tracking-[0.25em] transition-colors uppercase ${
              seccionActiva === "tour" ? "active text-[#d1b880]" : ""
            }`}
          >
            CONCIERTOS
          </a>
          <a
            href="#contacto"
            className={`menu-link text-[#dfdcd3] font-serif text-[11px] xl:text-xs tracking-[0.25em] transition-colors uppercase ${
              seccionActiva === "contacto" ? "active text-[#d1b880]" : ""
            }`}
          >
            CONTACTO
          </a>
        </div>

        {/* Redes Sociales Derecha (Marcos Circulares de Bronce) */}
        <div 
          className="hidden md:flex space-x-3 items-center transition-all duration-500 overflow-hidden flex-shrink-0"
          style={{
            width: scrolled ? "auto" : "0px",
            opacity: scrolled ? 1 : 0,
            pointerEvents: scrolled ? "auto" : "none"
          }}
        >
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880]/80 hover:text-white hover:border-[#d1b880]/60 hover:shadow-[0_0_8px_rgba(209,184,128,0.35)] transition-all duration-300 text-xs"
            aria-label="Facebook"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880]/80 hover:text-white hover:border-[#d1b880]/60 hover:shadow-[0_0_8px_rgba(209,184,128,0.35)] transition-all duration-300 text-xs"
            aria-label="Instagram"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880]/80 hover:text-white hover:border-[#d1b880]/60 hover:shadow-[0_0_8px_rgba(209,184,128,0.35)] transition-all duration-300 text-xs"
            aria-label="YouTube"
          >
            <i className="fab fa-youtube"></i>
          </a>
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880]/80 hover:text-white hover:border-[#d1b880]/60 hover:shadow-[0_0_8px_rgba(209,184,128,0.35)] transition-all duration-300 text-xs"
            aria-label="Spotify"
          >
            <i className="fab fa-spotify"></i>
          </a>
          <a
            href="https://music.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880]/80 hover:text-white hover:border-[#d1b880]/60 hover:shadow-[0_0_8px_rgba(209,184,128,0.35)] transition-all duration-300 text-xs"
            aria-label="Apple Music"
          >
            <i className="fab fa-apple"></i>
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880]/80 hover:text-white hover:border-[#d1b880]/60 hover:shadow-[0_0_8px_rgba(209,184,128,0.35)] transition-all duration-300 text-xs"
            aria-label="TikTok"
          >
            <i className="fab fa-tiktok"></i>
          </a>
        </div>

        {/* Botón de Menú Hamburguesa (Móvil) */}
        <div className="lg:hidden flex items-center">
          <button
            onClick={alternarMenuMovil}
            className="w-11 h-11 rounded-full bg-[#060a13]/90 border border-[#735f3d]/40 shadow-xl text-[#d1b880] hover:text-white focus:outline-none flex items-center justify-center transition-all hover:scale-105 active:scale-95"
            aria-label="Alternar Menú"
          >
            <i className="fas fa-bars text-lg"></i>
          </button>
        </div>
      </nav>

      {/* Menú Desplegable Lateral Móvil */}
      <div
        className={`lg:hidden fixed inset-0 z-[60] bg-[#060a13]/96 backdrop-blur-lg flex flex-col justify-center items-center space-y-8 transition-transform duration-500 ease-in-out ${
          menuMovilAbierto ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Botón de Cierre */}
        <button
          onClick={cerrarMenuMovil}
          className="absolute top-6 right-6 text-[#d1b880] hover:text-white text-3xl focus:outline-none transition-colors"
          aria-label="Cerrar Menú"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Enlaces Móviles */}
        <a
          href="#home"
          onClick={cerrarMenuMovil}
          className={`text-xl font-serif tracking-[0.25em] transition-colors uppercase ${
            seccionActiva === "home" ? "text-[#d1b880]" : "text-white hover:text-[#d1b880]"
          }`}
        >
          INICIO
        </a>
        <a
          href="#leyenda"
          onClick={cerrarMenuMovil}
          className={`text-xl font-serif tracking-[0.25em] transition-colors uppercase ${
            seccionActiva === "leyenda" ? "text-[#d1b880]" : "text-white hover:text-[#d1b880]"
          }`}
        >
          BANDA
        </a>
        <a
          href="#ritual"
          onClick={cerrarMenuMovil}
          className={`text-xl font-serif tracking-[0.25em] transition-colors uppercase ${
            seccionActiva === "ritual" ? "text-[#d1b880]" : "text-white hover:text-[#d1b880]"
          }`}
        >
          EL RITUAL
        </a>
        <a
          href="#cronicas"
          onClick={cerrarMenuMovil}
          className={`text-xl font-serif tracking-[0.25em] transition-colors uppercase ${
            seccionActiva === "cronicas" ? "text-[#d1b880]" : "text-white hover:text-[#d1b880]"
          }`}
        >
          CRÓNICAS
        </a>
        <a
          href="#tour"
          onClick={cerrarMenuMovil}
          className={`text-xl font-serif tracking-[0.25em] transition-colors uppercase ${
            seccionActiva === "tour" ? "text-[#d1b880]" : "text-white hover:text-[#d1b880]"
          }`}
        >
          CONCIERTOS
        </a>
        <a
          href="#contacto"
          onClick={cerrarMenuMovil}
          className={`text-xl font-serif tracking-[0.25em] transition-colors uppercase ${
            seccionActiva === "contacto" ? "text-[#d1b880]" : "text-white hover:text-[#d1b880]"
          }`}
        >
          CONTACTO
        </a>

        {/* Redes Sociales Móvil */}
        <div className="flex space-x-4 pt-6">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#d1b880] transition-colors text-sm"
          >
            <i className="fab fa-facebook-f"></i>
          </a>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#d1b880] transition-colors text-sm"
          >
            <i className="fab fa-instagram"></i>
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#d1b880] transition-colors text-sm"
          >
            <i className="fab fa-youtube"></i>
          </a>
          <a
            href="https://spotify.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#d1b880] transition-colors text-sm"
          >
            <i className="fab fa-spotify"></i>
          </a>
          <a
            href="https://music.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#d1b880] transition-colors text-sm"
          >
            <i className="fab fa-apple"></i>
          </a>
          <a
            href="https://tiktok.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full border border-[#d1b880]/15 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#d1b880] transition-colors text-sm"
          >
            <i className="fab fa-tiktok"></i>
          </a>
        </div>
      </div>
    </>
  );
}
