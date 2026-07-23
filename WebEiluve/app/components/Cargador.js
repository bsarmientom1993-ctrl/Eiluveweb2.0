"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const FRASES = [
  "Cargando suministros para la próxima gesta...",
  "El bardo marca el compás, el camino se abre ante nosotros...",
  "Cruzando las brumas del bosque prohibido...",
  "Nuestros caballos descansan, pronto comenzará la travesía...",
  "Preparando el banquete antes de que caiga la noche...",
  "Consultando las runas para trazar nuestro destino...",
  "Añadiendo lúpulo a la cerveza, templando el acero...",
  "Escuchando los susurros de los antiguos dioses...",
  "El juglar cuenta historias que el tiempo olvidó...",
  "Reuniendo a los clanes alrededor del fuego sagrado...",
  "Esperando a que la luna llena ilumine el escenario...",
  "En sintonía con la naturaleza...",
  "La leyenda está por comenzar...",
  "El bardo se quedó dormido, despertándolo con un barril de hidromiel...",
  "Estamos escondiendo las monedas de oro de los saqueadores...",
  "Buscando la taberna más cercana, un momento...",
  "Asegurándonos de que nadie se haya llevado el mapa del tesoro..."
];

const OBJETOS_MAGICOS = [
  {
    imagen: "/pantalla-de-carga/caldero.png",
    glow: "bg-[#8da382]/30 w-32 h-32 blur-2xl",
    animacionClass: "animate-bounce drop-shadow-[0_0_20px_rgba(74,232,217,0.7)]"
  },
  {
    imagen: "/pantalla-de-carga/pergamino.png",
    glow: "bg-[#d1b880]/30 w-32 h-32 blur-2xl",
    animacionClass: "animate-pulse drop-shadow-[0_0_20px_rgba(229,193,88,0.75)]"
  },
  {
    imagen: "/pantalla-de-carga/jarro.png",
    glow: "bg-[#d1b880]/30 w-32 h-32 blur-2xl",
    animacionClass: "animate-bounce drop-shadow-[0_0_20px_rgba(229,193,88,0.75)]"
  },
  {
    imagen: "/pantalla-de-carga/escudo-de-guerra.png",
    glow: "bg-gray-500/25 w-32 h-32 blur-2xl",
    animacionClass: "animate-pulse drop-shadow-[0_0_20px_rgba(255,255,255,0.35)]"
  },
  {
    imagen: "/pantalla-de-carga/el-cuervo.png",
    glow: "bg-[#8da382]/25 w-32 h-32 blur-2xl",
    animacionClass: "animate-pulse drop-shadow-[0_0_20px_rgba(74,232,217,0.55)]"
  },
  {
    imagen: "/pantalla-de-carga/anillo-demoniaco.png",
    glow: "bg-red-500/20 w-32 h-32 blur-2xl",
    animacionClass: "animate-bounce drop-shadow-[0_0_20px_rgba(239,68,68,0.7)]"
  },
  {
    imagen: "/pantalla-de-carga/espada.png",
    glow: "bg-blue-500/20 w-32 h-32 blur-2xl",
    animacionClass: "animate-pulse drop-shadow-[0_0_20px_rgba(96,165,250,0.7)]"
  },
  {
    imagen: "/pantalla-de-carga/reloj.png",
    glow: "bg-amber-500/20 w-32 h-32 blur-2xl",
    animacionClass: "animate-bounce drop-shadow-[0_0_20px_rgba(245,158,11,0.75)]"
  },
  {
    imagen: "/pantalla-de-carga/bola-de-cristal.png",
    glow: "bg-purple-500/25 w-32 h-32 blur-2xl",
    animacionClass: "animate-pulse drop-shadow-[0_0_20px_rgba(192,132,252,0.75)]"
  }
];

