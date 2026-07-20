"use client";

import { useEffect, useState } from "react";

export default function PortalTransicion({ activo }) {
  const [renderizar, setRenderizar] = useState(false);
  const [fase, setFase] = useState("oculto"); // oculto, entrando, saliendo

  useEffect(() => {
    if (activo) {
      setRenderizar(true);
      setFase("entrando");
    } else if (renderizar) {
      setFase("saliendo");
      const temporizador = setTimeout(() => {
        setRenderizar(false);
        setFase("oculto");
      }, 800); // Duración de la transición de salida
      return () => clearTimeout(temporizador);
    }
  }, [activo, renderizar]);

  if (!renderizar) return null;

  return (
    <div
      className={`fixed inset-0 z-50 pointer-events-none flex items-center justify-center transition-all duration-800 ${
        fase === "entrando"
          ? "bg-[#060a13]/60 backdrop-blur-sm opacity-100"
          : fase === "saliendo"
          ? "bg-transparent backdrop-blur-none opacity-0"
          : "opacity-0"
      }`}
    >
      {/* Círculo Rúnico de Luz */}
      <div
        className={`relative transition-all duration-800 cubic-bezier(0.5, 0, 0, 1) ${
          fase === "entrando"
            ? "scale-100 rotate-180 opacity-100"
            : fase === "saliendo"
            ? "scale-[2.5] rotate-360 opacity-0 blur-md"
            : "scale-50 opacity-0"
        }`}
      >
        <svg
          width="300"
          height="300"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_20px_rgba(229,193,88,0.8)] filter"
        >
          {/* Anillo Exterior */}
          <circle cx="100" cy="100" r="85" stroke="#d1b880" strokeWidth="1.5" strokeDasharray="5 3" className="animate-spin" style={{ animationDuration: "25s" }} />
          
          {/* Anillo Medio con Runas grabadas */}
          <circle cx="100" cy="100" r="75" stroke="#735f3d" strokeWidth="2" />
          
          {/* Runas de adorno (Textos SVG rotados) */}
          <g className="animate-spin" style={{ animationDuration: "40s", transformOrigin: "100px 100px" }}>
            <text x="100" y="38" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚠ</text>
            <text x="144" y="56" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚢ</text>
            <text x="162" y="100" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚦ</text>
            <text x="144" y="144" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚨ</text>
            <text x="100" y="162" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚱ</text>
            <text x="56" y="144" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚲ</text>
            <text x="38" y="100" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚷ</text>
            <text x="56" y="56" fill="#d1b880" fontSize="10" textAnchor="middle" fontFamily="monospace">ᚹ</text>
            
            <text x="122" y="42" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᚺ</text>
            <text x="158" y="78" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᚾ</text>
            <text x="158" y="122" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᛁ</text>
            <text x="122" y="158" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᛃ</text>
            <text x="78" y="158" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᛇ</text>
            <text x="42" y="122" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᛈ</text>
            <text x="42" y="78" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᛉ</text>
            <text x="78" y="42" fill="#8da382" fontSize="8" textAnchor="middle" fontFamily="monospace">ᛊ</text>
          </g>

          {/* Anillo Interior */}
          <circle cx="100" cy="100" r="55" stroke="#d1b880" strokeWidth="1" />
          
          {/* Triqueta / Nudo celta en el centro */}
          <path
            d="M100 65 C107 80 120 90 135 90 C120 90 110 100 100 115 C90 100 80 90 65 90 C80 90 93 80 100 65 Z"
            stroke="#d1b880"
            strokeWidth="1.5"
            fill="rgba(229, 193, 88, 0.05)"
            className="animate-pulse"
            style={{ animationDuration: "2s" }}
          />
          <path
            d="M100 115 C107 100 120 90 135 90 C120 90 110 80 100 65 C90 80 80 90 65 90 C80 90 93 100 100 115 Z"
            stroke="#8da382"
            strokeWidth="1"
            fill="none"
            opacity="0.7"
          />
          <circle cx="100" cy="90" r="18" stroke="#735f3d" strokeWidth="1" />
        </svg>
      </div>
    </div>
  );
}
