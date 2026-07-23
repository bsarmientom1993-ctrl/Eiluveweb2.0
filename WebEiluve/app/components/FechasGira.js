"use client";

import { useState, useEffect } from "react";

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

export default function FechasGira({ conciertos = [] }) {
  const [conciertoSeleccionado, setConciertoSeleccionado] = useState(null);
  const [conciertoActivoMapa, setConciertoActivoMapa] = useState(null);
  const [cantidadEntradas, setCantidadEntradas] = useState(1);
  const [tipoEntrada, setTipoEntrada] = useState("general");
  const [compraExitosa, setCompraExitosa] = useState(false);
  const [pathSenda, setPathSenda] = useState("");

  // Calcular trayectoria procedimental dinámica de la senda conectando todos los conciertos próximos
  useEffect(() => {
    const proximos = conciertos.filter(c => !esFechaPasada(c));
    if (proximos.length < 2) {
      setPathSenda("");
      return;
    }
    // Ordenamos conciertos próximos por fecha para trazar una senda lógica
    const ordenados = [...proximos].sort((a, b) => {
      const dateA = a.fechaCompleta ? new Date(a.fechaCompleta) : obtenerFechaObjeto(a);
      const dateB = b.fechaCompleta ? new Date(b.fechaCompleta) : obtenerFechaObjeto(b);
      return dateA - dateB;
    });
    let d = `M ${ordenados[0].x} ${ordenados[0].y}`;
    for (let i = 1; i < ordenados.length; i++) {
      const prev = ordenados[i - 1];
      const curr = ordenados[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy1 = prev.y;
      const cpx2 = prev.x + (curr.x - prev.x) * 0.5;
      const cpy2 = curr.y;
      d += ` C ${cpx1} ${cpy1}, ${cpx2} ${cpy2}, ${curr.x} ${curr.y}`;
    }
    setPathSenda(d);
  }, [conciertos]);

  const abrirModalEntradas = (concierto) => {
    setConciertoSeleccionado(concierto);
    setCantidadEntradas(1);
    setTipoEntrada("general");
    setCompraExitosa(false);
  };

  const cerrarModal = () => {
    setConciertoSeleccionado(null);
  };

  const procesarCompra = (e) => {
    e.preventDefault();
    setCompraExitosa(true);
  };

  const obtenerPrecioTotal = () => {
    if (!conciertoSeleccionado) return 0;
    const precioBase =
      tipoEntrada === "general"
        ? conciertoSeleccionado.precioGeneral
        : conciertoSeleccionado.precioVip;
    return precioBase * cantidadEntradas;
  };

  return (
    <section id="tour" className="min-h-screen flex flex-col justify-center bg-[#03060a] relative overflow-hidden snap-start snap-always py-12 seccion-magica">
      {/* Elementos Mágicos del Bosque (Max 5) */}
      <div className="elemento-magico-runa text-4xl text-[#d1b880]/45 left-[8%] top-[15%] select-none font-serif">ᚱ</div>
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/35 left-[10%] bottom-[20%] select-none font-serif [animation-delay:2s]">ᛖ</div>
      <div className="elemento-magico-runa text-3xl text-[#d1b880]/40 right-[10%] bottom-[25%] select-none font-serif [animation-delay:4s]">ᛞ</div>
      {/* Luces de la Senda */}
      <div className="absolute right-[10%] top-[30%] w-6 h-6 rounded-full bg-yellow-500/32 blur-md animate-pulse pointer-events-none z-0"></div>
      <div className="absolute left-[15%] top-[70%] w-8 h-8 rounded-full bg-amber-600/25 blur-lg animate-pulse pointer-events-none z-0"></div>

      {/* Separador de línea mágica */}
      <div className="section-divider">
        <div className="magic-line"></div>
        <i className="fas fa-map-marked-alt magic-rune"></i>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mt-6 w-full relative z-10">
        <div className="text-center mb-10 reveal">
          <h2
            className="font-serif text-4xl text-[#d1b880] mb-4 tracking-widest uppercase"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            La Cacería (Mapa del Tesoro)
          </h2>
          <div className="h-[1px] w-48 bg-gradient-to-r from-transparent via-[#8da382] to-transparent mx-auto mb-3"></div>
          <p className="text-sm text-gray-400 max-w-lg mx-auto font-sans leading-relaxed hidden lg:block">
            Sigue la senda de la taberna a través del bosque. Pasa el cursor por las marcas ❌ para descubrir los conciertos rituales.
          </p>
          <p className="text-sm text-gray-400 max-w-lg mx-auto font-sans leading-relaxed lg:hidden">
            Sigue la senda de la taberna a través del bosque para descubrir los conciertos rituales.
          </p>
        </div>

        {/* Panel Doble de la Gira (Escritorio - Mapa + Fechas) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LADO IZQUIERDO: Mapa del Tesoro Interactivo */}
          <div className="lg:col-span-7 panel-pergamino-oscuro p-4 flex flex-col justify-between overflow-hidden relative min-h-[350px] md:min-h-[460px] reveal-left">
            
            {/* Título en pergamino */}
            <div className="absolute top-4 left-4 border-b border-[#735f3d]/50 pb-1 z-20">
              <span className="text-[10px] font-bold text-[#735f3d] tracking-widest uppercase">TERRA DE EILUVË</span>
            </div>

            {/* SVG del Mapa del Tesoro */}
            <div className="w-full h-full flex-grow relative z-10 flex items-center justify-center">
              <svg 
                viewBox="0 0 1000 600" 
                className="w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Líneas de cuadrícula de latitud y longitud vintage */}
                <line x1="100" y1="0" x2="100" y2="600" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />
                <line x1="300" y1="0" x2="300" y2="600" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />
                <line x1="500" y1="0" x2="500" y2="600" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />
                <line x1="700" y1="0" x2="700" y2="600" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />
                <line x1="900" y1="0" x2="900" y2="600" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />
                
                <line x1="0" y1="150" x2="1000" y2="150" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />
                <line x1="0" y1="300" x2="1000" y2="300" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />
                <line x1="0" y1="450" x2="1000" y2="450" stroke="#735f3d" strokeWidth="0.5" strokeDasharray="5,15" opacity="0.4" />

                {/* Rosa de los Vientos Vintage en la esquina superior izquierda */}
                <g transform="translate(130, 130) scale(0.9)" className="opacity-60 select-none">
                  <circle cx="0" cy="0" r="45" fill="none" stroke="#735f3d" strokeWidth="0.8" strokeDasharray="3,6"/>
                  <circle cx="0" cy="0" r="10" fill="none" stroke="#735f3d" strokeWidth="1"/>
                  <path d="M0,-65 L8,-15 L0,0 L-8,-15 Z" fill="#d1b880" />
                  <path d="M0,65 L8,15 L0,0 L-8,15 Z" fill="#735f3d" />
                  <path d="M65,0 L15,8 L0,0 L15,-8 Z" fill="#d1b880" />
                  <path d="-65,0 L-15,8 L0,0 L-15,-8 Z" fill="#735f3d" />
                  {/* Puntos intermedios */}
                  <path d="M45,-45 L10,-10 L0,0 L10,-10 Z" fill="#735f3d" opacity="0.7"/>
                  <path d="M-45,45 L-10,10 L0,0 L-10,10 Z" fill="#735f3d" opacity="0.7"/>
                  <path d="M45,45 L10,10 L0,0 L10,10 Z" fill="#735f3d" opacity="0.7"/>
                  <path d="M-45,-45 L-10,-10 L0,0 L-10,-10 Z" fill="#735f3d" opacity="0.7"/>
                  <text x="-6" y="-72" fill="#d1b880" className="text-[14px] font-bold font-serif">N</text>
                </g>

                {/* Ilustración de barco antiguo en la costa gallega (cerca de Vigo) */}
                <g className="opacity-45 barco-animado">
                  <path d="M0,20 C15,20 25,25 35,25 L40,25 C30,15 20,5 20,0 L12,8 C12,0 5,8 0,20 Z" fill="none" stroke="#735f3d" strokeWidth="1.6" />
                  <path d="M-10,20 L50,20 C40,28 10,28 -10,20 Z" fill="none" stroke="#735f3d" strokeWidth="1.6" />
                  <line x1="20" y1="0" x2="20" y2="30" stroke="#735f3d" strokeWidth="1.6" />
                  <path d="M20,0 L35,8 L20,12 Z" fill="#735f3d" opacity="0.6" />
                </g>

                {/* Ilustraciones de grupos de árboles (Bosques místicos) */}
                {/* Bosque 1 (Noroeste) */}
                <g transform="translate(300, 100) scale(0.7)" fill="none" stroke="#735f3d" strokeWidth="1.5" className="opacity-30">
                  <path d="M0,0 L8,15 L-8,15 Z M0,8 L10,22 L-10,22 Z M0,22 L0,30" />
                  <path d="M25,5 L31,17 L-19,17 Z M25,12 L33,24 L-21,24 Z M25,24 L25,32" transform="translate(15, 10) scale(0.9)" />
                  <path d="M-25,5 L-19,17 L-31,17 Z M-25,12 L-17,24 L-33,24 Z M-25,24 L-25,32" transform="translate(-15, 5) scale(0.9)" />
                </g>
                {/* Bosque 2 (Central) */}
                <g transform="translate(620, 280) scale(0.7)" fill="none" stroke="#735f3d" strokeWidth="1.5" className="opacity-30">
                  <path d="M0,0 L8,15 L-8,15 Z M0,8 L10,22 L-10,22 Z M0,22 L0,30" />
                  <path d="M25,5 L31,17 L-19,17 Z M25,12 L33,24 L-21,24 Z M25,24 L25,32" transform="translate(12, 8) scale(0.95)" />
                </g>
                {/* Bosque 3 (Sur) */}
                <g transform="translate(350, 480) scale(0.7)" fill="none" stroke="#735f3d" strokeWidth="1.5" className="opacity-30">
                  <path d="M0,0 L8,15 L-8,15 Z M0,8 L10,22 L-10,22 Z M0,22 L0,30" />
                  <path d="M-25,5 L-19,17 L-31,17 Z M-25,12 L-17,24 L-33,24 Z M-25,24 L-25,32" transform="translate(-10, 5) scale(0.9)" />
                </g>

                {/* Cordillera de montañas vintage (Pirineos / Cantábrico) */}
                <g transform="translate(600, 70) scale(0.85)" fill="none" stroke="#735f3d" strokeWidth="1.6" className="opacity-35">
                  <path d="M0,40 L30,0 L60,40" />
                  <path d="M15,20 L30,30 L45,20" />
                  <path d="M40,50 L65,15 L90,50" />
                  <path d="M52,32 L65,40 L78,32" />
                  <path d="M-30,50 L-5,10 L20,50" />
                </g>

                {/* Senda / Camino punteado del tesoro (Conecta las ciudades en orden de gira) */}
                {/* Senda: Vigo -> Bilbao -> Barcelona -> Madrid */}
                {pathSenda && (
                  <path 
                    d={pathSenda} 
                    fill="none" 
                    stroke="#d1b880" 
                    strokeWidth="2.5" 
                    className="opacity-75 camino-senda-animado"
                  />
                )}

                {/* Nombres de Regiones e Impresiones del mapa */}
                <text x="350" y="320" fill="#735f3d" opacity="0.25" className="text-[28px] font-serif tracking-[12px] uppercase select-none pointer-events-none">MAGNOLIA SILVA</text>
                <text x="750" y="480" fill="#735f3d" opacity="0.2" className="text-[20px] font-serif tracking-[8px] uppercase select-none pointer-events-none">OCEANUS</text>

                {/* Nodos de Concierto Interactivos (Solo se muestran conciertos próximos en el mapa) */}
                {conciertos.filter(c => !esFechaPasada(c)).map((concierto) => {
                  const estaActivo = conciertoActivoMapa?.id === concierto.id;
                  const esPasado = esFechaPasada(concierto);
                  return (
                    <g 
                      key={concierto.id}
                      transform={`translate(${concierto.x}, ${concierto.y})`}
                      className="cursor-pointer group"
                      onMouseEnter={() => setConciertoActivoMapa(concierto)}
                      onMouseLeave={() => setConciertoActivoMapa(null)}
                      onClick={() => abrirModalEntradas(concierto)}
                    >
                      {/* Anillo de pulso mágico */}
                      <circle 
                        r={estaActivo ? "26" : "18"} 
                        fill="none" 
                        stroke={estaActivo ? "#fbbf24" : (esPasado ? "#374151" : "#d1b880")} 
                        strokeWidth="1.5" 
                        className={`transition-all duration-300 ${estaActivo ? "animate-ping opacity-60" : "opacity-30"}`} 
                      />
                      
                      {/* Aura interna brillante */}
                      <circle 
                        r="14" 
                        fill={estaActivo ? "rgba(229, 193, 88, 0.25)" : (esPasado ? "rgba(75, 85, 99, 0.03)" : "rgba(115, 95, 61, 0.1)")} 
                        className="transition-colors duration-300" 
                      />

                      {/* Marca X o Checkmark del tesoro (✓ si finalizó) */}
                      {esPasado ? (
                        <path 
                          d="M -6 0 L -2 4 L 6 -4" 
                          stroke={estaActivo ? "#fbbf24" : "#8da382"} 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          strokeLinejoin="round"
                          fill="none"
                          className="transition-all duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <path 
                          d="M -7 -7 L 7 7 M 7 -7 L -7 7" 
                          stroke={estaActivo ? "#f59e0b" : "#d1b880"} 
                          strokeWidth="3.5" 
                          strokeLinecap="round" 
                          className="transition-all duration-300 group-hover:scale-110"
                        />
                      )}

                      {/* Nombre de la Ciudad en Pergamino del mapa */}
                      <text
                        y="-22"
                        textAnchor="middle"
                        fill={estaActivo ? "#ffffff" : (esPasado ? "#6b7280" : "#d1b880")}
                        className={`text-[13px] font-bold font-serif transition-colors duration-300 ${estaActivo ? "drop-shadow-[0_0_8px_#fbbf24]" : "opacity-85"}`}
                      >
                        {concierto.etiqueta} {esPasado ? "✓" : ""}
                      </text>
                      
                      <text
                        y="30"
                        textAnchor="middle"
                        fill={esPasado ? "#4b5563" : "#8da382"}
                        className={`text-[10px] font-sans tracking-wide uppercase transition-opacity duration-300 ${estaActivo ? "opacity-100" : "opacity-0"}`}
                      >
                        {concierto.fecha}
                      </text>
                    </g>
                  );
                })}
              </svg>

              {/* Tooltip HTML flotante flotando sobre el mapa */}
              {conciertoActivoMapa && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-[#0c1322]/95 backdrop-blur-md border border-[#d1b880] p-3 px-5 rounded shadow-2xl z-40 text-center animate-fade-in w-72 pointer-events-none">
                  <p className="text-[10px] text-[#8da382] font-bold tracking-widest uppercase">
                    {conciertoActivoMapa.fecha} {esFechaPasada(conciertoActivoMapa) ? "• CULMINADO ✓" : ""}
                  </p>
                  <p className="text-base font-bold text-white mt-0.5">{conciertoActivoMapa.nombre}</p>
                  <p className="text-xs text-gray-400">{conciertoActivoMapa.lugar}</p>
                  <p className="text-[10px] text-[#d1b880]/90 font-serif mt-1.5 italic">
                    {esFechaPasada(conciertoActivoMapa) ? "Este ritual ya ha culminado" : "Haga clic para ver información"}
                  </p>
                </div>
              )}
            </div>

            {/* Detalle inferior */}
            <div className="flex justify-between items-center text-[10px] text-[#735f3d]/60 font-mono relative z-10 border-t border-[#735f3d]/20 pt-2 px-1">
              <span>COORD: 42.87° N / 8.54° O</span>
              <span>RUSTIC MAP EDITION v2</span>
            </div>
          </div>

          {/* LADO DERECHO: Detalle Medieval de Fechas */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-4 reveal-right">
            {ordenarConciertos(conciertos).map((concierto) => {
              const estaEnFoco = conciertoActivoMapa?.id === concierto.id;
              const esPasado = esFechaPasada(concierto);
              return (
                <div
                  key={concierto.id}
                  onMouseEnter={() => !esPasado && setConciertoActivoMapa(concierto)}
                  onMouseLeave={() => !esPasado && setConciertoActivoMapa(null)}
                  className={`border p-5 px-6 flex flex-col sm:flex-row justify-between items-center transition-all duration-300 rounded-sm cursor-pointer ${
                    esPasado
                      ? "bg-[#181410]/80 border-[#735f3d]/40 hover:border-[#d1b880]"
                      : estaEnFoco 
                        ? "border-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.2)] bg-[#735f3d]/20 hover:bg-[#735f3d]/25" 
                        : "bg-[#0c1322]/85 border-[#d1b880]/30 hover:bg-[#735f3d]/15"
                  }`}
                  onClick={() => abrirModalEntradas(concierto)}
                >
                  <div className="text-center sm:text-left mb-2 sm:mb-0">
                    <span className={`text-[10px] font-bold tracking-widest block uppercase mb-0.5 ${esPasado ? "text-amber-400" : "text-[#8da382]"}`}>
                      {concierto.fecha} {concierto.hora ? ` - ${concierto.hora}` : ""} {esPasado ? " • FINALIZADO" : ""}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-white flex items-center gap-2" style={{ fontFamily: "'Cinzel', serif" }}>
                      <span>{concierto.nombre}</span>
                      {esPasado && (
                        <span className="text-[9px] bg-rose-950/80 text-rose-300 border border-rose-800/60 px-2 py-0.5 rounded font-mono font-normal">
                          ✓ REALIZADO
                        </span>
                      )}
                    </h4>
                    <p className="text-xs text-gray-300 mt-0.5 flex items-center justify-center sm:justify-start">
                      <i className="fas fa-map-marker-alt text-[#d1b880] mr-1.5 text-[10px]"></i>
                      {concierto.lugar}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirModalEntradas(concierto);
                    }}
                    className={`mt-3 sm:mt-0 px-5 py-2.5 text-[10px] tracking-widest font-bold font-sans uppercase border transition-all duration-300 rounded-sm ${
                      esPasado
                        ? "border-amber-700/50 text-amber-300 bg-amber-950/40 hover:bg-amber-900/60 cursor-pointer"
                        : "border-[#d1b880] text-[#d1b880] hover:bg-[#d1b880] hover:text-[#060a13]"
                    }`}
                  >
                    {esPasado ? "Ficha del Ritual" : "Ver Información"}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lista Compacta de Conciertos (Móvil - Sin mapa, visible y ordenado con prioridad y hora) */}
        <div className="lg:hidden flex flex-col space-y-3.5 w-full max-h-[62vh] overflow-y-auto pr-1">
          {ordenarConciertos(conciertos).map((concierto) => {
            const esPasado = esFechaPasada(concierto);
            return (
              <div
                key={concierto.id}
                onClick={() => abrirModalEntradas(concierto)}
                className={`flex items-center justify-between border p-4 rounded-xl cursor-pointer hover:shadow-lg transition-all ${
                  esPasado 
                    ? "bg-[#181410]/90 border-[#735f3d]/40" 
                    : "bg-[#0c1322]/70 backdrop-blur-md border-[#d1b880]/20 hover:border-[#fbbf24]"
                }`}
              >
                {/* Badge de fecha místico */}
                <div className={`flex flex-col items-center justify-center border rounded-lg w-14 h-14 flex-shrink-0 text-center ${
                  esPasado 
                    ? "bg-amber-950/50 border-amber-800/40" 
                    : "bg-[#735f3d]/15 border-[#735f3d]/30"
                }`}>
                  <span className={`text-xs font-bold font-mono uppercase ${esPasado ? "text-amber-300" : "text-[#fbbf24]"}`}>
                    {concierto.fecha.split(" ")[0]}
                  </span>
                  <span className={`text-[9px] font-mono uppercase -mt-0.5 ${esPasado ? "text-amber-400/80" : "text-gray-300"}`}>
                    {concierto.fecha.split(" ")[1]}
                  </span>
                </div>

                {/* Título y Lugar */}
                <div className="flex-grow min-w-0 px-4 text-left">
                  <h4 className="font-serif text-white text-sm font-bold leading-tight truncate uppercase flex items-center gap-1.5" style={{ fontFamily: "'Cinzel', serif" }}>
                    <span>{concierto.nombre}</span>
                    {esPasado && <span className="text-[8px] bg-rose-950/80 text-rose-300 border border-rose-800/60 px-1 py-0.2 rounded font-mono font-normal flex-shrink-0">FINALIZADO</span>}
                  </h4>
                  <p className="text-[11px] text-gray-300 truncate mt-1">
                    <i className="fas fa-clock text-[#d1b880] mr-1 text-[9px]"></i>
                    <span className="mr-2">{concierto.hora || "20:00"}</span>
                    <i className="fas fa-map-marker-alt text-[#d1b880] mr-1 text-[9px]"></i>
                    {concierto.lugar}
                  </p>
                </div>

                {/* Botón o Icono de información */}
                <div className={`text-[10px] font-mono uppercase tracking-wider flex items-center gap-1.5 flex-shrink-0 px-3 py-1.5 rounded-lg border transition-all ${
                  esPasado 
                    ? "text-amber-300 bg-amber-950/40 border-amber-800/40" 
                    : "text-[#fbbf24] bg-[#fbbf24]/5 border-[#fbbf24]/20 hover:bg-[#fbbf24]/20"
                }`}>
                  {esPasado ? "FICHA ✓" : "INFO"} <i className="fas fa-chevron-right text-[8px] opacity-80"></i>
                </div>
              </div>
            );
          })}
        </div>

      </div>

      {/* Modal de Entradas */}
      {conciertoSeleccionado && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative w-full max-w-md bg-[#0c1322] border border-[#d1b880]/40 rounded p-6 shadow-2xl">
            <button
              onClick={cerrarModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl focus:outline-none"
              aria-label="Cerrar"
            >
              <i className="fas fa-times"></i>
            </button>

            <div className="space-y-6">
              <h3
                className="font-serif text-2xl text-[#d1b880] border-b border-[#735f3d]/30 pb-3 uppercase tracking-wider text-center"
                style={{ fontFamily: "'Cinzel', serif" }}
              >
                {esFechaPasada(conciertoSeleccionado) ? "Ritual Culminado" : "Información del Ritual"}
              </h3>
              
              <div className="space-y-4">
                <div className="bg-[#060a13] p-4 border border-[#735f3d]/30 rounded-lg">
                  <span className="text-[10px] text-[#8da382] font-mono tracking-widest block uppercase mb-1">Nombre del Concierto</span>
                  <p className="text-xl font-bold text-white font-serif">{conciertoSeleccionado.nombre}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#060a13] p-4 border border-[#735f3d]/30 rounded-lg">
                    <span className="text-[10px] text-[#8da382] font-mono tracking-widest block uppercase mb-1">Fecha de la Gesta</span>
                    <p className="text-sm font-bold text-white">{conciertoSeleccionado.fecha}</p>
                  </div>
                  <div className="bg-[#060a13] p-4 border border-[#735f3d]/30 rounded-lg">
                    <span className="text-[10px] text-[#8da382] font-mono tracking-widest block uppercase mb-1">Ubicación / Sala</span>
                    <p className="text-sm font-bold text-white">{conciertoSeleccionado.lugar}</p>
                  </div>
                </div>

                <div className="bg-[#060a13] p-4 border border-[#735f3d]/30 rounded-lg">
                  <span className="text-[10px] text-[#8da382] font-mono tracking-widest block uppercase mb-2">Tributos de Entrada</span>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="text-gray-400">Pase General:</span>
                    <span className="font-bold text-[#d1b880]">{conciertoSeleccionado.precioGeneral}€</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">VIP del Bosque:</span>
                    <span className="font-bold text-[#fbbf24]">{conciertoSeleccionado.precioVip}€</span>
                  </div>
                </div>

                <div className="bg-[#060a13] p-4 border border-[#735f3d]/20 rounded-lg text-center">
                  <p className="text-xs text-gray-400 italic">
                    {esFechaPasada(conciertoSeleccionado) 
                      ? "Este ritual ya fue consagrado y ha finalizado en la fecha pactada."
                      : '"Las runas y los pases se consagrarán directamente en las puertas físicas de la taberna del evento."'
                    }
                  </p>
                </div>
              </div>

              <button
                onClick={cerrarModal}
                className="w-full py-3 bg-[#d1b880] text-[#060a13] font-bold text-center tracking-widest uppercase hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(229,193,88,0.3)] rounded-lg text-xs"
              >
                Cerrar Pergamino
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
