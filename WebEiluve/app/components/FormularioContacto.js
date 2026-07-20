"use client";

import { useState, useEffect } from "react";

export default function FormularioContacto({ referenciaProp = "", setReferenciaProp, alEnviarMensaje }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    correo: "",
    referencia: "",
    mensaje: "",
  });
  const [estado, setEstado] = useState("libre"); // libre, enviando, enviado

  useEffect(() => {
    setDatosFormulario((previo) => ({ ...previo, referencia: referenciaProp }));
  }, [referenciaProp]);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setDatosFormulario((previo) => ({ ...previo, [name]: value }));
    if (name === "referencia" && setReferenciaProp) {
      setReferenciaProp(value);
    }
  };

  const manejarEnvio = (e) => {
    e.preventDefault();
    if (!datosFormulario.nombre || !datosFormulario.correo || !datosFormulario.mensaje) return;

    setEstado("enviando");

    // Simula el viaje del cuervo mensajero (2 segundos de retraso)
    setTimeout(() => {
      setEstado("enviado");
      if (alEnviarMensaje) {
        alEnviarMensaje({
          nombre: datosFormulario.nombre,
          correo: datosFormulario.correo,
          referencia: datosFormulario.referencia || "General / Pacto",
          mensaje: datosFormulario.mensaje
        });
      }
      window.dispatchEvent(new Event("eiluve_realtime_sync"));
      setDatosFormulario({ nombre: "", correo: "", referencia: "", mensaje: "" });
      if (setReferenciaProp) setReferenciaProp("");
    }, 2000);
  };

  return (
    <section id="contacto" className="py-24 bg-[#060a13] relative overflow-hidden">
      {/* Separador de línea mágica */}
      <div className="section-divider">
        <div className="magic-line"></div>
        <i className="fas fa-crow magic-rune"></i>
      </div>

      <div className="max-w-3xl mx-auto px-6 mt-10">
        <div className="text-center mb-12 reveal">
          <h2
            className="font-serif text-4xl text-[#d1b880] mb-4 tracking-wide"
            style={{ fontFamily: "'Cinzel', serif" }}
          >
            Envía un Cuervo
          </h2>
          <p className="text-gray-400">Para pactos, alianzas o conciertos.</p>
        </div>

        {estado !== "enviado" ? (
          <form
            onSubmit={manejarEnvio}
            className="bg-[#0c1322]/85 backdrop-blur-[10px] border border-[#d1b880]/30 p-8 space-y-6 rounded-sm shadow-2xl reveal-scale"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="sr-only" htmlFor="nombre-contacto">Tu Nombre / Clan</label>
                <input
                  id="nombre-contacto"
                  type="text"
                  name="nombre"
                  value={datosFormulario.nombre}
                  onChange={manejarCambio}
                  required
                  placeholder="Tu Nombre / Clan"
                  className="bg-[#060a13] border border-[#735f3d]/30 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d1b880] w-full transition-colors rounded-sm"
                  disabled={estado === "enviando"}
                />
              </div>
              <div>
                <label className="sr-only" htmlFor="correo-contacto">Correo (Pergamino)</label>
                <input
                  id="correo-contacto"
                  type="email"
                  name="correo"
                  value={datosFormulario.correo}
                  onChange={manejarCambio}
                  required
                  placeholder="Correo (Pergamino)"
                  className="bg-[#060a13] border border-[#735f3d]/30 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d1b880] w-full transition-colors rounded-sm"
                  disabled={estado === "enviando"}
                />
              </div>
            </div>
            <div>
              <label className="sr-only" htmlFor="referencia-contacto">Referencia (Asunto)</label>
              <input
                id="referencia-contacto"
                type="text"
                name="referencia"
                value={datosFormulario.referencia}
                onChange={manejarCambio}
                placeholder="Referencia (ej: Adquisición de Merchandising, Concierto...)"
                className="bg-[#060a13] border border-[#735f3d]/30 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d1b880] w-full transition-colors rounded-sm"
                disabled={estado === "enviando"}
              />
            </div>
            <div>
              <label className="sr-only" htmlFor="mensaje-contacto">El Mensaje...</label>
              <textarea
                id="mensaje-contacto"
                name="mensaje"
                value={datosFormulario.mensaje}
                onChange={manejarCambio}
                required
                rows="4"
                placeholder="El Mensaje..."
                className="bg-[#060a13] border border-[#735f3d]/30 p-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#d1b880] w-full resize-none transition-colors rounded-sm"
                disabled={estado === "enviando"}
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={estado === "enviando"}
              className="btn-gold w-full py-4 text-lg font-bold border border-[#d1b880] text-[#d1b880] tracking-widest hover:bg-[#d1b880]/10 transition-all duration-300 relative overflow-hidden flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(229,193,88,0.2)] rounded-sm"
            >
              {estado === "enviando" ? (
                <>
                  <i className="fas fa-feather-pointed animate-spin"></i>
                  ESCRIBIENDO RUNAS...
                </>
              ) : (
                <>
                  ENVIAR MENSAJE
                  <i className="fas fa-paper-plane text-sm"></i>
                </>
              )}
            </button>
          </form>
        ) : (
          <div className="bg-[#0c1322]/85 backdrop-blur-[10px] border border-[#d1b880]/40 p-10 text-center rounded-sm shadow-2xl reveal-scale space-y-6">
            <div className="relative h-20 w-20 mx-auto">
              {/* Animación del cuervo despegando */}
              <i className="fas fa-crow text-5xl text-[#d1b880] absolute inset-0 animate-bounce"></i>
            </div>
            <h3 className="font-serif text-2xl text-[#d1b880]">
              ¡El Cuervo ha Despegado!
            </h3>
            <p className="text-gray-300 max-w-md mx-auto">
              Tu mensaje ha sido atado a la pata de nuestro mensajero alado. Atravesará
              los bosques de niebla y llegará a nuestro clan en la próxima luna llena.
            </p>
            <button
              onClick={() => setEstado("libre")}
              className="px-6 py-2 border border-[#735f3d] text-[#735f3d] hover:text-[#d1b880] hover:border-[#d1b880] transition-colors text-xs font-bold tracking-widest uppercase rounded-sm"
            >
              ENVIAR OTRO MENSAJE
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
