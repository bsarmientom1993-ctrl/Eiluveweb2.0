"use client";

import Image from "next/image";

const obtenerFechaObjeto = (c) => {
  if (c.fechaCompleta) {
    return new Date(c.fechaCompleta);
  }
  const partes = c.fecha.trim().split(/\s+/);
  if (partes.length === 2) {
    const dia = parseInt(partes[0]);
    const meses = {
      ENE: 0, FEB: 1, MAR: 2, ABR: 3, MAY: 4, JUN: 5,
      JUL: 6, AGO: 7, SEP: 8, OCT: 9, NOV: 10, DIC: 11
    };
    const mesStr = partes[1].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const mes = meses[mesStr.substring(0, 3)] ?? 5; // default June
    return new Date(2026, mes, dia);
  }
  return new Date(2026, 5, 15); // default fallback
};

const esFechaPasada = (c) => {
  if (!c) return false;
  const fechaConcierto = obtenerFechaObjeto(c);
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  fechaConcierto.setHours(0, 0, 0, 0);
  return fechaConcierto < hoy;
};

const ordenarConciertos = (lista) => {
  const hoy = new Date();
  
  const obtenerFechaCompletaObjeto = (c) => {
    const horaStr = c.hora || "20:00";
    if (c.fechaCompleta) {
      return new Date(`${c.fechaCompleta}T${horaStr}:00`);
    }
    const date = obtenerFechaObjeto(c);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return new Date(`${yyyy}-${mm}-${dd}T${horaStr}:00`);
  };

  const proximos = lista.filter(c => obtenerFechaCompletaObjeto(c) >= hoy)
    .sort((a, b) => obtenerFechaCompletaObjeto(a) - obtenerFechaCompletaObjeto(b));

  const pasados = lista.filter(c => obtenerFechaCompletaObjeto(c) < hoy)
    .sort((a, b) => obtenerFechaCompletaObjeto(b) - obtenerFechaCompletaObjeto(a));

  return [...proximos, ...pasados];
};

