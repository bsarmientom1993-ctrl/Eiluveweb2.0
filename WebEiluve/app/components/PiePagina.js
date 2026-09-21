"use client";

import { useState } from "react";

export default function PiePagina() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [documentoActivo, setDocumentoActivo] = useState("aviso"); // 'aviso' o 'privacidad'

  const abrirDocumento = (tipo) => {
    setDocumentoActivo(tipo);
    setModalAbierto(true);
  };

  const cerrarModal = () => {
    setModalAbierto(false);
  };

  return (
    <>
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
            <button
              onClick={() => abrirDocumento("aviso")}
              className="hover:text-[#d1b880] transition-colors uppercase bg-transparent border-none p-0 cursor-pointer font-sans text-[10px] md:text-xs tracking-[0.2em]"
            >
              AVISO LEGAL
            </button>
            <span>|</span>
            <button
              onClick={() => abrirDocumento("privacidad")}
              className="hover:text-[#d1b880] transition-colors uppercase bg-transparent border-none p-0 cursor-pointer font-sans text-[10px] md:text-xs tracking-[0.2em]"
            >
              POLÍTICA DE PRIVACIDAD
            </button>
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

      {/* Modal Legal Flotante */}
      {modalAbierto && (
        <div 
          className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in"
          onClick={cerrarModal}
        >
          <div 
            className="relative w-full max-w-3xl max-h-[85vh] bg-[#0c0907] border-2 border-[#735f3d]/60 rounded-lg shadow-2xl flex flex-col overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Cabecera del Modal */}
            <div className="bg-[#16100c] border-b border-[#735f3d]/40 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[#fbbf24] text-lg">⚖️</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDocumentoActivo("aviso")}
                    className={`font-serif text-xs sm:text-sm uppercase tracking-wider px-3 py-1 rounded transition-colors ${
                      documentoActivo === "aviso"
                        ? "bg-[#735f3d] text-white font-bold"
                        : "text-gray-400 hover:text-[#d1b880]"
                    }`}
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Aviso Legal
                  </button>
                  <button
                    onClick={() => setDocumentoActivo("privacidad")}
                    className={`font-serif text-xs sm:text-sm uppercase tracking-wider px-3 py-1 rounded transition-colors ${
                      documentoActivo === "privacidad"
                        ? "bg-[#735f3d] text-white font-bold"
                        : "text-gray-400 hover:text-[#d1b880]"
                    }`}
                    style={{ fontFamily: "'Cinzel', serif" }}
                  >
                    Política de Privacidad
                  </button>
                </div>
              </div>

              <button
                onClick={cerrarModal}
                className="text-gray-400 hover:text-white text-xl p-1 transition-colors"
                aria-label="Cerrar"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>

            {/* Cuerpo del Documento */}
            <div className="p-6 overflow-y-auto space-y-5 text-gray-300 text-xs sm:text-sm leading-relaxed font-sans">
              {documentoActivo === "aviso" ? (
                <>
                  <h3 className="font-serif text-base sm:text-lg text-[#fbbf24] uppercase tracking-wider font-bold border-b border-[#735f3d]/30 pb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    TÉRMINOS Y AVISO LEGAL
                  </h3>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">1. Datos Identificativos</h4>
                    <p>
                      En cumplimiento con los deberes de información contemplados en las legislaciones vigentes de comercio electrónico y protección de datos, se informa que el presente sitio web es la plataforma oficial de la banda musical <strong>Eiluvë</strong> (en adelante, &ldquo;Eiluvë&rdquo;). Para cualquier consulta o contacto legal, puede utilizar el formulario oficial disponible en esta web.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">2. Propiedad Intelectual e Industrial</h4>
                    <p>
                      Todos los derechos de propiedad intelectual e industrial sobre la música, obras líricas, composiciones de sonido, fotografías, obras audiovisuales, artes gráficas, logotipos, símbolos rúnicos e ilustraciones presentes en este sitio web pertenecen en su totalidad a Eiluvë o a terceros que han autorizado expresamente su inclusión. Queda estrictamente prohibida la reproducción, copia, distribución, comunicación pública o transformación no autorizada de estos materiales sin el consentimiento escrito previo de Eiluvë.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">3. Condiciones de Uso del Sitio Web</h4>
                    <p>
                      El acceso y navegación por esta plataforma atribuye la condición de usuario e implica la aceptación de las presentes condiciones. El usuario se compromete a hacer un uso adecuado de los contenidos y servicios de la web, absteniéndose de realizar actividades ilícitas, contrarias a la buena fe o que atenten contra la seguridad del servidor.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">4. Enlaces a Plataformas de Terceros</h4>
                    <p>
                      Esta web contiene enlaces directos a plataformas musicales y redes sociales oficiales (Spotify, YouTube, Apple Music, Instagram, Facebook, TikTok). Eiluvë no ejerce control alguno sobre dichos sitios externos y no se responsabiliza de las políticas, prácticas o contenidos prestados por los mismos.
                    </p>
                  </section>
                </>
              ) : (
                <>
                  <h3 className="font-serif text-base sm:text-lg text-[#fbbf24] uppercase tracking-wider font-bold border-b border-[#735f3d]/30 pb-2" style={{ fontFamily: "'Cinzel', serif" }}>
                    POLÍTICA DE PRIVACIDAD Y PROTECCIÓN DE DATOS
                  </h3>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">1. Responsable del Tratamiento</h4>
                    <p>
                      El responsable del tratamiento de los datos personales recabados a través de este sitio web es el equipo de gestión oficial de la banda <strong>Eiluvë</strong>.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">2. Finalidad del Tratamiento</h4>
                    <p>
                      Los datos personales recabados a través del formulario de contacto o el buzón de la alianza (nombre, dirección de correo electrónico y contenido del mensaje) se utilizan exclusivamente para:
                    </p>
                    <ul className="list-disc pl-5 space-y-1 text-gray-400">
                      <li>Responder a solicitudes de información, dudas o contratación de conciertos.</li>
                      <li>Gestionar comunicaciones directas con los seguidores del clan.</li>
                      <li>Enviar actualizaciones sobre nuevos lanzamientos musicales o merchandising únicamente bajo expresa solicitud del usuario.</li>
                    </ul>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">3. Legitimación y Conservación</h4>
                    <p>
                      La base legal para el tratamiento de sus datos es el propio consentimiento expreso otorgado al enviar los formularios de la web. Los datos se conservarán durante el tiempo estrictamente necesario para resolver la solicitud o mientras no solicite su cancelación.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">4. Cesión de Datos y Cookies</h4>
                    <p>
                      Eiluvë no venderá, alquilará ni cederá sus datos personales a terceros bajo ninguna circunstancia. La web únicamente utiliza almacenamiento técnico local (<code>localStorage</code>) para guardar preferencias de volumen, reproducción y acceso a la alianza rúnica, sin emplear cookies publicitarias o de rastreo invasivo.
                    </p>
                  </section>

                  <section className="space-y-2">
                    <h4 className="font-bold text-[#d1b880] uppercase tracking-wide">5. Ejercicio de Derechos</h4>
                    <p>
                      Puede ejercitar en cualquier momento sus derechos de acceso, rectificación, cancelación, supresión y oposición mediante un mensaje enviado desde la sección de contacto de la propia web.
                    </p>
                  </section>
                </>
              )}
            </div>

            {/* Pie del Modal */}
            <div className="bg-[#16100c] border-t border-[#735f3d]/40 px-6 py-3 flex justify-end">
              <button
                onClick={cerrarModal}
                className="px-6 py-2 bg-[#735f3d] text-white font-bold uppercase tracking-wider text-xs rounded hover:bg-[#fbbf24] hover:text-black transition-colors"
              >
                Cerrar Documento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