export default function Cargador({ alTerminarCarga = () => {}, frases = [] }) {
  const [visible, setVisible] = useState(true);
  const [montado, setMontado] = useState(true);
  const [frase, setFrase] = useState("Invocando Espíritus...");
  const [objeto, setObjeto] = useState(OBJETOS_MAGICOS[0]);

  useEffect(() => {
    // Selección aleatoria únicamente en cliente para prevenir hydration warning de SSR
    const listaFrases = frases && frases.length > 0 ? frases : FRASES;
    const fraseAleatoria = listaFrases[Math.floor(Math.random() * listaFrases.length)];
    const objetoAleatorio = OBJETOS_MAGICOS[Math.floor(Math.random() * OBJETOS_MAGICOS.length)];
    setFrase(fraseAleatoria);
    setObjeto(objetoAleatorio);

    const manejarCarga = () => {
      const temporizador = setTimeout(() => {
        setVisible(false);
      }, 2500); // 2.5s para apreciar la animación flotante y la revelación del texto
      return () => clearTimeout(temporizador);
    };

    if (document.readyState === "complete") {
      manejarCarga();
    } else {
      window.addEventListener("load", manejarCarga);
    }

    const temporizadorSeguridad = setTimeout(() => {
      setVisible(false);
    }, 4500);

    return () => {
      window.removeEventListener("load", manejarCarga);
      clearTimeout(temporizadorSeguridad);
    };
  }, []);

  useEffect(() => {
    if (!visible) {
      if (alTerminarCarga) {
        alTerminarCarga();
      }
      const temporizadorDesmontaje = setTimeout(() => {
        setMontado(false);
      }, 800);
      return () => clearTimeout(temporizadorDesmontaje);
    }
  }, [visible, alTerminarCarga]);

  if (!montado) return null;

  return (
    <div
      id="loader"
      className={`fixed inset-0 z-50 bg-[#060a13] flex flex-col items-center justify-center transition-all duration-800 ease-out px-4 text-center ${
        visible ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
      }`}
    >
      {/* Estilos CSS embebidos para animaciones mágicas auto-contenidas */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes levitacionMagica {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes revelacionBrilloTexto {
          0% {
            opacity: 0;
            filter: blur(12px);
            transform: scale(0.94);
            text-shadow: 0 0 0px rgba(229,193,88,0);
          }
          50% {
            text-shadow: 0 0 15px rgba(229,193,88,0.8);
          }
          100% {
            opacity: 1;
            filter: blur(0px);
            transform: scale(1);
            text-shadow: 0 2px 4px rgba(0,0,0,0.8);
          }
        }
        @keyframes zoomAcercar {
          0% { transform: scale(1); }
          100% { transform: scale(1.35); }
        }
        .objeto-flotante {
          animation: levitacionMagica 4.5s ease-in-out infinite;
        }
        .texto-revelado {
          animation: revelacionBrilloTexto 1.6s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .fondo-zoom {
          animation: zoomAcercar 16s ease-in-out infinite alternate;
          transform-origin: center center;
        }
      `}} />

      {/* Fondo de pantalla de carga con zoom-in y mayor iluminación */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
        <Image
          src="/pantalla-de-carga/fondo-pantalla-de-carga.png"
          alt="Fondo de Carga"
          fill
          unoptimized
          className="object-cover opacity-60 filter brightness-[0.88] contrast-[1.05] fondo-zoom"
          priority
        />
        {/* Capa de overlay radial para fusionar con bordes oscuros */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#060a13] opacity-80"></div>
        <div className="absolute inset-0 bg-black/25"></div>
      </div>

      {/* Contenedor del Objeto Levitante (Más Grande) */}
      <div className="relative w-48 h-48 mb-10 objeto-flotante flex items-center justify-center z-10">
        {/* Resplandor circular de fondo */}
        <div className={`absolute blur-3xl rounded-full ${objeto.glow}`}></div>
        
        {/* Imagen del objeto mágico base con animaciones aplicadas directamente */}
        <div className={`relative w-36 h-36 z-10 select-none pointer-events-none ${objeto.animacionClass}`}>
          <Image
            src={objeto.imagen}
            alt="Objeto Mágico"
            fill
            unoptimized
            className="object-contain"
            sizes="150px"
            priority
          />
        </div>
      </div>
      
      {/* Mensaje dinámico con animación de niebla/revelación de brillo */}
      <h2 className="font-serif text-lg md:text-xl text-[#d1b880] tracking-[0.15em] max-w-xl leading-relaxed uppercase px-4 texto-revelado opacity-0 relative z-10">
        {frase}
      </h2>
    </div>
  );
}