export default function Widgets({
  cancionActual,
  reproduciendo,
  alternarReproduccion,
  progreso,
  desplazar,
  adelantar,
  retroceder,
  tiempoActual,
  tiempoTotal,
  siguienteCancion,
  anteriorCancion,
  alHacerClickLlave,
  albumLink = "#",
  merchImg = "/merch_preview.png",
  merchLink = "#contacto",
  alHacerClickMerch,
  conciertos = []
}) {
  const manejarClickProgreso = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ancho = rect.width;
    const porcentaje = clickX / ancho;
    desplazar(porcentaje);
  };

  return (
    <div className="w-full relative z-20 px-4 md:px-8 pb-6 mt-3 hidden md:block">
      {/* Rejilla de tarjetas con más aire y separación (gap-6) */}
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Widget 1: Álbum (Diseñado como Reliquia del Bosque) */}
        <a
          href={albumLink}
          target={albumLink !== "#" && albumLink !== "" ? "_blank" : undefined}
          rel={albumLink !== "#" && albumLink !== "" ? "noopener noreferrer" : undefined}
          className="panel-reliquia p-4 flex flex-col justify-between group cursor-pointer h-full"
        >
          <div className="flex gap-3 mb-2">
            {/* Imagen de portada con zoom sutil */}
            <div className="w-16 h-16 bg-black/50 border border-[#735f3d]/40 overflow-hidden relative rounded-lg flex-shrink-0 shadow-inner">
              <Image
                src={cancionActual.portada || "/Somos todos.jpg"}
                alt="Portada La Taberna y el Bosque"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                unoptimized
                sizes="64px"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <span className="text-[9px] text-[#735f3d] font-serif tracking-[0.25em] uppercase block mb-0.5">
                  NUEVO ÁLBUM
                </span>
                <h3 className="font-serif text-[#d1b880] text-base font-bold leading-tight tracking-wide mb-0.5 transition-colors group-hover:text-white">
                  LA TABERNA Y EL BOSQUE
                </h3>
              </div>
              <span className="text-[8.5px] text-[#8da382] font-bold tracking-[0.15em] uppercase">
                YA DISPONIBLE
              </span>
            </div>
          </div>

          {/* Iconos de plataformas y botón de acción forjado */}
          <div className="space-y-2 pt-2 border-t border-[#735f3d]/20">
            <div className="flex space-x-4 text-[#735f3d]/80 justify-start px-1 text-xs">
              <span className="hover:text-[#d1b880] transition-colors"><i className="fab fa-spotify"></i></span>
              <span className="hover:text-[#d1b880] transition-colors"><i className="fab fa-youtube"></i></span>
              <span className="hover:text-[#d1b880] transition-colors"><i className="fab fa-apple"></i></span>
              <span className="hover:text-[#d1b880] transition-colors"><i className="fab fa-amazon"></i></span>
            </div>
            <span className="boton-forjado-premium text-[9px] tracking-[0.22em] font-serif font-bold py-1.5 rounded-lg w-full text-center block uppercase">
              ESCUCHAR ÁLBUM
            </span>
          </div>
        </a>

        {/* Widget 2: Conciertos (Piedra Tallada / Reliquia) */}
        <a
          href="#tour"
          className="panel-reliquia p-4 flex flex-col justify-between cursor-pointer group h-full"
        >
          <div className="flex justify-between items-center border-b border-[#735f3d]/30 pb-2 mb-2">
            <h3 className="font-serif text-[#d1b880] text-xs font-bold tracking-[0.2em] uppercase">
              CONCIERTOS Y GIRA
            </h3>
            <span className="text-[8.5px] font-mono text-[#8da382] bg-[#8da382]/10 border border-[#8da382]/30 px-1.5 py-0.5 rounded">
              {conciertos.length} FECHAS
            </span>
          </div>
          <ul className="flex-1 space-y-1.5 font-sans text-[10.5px] px-0.5">
            {ordenarConciertos(conciertos).slice(0, 3).map((concierto) => {
              const esPasado = esFechaPasada(concierto);
              return (
                <li 
                  key={concierto.id} 
                  className={`flex justify-between items-center p-1 rounded transition-all duration-300 ${
                    esPasado 
                      ? "bg-[#181410]/80 border border-[#735f3d]/30 hover:border-[#d1b880]/60 text-amber-200/90" 
                      : "bg-[#735f3d]/20 border border-[#fbbf24]/40 hover:bg-[#735f3d]/35 text-white shadow-[0_0_10px_rgba(251,191,36,0.12)]"
                  }`}
                >
                  <span className={`w-13 font-bold font-serif text-[9px] px-1 py-0.5 rounded text-center flex-shrink-0 ${
                    esPasado ? "bg-amber-950/60 text-amber-300 border border-amber-800/40" : "bg-amber-500/25 text-[#fbbf24] border border-amber-500/50"
                  }`}>
                    {concierto.fecha}
                  </span>
                  <span className="flex-1 truncate mx-1.5 font-serif text-[11px] font-semibold text-gray-100">
                    {concierto.nombre}
                  </span>
                  {esPasado ? (
                    <span className="text-[7.5px] font-mono bg-rose-950/80 text-rose-300 border border-rose-800/60 px-1 py-0.5 rounded flex-shrink-0">
                      FINALIZADO
                    </span>
                  ) : (
                    <span className="text-[7.5px] font-mono bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 px-1 py-0.5 rounded flex-shrink-0 animate-pulse">
                      PRÓXIMO
                    </span>
                  )}
                </li>
              );
            })}
          </ul>
          <div className="pt-2 mt-1 border-t border-[#735f3d]/20">
            <span className="boton-forjado-premium text-[9px] tracking-[0.22em] font-serif font-bold py-1.5 rounded-lg w-full text-center block uppercase">
              VER TODOS LOS CONCIERTOS
            </span>
          </div>
        </a>

        {/* Widget 3: Reproductor (Reliquia de Audio) */}
        <div className="panel-reliquia p-4 flex flex-col justify-between h-full">
          <h3 className="font-serif text-[#d1b880] text-xs font-bold tracking-[0.2em] text-center uppercase border-b border-[#735f3d]/30 pb-2 mb-2">
            ESCUCHA
          </h3>
          <div className="flex items-center gap-3 mb-2">
            {/* Portada pequeña del player con latido de luz */}
            <div className="w-9 h-9 bg-black border border-[#735f3d]/30 flex items-center justify-center rounded-lg relative overflow-hidden flex-shrink-0">
              <Image
                src={cancionActual.portada || "/Somos todos.jpg"}
                alt="Carátula"
                fill
                className="object-cover animate-pulse"
                style={{ animationDuration: "6s" }}
                unoptimized
                sizes="36px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-200 truncate tracking-wide">
                {cancionActual.titulo}
              </p>
              <p className="text-[9.5px] text-[#735f3d] font-serif truncate uppercase tracking-wider">
                {cancionActual.artista}
              </p>
            </div>
          </div>

          {/* Barra de progreso con resplandor dorado */}
          <div className="flex items-center text-[9px] text-gray-500 gap-2 mb-2">
            <span className="w-7 text-right font-mono">{tiempoActual}</span>
            <div
              className="flex-1 h-1 bg-gray-900 rounded-full cursor-pointer relative overflow-hidden shadow-inner border border-[#735f3d]/10"
              onClick={manejarClickProgreso}
            >
              <div
                className="h-full bg-gradient-to-r from-[#735f3d] to-[#d1b880] rounded-full transition-all duration-100 shadow-[0_0_8px_rgba(209,184,128,0.5)]"
                style={{ width: `${progreso}%` }}
              ></div>
            </div>
            <span className="w-7 font-mono">{tiempoTotal}</span>
          </div>

          {/* Controles de reproducción metálicos */}
          <div className="flex justify-between items-center text-[#d1b880]/80 px-1 pt-1 border-t border-[#735f3d]/20">
            <button
              onClick={retroceder}
              className="hover:text-white transition-colors"
              aria-label="Retroceder 10 segundos"
              title="Retroceder 10s"
            >
              <i className="fas fa-undo-alt text-[10px]"></i>
            </button>
            <button
              onClick={anteriorCancion}
              className="hover:text-white transition-colors"
              aria-label="Canción Anterior"
            >
              <i className="fas fa-step-backward text-[10px]"></i>
            </button>
            <button
              onClick={alternarReproduccion}
              className="w-8 h-8 rounded-full bg-[#735f3d]/25 border border-[#d1b880]/35 flex items-center justify-center text-[#d1b880] hover:bg-[#d1b880] hover:text-[#060a13] hover:border-[#d1b880] transition-all duration-300 hover:shadow-[0_0_12px_rgba(209,184,128,0.5)] hover:scale-105"
              aria-label={reproduciendo ? "Pausa" : "Reproducir"}
            >
              <i className={`fas ${reproduciendo ? "fa-pause text-[9px]" : "fa-play text-[9px] ml-0.5"}`}></i>
            </button>
            <button
              onClick={siguienteCancion}
              className="hover:text-white transition-colors"
              aria-label="Siguiente Canción"
            >
              <i className="fas fa-step-forward text-[10px]"></i>
            </button>
            <button
              onClick={adelantar}
              className="hover:text-white transition-colors"
              aria-label="Adelantar 10 segundos"
              title="Adelantar 10s"
            >
              <i className="fas fa-redo-alt text-[10px]"></i>
            </button>
          </div>
        </div>

        {/* Widget 4: Merch (Caja / Reliquia Antigua) */}
        <a
          href={merchLink}
          target={merchLink !== "#contacto" && merchLink !== "#" ? "_blank" : undefined}
          rel={merchLink !== "#contacto" && merchLink !== "#" ? "noopener noreferrer" : undefined}
          onClick={() => {
            if (merchLink === "#contacto" && alHacerClickMerch) {
              alHacerClickMerch();
            }
          }}
          className="panel-reliquia p-4 flex flex-col justify-between group cursor-pointer h-full"
        >
          <h3 className="font-serif text-[#d1b880] text-xs font-bold tracking-[0.2em] text-center uppercase border-b border-[#735f3d]/30 pb-2 mb-2 w-full">
            MERCH OFICIAL
          </h3>
          <div className="flex-1 flex items-center justify-center relative w-full h-16 mb-2">
            <div className="relative w-full h-full group-hover:scale-105 transition-transform duration-500">
              <Image
                src={merchImg}
                alt="Merch Oficial Eiluvë"
                fill
                className="object-contain filter drop-shadow-[0_6px_12px_rgba(0,0,0,0.8)]"
                unoptimized
                sizes="120px"
              />
            </div>
          </div>
          <div className="pt-2 border-t border-[#735f3d]/20">
            <span className="boton-forjado-premium text-[9px] tracking-[0.22em] font-serif font-bold py-1.5 rounded-lg w-full text-center block uppercase">
              IR A LA TIENDA
            </span>
          </div>
        </a>

      </div>

      {/* Llave Secreta en la parte inferior derecha (Portal a las Mazmorras) */}
      <div className="absolute right-4 bottom-4 md:right-8 md:bottom-4 z-30 llave-flotante-container">
        <button 
          onClick={alHacerClickLlave}
          className="w-16 h-16 rounded-full border-2 border-[#fbbf24]/60 bg-[#060a13]/95 flex items-center justify-center hover:border-[#fbbf24] hover:shadow-[0_0_30px_rgba(251,191,36,0.95)] hover:scale-115 transition-all duration-300 group shadow-2xl p-2.5 boton-llave-premium"
          title="Abrir las Mazmorras Secretas"
        >
          <div className="relative w-full h-full group-hover:rotate-45 transition-transform duration-500">
            <Image
              src="/pantalla-de-carga/llave-de-las-mazmorras.png"
              alt="Llave de las Mazmorras"
              fill
              unoptimized
              className="object-contain"
            />
          </div>
        </button>
      </div>
    </div>
  );
}
