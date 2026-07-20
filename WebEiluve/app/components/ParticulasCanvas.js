"use client";

import { useEffect, useRef } from "react";

export default function ParticulasCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let idFotogramaAnimacion;
    let particulas = [];
    let estrellas = [];
    const raton = { x: null, y: null, radio: 130 };

    // Paletas de colores
    const coloresPolvo = [
      "rgba(74, 232, 217, 0.42)",
      "rgba(168, 85, 247, 0.38)",
      "rgba(52, 211, 153, 0.38)",
      "rgba(251, 191, 36, 0.42)",
    ];

    const coloresHojas = [
      "rgba(34, 139, 34, 0.65)",
      "rgba(217, 119, 6, 0.6)",
      "rgba(110, 172, 108, 0.55)",
    ];

    const coloresLuciernagas = [
      { color: "rgba(74, 232, 217, 0.8)", shadow: "rgba(74, 232, 217, 0.95)" },
      { color: "rgba(52, 211, 153, 0.8)", shadow: "rgba(52, 211, 153, 0.95)" },
      { color: "rgba(245, 158, 11, 0.85)", shadow: "rgba(245, 158, 11, 0.95)" },
      { color: "rgba(168, 85, 247, 0.8)", shadow: "rgba(168, 85, 247, 0.95)" },
    ];

    const coloresNieve = [
      "rgba(241, 245, 249, 0.6)",
      "rgba(238, 220, 254, 0.5)",
    ];

    const coloresGotas = [
      "rgba(103, 232, 249, 0.32)",
      "rgba(96, 165, 250, 0.28)",
    ];

    // Elección aleatoria de exactamente 2 tipos de partículas para esta sesión
    const tiposDisponibles = ["polvo", "luciernaga", "hoja", "nieve", "gota"];
    const tiposSeleccionados = tiposDisponibles
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);

    // Ajustar dimensiones del canvas
    const redimensionarCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      inicializarEstrellas();
    };

    const inicializarEstrellas = () => {
      estrellas = [];
      const cantidadEstrellas = Math.min(25, Math.floor(canvas.width / 50));
      for (let i = 0; i < cantidadEstrellas; i++) {
        estrellas.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height * 0.38),
          size: Math.random() * 1.5 + 0.4,
          fase: Math.random() * Math.PI * 2,
          velocidadFase: Math.random() * 0.016 + 0.005,
          color: Math.random() > 0.5 ? "rgba(253, 251, 243, 0.9)" : "rgba(200, 225, 255, 0.8)"
        });
      }
    };

    window.addEventListener("resize", redimensionarCanvas);

    const manejarMovimientoRaton = (e) => {
      raton.x = e.clientX;
      raton.y = e.clientY;
    };

    const manejarSalidaRaton = () => {
      raton.x = null;
      raton.y = null;
    };

    window.addEventListener("mousemove", manejarMovimientoRaton);
    window.addEventListener("mouseleave", manejarSalidaRaton);

    // Clase de partículas
    class Particula {
      constructor() {
        this.reiniciar(true);
      }

      reiniciar(inicioCompleto = false) {
        this.tipo = tiposSeleccionados[Math.floor(Math.random() * tiposSeleccionados.length)];
        this.x = Math.random() * canvas.width;
        
        if (this.tipo === "polvo" || this.tipo === "luciernaga") {
          this.y = inicioCompleto ? Math.random() * canvas.height : canvas.height + Math.random() * 60;
          this.direcciónY = -1;
        } else {
          this.y = inicioCompleto ? Math.random() * canvas.height : -30 - Math.random() * 80;
          this.direcciónY = 1;
        }

        // Parámetros específicos por tipo (INCREMENTADO EL TAMAÑO GENERAL)
        if (this.tipo === "polvo") {
          this.size = Math.random() * 3.5 + 1.2; // Más grande y visible (1.2px - 4.7px)
          this.velocidadY = Math.random() * 0.8 + 0.25;
          this.velocidadX = (Math.random() - 0.5) * 0.3;
          this.color = coloresPolvo[Math.floor(Math.random() * coloresPolvo.length)];
          this.opacidadMax = Math.random() * 0.55 + 0.15;
        } 
        else if (this.tipo === "luciernaga") {
          this.size = Math.random() * 4.8 + 3.2; // Luciérnagas prominentes (3.2px - 8.0px)
          this.velocidadY = Math.random() * 0.35 + 0.12;
          this.velocidadX = (Math.random() - 0.5) * 0.22;
          
          const configLuc = coloresLuciernagas[Math.floor(Math.random() * coloresLuciernagas.length)];
          this.color = configLuc.color;
          this.shadowColor = configLuc.shadow;
          
          this.opacidadMax = Math.random() * 0.6 + 0.35;
          this.anguloSeno = Math.random() * Math.PI * 2;
          this.velocidadAngulo = Math.random() * 0.015 + 0.005;
          this.frecuenciaOndulacion = Math.random() * 0.45 + 0.25;
        } 
        else if (this.tipo === "hoja") {
          this.size = Math.random() * 7.0 + 4.5; // Hojas más grandes (4.5px - 11.5px)
          this.velocidadY = Math.random() * 0.65 + 0.45;
          this.velocidadX = (Math.random() - 0.4) * 0.2;
          this.color = coloresHojas[Math.floor(Math.random() * coloresHojas.length)];
          this.opacidadMax = Math.random() * 0.5 + 0.25;
          this.anguloRotacion = Math.random() * Math.PI * 2;
          this.velocidadRotacion = (Math.random() - 0.5) * 0.022;
          this.anguloSeno = Math.random() * Math.PI * 2;
          this.velocidadAngulo = Math.random() * 0.018 + 0.008;
          this.frecuenciaOndulacion = Math.random() * 0.7 + 0.4;
        } 
        else if (this.tipo === "nieve") {
          this.size = Math.random() * 2.8 + 1.6; // Copos visibles (1.6px - 4.4px)
          this.velocidadY = Math.random() * 0.45 + 0.3;
          this.velocidadX = (Math.random() - 0.3) * 0.15;
          this.color = coloresNieve[Math.floor(Math.random() * coloresNieve.length)];
          this.opacidadMax = Math.random() * 0.55 + 0.2;
        } 
        else if (this.tipo === "gota") {
          this.size = Math.random() * 6.0 + 5.0; // Gotas más largas
          this.velocidadY = Math.random() * 1.8 + 1.2;
          this.velocidadX = 0.2;
          this.color = coloresGotas[Math.floor(Math.random() * coloresGotas.length)];
          this.opacidadMax = Math.random() * 0.3 + 0.1;
        }

        this.opacidad = Math.random() * this.opacidadMax;
        this.velocidadOpacidad = Math.random() * 0.005 + 0.002;
        this.creciendoOpacidad = Math.random() > 0.5;
        this.desplazamientoFuerzaX = 0;
        this.desplazamientoFuerzaY = 0;
      }

      actualizar() {
        if (raton.x !== null && raton.y !== null) {
          const dx = this.x - raton.x;
          const dy = this.y - raton.y;
          const distancia = Math.sqrt(dx * dx + dy * dy);

          if (distancia < raton.radio) {
            const fuerza = (raton.radio - distancia) / raton.radio;
            const empujeX = (dx / distancia) * fuerza * 2.0;
            const factorEmpuje = this.tipo === "gota" ? 0.3 : this.tipo === "hoja" ? 1.4 : 1.0;

            this.desplazamientoFuerzaX += (empujeX * factorEmpuje - this.desplazamientoFuerzaX) * 0.09;
            this.desplazamientoFuerzaY += ((dy / distancia) * fuerza * 1.4 * factorEmpuje - this.desplazamientoFuerzaY) * 0.09;
          } else {
            this.desplazamientoFuerzaX *= 0.94;
            this.desplazamientoFuerzaY *= 0.94;
          }
        } else {
          this.desplazamientoFuerzaX *= 0.94;
          this.desplazamientoFuerzaY *= 0.94;
        }

        this.y += (this.velocidadY * this.direcciónY + this.desplazamientoFuerzaY);
        this.x += (this.velocidadX + this.desplazamientoFuerzaX);

        if (this.tipo === "luciernaga") {
          this.anguloSeno += this.velocidadAngulo;
          this.x += Math.sin(this.anguloSeno) * this.frecuenciaOndulacion;
        } 
        else if (this.tipo === "hoja") {
          this.anguloRotacion += this.velocidadRotacion;
          this.anguloSeno += this.velocidadAngulo;
          this.x += Math.sin(this.anguloSeno) * this.frecuenciaOndulacion;
        }

        if (this.creciendoOpacidad) {
          this.opacidad += this.velocidadOpacidad;
          if (this.opacidad >= this.opacidadMax) this.creciendoOpacidad = false;
        } else {
          this.opacidad -= this.velocidadOpacidad;
          if (this.opacidad <= 0.02) this.creciendoOpacidad = true;
        }

        if (this.direcciónY === -1) {
          if (this.y < -20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reiniciar(false);
          }
        } else {
          if (this.y > canvas.height + 20 || this.x < -20 || this.x > canvas.width + 20) {
            this.reiniciar(false);
          }
        }
      }

      dibujar() {
        ctx.globalAlpha = this.opacidad;

        if (this.tipo === "polvo" || this.tipo === "nieve") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
        } 
        else if (this.tipo === "luciernaga") {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.shadowBlur = this.size * 3.8;
          ctx.shadowColor = this.shadowColor;
          ctx.fill();
          ctx.shadowBlur = 0;
        } 
        else if (this.tipo === "hoja") {
          ctx.save();
          ctx.translate(this.x, this.y);
          ctx.rotate(this.anguloRotacion);
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size, this.size * 0.45, 0, 0, Math.PI * 2);
          ctx.fillStyle = this.color;
          ctx.fill();
          
          ctx.beginPath();
          ctx.moveTo(-this.size, 0);
          ctx.lineTo(this.size * 0.8, 0);
          ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
          ctx.lineWidth = 0.6;
          ctx.stroke();
          ctx.restore();
        } 
        else if (this.tipo === "gota") {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + this.velocidadX * 3, this.y + this.size);
          ctx.strokeStyle = this.color;
          ctx.lineWidth = 1.0;
          ctx.stroke();
        }

        ctx.globalAlpha = 1.0;
      }
    }

    redimensionarCanvas();

    const cantidadParticulas = Math.min(85, Math.floor(canvas.width / 15));
    for (let i = 0; i < cantidadParticulas; i++) {
      particulas.push(new Particula());
    }

    const animar = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Centelleo de estrellas (se mantiene al fondo de la pantalla fija)
      for (let i = 0; i < estrellas.length; i++) {
        const estrella = estrellas[i];
        estrella.fase += estrella.velocidadFase;
        const brillo = Math.max(0.1, Math.min(0.8, (Math.sin(estrella.fase) + 1) / 2));
        
        ctx.beginPath();
        ctx.arc(estrella.x, estrella.y, estrella.size, 0, Math.PI * 2);
        ctx.fillStyle = estrella.color;
        ctx.globalAlpha = brillo;
        ctx.fill();
      }
      ctx.globalAlpha = 1.0;

      for (let i = 0; i < particulas.length; i++) {
        particulas[i].actualizar();
        particulas[i].dibujar();
      }
      
      idFotogramaAnimacion = requestAnimationFrame(animar);
    };
    animar();

    return () => {
      window.removeEventListener("resize", redimensionarCanvas);
      window.removeEventListener("mousemove", manejarMovimientoRaton);
      window.removeEventListener("mouseleave", manejarSalidaRaton);
      cancelAnimationFrame(idFotogramaAnimacion);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
