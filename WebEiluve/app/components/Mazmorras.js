"use client";

import { useState, useEffect, useRef } from "react";

export default function Mazmorras({ abierta, alCerrar, passcode = "bsm669", miembros = [], canciones = [], fotos = [], videos = [], nfcCodes = [], fansRegistrados = [], setFansRegistrados }) {
  const [codigo, setCodigo] = useState("");
  const [accesoConcedido, setAccesoConcedido] = useState(false);
  const [abriendoPuerta, setAbriendoPuerta] = useState(false);
  const [cerrandoPuerta, setCerrandoPuerta] = useState(false);
  const [pantallaTemblar, setPantallaTemblar] = useState(false);
  const [pantallaSismoViolento, setPantallaSismoViolento] = useState(false);
  const [errorCodigo, setErrorCodigo] = useState(false);
  const [activarDestello, setActivarDestello] = useState(false);
  const [desbloqueoRunico, setDesbloqueoRunico] = useState(false);
  const [mensajeSellar, setMensajeSellar] = useState("");
  const [mostrarMensajeSellar, setMostrarMensajeSellar] = useState(false);
  const [desvanecerCierre, setDesvanecerCierre] = useState(false);

  
  // Gestión de Contenido: Pestaña Activa y Siguiente para la Transición de Libro en 3D
  const [pestanaActiva, setPestanaActiva] = useState("audios");
  const [pestanaSiguiente, setPestanaSiguiente] = useState(null);
  const [paginaVolteando, setPaginaVolteando] = useState(false);

  // INTERACTIVIDAD EXCLUSIVA: Estados de Alquimia y Runas
  const [modoMagico, setModoMagico] = useState(0); // 0: Forja, 1: Fatuo, 2: Amatista, 3: Silvestre
  const [particulas, setParticulas] = useState([]);
  const [susurroActivo, setSusurroActivo] = useState("");
  const [susurroTimer, setSusurroTimer] = useState(null);
  const [columnaActiva, setColumnaActiva] = useState(null); // 'izq' o 'der'
  const [ondasClic, setOndasClic] = useState([]);
  const [criaturas, setCriaturas] = useState([]);
  const [dungeonPreparado, setDungeonPreparado] = useState(false);
  const [capturasCount, setCapturasCount] = useState(0);
  const [objetosEstado, setObjetosEstado] = useState({
    harpa: "esperando",
    pocion: "esperando",
    contenedor: "esperando",
    mapa: "esperando",
    ikl: "esperando"
  });
  const [objetosPos, setObjetosPos] = useState({
    harpa: { left: 8, top: 80 },
    pocion: { left: 92, top: 82 },
    contenedor: { left: 92, top: 12 },
    mapa: { left: 8, top: 12 },
    ikl: { left: 76, top: 85 }
  });

  // Estados para el Formulario de Contacto de Miembros de la Banda
  const [contactoSeleccionado, setContactoSeleccionado] = useState(null);
  const [asuntoContacto, setAsuntoContacto] = useState("");
  const [mensajeContacto, setMensajeContacto] = useState("");
  const [mensajeroContacto, setMensajeroContacto] = useState("cuervo");
  const [misivaEnviada, setMisivaEnviada] = useState(false);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState("");

  // Estados para el Formulario de Registro de Fanático
  const [codigoVerificado, setCodigoVerificado] = useState(false);
  const [nombreFan, setNombreFan] = useState("");
  const [emailFan, setEmailFan] = useState("");
  const [telefonoFan, setTelefonoFan] = useState("");
  const [paisFan, setPaisFan] = useState("");
  const [fanActual, setFanActual] = useState(null);
  const [nuevoMensajeFan, setNuevoMensajeFan] = useState("");

  // Estados para el Saludo Misterioso de Cuento de Hadas
  const [saludoMisterioso, setSaludoMisterioso] = useState("");
  const [saludoPos, setSaludoPos] = useState({ top: "8%", left: "5%", right: "auto", bottom: "auto", transform: "none" });
  const [saludoVisible, setSaludoVisible] = useState(false);

  // Estados para Easter Eggs
  const [clicsTitulo, setClicsTitulo] = useState(0);
  const [modoEclipse, setModoEclipse] = useState(false);
  const [mensajeErrorCodigo, setMensajeErrorCodigo] = useState("Código incorrecto. Los guardianes rechazan tu ofrenda.");








  // Audio Player de las Mazmorras
  const [cancionActivaDungeon, setCancionActivaDungeon] = useState(null);
  const [reproduciendoDungeon, setReproduciendoDungeon] = useState(false);
  const [progresoAudio, setProgresoAudio] = useState(0);
  const audioRefDungeon = useRef(null);

  // Lista de canciones para reproducir el disco completo + Demos
  const albumCompleto = canciones && canciones.length > 0 ? canciones : [
    {
      id: 1,
      titulo: "Somos todos",
      tipo: "Álbum Oficial",
      enlace: "/Somos todos.mp3",
      duracion: "6:12"
    },
    {
      id: 2,
      titulo: "Tú Voz (Demo Acústica)",
      tipo: "Maqueta Inédita",
      enlace: "/Tu voz.mp3",
      duracion: "7:05"
    },
    {
      id: 3,
      titulo: "Quizás mañana",
      tipo: "Álbum Oficial",
      enlace: "/Quizas mañana.mp3",
      duracion: "5:44"
    },
    {
      id: 4,
      titulo: "El matriqui del diablo",
      tipo: "Álbum Oficial",
      enlace: "/El matriqui del diablo.mp3",
      duracion: "5:44"
    }
  ];

  // Fotos inéditas exclusivas
  const fotosIneditas = fotos && fotos.length > 0 ? fotos : [
    {
      id: 1,
      titulo: "Retrato del Bardo",
      descripcion: "Sesión conceptual con zanfoña en el robledal sagrado.",
      src: "/Somos todos.jpg"
    },
    {
      id: 2,
      titulo: "El Cónclave Secreto",
      descripcion: "Ensayo nocturno a la luz de las antorchas.",
      src: "/Tu voz.jpg"
    },
    {
      id: 3,
      titulo: "La Ofrenda al Bosque",
      descripcion: "Detalle del altar rúnico tallado para la portada.",
      src: "/Quizas mañana.jpg"
    },
    {
      id: 4,
      titulo: "La Senda del Fuego",
      descripcion: "Boceto cromático descartado para el Ritual.",
      src: "/El matriqui del diablo.jpg"
    }
  ];

  // Clips de vídeo inéditos
  const [videoModalAbierto, setVideoModalAbierto] = useState(false);
  const [videoUrlActual, setVideoUrlActual] = useState("");

  const clipsIneditos = videos && videos.length > 0 ? videos : [
    {
      id: 1,
      titulo: "Ensayos bajo la Bruma",
      descripcion: "Metraje en crudo de los primeros ensayos de flauta y violín.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      imagen: "/Somos todos.jpg"
    },
    {
      id: 2,
      titulo: "Grabando Voces",
      descripcion: "Tomas descartadas en el estudio rústico de grabación.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      imagen: "/Tu voz.jpg"
    }
  ];

  // Efecto para generar 30 partículas aleatorias al cargar el componente
  useEffect(() => {
    const nuevasParticulas = Array.from({ length: 30 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      bottom: Math.random() * 35,
      size: Math.random() * 3 + 1.2,
      duration: Math.random() * 6 + 6,
      delay: Math.random() * -10, // delay negativo para que aparezcan ya distribuidas
      sway: Math.random() > 0.5 ? "flotarPolvoSway1" : "flotarPolvoSway2",
    }));
    setParticulas(nuevasParticulas);
  }, []);

  // 🧚 Y 🧪 SISTEMA EXCLUSIVO: EXACTAMENTE 1 SOLO ELEMENTO ÚNICO EN PANTALLA EN TODO MOMENTO (EN MARGENES EXTREMOS)
  useEffect(() => {
    if (!accesoConcedido || !dungeonPreparado || cerrandoPuerta) return;

    let timeoutId = null;

    const todosLosTipos = [
      // CRIATURAS (IMÁGENES PNG REALES DE /Criaturas/)
      { tipo: "brote_maldad", nombre: "Brote de Maldad", img: "/Criaturas/brote de maldad.png", anim: "crecerBrote 8s ease-in-out forwards", duracion: 8000, shadow: "drop-shadow-[0_0_15px_#f43f5e]" },
      { tipo: "escolta_muerte", nombre: "Escolta de la Muerte", img: "/Criaturas/escolta de la muerte.png", anim: "desplazarEscolta 9s ease-in-out forwards", duracion: 9000, shadow: "drop-shadow-[0_0_18px_#fbbf24]" },
      { tipo: "espiritu_bosque", nombre: "Espíritu del Bosque", img: "/Criaturas/espiritu del bosque.png", anim: "orbitaEspirituBosque 8s ease-in-out forwards", duracion: 8000, shadow: "drop-shadow-[0_0_18px_#10b981]" },
      { tipo: "fauna_herrante", nombre: "Fauna Herrante", img: "/Criaturas/fauna herrante.png", anim: "galopeFauna 9s linear forwards", duracion: 9000, shadow: "drop-shadow-[0_0_15px_#fde047]" },
      { tipo: "juglar_olvidado", nombre: "Juglar Olvidado", img: "/Criaturas/juglar olvidado.png", anim: "tocarJuglar 8s ease-in-out forwards", duracion: 8000, shadow: "drop-shadow-[0_0_15px_#fb923c]" },

      // OBJETOS Y RELIQUIAS (IMÁGENES PNG REALES DE /Objetos/)
      { tipo: "harpa_malditos", nombre: "Harpa de los Malditos", img: "/Objetos/harpa de los malditos.png", anim: "flotarHada 8s ease-in-out forwards", duracion: 8000, shadow: "drop-shadow-[0_0_18px_#fbbf24]" },
      { tipo: "pocion_vida", nombre: "Pócima de Vida", img: "/Objetos/pocion vida.png", anim: "asomarDuende 8s ease-in-out forwards", duracion: 8000, shadow: "drop-shadow-[0_0_18px_#34d399]" },
      { tipo: "contenedor_almas", nombre: "Contenedor de Almas", img: "/Objetos/Contenedor de almas.png", anim: "flotarFantasma 9s ease-in-out forwards", duracion: 9000, shadow: "drop-shadow-[0_0_20px_#c084fc]" },
      { tipo: "mapa_runico", nombre: "Mapa Rúnico", img: "/Objetos/Mapa.png", anim: "volarEspiritu 8s linear forwards", duracion: 8000, shadow: "drop-shadow-[0_0_15px_#38bdf8]" },
      { tipo: "ikl_reliquia", nombre: "Reliquia Ikl", img: "/Objetos/Ikl.png", anim: "orbitaEspirituBosque 9s ease-in-out forwards", duracion: 9000, shadow: "drop-shadow-[0_0_18px_#22d3ee]" }
    ];

    const spawnearElementoUnico = () => {
      // Escoger un elemento aleatorio de la lista
      const itemEscogido = todosLosTipos[Math.floor(Math.random() * todosLosTipos.length)];
      const id = `visual-${Date.now()}`;
      const esLadoIzquierdo = Math.random() > 0.5;

      // Coordenadas extremas de las paredes exteriores (2% o 94%) totalmente alejadas del cuadro central
      let nuevoElemento = {
        id,
        ...itemEscogido,
        left: esLadoIzquierdo ? 2 : 94,
        top: Math.random() * 40 + 30,
        scale: 0.95
      };

      if (itemEscogido.tipo === "pocion_vida") {
        nuevoElemento.left = esLadoIzquierdo ? 2 : 94;
        nuevoElemento.top = 75;
      } else if (itemEscogido.tipo === "fauna_herrante") {
        nuevoElemento.left = esLadoIzquierdo ? 2 : 94;
        nuevoElemento.top = 80;
      }

      // ESTABLECER RIGUROSAMENTE 1 SOLO ELEMENTO EN EL ESTADO
      setCriaturas([nuevoElemento]);

      // Programar remoción y espera de calma antes del siguiente spawn
      timeoutId = setTimeout(() => {
        setCriaturas([]);
        // Pausa de 3.5 segundos de serenidad sin ninguna figura en pantalla
        timeoutId = setTimeout(spawnearElementoUnico, 3500);
      }, itemEscogido.duracion);
    };

    spawnearElementoUnico();

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [accesoConcedido, dungeonPreparado, cerrandoPuerta]);

  // Efecto de rotación del Saludo Misterioso de Cuento de Hadas (cambia posición y mensaje)
  useEffect(() => {
    if (!accesoConcedido || !nombreFan || cerrandoPuerta) {
      setSaludoVisible(false);
      return;
    }

    const mensajesMisteriosos = [
      `« ${nombreFan}, el susurro del bosque gallego guiará tus pasos en la penumbra... »`,
      `« El pacto rúnico ha sido sellado con tu nombre, ${nombreFan}. Los espíritus te observan. »`,
      `« ¿Escuchas la melodía del viento, ${nombreFan}? La arboleda recuerda tu espíritu. »`,
      `« ${nombreFan}... las estrellas se han alineado y el viejo hechizo vuelve a latir por ti. »`,
      `« Las raíces del gran roble guardan tu secreto, ${nombreFan}. No temas al calabozo. »`,
      `« Donde el metal y la magia se funden, tu lugar en el ritual te aguarda, ${nombreFan}... »`,
      `« Sigue el rastro del doble pedal, ${nombreFan}, y adéntrate en el santuario de la niebla. »`
    ];

    const posiciones = [
      { top: "6%", left: "6%", right: "auto", bottom: "auto", transform: "none" }, // Superior Izquierda
      { top: "6%", left: "auto", right: "6%", bottom: "auto", transform: "none" }, // Superior Derecha
      { top: "auto", left: "6%", right: "auto", bottom: "6%", transform: "none" }, // Inferior Izquierda
      { top: "auto", left: "auto", right: "6%", bottom: "6%", transform: "none" }, // Inferior Derecha
      { top: "auto", left: "50%", right: "auto", bottom: "9%", transform: "translateX(-50%)" } // Central Inferior
    ];

    let indiceMensaje = 0;

    // 1. Inicializar datos en opacidad cero para permitir que React monte el nodo en el DOM
    const primerMsg = mensajesMisteriosos[0];
    const primeraPos = posiciones[Math.floor(Math.random() * posiciones.length)];
    setSaludoMisterioso(primerMsg);
    setSaludoPos(primeraPos);
    setSaludoVisible(false);

    // 2. Disparar transición de fade-in en el siguiente frame/tick del navegador
    const initTimeout = setTimeout(() => {
      setSaludoVisible(true);
      indiceMensaje = 1;
    }, 150);

    const rotarSaludo = () => {
      // Desvanecer a opacidad 0
      setSaludoVisible(false);

      // Esperar que la animación de desvanecimiento termine (1s) antes de teletransportar y cambiar texto
      setTimeout(() => {
        const nuevaPos = posiciones[Math.floor(Math.random() * posiciones.length)];
        const nuevoMsg = mensajesMisteriosos[indiceMensaje % mensajesMisteriosos.length];
        
        setSaludoPos(nuevaPos);
        setSaludoMisterioso(nuevoMsg);
        
        // Esperar un leve instante para que el navegador asimile el cambio de coordenadas antes de volver a brillar
        setTimeout(() => {
          setSaludoVisible(true);
          indiceMensaje++;
        }, 50);
      }, 1000);
    };

    // Bucle recurrente cada 9 segundos
    const interval = setInterval(rotarSaludo, 9000);

    return () => {
      clearTimeout(initTimeout);
      clearInterval(interval);
      setSaludoVisible(false);
    };
  }, [accesoConcedido, nombreFan, cerrandoPuerta]);

  // Helpers de color para Interactividad Rúnica y Alquímica


  const obtenerColorParticula = (modo) => {
    if (modoEclipse) {
      const coloresEclipse = ["#ff0055", "#00ffcc", "#ffcc00", "#a855f7", "#22d3ee", "#e0e7ff"];
      return coloresEclipse[Math.floor(Math.random() * coloresEclipse.length)];
    }
    switch (modo) {
      case 1: return "#22d3ee"; // Cyan fatuo
      case 2: return "#c084fc"; // Purple alquimia
      case 3: return "#34d399"; // Green veneno
      default: return "#f59e0b"; // Gold forja
    }
  };

  const obtenerGlowParticula = (modo) => {
    if (modoEclipse) {
      return "0 0 10px #ff007f, 0 0 20px rgba(255,0,127,0.7)";
    }
    switch (modo) {
      case 1: return "0 0 8px #06b6d4, 0 0 15px rgba(6,182,212,0.6)";
      case 2: return "0 0 8px #a855f7, 0 0 15px rgba(168,85,247,0.6)";
      case 3: return "0 0 8px #10b981, 0 0 15px rgba(16,185,129,0.6)";
      default: return "0 0 8px #fbbf24, 0 0 15px rgba(251,191,36,0.6)";
    }
  };

  const obtenerColorPortal = (modo) => {
    switch (modo) {
      case 1: return "text-cyan-400 opacity-[0.15] drop-shadow-[0_0_30px_rgba(6,182,212,0.65)]";
      case 2: return "text-purple-400 opacity-[0.15] drop-shadow-[0_0_30px_rgba(168,85,247,0.65)]";
      case 3: return "text-emerald-400 opacity-[0.15] drop-shadow-[0_0_30px_rgba(16,185,129,0.65)]";
      default: return "text-[#735f3d] opacity-[0.04]";
    }
  };

  const obtenerColorGlowFondo = (modo, lado) => {
    if (lado === "izq") {
      switch (modo) {
        case 1: return "bg-cyan-500/18";
        case 2: return "bg-purple-500/18";
        case 3: return "bg-emerald-500/18";
        default: return "bg-amber-600/12";
      }
    } else {
      switch (modo) {
        case 1: return "bg-teal-600/18";
        case 2: return "bg-fuchsia-600/18";
        case 3: return "bg-green-600/18";
        default: return "bg-red-800/12";
      }
    }
  };

  const obtenerColorClaseTexto = (modo) => {
    switch (modo) {
      case 1: return "text-cyan-400";
      case 2: return "text-purple-400";
      case 3: return "text-emerald-400";
      default: return "text-[#d1b880]";
    }
  };

  const obtenerColorClaseBg = (modo) => {
    switch (modo) {
      case 1: return "bg-cyan-500";
      case 2: return "bg-purple-500";
      case 3: return "bg-emerald-500";
      default: return "bg-[#d1b880]";
    }
  };

  const obtenerColorClaseBorde = (modo) => {
    switch (modo) {
      case 1: return "border-cyan-500 bg-cyan-950/20";
      case 2: return "border-purple-500 bg-purple-950/20";
      case 3: return "border-emerald-500 bg-emerald-950/20";
      default: return "border-[#d1b880] bg-[#403020]/20";
    }
  };

  const revelarSusurro = (columna) => {
    const susurrosPilar = [
      "« En el robledal sagrado, el cónclave fundó la alianza del metal y el viento. »",
      "« Cuando las compuertas se sellen, el riff eterno seguirá latiendo en la bruma. »",
      "« Cuidado con el fuego fatuo; revela verdades que el bardo prefirió callar. »",
      "« La zanfoña silba en la tormenta el nombre de los que ya no están. »",
      "« BSM669: El código de las almas libres que custodian la arboleda. »",
      "« El tercer álbum de Eiluvë brotará de las raíces cuando las estrellas se alineen. »"
    ];

    const susurrosTabla = [
      "« Runa del Destino: Tu espíritu está ligado a las raíces del gran roble. »",
      "« Runa del Destino: Acepta el riff del bosque, te guiará de vuelta a casa. »",
      "« Runa del Destino: El metal rúnico fluye por las venas de los espíritus de la arboleda. »",
      "« Runa del Destino: El conjuro renace cada vez que una nueva alma cruza el umbral. »",
      "« Runa del Destino: No temas a la oscuridad; la melodía rústica iluminará tu senda. »"
    ];

    const pool = columna === "tabla" ? susurrosTabla : susurrosPilar;

    if (susurroTimer) clearTimeout(susurroTimer);
    
    setColumnaActiva(columna);
    const indice = Math.floor(Math.random() * pool.length);
    setSusurroActivo(pool[indice]);

    const timer = setTimeout(() => {
      setSusurroActivo("");
      setColumnaActiva(null);
    }, 5500);
    setSusurroTimer(timer);
  };

  const registrarClicOnda = (e) => {
    if (!accesoConcedido || cerrandoPuerta) return;
    
    // Generar ID único
    const id = Date.now() + Math.random();
    const nuevaOnda = {
      id,
      x: e.clientX,
      y: e.clientY
    };
    
    setOndasClic((prev) => [...prev, nuevaOnda]);
    
    // Limpiar onda
    setTimeout(() => {
      setOndasClic((prev) => prev.filter((o) => o.id !== id));
    }, 1200);
  };

  const liberarEnergiaFrasco = () => {
    // Genera 20 partículas flotando rápidamente desde el frasco del extremo inferior derecho
    const nuevasChispas = Array.from({ length: 20 }).map((_, i) => ({
      id: `burst-${Date.now()}-${i}`,
      left: 80 + Math.random() * 12, // posicionado sobre la botella en la ilustración
      bottom: 5 + Math.random() * 12,
      size: Math.random() * 3.5 + 2.0, // ligeramente más grandes
      duration: Math.random() * 3.5 + 2.5, // velocidad más rápida
      delay: 0,
      sway: Math.random() > 0.5 ? "flotarPolvoSway1" : "flotarPolvoSway2",
    }));
    
    setParticulas((prev) => [...prev, ...nuevasChispas]);
    
    // Limpiar partículas añadidas tras 6s
    setTimeout(() => {
      setParticulas((prev) => prev.filter((p) => typeof p.id === 'number'));
    }, 6000);
  };

  const miembrosClan = miembros && miembros.length > 0 ? miembros : [
    {
      id: 1,
      nombre: "Valerius",
      rol: "El Bardo (Voz y Zanfoña)",
      desc: "El guardián de los manuscritos y la voz del roble. Susurra melodías a través de la manivela de la zanfoña celta.",
      mensajero: "Cuervo Rúnico"
    },
    {
      id: 2,
      nombre: "Kaelen",
      rol: "El Gaitero (Gaita y Silbatos)",
      desc: "Canaliza el viento de las cumbres a través del fuelle y la madera. Sus notas atraen a los espíritus de la niebla.",
      mensajero: "Halcón Peregrino"
    },
    {
      id: 3,
      nombre: "Eowyn",
      rol: "La Tejedora (Violín y Arpa)",
      desc: "Teje la melancolía del bosque gallego en las cuerdas de su violín, creando puentes entre la niebla y la realidad.",
      mensajero: "Lechuza de Nieve"
    },
    {
      id: 4,
      nombre: "Bran",
      rol: "El Herrero (Guitarra y Distorsión)",
      desc: "El alquimista que transmuta el metal y la roca en riffs demoledores. Forja las tormentas en sus acordes.",
      mensajero: "Águila Dorada"
    },
    {
      id: 5,
      nombre: "Drakon",
      rol: "El Guardián (Batería y Percusión)",
      desc: "Marca el latido del bosque con el doble pedal y los tambores de guerra. Sus golpes despiertan a los gigantes de la roca.",
      mensajero: "Gran Búho Real"
    }
  ];

  const enviarMisiva = (e) => {
    e.preventDefault();
    if (!contactoSeleccionado || !mensajeContacto.trim()) return;

    // Disparar chispas al enviar
    liberarEnergiaFrasco();

    const animal = mensajeroContacto === "cuervo" ? "un Cuervo Rúnico" :
                   mensajeroContacto === "lechuza" ? "una Lechuza de Nieve" :
                   "un Halcón Peregrino";

    setMensajeConfirmacion(`« Tu misiva ha sido entregada a ${contactoSeleccionado.nombre} mediante ${animal}. Responderá cuando las estrellas se alineen. »`);
    setMisivaEnviada(true);

    // Resetear valores tras 5.5s
    setTimeout(() => {
      setMisivaEnviada(false);
      setContactoSeleccionado(null);
      setAsuntoContacto("");
      setMensajeContacto("");
      setMensajeroContacto("cuervo");
      setMensajeConfirmacion("");
    }, 5500);
  };

  // Cargar sesión de fanático logueado
  useEffect(() => {
    if (abierta) {
      const loggedFanStr = localStorage.getItem("eiluve_logged_fan");
      if (loggedFanStr) {
        try {
          const loggedFan = JSON.parse(loggedFanStr);
          const freshFanObj = fansRegistrados.find(f => f.id === loggedFan.id) || loggedFan;
          setFanActual(freshFanObj);
          setAccesoConcedido(true);
          setDungeonPreparado(true);
          setCodigoVerificado(true);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }, [abierta]);

  // Sincronizar el fan logueado actual con los cambios en tiempo real desde el dashboard
  useEffect(() => {
    if (fanActual) {
      const updatedFan = fansRegistrados.find((f) => f.id === fanActual.id);
      if (updatedFan) {
        if (!fanActual.mensajes || !updatedFan.mensajes || updatedFan.mensajes.length !== fanActual.mensajes.length) {
          setFanActual(updatedFan);
        }
      }
    }
  }, [fansRegistrados, fanActual]);

  // Actualización del progreso del reproductor
  useEffect(() => {

    const audio = audioRefDungeon.current;
    if (!audio) return;

    const actualizarProgreso = () => {
      const porcentaje = (audio.currentTime / audio.duration) * 100;
      setProgresoAudio(isNaN(porcentaje) ? 0 : porcentaje);
    };

    audio.addEventListener("timeupdate", actualizarProgreso);
    return () => audio.removeEventListener("timeupdate", actualizarProgreso);
  }, [cancionActivaDungeon]);

  // Sincronización en tiempo real para el buzón del fanático
  useEffect(() => {
    const syncRealtimeFan = () => {
      const savedFans = localStorage.getItem("eiluve_fans_registrados");
      if (savedFans) {
        try {
          const parsed = JSON.parse(savedFans);
          if (fanActual && fanActual.id !== "master_guest") {
            const actualizado = parsed.find((f) => f.id === fanActual.id);
            if (actualizado) {
              setFanActual(actualizado);
            }
          }
        } catch (e) {}
      }
    };
    window.addEventListener("eiluve_realtime_sync", syncRealtimeFan);
    window.addEventListener("storage", syncRealtimeFan);
    return () => {
      window.removeEventListener("eiluve_realtime_sync", syncRealtimeFan);
      window.removeEventListener("storage", syncRealtimeFan);
    };
  }, [fanActual]);

  if (!abierta) return null;

  const iniciarSecuenciaAcceso = (fanObj) => {
    setFanActual(fanObj);
    setNombreFan(fanObj.nombre);
    
    // Iniciar secuencia de sismo y destello mágico
    setDesbloqueoRunico(true); 
    setPantallaTemblar(true);  
    
    // Sismo Violento a los 1000ms
    setTimeout(() => {
      setPantallaTemblar(false);
      setPantallaSismoViolento(true);
      setActivarDestello(true);
    }, 1000);

    // Deslizar compuertas a los 1600ms
    setTimeout(() => {
      setPantallaSismoViolento(false);
      setAbriendoPuerta(true);
      setAccesoConcedido(true); // Se muestra la mazmorra de fondo detrás de las compuertas deslizantes
    }, 1600);

    // Cargar el calabozo por completo
    setTimeout(() => {
      setAbriendoPuerta(false);
      setActivarDestello(false);
      setDesbloqueoRunico(false);
      setCancionActivaDungeon(albumCompleto[0]);
      setTimeout(() => {
        setDungeonPreparado(true);
      }, 800);
    }, 3300);
  };

  const verificarCodigo = (e) => {
    e.preventDefault();
    const input = codigo.trim().toLowerCase();
    const normalizar = (str) => str.toString().replace(/[^a-z0-9]/gi, "").toLowerCase();
    
    // Validar contra el master passcode o la lista de códigos únicos NFC vinculados
    const coincideNfc = nfcCodes && nfcCodes.some(
      (item) => normalizar(item.codigo) === normalizar(input)
    );
    
    if (input === passcode.trim().toLowerCase()) {
      // Ingreso con CÓDIGO MAESTRO: Acceso directo sin registro en BD
      setErrorCodigo(false);
      const masterFan = {
        id: "master_guest",
        nombre: "Invitado del Clan",
        correo: "invitado@eiluve.com",
        pais: "Tierra de la Arboleda",
        codigoUsado: input,
        fechaRegistro: new Date().toISOString().split("T")[0],
        mensajes: []
      };
      localStorage.setItem("eiluve_logged_fan", JSON.stringify(masterFan));
      iniciarSecuenciaAcceso(masterFan);
    } else if (coincideNfc) {
      setErrorCodigo(false);
      
      // Buscar si ya existe un perfil de fanático registrado con este código exacto
      const fanExistente = fansRegistrados.find(
        (f) => f.codigoUsado.toString().trim().toLowerCase() === input
      );
        
      if (fanExistente) {
        // Acceso directo: ya está registrado
        localStorage.setItem("eiluve_logged_fan", JSON.stringify(fanExistente));
        iniciarSecuenciaAcceso(fanExistente);
      } else {
        // Primera vez para este código NFC: mostrar formulario de registro
        setCodigoVerificado(true);
      }
    } else {
      let mensajeEasterEgg = "";
      
      if (input === "666") {
        mensajeEasterEgg = "« Las llamas del metal arden, pero el sello rúnico requiere una llave pagana. »";
      } else if (input === "hadas" || input === "duendes" || input === "criaturas") {
        mensajeEasterEgg = "« Has convocado a la corte del bosque. Siente el aleteo a tu alrededor... »";
      } else if (input === "eiluve") {
        mensajeEasterEgg = "« El nombre sagrado hace vibrar los muros de piedra... los antiguos escuchan. »";
      } else if (input === "valerius") {
        mensajeEasterEgg = "« El Bardo afina su zanfoña. El Cuervo Rúnico grazna sobre tu hombro. »";
      } else if (input === "kaelen") {
        mensajeEasterEgg = "« El Gaitero sopla las primeras notas. El Halcón Peregrino emprende el vuelo. »";
      } else if (input === "eowyn") {
        mensajeEasterEgg = "« La Tejedora acaricia el violín. La Lechuza de Nieve vigila silenciosa. »";
      } else if (input === "bran") {
        mensajeEasterEgg = "« El Herrero golpea el yunque de distorsión. El Águila Dorada corona las alturas. »";
      } else if (input === "drakon") {
        mensajeEasterEgg = "« El Guardián despierta el latido del trueno. El Gran Búho Real despliega sus alas. »";
      } else if (input === "zanfoña" || input === "gaita" || input === "violin" || input === "arpa" || input === "guitarra" || input === "bateria") {
        mensajeEasterEgg = "« Las cuerdas y el viento soplan en la distancia. Escuchas el eco del bardo celta. »";
      }
      
      if (mensajeEasterEgg) {
        setMensajeErrorCodigo(mensajeEasterEgg);
      } else {
        setMensajeErrorCodigo("Código incorrecto. Los guardianes rechazan tu ofrenda.");
      }
      
      setErrorCodigo(true);
      setCodigo("");
    }
  };

  const activarEasterEggEclipse = () => {
    setClicsTitulo(prev => {
      const nuevo = prev + 1;
      if (nuevo >= 5) {
        setModoEclipse(true);
        setPantallaTemblar(true);
        setTimeout(() => setPantallaTemblar(false), 500);
        
        // Spawnear una ráfaga inmediata de partículas multicolor
        const nuevasChispas = Array.from({ length: 40 }).map((_, i) => ({
          id: `eclipse-${Date.now()}-${i}`,
          left: Math.random() * 100,
          bottom: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 4 + 3,
          delay: 0,
          sway: Math.random() > 0.5 ? "flotarPolvoSway1" : "flotarPolvoSway2",
        }));
        setParticulas(prev => [...prev, ...nuevasChispas]);
        
        setSaludoMisterioso("« ¡Has desatado el Eclipse de la Arboleda! Colores y susurros prohibidos emergen del caos... »");
        setSaludoVisible(true);
        return 0;
      }
      return nuevo;
    });
  };

  const explotarCriatura = (id, tipo, left, top) => {
    // 1. Marcar la criatura como explotando para aplicar animación de desvanecimiento
    setCriaturas((prev) => prev.map((c) => c.id === id ? { ...c, explotando: true } : c));
    setCapturasCount((prev) => prev + 1);
    
    // Desmontar físicamente tras 500ms de animación
    setTimeout(() => {
      setCriaturas((prev) => prev.filter((c) => c.id !== id));
    }, 500);

    // 2. Generar 20 partículas en la posición de la criatura con su color rúnico específico
    const colorPoder = tipo === "hada" ? "#ff007f" : tipo === "duende" ? "#39ff14" : tipo === "fantasma" ? "#e0e7ff" : "#22d3ee";
    const nuevasChispas = Array.from({ length: 20 }).map((_, i) => ({
      id: `criatura-${Date.now()}-${i}`,
      left: left + (Math.random() * 12 - 6),
      bottom: (100 - top) + (Math.random() * 12 - 6),
      size: Math.random() * 4 + 2.2,
      duration: Math.random() * 2.5 + 1.5,
      delay: 0,
      sway: Math.random() > 0.5 ? "flotarPolvoSway1" : "flotarPolvoSway2",
      colorOverride: colorPoder
    }));

    setParticulas((prev) => [...prev, ...nuevasChispas]);

    // Limpiar partículas añadidas tras 5s
    setTimeout(() => {
      setParticulas((prev) => prev.filter((p) => p.id && !p.id.toString().startsWith('criatura-')));
    }, 5000);

    // 3. Mostrar saludo misterioso
    let saludoElegido = "";
    if (tipo === "hada") {
      saludoElegido = `« El hada del bosque te concede su bendición neón de fuego rosa antes de partir. »`;
    } else if (tipo === "duende") {
      saludoElegido = `« Un duende silvestre te regala una risa rúnica verde y se disuelve en el viento. »`;
    } else if (tipo === "fantasma") {
      saludoElegido = `« ¡Has desvanecido un espectro ancestral! El aire se torna gélido y gime en la penumbra... »`;
    } else {
      saludoElegido = `« ¡Has tocado un espíritu de la niebla! Su magia fría impregna tus dedos. »`;
    }
    setSaludoMisterioso(saludoElegido);
    setSaludoVisible(true);
  };

  const interactuarObjeto = (nombre) => {
    // 1. Iniciar animación de desvanecimiento mágico
    setObjetosEstado((prev) => ({ ...prev, [nombre]: "explotando" }));
    setCapturasCount((prev) => prev + 1);
    setTimeout(() => {
      setObjetosEstado((prev) => ({ ...prev, [nombre]: "capturado" }));
    }, 500);

    let mensaje = "";
    let colorChispas = "#fbbf24";
    const posX = objetosPos[nombre]?.left || 50;
    const posYFromBottom = 100 - (objetosPos[nombre]?.top || 50);
    
    if (nombre === "harpa") {
      mensaje = "« El Arpa de los Malditos vibra sola. Su lamento resuena en las profundidades de la piedra... »";
      colorChispas = "#c084fc"; // Violeta/Arpa
    } else if (nombre === "pocion") {
      mensaje = "« Bebes de la Poción de Vida. Una calidez ancestral y revitalizante recorre tus venas. »";
      colorChispas = "#34d399"; // Verde/Vida
    } else if (nombre === "contenedor") {
      mensaje = "« El Contenedor de Almas gime. Atisbas fragmentos de melodías ancestrales atrapadas en su interior... »";
      colorChispas = "#22d3ee"; // Cyan/Almas
    } else if (nombre === "mapa") {
      mensaje = "« El mapa detalla senderos olvidados hacia la arboleda gallega secreta donde Eiluvë forja su metal. »";
      colorChispas = "#fbbf24"; // Oro/Mapa
    } else if (nombre === "ikl") {
      mensaje = "« La legendaria hoja Ikl brilla con un filo rúnico gótico. Sientes el poder de la distorsión. »";
      colorChispas = "#ff5500"; // Naranja/Espada
    }

    setSaludoMisterioso(mensaje);
    setSaludoVisible(true);

    // Spawnear chispas en la pantalla localizadas en la posición del objeto
    const nuevasChispas = Array.from({ length: 25 }).map((_, i) => ({
      id: `objeto-${Date.now()}-${i}`,
      left: posX + (Math.random() * 12 - 6),
      bottom: posYFromBottom + (Math.random() * 12 - 6),
      size: Math.random() * 3.5 + 2.2,
      duration: Math.random() * 2 + 1.2,
      delay: 0,
      sway: Math.random() > 0.5 ? "flotarPolvoSway1" : "flotarPolvoSway2",
      colorOverride: colorChispas
    }));
    
    setParticulas((prev) => [...prev, ...nuevasChispas]);
    
    setTimeout(() => {
      setParticulas((prev) => prev.filter((p) => p.id && !p.id.toString().startsWith('objeto-')));
    }, 5000);
  };

  const procesarRegistroFan = (e) => {
    e.preventDefault();
    if (!nombreFan.trim() || !emailFan.trim()) return;

    // Crear el nuevo objeto de fan
    const nuevoFan = {
      id: "fan_" + Date.now(),
      nombre: nombreFan.trim(),
      correo: emailFan.trim(),
      telefono: telefonoFan.trim() || "No especificado",
      pais: paisFan.trim() || "Tierra Desconocida",
      codigoUsado: codigo.trim().toLowerCase(),
      fechaRegistro: new Date().toISOString().split("T")[0],
      mensajes: []
    };

    // Registrar en la lista
    const nuevosFans = [...fansRegistrados, nuevoFan];
    setFansRegistrados(nuevosFans);
    localStorage.setItem("eiluve_fans_registrados", JSON.stringify(nuevosFans));

    // Lanzar secuencia de carga y entrada
    localStorage.setItem("eiluve_logged_fan", JSON.stringify(nuevoFan));
    iniciarSecuenciaAcceso(nuevoFan);
  };



  const enviarMensajeBuzonFan = (e) => {
    e.preventDefault();
    if (!nuevoMensajeFan.trim() || !fanActual) return;

    const mensajeNuevo = {
      id: Date.now(),
      remitente: "fan",
      texto: nuevoMensajeFan.trim(),
      fecha: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const mensajesActualizados = [...(fanActual.mensajes || []), mensajeNuevo];
    const fanActualizado = { ...fanActual, mensajes: mensajesActualizados };
    setFanActual(fanActualizado);

    if (fanActual.id === "master_guest") {
      localStorage.setItem("eiluve_logged_fan", JSON.stringify(fanActualizado));
      setNuevoMensajeFan("");
      window.dispatchEvent(new Event("eiluve_realtime_sync"));
      return;
    }

    const nuevosFans = fansRegistrados.map((f) =>
      f.id === fanActual.id ? fanActualizado : f
    );
    setFansRegistrados(nuevosFans);
    localStorage.setItem("eiluve_fans_registrados", JSON.stringify(nuevosFans));
    setNuevoMensajeFan("");
    window.dispatchEvent(new Event("eiluve_realtime_sync"));
  };


  const cerrarYResetear = () => {
    localStorage.removeItem("eiluve_logged_fan");
    setDungeonPreparado(false);
    setCapturasCount(0);
    setObjetosEstado({
      harpa: "esperando",
      pocion: "esperando",
      contenedor: "esperando",
      mapa: "esperando",
      ikl: "esperando"
    });
    setObjetosPos({
      harpa: { left: 8, top: 80 },
      pocion: { left: 92, top: 82 },
      contenedor: { left: 92, top: 12 },
      mapa: { left: 8, top: 12 },
      ikl: { left: 76, top: 85 }
    });
    setCodigo("");
    setAccesoConcedido(false);
    setAbriendoPuerta(false);
    setCerrandoPuerta(false);
    setPantallaTemblar(false);
    setPantallaSismoViolento(false);
    setErrorCodigo(false);
    setReproduciendoDungeon(false);
    setModoMagico(0);
    setDesvanecerCierre(false);
    setMostrarMensajeSellar(false);
    setDesbloqueoRunico(false);
    setActivarDestello(false);
    setCodigoVerificado(false);
    setNombreFan("");
    setEmailFan("");
    setTelefonoFan("");
    setPaisFan("");
    setFanActual(null);
    setNuevoMensajeFan("");
    setSaludoMisterioso("");
    setSaludoVisible(false);
    
    // Resets para Easter Eggs
    setClicsTitulo(0);
    setModoEclipse(false);
    setMensajeErrorCodigo("Código incorrecto. Los guardianes rechazan tu ofrenda.");
    alCerrar();
  };





  // Cierre épico de compuertas
  const iniciarCierreEpico = () => {
    setReproduciendoDungeon(false);
    if (audioRefDungeon.current) {
      audioRefDungeon.current.pause();
    }

    const mensajesDespedida = [
      "Las runas han vuelto a encenderse en la penumbra. El portal te espera.",
      "El conjuro sigue activo, suspendido en el aire como un riff eterno. Cruza el umbral.",
      "Las estrellas se han alineado y el viejo hechizo vuelve a cobrar fuerza. Regresa al círculo místico.",
      "¿Sientes la vibración en el aire? La magia ancestral y el metal se fusionan de nuevo aquí.",
      "La arboleda sagrada vuelve a latir al ritmo del doble pedal. Adéntrate en el santuario.",
      "El eco de los espíritus del bosque resuena en las guitarras. Sigue el rastro del viento y regresa.",
      "Bajo el dosel de hojas eternas, los secretos mejor guardados vuelven a brillar.",
      "Bajo el influjo de la luna llena, el rito se repite. Tu lugar en el ritual te aguarda.",
      "Donde la materia se transmuta en melodía. Regresa a nuestro laboratorio de alquimia musical.",
      "Riffs cargados de polvo de estrellas y mitología olvidada. Despierta el misticismo una vez más."
    ];

    const indice = Math.floor(Math.random() * mensajesDespedida.length);
    setMensajeSellar(mensajesDespedida[indice]);

    setCerrandoPuerta(true);
    setMostrarMensajeSellar(false);
    setDesvanecerCierre(false);



    // Al cerrarse completamente (1.2s)
    setTimeout(() => {
      setPantallaSismoViolento(true);
      setMostrarMensajeSellar(true);
    }, 1200);

    // Detener temblor a los 2.0s
    setTimeout(() => {
      setPantallaSismoViolento(false);
    }, 2000);

    // Iniciar desvanecimiento a los 5.5s (dando 4.3s para leer)
    setTimeout(() => {
      setDesvanecerCierre(true);
    }, 5500);

    // Resetear a los 6.5s
    setTimeout(() => {
      cerrarYResetear();
    }, 6500);
  };


  // CONTROL DE TABS: Transición 3D de Volteo de Página de Libro
  const cambiarPestanaConLibro = (nuevaPestana) => {
    if (nuevaPestana === pestanaActiva || paginaVolteando) return;

    setPestanaSiguiente(nuevaPestana);
    setPaginaVolteando(true);

    // Duración exacta del giro 3D (700ms)
    setTimeout(() => {
      setPestanaActiva(nuevaPestana);
      setPaginaVolteando(false);
      setPestanaSiguiente(null);
    }, 700);
  };

  const alternarReproduccionDungeon = () => {
    if (!audioRefDungeon.current) return;
    if (reproduciendoDungeon) {
      audioRefDungeon.current.pause();
      setReproduciendoDungeon(false);
    } else {
      audioRefDungeon.current.play().catch(() => {});
      setReproduciendoDungeon(true);
    }
  };

  const adelantarDungeon = () => {
    if (!audioRefDungeon.current) return;
    audioRefDungeon.current.currentTime = Math.min(audioRefDungeon.current.duration, audioRefDungeon.current.currentTime + 10);
  };

  const retrocederDungeon = () => {
    if (!audioRefDungeon.current) return;
    audioRefDungeon.current.currentTime = Math.max(0, audioRefDungeon.current.currentTime - 10);
  };

  const manejarClickProgresoDungeon = (e) => {
    if (!audioRefDungeon.current || !audioRefDungeon.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const ancho = rect.width;
    const porcentaje = clickX / ancho;
    audioRefDungeon.current.currentTime = porcentaje * audioRefDungeon.current.duration;
    setProgresoAudio(porcentaje * 100);
  };

  const seleccionarYReproducir = (cancion) => {
    setCancionActivaDungeon(cancion);
    setReproduciendoDungeon(true);
    
    setTimeout(() => {
      if (audioRefDungeon.current) {
        audioRefDungeon.current.load();
        audioRefDungeon.current.play().catch(() => {});
      }
    }, 50);
  };

  const abrirClipVideo = (url) => {
    setVideoUrlActual(url);
    setVideoModalAbierto(true);
  };

  // Renderizar la información correspondiente en la página del libro
  const renderizarContenidoPaginaLibro = (pestana) => {
    switch (pestana) {
      case "audios":
        return (
          <div className="w-full h-full bg-[#0a0705]/85 p-5 border border-[#523d26]/40 rounded-r-sm shadow-xl flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-[#fbbf24] font-mono tracking-widest uppercase flex items-center gap-2 mb-3 border-b border-[#735f3d]/30 pb-1.5">
                <span className="text-amber-400 text-sm animate-pulse filter drop-shadow-[0_0_5px_rgba(251,191,36,0.6)]">🎵</span>
                GRABACIONES OCULTAS (GRIMORIO)
              </span>
              <div className="space-y-1.5 max-h-[300px] overflow-y-auto pr-1">
                {albumCompleto.map((pista) => {
                  const esLaActiva = cancionActivaDungeon?.id === pista.id;
                  return (
                    <div
                      key={pista.id}
                      onClick={() => seleccionarYReproducir(pista)}
                      className={`p-2.5 border flex justify-between items-center hover:bg-[#735f3d]/15 transition-all duration-200 cursor-pointer rounded-sm ${
                        esLaActiva 
                          ? `${obtenerColorClaseBorde(modoMagico)} text-white`
                          : "border-[#735f3d]/20 bg-black/40 text-gray-300"
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-[#735f3d] font-mono">0{pista.id}</span>
                        <p className={`text-xs font-bold font-serif ${esLaActiva ? obtenerColorClaseTexto(modoMagico) : "text-white"}`}>
                          {pista.titulo}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-[10px] text-gray-400 font-mono">{pista.duracion}</span>
                        <span className="text-xs">
                          {esLaActiva && reproduciendoDungeon ? (
                            <i className={`fas fa-volume-up animate-pulse ${obtenerColorClaseTexto(modoMagico)}`}></i>
                          ) : (

                            <i className="fas fa-play opacity-45"></i>
                          )}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="mt-4 bg-black/40 border border-[#735f3d]/20 p-3 rounded-sm font-mono text-[8px] text-gray-500 text-center">
              ZANFOÑA, GUITARRA Y ARPA CELTA DIRECTO A BOBINA.
            </div>
          </div>
        );
      case "fotos":
        return (
          <div className="w-full h-full bg-[#0a0705]/85 p-5 border border-[#523d26]/40 rounded-r-sm shadow-xl">
            <span className="text-[10px] text-[#38bdf8] font-mono tracking-widest uppercase flex items-center gap-2 mb-3 border-b border-cyan-500/20 pb-1.5">
              <span className="text-cyan-400 text-sm animate-pulse filter drop-shadow-[0_0_5px_rgba(56,189,248,0.6)]">🔮</span>
              RETRATOS EXCLUSIVOS DEL CLAN (VISIONES)
            </span>
            <div className="grid grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
              {fotosIneditas.map((foto) => (
                <div 
                  key={foto.id} 
                  className={`group bg-[#060403] border border-[#523d26]/40 p-2 rounded-sm hover:border-transparent transition-all duration-500 borde-magico-lineal ${
                    modoMagico === 1 ? "hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]" : modoMagico === 2 ? "hover:shadow-[0_0_15px_rgba(168,85,247,0.4)]" : modoMagico === 3 ? "hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "hover:shadow-[0_0_15px_rgba(251,191,36,0.4)]"
                  }`}

                >
                  <div className="relative h-28 w-full overflow-hidden bg-black/60 rounded-sm mb-2 border border-black">
                    <img
                      src={foto.src}
                      alt={foto.titulo}
                      className="object-cover w-full h-full opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-700 filter sepia-[0.3] brightness-[0.7] group-hover:brightness-100"
                    />
                    <div className="absolute top-1.5 left-1.5 bg-black/80 px-1.5 py-0.5 border border-[#735f3d]/40 text-[7px] text-[#d1b880] tracking-widest uppercase font-mono rounded-sm">
                      FILE 0{foto.id}
                    </div>
                  </div>
                  <h5 className="text-xs font-bold text-white font-serif">{foto.titulo}</h5>
                  <p className="text-[9px] text-gray-400 leading-normal">{foto.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "clips":
        return (
          <div className="w-full h-full bg-[#0a0705]/85 p-5 border border-[#523d26]/40 rounded-r-sm shadow-xl">
            <span className="text-[10px] text-[#f97316] font-mono tracking-widest uppercase flex items-center gap-2 mb-3 border-b border-orange-500/20 pb-1.5">
              <span className="text-orange-400 text-sm animate-pulse filter drop-shadow-[0_0_6px_rgba(249,115,22,0.8)]">🔥</span>
              RITUALES Y ENSAYOS OCULTOS (INCANTACIONES)
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[340px] overflow-y-auto pr-1">
              {clipsIneditos.map((clip) => (
                <div 
                  key={clip.id} 
                  className={`group bg-[#060403] border border-[#523d26]/40 p-3 rounded-sm transition-all duration-500 cursor-pointer relative overflow-hidden ${
                    modoMagico === 1 ? "hover:border-cyan-500/50 hover:shadow-[0_0_15px_rgba(6,182,212,0.2)]" :
                    modoMagico === 2 ? "hover:border-purple-500/50 hover:shadow-[0_0_15px_rgba(168,85,247,0.2)]" :
                    modoMagico === 3 ? "hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.2)]" :
                    "hover:border-[#fbbf24]/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                  }`}
                  onClick={() => abrirClipVideo(clip.videoUrl)}
                >
                  <div className="relative h-28 w-full overflow-hidden bg-black rounded-sm mb-2 border border-black flex items-center justify-center">
                    <img
                      src={clip.imagen}
                      alt={clip.titulo}
                      className="object-cover w-full h-full opacity-40 group-hover:scale-105 group-hover:opacity-70 transition-all duration-700 filter brightness-[0.6] group-hover:brightness-[0.9]"
                    />
                    
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-500">
                      <span className={`text-[80px] font-serif rotate-0 animate-spin ${obtenerColorClaseTexto(modoMagico)}`} style={{ animationDuration: "12s" }}>ᛉ</span>
                    </div>

                    <div className={`absolute w-10 h-10 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 z-10 pulso-sonar ${
                      modoMagico === 1 ? "bg-black/90 border-cyan-500/60 text-cyan-400" :
                      modoMagico === 2 ? "bg-black/90 border-purple-500/60 text-purple-400" :
                      modoMagico === 3 ? "bg-black/90 border-emerald-500/60 text-emerald-400" :
                      "bg-black/90 border-[#fbbf24]/60 text-[#fbbf24]"
                    }`}>
                      <i className="fas fa-play text-xs pl-[2px]"></i>
                    </div>
                  </div>

                  <h5 className="text-xs font-bold text-white font-serif group-hover:text-[#fbbf24] transition-colors">{clip.titulo}</h5>
                  <p className="text-[9px] text-gray-400 leading-normal">{clip.descripcion}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "contacto":
        return (
          <div className="w-full h-full bg-[#0a0705]/85 p-5 border border-[#523d26]/40 rounded-r-sm shadow-xl flex flex-col justify-between">
            <span className="text-[9px] text-[#34d399] font-mono tracking-widest uppercase flex items-center gap-2 mb-3 border-b border-emerald-500/20 pb-1.5">
              <span className="text-emerald-400 text-sm animate-pulse filter drop-shadow-[0_0_5px_rgba(52,211,153,0.6)]">⚔️</span>
              {contactoSeleccionado ? `ENVIAR MISIVA A ${contactoSeleccionado.nombre.toUpperCase()}` : "ALIANZA DEL CLAN (CONTACTO)"}
            </span>

            {misivaEnviada ? (
              <div className="flex-grow flex flex-col items-center justify-center text-center space-y-3 p-4 animate-pulse">
                <i className="fas fa-feather-alt text-4xl text-[#fbbf24] rotate-12"></i>
                <p className="text-xs text-[#d1b880] font-serif italic max-w-sm leading-relaxed">
                  {mensajeConfirmacion}
                </p>
              </div>
            ) : contactoSeleccionado ? (
              <form onSubmit={enviarMisiva} className="flex-grow flex flex-col justify-between space-y-3 max-h-[300px] overflow-y-auto pr-1">
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-[10px] text-gray-400">
                    <span>Destinatario: <strong className="text-white">{contactoSeleccionado.rol}</strong></span>
                    <button 
                      type="button" 
                      onClick={() => setContactoSeleccionado(null)}
                      className="text-amber-500 hover:text-white transition-colors text-[9px] font-mono uppercase"
                    >
                      Volver ↩
                    </button>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 font-mono block uppercase">Asunto de la misiva</label>
                    <input 
                      type="text" 
                      value={asuntoContacto}
                      onChange={(e) => setAsuntoContacto(e.target.value)}
                      placeholder="Ej: Colaboración, Saludos del bardo..."
                      className="w-full bg-black/60 border border-[#735f3d]/30 text-xs text-white p-2 rounded-sm focus:outline-none focus:border-[#fbbf24] transition-colors"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 font-mono block uppercase">Mensaje tallado en pergamino</label>
                    <textarea 
                      value={mensajeContacto}
                      onChange={(e) => setMensajeContacto(e.target.value)}
                      placeholder="Escribe tu mensaje para el miembro del clan..."
                      rows="3"
                      className="w-full bg-black/60 border border-[#735f3d]/30 text-xs text-white p-2 rounded-sm focus:outline-none focus:border-[#fbbf24] transition-colors resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[8px] text-gray-500 font-mono block uppercase">Seleccionar mensajero alado</label>
                    <select 
                      value={mensajeroContacto}
                      onChange={(e) => setMensajeroContacto(e.target.value)}
                      className="w-full bg-black/60 border border-[#735f3d]/30 text-xs text-white p-2 rounded-sm focus:outline-none focus:border-[#fbbf24] transition-colors"
                    >
                      <option value="cuervo">🦅 Cuervo Rúnico (Mensaje Oscuro/Rápido)</option>
                      <option value="lechuza">🦉 Lechuza de Nieve (Mensaje Silencioso/Sagrado)</option>
                      <option value="halcon">🦅 Halcón Peregrino (Mensaje Urgente/Veloz)</option>
                    </select>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-2 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black transition-all duration-300 rounded-sm font-mono text-[10px] font-bold uppercase tracking-wider shadow"
                >
                  Enviar Misiva por Mensajero Alado
                </button>
              </form>
            ) : (
              <div className="flex-grow flex flex-col justify-between">
                <div className="space-y-2 max-h-[290px] overflow-y-auto pr-1">
                  {miembrosClan.map((miembro) => (
                    <div 
                      key={miembro.id}
                      className="p-3 border border-[#735f3d]/20 bg-black/50 rounded-sm flex justify-between items-center group hover:border-[#fbbf24]/40 transition-all duration-300"
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <h4 className="text-xs font-serif font-bold text-[#fbbf24]">{miembro.nombre}</h4>
                        <span className="text-[8px] text-gray-400 font-mono block uppercase">{miembro.rol}</span>
                        <p className="text-[9px] text-gray-300 leading-normal italic">{miembro.desc}</p>
                      </div>
                      <button
                        onClick={() => setContactoSeleccionado(miembro)}
                        className="px-3 py-1.5 bg-[#403020]/40 border border-[#735f3d]/50 text-[9px] text-[#d1b880] group-hover:bg-[#735f3d] group-hover:text-white transition-all duration-300 rounded-sm font-mono uppercase font-bold"
                      >
                        ✉️ Escribir
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      case "buzon":
        return (
          <div className="w-full h-full bg-[#0a0705]/85 p-5 border border-[#523d26]/40 rounded-r-sm shadow-xl flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3 border-b border-purple-500/20 pb-1.5 select-none">
              <span className="text-[10px] text-[#c084fc] font-mono tracking-widest uppercase flex items-center gap-2">
                <span className="text-purple-400 text-sm animate-pulse filter drop-shadow-[0_0_5px_rgba(192,132,252,0.6)]">📬</span>
                BUZÓN EXCLUSIVO CON EL CLAN
              </span>
              <div className="flex items-center space-x-2">
                <span className="text-[8px] font-mono text-[#8da382] uppercase bg-[#8da382]/10 px-2 py-0.5 rounded-full border border-[#8da382]/25">
                  {fanActual ? fanActual.nombre : "Fanático"}
                </span>
                <button
                  onClick={() => {
                    if (confirm("¿Deseas cerrar la sesión de esta alianza?")) {
                      localStorage.removeItem("eiluve_logged_fan");
                      cerrarYResetear();
                    }
                  }}
                  className="text-[8px] font-mono text-red-400 hover:text-red-300 uppercase underline bg-red-950/20 px-1.5 py-0.5 rounded border border-red-900/30 transition-colors"
                  title="Cerrar sesión"
                >
                  Salir
                </button>
              </div>
            </div>

            {/* Historial de conversación */}
            <div className="flex-grow overflow-y-auto mb-3 space-y-2.5 pr-1 max-h-[220px] custom-scrollbar">
              {(!fanActual || !fanActual.mensajes || fanActual.mensajes.length === 0) ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-500 font-serif italic text-xs space-y-2">
                  <i className="fas fa-inbox text-3xl text-gray-700"></i>
                  <p>« El buzón del clan está en silencio... Talla un mensaje en el pergamino y envíalo a la banda. »</p>
                </div>
              ) : (
                fanActual.mensajes.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col max-w-[85%] rounded p-2.5 border text-xs leading-relaxed ${
                      m.remitente === "fan"
                        ? "ml-auto bg-[#735f3d]/15 border-[#735f3d]/30 text-amber-100"
                        : "mr-auto bg-black/60 border-[#fbbf24]/20 text-gray-200"
                    }`}
                  >
                    <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-500 mb-1 select-none">
                      <span className="font-semibold uppercase tracking-wider">
                        {m.remitente === "fan" ? "Tú" : "La Banda"}
                      </span>
                      <span>{m.fecha}</span>
                    </div>
                    <p className="font-sans break-words">{m.texto}</p>
                  </div>
                ))
              )}
            </div>

            {/* Formulario de envío */}
            {fanActual ? (
              <form onSubmit={enviarMensajeBuzonFan} className="flex gap-2">
                <textarea
                  value={nuevoMensajeFan}
                  onChange={(e) => setNuevoMensajeFan(e.target.value)}
                  placeholder="Talla tu mensaje aquí..."
                  rows="2"
                  className="flex-grow bg-black/70 border border-[#735f3d]/40 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] transition-colors resize-none placeholder-gray-600 font-sans"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="px-4 bg-[#735f3d] hover:bg-[#fbbf24] text-white hover:text-black border border-[#735f3d]/50 hover:border-[#fbbf24] font-mono font-bold text-[9px] uppercase tracking-wider rounded transition-all duration-300 flex items-center justify-center"
                >
                  Enviar
                </button>
              </form>
            ) : (
              <p className="text-[10px] text-gray-500 font-serif italic text-center">Registra tu pacto para enviar misivas.</p>
            )}
          </div>
        );
      default:

        return null;
    }
  };

  return (
    <div 
      onClick={registrarClicOnda}
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto p-4 md:p-8 transition-all duration-1000 ${
        accesoConcedido ? "bg-black" : "bg-[#040303]/99 backdrop-blur-xl"
      } ${
        pantallaTemblar ? "animate-temblor" : ""
      } ${
        pantallaSismoViolento ? "animate-sismo" : ""
      } ${
        desvanecerCierre ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      
      {/* Imagen de fondo de las Mazmorras (Ramas abrazando la ventana) */}
      {accesoConcedido && (
        <div 
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none select-none z-0"
          style={{ opacity: Math.min(capturasCount * 0.125, 1) }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat filter brightness-[1.28] contrast-[1.05]"
            style={{ backgroundImage: "url('/dungeon_bg.png')" }}
          ></div>
          
          {/* LUCES AMBIENTALES DINÁMICAS A NIVEL VIEWPORT */}
          <div className={`absolute left-0 top-[10%] w-[45%] h-[60%] blur-[140px] rounded-full opacity-100 ${
            modoMagico === 1 ? "bg-cyan-500/28 shadow-[0_0_120px_rgba(6,182,212,0.45)]" :
            modoMagico === 2 ? "bg-purple-500/28 shadow-[0_0_120px_rgba(168,85,247,0.45)]" :
            modoMagico === 3 ? "bg-emerald-500/28 shadow-[0_0_120px_rgba(16,185,129,0.45)]" :
            "bg-amber-600/24 shadow-[0_0_100px_rgba(245,158,11,0.35)]"
          }`}></div>
          <div className={`absolute right-0 top-[15%] w-[50%] h-[70%] blur-[150px] rounded-full opacity-100 ${
            modoMagico === 1 ? "bg-teal-600/24 shadow-[0_0_125px_rgba(20,184,166,0.42)]" :
            modoMagico === 2 ? "bg-fuchsia-600/24 shadow-[0_0_125px_rgba(217,70,239,0.42)]" :
            modoMagico === 3 ? "bg-green-600/24 shadow-[0_0_125px_rgba(34,197,94,0.42)]" :
            "bg-red-800/20 shadow-[0_0_120px_rgba(239,68,68,0.32)]"
          }`}></div>
        </div>
      )}


      {/* EFECTO VIÑETA CINEMÁTICA: Bordes oscurecidos en todos los lados */}

      {accesoConcedido && (
        <div 
          className="absolute inset-0 bg-[radial-gradient(circle,_transparent_30%,_rgba(0,0,0,0.85)_80%,_rgba(0,0,0,0.99)_100%)] pointer-events-none z-0 select-none"
        ></div>
      )}

      {/* Ondas expansivas de clic rúnicas */}
      {accesoConcedido && ondasClic.map((o) => (
        <div
          key={o.id}
          className="fixed rounded-full border pointer-events-none z-50 animate-onda-clic"
          style={{
            left: o.x,
            top: o.y,
            transform: 'translate(-50%, -50%)',
            borderColor: obtenerColorParticula(modoMagico),
            boxShadow: `0 0 15px ${obtenerColorParticula(modoMagico)}, inset 0 0 10px ${obtenerColorParticula(modoMagico)}`
          }}
        ></div>
      ))}

      {/* Torbellino de polvo mágico neón a nivel de pantalla completa */}
      {accesoConcedido && (
        <div className="absolute inset-0 pointer-events-none z-30 overflow-hidden">
          {particulas.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full transition-colors duration-1000"
              style={{
                left: `${p.left}%`,
                bottom: `${p.bottom}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: p.colorOverride || obtenerColorParticula(modoMagico),
                boxShadow: p.colorOverride ? `0 0 8px ${p.colorOverride}, 0 0 15px rgba(255,255,255,0.4)` : obtenerGlowParticula(modoMagico),
                animation: `${p.sway} ${p.duration}s linear infinite`,
                animationDelay: `${p.delay}s`,
              }}
            ></div>
          ))}
        </div>
      )}

      {/* CRIATURAS MÍSTICAS SILUETAS A NIVEL DE PANTALLA COMPLETA */}
      {accesoConcedido && dungeonPreparado && !cerrandoPuerta && (
        <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
          {criaturas.map((c) => {
            let glowColor = obtenerColorParticula(modoMagico);
            if (c.tipo === "fantasma") {
              glowColor = "#e0e7ff";
            } else if (c.tipo === "brote_maldad") {
              glowColor = "#ff007f";
            } else if (c.tipo === "escolta_muerte") {
              glowColor = "#a855f7";
            } else if (c.tipo === "espiritu_bosque") {
              glowColor = "#fbbf24";
            } else if (c.tipo === "fauna_herrante") {
              glowColor = "#22d3ee";
            } else if (c.tipo === "juglar_olvidado") {
              glowColor = "#34d399";
            }

            return (
              <div
                key={c.id}
                onClick={(e) => {
                  if (c.explotando) return;
                  e.stopPropagation();
                  explotarCriatura(c.id, c.tipo, c.left === -100 ? 50 : c.left, c.top);
                }}
                className={`absolute pointer-events-auto cursor-pointer hover:scale-125 transition-transform duration-300 ${
                  c.explotando ? "animate-desvanecer-magico" : ""
                }`}
                style={{
                  left: `${c.left}%`,
                  top: `${c.top}%`,
                  transform: `scale(${c.scale}) translate(-50%, -50%)`,
                  transition: 'left 4s ease-in-out, top 4s ease-in-out, transform 0.3s',
                  animation: c.anim || (
                             c.tipo === "hada" ? `flotarHada 8s ease-in-out forwards` :
                             c.tipo === "duende" ? `asomarDuende 7s ease-in-out forwards` :
                             c.tipo === "fantasma" ? `flotarFantasma 10s ease-in-out forwards` :
                             `volarEspiritu 9s linear forwards`
                             ),
                  color: glowColor,
                  filter: `drop-shadow(0 0 15px ${glowColor})`,
                }}
              >
                {c.tipo === "hada" && (
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-10 h-10 opacity-75">
                    <circle cx="50" cy="30" r="7" />
                    <path d="M48 37 C48 37, 45 56, 50 70 C55 56, 52 37, 52 37 Z" />
                    <path d="M48 40 C32 33, 18 42, 32 55 C39 62, 48 46, 48 40 Z" className="opacity-80" />
                    <path d="M52 40 C68 33, 82 42, 68 55 C61 62, 52 46, 52 40 Z" className="opacity-80" />
                    <path d="M48 43 C38 48, 28 62, 42 70 C46 72, 48 56, 48 43 Z" className="opacity-60" />
                    <path d="M52 43 C62 48, 72 62, 58 70 C54 72, 52 56, 52 43 Z" className="opacity-60" />
                  </svg>
                )}
                {c.tipo === "duende" && (
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-10 h-10 opacity-80">
                    <circle cx="50" cy="35" r="9" />
                    <path d="M41 33 C32 25, 22 28, 42 37 Z" />
                    <path d="M59 33 C68 25, 78 28, 58 37 Z" />
                    <path d="M43 44 C39 50, 36 62, 46 70 C49 73, 51 73, 54 70 C64 62, 61 50, 57 44 Z" />
                    <circle cx="47" cy="35" r="1.2" fill="#fff" />
                    <circle cx="53" cy="35" r="1.2" fill="#fff" />
                  </svg>
                )}
                {c.tipo === "espiritu" && (
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-12 h-12 opacity-65">
                    <path d="M50 35 C40 25, 10 30, 20 60 C35 70, 45 50, 50 48 C55 50, 65 70, 80 60 C90 30, 60 25, 50 35 Z" />
                    <ellipse cx="45" cy="39" rx="1.8" ry="2.5" fill="#fff" />
                    <ellipse cx="55" cy="39" rx="1.8" ry="2.5" fill="#fff" />
                  </svg>
                )}
                {c.tipo === "fantasma" && (
                  <svg viewBox="0 0 100 100" fill="currentColor" className="w-16 h-16 opacity-60">
                    <path d="M50 12 C30 12 25 32 25 55 C25 65 20 75 30 85 C35 88 40 84 43 81 C47 84 53 84 57 81 C60 84 65 88 70 85 C80 75 75 65 75 55 C75 32 70 12 50 12 Z" />
                    <ellipse cx="42" cy="42" rx="2.5" ry="3.5" fill="#000" />
                    <ellipse cx="58" cy="42" rx="2.5" ry="3.5" fill="#000" />
                    <ellipse cx="50" cy="54" rx="2" ry="4" fill="#000" />
                  </svg>
                )}
                {c.tipo === "brote_maldad" && (
                  <img src="/Criaturas/brote de maldad.png" alt="Brote de Maldad" className="w-28 h-28 object-contain opacity-85" />
                )}
                {c.tipo === "escolta_muerte" && (
                  <img src="/Criaturas/escolta de la muerte.png" alt="Escolta de la Muerte" className="w-32 h-32 object-contain opacity-80" />
                )}
                {c.tipo === "espiritu_bosque" && (
                  <img src="/Criaturas/espiritu del bosque.png" alt="Espíritu del Bosque" className="w-28 h-28 object-contain opacity-85" />
                )}
                {c.tipo === "fauna_herrante" && (
                  <img src="/Criaturas/fauna herrante.png" alt="Fauna Herrante" className="w-30 h-30 object-contain opacity-85" />
                )}
                {c.tipo === "juglar_olvidado" && (
                  <img src="/Criaturas/juglar olvidado.png" alt="Juglar Olvidado" className="w-28 h-28 object-contain opacity-85" />
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SALUDO MISTERIOSO DE CUENTO DE HADAS (FUERA DE LA VENTANA) */}
      {accesoConcedido && saludoMisterioso && (
        <div
          className="fixed pointer-events-none z-40 select-none text-center transition-opacity duration-1000"
          style={{
            top: saludoPos.top,
            left: saludoPos.left,
            right: saludoPos.right,
            bottom: saludoPos.bottom,
            transform: saludoPos.transform,
            opacity: saludoVisible ? 0.9 : 0,
          }}
        >
          <p 
            className="font-serif italic text-sm md:text-base text-[#fbbf24] tracking-wider leading-relaxed pointer-events-none select-none"
            style={{ 
              fontFamily: "'Cinzel', Georgia, serif",
              textShadow: "0 0 10px rgba(251,191,36,0.8), 0 0 20px rgba(251,191,36,0.4), 0 2px 5px rgba(0,0,0,0.95)"
            }}
          >
            {saludoMisterioso}
          </p>

        </div>
      )}







      
      {/* HOJA DE ESTILOS CSS CON ANIMACIONES DE VOLTEO EN 3D DE PÁGINAS DE LIBRO */}
      <style>{`
        /* Temblor sutil */
        @keyframes temblor {
          0%, 100% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-2px, -1px) rotate(-0.2deg); }
          35% { transform: translate(1px, 2px) rotate(0.2deg); }
          70% { transform: translate(-2px, 1px) rotate(0deg); }
        }
        .animate-temblor {
          animation: temblor 0.6s ease-in-out infinite;
        }

        /* Sismo violento */
        @keyframes sismo {
          0%, 100% { transform: translate(0, 0) scale(1) rotate(0deg); }
          10% { transform: translate(-8px, -5px) scale(1.02) rotate(-1.5deg); filter: brightness(1.3); }
          25% { transform: translate(6px, 8px) scale(0.99) rotate(1.2deg); }
          50% { transform: translate(-10px, 4px) scale(1.03) rotate(-0.5deg); }
          75% { transform: translate(8px, -6px) scale(0.98) rotate(1deg); }
        }
        .animate-sismo {
          animation: sismo 0.5s cubic-bezier(.36,.07,.19,.97) infinite;
        }

        /* Giro cerradura */
        @keyframes giroRunaBloqueo {
          0% { transform: rotate(0deg) scale(1); filter: drop-shadow(0 0 10px #735f3d); }
          50% { transform: rotate(180deg) scale(1.25); filter: drop-shadow(0 0 35px #fbbf24); }
          100% { transform: rotate(720deg) scale(1.8); filter: drop-shadow(0 0 60px #fff); opacity: 0; }
        }
        .runa-bloqueo-activa {
          animation: giroRunaBloqueo 1.6s cubic-bezier(0.6, -0.28, 0.735, 0.045) forwards;
        }

        /* Onda de choque */
        @keyframes shockwave {
          0% { transform: scale(0.3); opacity: 0; }
          10% { opacity: 0.9; }
          100% { transform: scale(3.5); opacity: 0; }
        }
        .shockwave-ring {
          animation: shockwave 1.4s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
          border: 4px solid #fbbf24;
          box-shadow: 0 0 40px rgba(251, 191, 36, 0.8), inset 0 0 40px rgba(251, 191, 36, 0.6);
        }

        /* Destello radial */
        @keyframes superDestello {
          0% { opacity: 0; }
          30% { opacity: 1; }
          100% { opacity: 0; }
        }
        .super-destello {
          animation: superDestello 1.8s ease-out forwards;
          background: radial-gradient(circle, #fff 0%, #fbbf24 45%, #ea580c 70%, transparent 95%);
        }

        /* Antorchas */
        @keyframes parpadeoAntorcha {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 12px rgba(245, 158, 11, 0.8)) blur(0.5px); opacity: 0.9; }
          50% { transform: scale(0.88) translate(1px, -1px); filter: drop-shadow(0 0 18px rgba(245, 158, 11, 0.95)); opacity: 1; }
        }
        .antorcha-fuego { animation: parpadeoAntorcha 0.3s ease-in-out infinite; }
        
        @keyframes parpadeoFatuo {
          0%, 100% { transform: scale(1); filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.9)) blur(0.5px); opacity: 0.9; }
          50% { transform: scale(0.85) translate(-1px, 1.5px); filter: drop-shadow(0 0 24px rgba(6, 182, 212, 1)); opacity: 1; }
        }
        .antorcha-fatuo-fire { animation: parpadeoFatuo 0.3s ease-in-out infinite; }

        /* Niebla */
        @keyframes nieblaFlotante {
          0% { transform: translateX(-25%); }
          50% { transform: translateX(8%); }
          100% { transform: translateX(-25%); }
        }
        .niebla-mazmorra {
          animation: nieblaFlotante 25s ease-in-out infinite;
          background: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.04) 30%, rgba(255, 255, 255, 0.07) 50%, transparent 100%);
          filter: blur(12px);
        }

        /* Polvo mágico flotante */
        @keyframes flotarPolvoSway1 {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translateY(-200px) translateX(25px); }
          85% { opacity: 0.8; }
          100% { transform: translateY(-450px) translateX(-15px); opacity: 0; }
        }
        @keyframes flotarPolvoSway2 {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translateY(-200px) translateX(-20px); }
          85% { opacity: 0.8; }
          100% { transform: translateY(-450px) translateX(15px); opacity: 0; }
        }

        /* Despliegue de Pergamino en 3D */
        @keyframes desplegarPergamino {
          0% { transform: scaleY(0); filter: brightness(0.2); }
          60% { transform: scaleY(1.08); filter: brightness(1.2); }
          100% { transform: scaleY(1); filter: brightness(1); }
        }
        .efecto-pergamino {
          transform-origin: top;
          animation: desplegarPergamino 0.9s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }

        /* Orbes Fatuos */
        @keyframes orbitarFuegoFatuo {
          0% { transform: translate(0, 0) scale(1); filter: blur(70px); }
          33% { transform: translate(70px, -110px) scale(1.35); filter: blur(90px); }
          66% { transform: translate(-60px, 60px) scale(0.8); filter: blur(60px); }
          100% { transform: translate(0, 0) scale(1); filter: blur(70px); }
        }
        .orbe-espiritual { animation: orbitarFuegoFatuo 14s ease-in-out infinite; }

        /* Bordes Láser de Tarjetas */
        .borde-magico-lineal::after {
          content: '';
          position: absolute;
          inset: -1px;
          border: 2px solid transparent;
          background: linear-gradient(135deg, transparent, #735f3d, transparent) border-box;
          -webkit-mask: linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0.4;
          transition: opacity 0.5s, background 0.5s;
          pointer-events: none;
          border-radius: 4px;
        }
        .borde-magico-lineal:hover::after {
          opacity: 1;
          background: linear-gradient(var(--angulo-borde, 135deg), var(--laser-color-1, #fbbf24), var(--laser-color-2, #fb923c), var(--laser-color-1, #fbbf24)) border-box;
          animation: rotarBordeGradiente 2s linear infinite;
        }

        /* Sonar de Play */
        @keyframes pulsoPlay {
          0% { transform: scale(1); opacity: 0.8; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        .pulso-sonar::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          border: 2px solid #fbbf24;
          animation: pulsoPlay 2s infinite;
          pointer-events: none;
        }

        /* Portal de fondo */
        @keyframes rotarPortalFondo {
          to { transform: rotate(360deg); }
        }
        .portal-runico-fondo { animation: rotarPortalFondo 80s linear infinite; }

        /* Ondas de onda de choque al hacer clic */
        @keyframes ondaClicAnim {
          0% { width: 0px; height: 0px; opacity: 1; border-width: 3px; }
          100% { width: 140px; height: 140px; opacity: 0; border-width: 1px; }
        }
        .animate-onda-clic {
          animation: ondaClicAnim 0.9s cubic-bezier(0.1, 0.8, 0.3, 1) forwards;
        }

        /* Delineado Neón Pulsante para la Ventana */
        @keyframes neonBorderPulse {
          0% {
            border-color: var(--laser-color-1, #fbbf24);
            box-shadow: 0 0 25px -4px var(--laser-color-1, #fbbf24), 0 0 65px -12px var(--laser-color-2, #fb923c), 0 0 100px rgba(0,0,0,0.95);
          }
          100% {
            border-color: var(--laser-color-2, #fb923c);
            box-shadow: 0 0 38px 3px var(--laser-color-2, #fb923c), 0 0 85px -3px var(--laser-color-1, #fbbf24), 0 0 100px rgba(0,0,0,0.95);
          }
        }
        .animate-neon-border {
          animation: neonBorderPulse 3s ease-in-out infinite alternate;
        }

        /* Animaciones de Criaturas Místicas */
        @keyframes flotarHada {
          0% { transform: translateY(120px) scale(0.6) rotate(-10deg); opacity: 0; filter: blur(3px); }
          20% { opacity: 0.9; filter: blur(0px); }
          50% { transform: translateY(-100px) translateX(30px) scale(1.1) rotate(10deg); }
          80% { opacity: 0.9; }
          100% { transform: translateY(-260px) translateX(-20px) scale(0.6) rotate(-5deg); opacity: 0; filter: blur(2px); }
        }
        @keyframes asomarDuende {
          0% { opacity: 0; transform: scale(0.7) translateY(20px) rotate(0deg); }
          15% { opacity: 0.95; transform: scale(0.85) translateY(0px) rotate(3deg); }
          50% { transform: scale(0.85) translateY(0px) rotate(-3deg); }
          85% { opacity: 0.95; transform: scale(0.85) translateY(0px) rotate(0deg); }
          100% { opacity: 0; transform: scale(0.7) translateY(15px) rotate(0deg); }
        }
        @keyframes volarEspiritu {
          0% { transform: translateX(-150px) scale(0.7) translateY(0); opacity: 0; }
          15% { opacity: 0.8; }
          50% { transform: translateX(calc(50vw)) scale(1.15) translateY(-30px); }
          85% { opacity: 0.8; }
          100% { transform: translateX(calc(100vw + 150px)) scale(0.7) translateY(0); opacity: 0; }
        }

        /* Animación de Fantasmas Medianos */
        @keyframes flotarFantasma {
          0% { transform: translateY(40px) translateX(0) scale(0.9); opacity: 0; }
          20% { opacity: 0.65; }
          50% { transform: translateY(-40px) translateX(25px) scale(1.15); opacity: 0.7; }
          80% { opacity: 0.65; }
          100% { transform: translateY(-120px) translateX(-15px) scale(0.9); opacity: 0; }
        }

        /* 🏺 ANIMACIONES ÚNICAS PARA LOS OBJETOS CONTORNOS */
        @keyframes vibrarHarpa {
          0%, 100% { transform: rotate(0deg) scale(1); }
          25% { transform: rotate(2deg) scale(1.02); }
          75% { transform: rotate(-2deg) scale(0.98); }
        }
        .animate-harpa {
          animation: vibrarHarpa 6s ease-in-out infinite;
        }

        @keyframes burbujearPocion {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-12px) scale(1.08); }
        }
        .animate-pocion {
          animation: burbujearPocion 4s ease-in-out infinite;
        }

        @keyframes respirarContenedor {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.55; }
          50% { transform: scale(1.15) rotate(2deg); opacity: 0.95; }
        }
        .animate-contenedor {
          animation: respirarContenedor 3.5s ease-in-out infinite;
        }

        @keyframes flotarMapa {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          33% { transform: translateY(-6px) rotate(1.5deg); }
          66% { transform: translateY(4px) rotate(-2deg); }
        }
        .animate-mapa {
          animation: flotarMapa 5.5s ease-in-out infinite;
        }

        @keyframes destellarEspada {
          0%, 100% { transform: rotate(6deg) scale(1); filter: brightness(1) drop-shadow(0 0 10px rgba(255,85,0,0.65)); }
          50% { transform: rotate(10deg) scale(1.12); filter: brightness(1.3) drop-shadow(0 0 20px rgba(255,85,0,0.9)); }
        }
        .animate-ikl {
          animation: destellarEspada 5s ease-in-out infinite;
        }

        /* 🌿 ANIMACIONES ÚNICAS PARA LAS CRIATURAS PNG */
        @keyframes crecerBrote {
          0% { transform: scale(0) translateY(50px); opacity: 0; }
          15% { transform: scale(1.2) translateY(0); opacity: 0.95; }
          50% { transform: scale(1.25) translateY(-5px) rotate(2deg); opacity: 0.95; }
          85% { transform: scale(1.2) translateY(0); opacity: 0.95; }
          100% { transform: scale(0) translateY(30px); opacity: 0; }
        }
        @keyframes desplazarEscolta {
          0% { transform: translateY(60px) scale(0.9); opacity: 0; }
          20% { opacity: 0.85; }
          50% { transform: translateY(-30px) scale(1.25); opacity: 0.85; }
          80% { opacity: 0.85; }
          100% { transform: translateY(-90px) scale(0.9); opacity: 0; }
        }
        @keyframes orbitaEspirituBosque {
          0% { transform: translate(0, 0) scale(1); opacity: 0; }
          15% { opacity: 0.85; }
          35% { transform: translate(20px, -15px) scale(1.25); }
          70% { transform: translate(-20px, 10px) scale(1.1); }
          85% { opacity: 0.85; }
          100% { transform: translate(0, 0) scale(1); opacity: 0; }
        }
        @keyframes galopeFauna {
          0% { transform: translateX(-200px) translateY(0) scale(0.95); opacity: 0; }
          10% { opacity: 0.85; }
          25% { transform: translateX(calc(25vw)) translateY(-20px) scale(1.2); }
          50% { transform: translateX(calc(50vw)) translateY(0) scale(1.3); }
          75% { transform: translateX(calc(75vw)) translateY(-20px) scale(1.2); }
          90% { opacity: 0.85; }
          100% { transform: translateX(calc(100vw + 200px)) translateY(0) scale(0.95); opacity: 0; }
        }
        @keyframes tocarJuglar {
          0% { transform: translateX(60px) scale(0.9); opacity: 0; }
          15% { transform: translateX(0) scale(1.2); opacity: 0.95; }
          30% { transform: rotate(4deg) scale(1.25); }
          60% { transform: rotate(-4deg) scale(1.18); }
          85% { transform: translateX(0) scale(1.2); opacity: 0.95; }
          100% { transform: translateX(-60px) scale(0.9); opacity: 0; }
        }



        /* Animación de Parpadeo de Saludo Místico */
        @keyframes parpadeoSaludo {
          0%, 100% { opacity: 0.15; filter: blur(0.5px); }
          50% { opacity: 0.95; filter: blur(0px) drop-shadow(0 0 10px var(--laser-color-1)); }
        }
        .animate-parpadeo-saludo {
          animation: parpadeoSaludo 6s ease-in-out infinite;
        }

        /* Animación Mágica de Desvanecimiento al Clic (Spell Vaporization) */
        @keyframes desvanecerMagico {
          0% { transform: scale(1) rotate(0deg); opacity: 1; filter: blur(0px) brightness(1); }
          100% { transform: scale(0) rotate(180deg); opacity: 0; filter: blur(15px) brightness(2.5); }
        }
        .animate-desvanecer-magico {
          animation: desvanecerMagico 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards !important;
        }


        /* Animación del Eclipse Rúnico (Modo Arcoíris) */
        @keyframes eclipseGlow {
          0%, 100% {
            border-color: #ff007f;
            box-shadow: 0 0 35px -5px #ff007f, 0 0 80px -15px #a855f7, 0 0 100px rgba(0,0,0,0.95);
          }
          25% {
            border-color: #22d3ee;
            box-shadow: 0 0 35px -5px #22d3ee, 0 0 80px -15px #06b6d4, 0 0 100px rgba(0,0,0,0.95);
          }
          50% {
            border-color: #34d399;
            box-shadow: 0 0 35px -5px #34d399, 0 0 80px -15px #10b981, 0 0 100px rgba(0,0,0,0.95);
          }
          75% {
            border-color: #fbbf24;
            box-shadow: 0 0 35px -5px #fbbf24, 0 0 80px -15px #fb923c, 0 0 100px rgba(0,0,0,0.95);
          }
        }
        .animate-eclipse {
          animation: eclipseGlow 8s linear infinite !important;
        }

        /* =========================================================================

           📖 ANIMACIÓN EXCLUSIVA DE LIBRO 3D: VOLTEO DE PÁGINAS (Pestanas)
           ========================================================================= */


        .libro-contenedor {
          position: relative;
          overflow: hidden;
          border-radius: 4px;
        }

        /* Trazado y transición de vórtice rúnico místico */
        .libro-hoja {
          width: 100%;
          height: 100%;
          transition: transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), 
                      opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), 
                      filter 0.65s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 10;
          transform: scale(1) rotate(0deg);
          opacity: 1;
          filter: blur(0px);
        }

        /* El contenido antiguo se desvanece rotando suavemente con un halo brillante */
        .libro-hoja.hoja-volteada {
          transform: scale(0.92) rotate(-3.5deg);
          opacity: 0;
          filter: blur(16px) brightness(1.6);
        }

        .libro-sombra-hoja {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 50%, rgba(251,191,36,0.05) 0%, transparent 80%);
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.6s;
          z-index: 15;
          border-radius: 4px;
        }
        .libro-hoja.hoja-volteada .libro-sombra-hoja {
          opacity: 1;
        }

        /* Nueva página que se materializa con zoom-in y foco gradual */
        .libro-hoja-estatica {
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0;
          z-index: 5;
          animation: magicaMaterializacion 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes magicaMaterializacion {
          0% {
            transform: scale(1.08) rotate(3.5deg);
            opacity: 0;
            filter: blur(18px) brightness(1.6);
          }
          100% {
            transform: scale(1) rotate(0deg);
            opacity: 1;
            filter: blur(0px) brightness(1);
          }
        }

        /* Lomo central de las páginas del libro (Sombra de encuadernación) */
        .lomo-libro {
          position: absolute;
          top: 0;
          bottom: 0;
          left: 0;
          width: 8px;
          background: linear-gradient(90deg, rgba(251,191,36,0.08) 0%, transparent 100%);
          z-index: 20;
          pointer-events: none;
        }

        /* =========================================================================
           🚪 COMPUERTAS DE PIEDRA: ANIMACIONES DE ENTRADA Y SALIDA
           ========================================================================= */
        @keyframes translateLeft {
          0% { transform: translateX(0); }
          30% { transform: translateX(0); } /* Retraso para sismo */
          100% { transform: translateX(-100%); }
        }
        @keyframes translateRight {
          0% { transform: translateX(0); }
          30% { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }

        @keyframes closeLeft {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0); }
        }
        @keyframes closeRight {
          0% { transform: translateX(100%); }
          100% { transform: translateX(0); }
        }

        @keyframes fadeScaleOut {
          0% { transform: translate(-50%, -50%) scale(1) rotate(0deg); opacity: 1; }
          40% { transform: translate(-50%, -50%) scale(1.2) rotate(180deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0.3) rotate(360deg); opacity: 0; }
        }

        @keyframes fadeScaleIn {
          0% { transform: translate(-50%, -50%) scale(2); opacity: 0; }
          75% { transform: translate(-50%, -50%) scale(0.9); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        }

        @keyframes fadeInInscription {
          0% { opacity: 0; filter: blur(6px) brightness(0.3); transform: translate(-50%, 15px); }
          100% { opacity: 1; filter: blur(0) brightness(1.2); transform: translate(-50%, 0); }
        }
      `}</style>

      {/* 1. PANTALLA DE ACCESO */}
      {!accesoConcedido && !abriendoPuerta && !cerrandoPuerta && (
        <div className={`relative w-full bg-[#0a0705] border-2 border-[#5a462f] rounded-sm shadow-2xl text-center overflow-hidden z-10 transition-all duration-500 ${
          codigoVerificado ? "max-w-xl p-10" : "max-w-md p-8"
        }`}>
          <div className="absolute inset-0 bg-radial-gradient(circle, rgba(20, 15, 10, 0.4) 0%, rgba(5, 3, 2, 0.98) 100%) pointer-events-none z-0"></div>
          
          <button
            onClick={cerrarYResetear}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10"
            aria-label="Cerrar"
          >
            <i className="fas fa-times text-xl"></i>
          </button>

          {desbloqueoRunico && (
            <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 rounded-full shockwave-ring absolute"></div>
            </div>
          )}

          {!codigoVerificado ? (
            <div className="relative z-10 space-y-6">
              <div className={`w-20 h-20 mx-auto rounded-full bg-[#16100c] border-2 border-[#735f3d] flex items-center justify-center text-[#d1b880] shadow-[inset_0_0_12px_rgba(0,0,0,0.9),0_0_20px_rgba(115,95,61,0.3)] ${
                desbloqueoRunico ? "runa-bloqueo-activa" : "animate-pulse"
              }`}>
                <i className={`fas ${desbloqueoRunico ? "fa-lock-open" : "fa-lock"} text-3xl`}></i>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#d1b880] uppercase tracking-widest" style={{ fontFamily: "'Cinzel', serif" }}>
                  Las Mazmorras
                </h3>
                <p className="text-xs text-gray-400 font-mono tracking-wider">
                  Sello de piedra bloqueado. Introduce el código de alianza para entrar.
                </p>
              </div>

              <form onSubmit={verificarCodigo} className="space-y-4">
                <div className="relative">
                  <input
                    type="password"
                    placeholder="Introduce el código..."
                    value={codigo}
                    onChange={(e) => setCodigo(e.target.value)}
                    className="w-full bg-[#050302] border border-[#735f3d]/60 p-3.5 text-center text-white placeholder-gray-700 rounded-sm font-mono tracking-[0.3em] uppercase focus:border-[#fbbf24] focus:outline-none transition-colors"
                  />
                </div>

                {errorCodigo && (
                  <p 
                    className={`text-[10px] font-mono tracking-wide ${
                      mensajeErrorCodigo.startsWith("«") ? "text-[#fbbf24]" : "text-red-500 animate-pulse"
                    }`}
                  >
                    {mensajeErrorCodigo}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#403020]/40 border border-[#d1b880]/50 text-[#d1b880] font-bold text-center tracking-widest uppercase hover:bg-[#fbbf24] hover:text-[#060a13] hover:shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-300 rounded-sm text-xs"
                >
                  Descifrar Sello
                </button>
              </form>
            </div>
          ) : (
            <div className="relative z-10 space-y-6 text-left">
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 mx-auto rounded-full bg-[#16100c] border-2 border-[#fbbf24]/50 flex items-center justify-center text-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.25)] mb-2">
                  <i className="fas fa-feather-alt text-xl"></i>
                </div>
                <h3 className="font-serif text-2xl text-[#d1b880] uppercase tracking-widest text-center" style={{ fontFamily: "'Cinzel', serif" }}>
                  Pacto de la Arboleda
                </h3>
                <p className="text-[10px] text-gray-400 font-mono tracking-wider text-center">
                  Código verificado. Grava tus datos en la piedra antes de cruzar el umbral.
                </p>
              </div>

              <form onSubmit={procesarRegistroFan} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[9.5px] text-[#fbbf24] font-mono uppercase block">Nombre o Alias en el Clan</label>
                  <input 
                    type="text"
                    placeholder="Ej: Valerius"
                    value={nombreFan}
                    onChange={(e) => setNombreFan(e.target.value)}
                    className="w-full bg-black/60 border border-[#735f3d]/40 text-sm text-white p-3.5 rounded-sm focus:outline-none focus:border-[#fbbf24] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-[#fbbf24] font-mono uppercase block">Correo de Contacto</label>
                  <input 
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={emailFan}
                    onChange={(e) => setEmailFan(e.target.value)}
                    className="w-full bg-black/60 border border-[#735f3d]/40 text-sm text-white p-3.5 rounded-sm focus:outline-none focus:border-[#fbbf24] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-[#fbbf24] font-mono uppercase block">País / Tierra Natal</label>
                  <input 
                    type="text"
                    placeholder="Ej: España"
                    value={paisFan}
                    onChange={(e) => setPaisFan(e.target.value)}
                    className="w-full bg-black/60 border border-[#735f3d]/40 text-sm text-white p-3.5 rounded-sm focus:outline-none focus:border-[#fbbf24] transition-colors"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9.5px] text-[#fbbf24] font-mono uppercase block">Número de Teléfono</label>
                  <input 
                    type="tel"
                    placeholder="Ej: +34 600 000 000"
                    value={telefonoFan}
                    onChange={(e) => setTelefonoFan(e.target.value)}
                    className="w-full bg-black/60 border border-[#735f3d]/40 text-sm text-white p-3.5 rounded-sm focus:outline-none focus:border-[#fbbf24] transition-colors"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 mt-4 bg-[#735f3d] border border-[#d1b880]/50 text-white font-bold text-center tracking-widest uppercase hover:bg-[#fbbf24] hover:text-[#060a13] hover:shadow-[0_0_15px_rgba(251,191,36,0.6)] transition-all duration-300 rounded-sm text-xs font-mono"
                >
                  Gravar Nombre en la Piedra
                </button>
              </form>
            </div>
          )}
        </div>
      )}



      {/* 2. CINEMÁTICA INTERACTIVA: APERTURA */}
      {abriendoPuerta && (
        <div className="fixed inset-0 z-50 flex overflow-hidden">
          <div 
            className="w-1/2 h-full bg-[#120d0a] border-r border-[#5a462f] flex items-center justify-end relative select-none shadow-[10px_0_30px_rgba(0,0,0,0.8)] overflow-hidden animate-[translateLeft_1.5s_ease-in-out_forwards]"
          >
            {/* Contenedor interno que ocupa el ancho de pantalla completo para mantener proporción */}
            <div 
              className="absolute top-0 left-0 w-[100vw] h-full pointer-events-none"
              style={{
                backgroundImage: "url('/puerta-de-las-mazmorras.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div className="absolute inset-0 bg-radial-gradient(circle at right, rgba(35, 25, 18, 0.4) 0%, rgba(5, 3, 2, 0.98) 100%) pointer-events-none"></div>
            <div className="text-[60px] text-[#735f3d]/15 font-serif absolute left-10 top-1/3 z-10">ᚲ</div>
          </div>
          <div 
            className="w-1/2 h-full bg-[#120d0a] border-l border-[#5a462f] flex items-center justify-start relative select-none shadow-[-10px_0_30px_rgba(0,0,0,0.8)] overflow-hidden animate-[translateRight_1.5s_ease-in-out_forwards]"
          >
            {/* Contenedor interno que ocupa el ancho de pantalla completo, desplazado a la izquierda para alinear */}
            <div 
              className="absolute top-0 left-[-50vw] w-[100vw] h-full pointer-events-none"
              style={{
                backgroundImage: "url('/puerta-de-las-mazmorras.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div className="absolute inset-0 bg-radial-gradient(circle at left, rgba(35, 25, 18, 0.4) 0%, rgba(5, 3, 2, 0.98) 100%) pointer-events-none"></div>
            <div className="text-[60px] text-[#735f3d]/15 font-serif absolute right-10 top-1/3 z-10">ᚦ</div>
          </div>
          {/* Candado Central Completo que gira y desaparece */}
          <div className="absolute left-1/2 top-1/2 w-20 h-20 rounded-full border-2 border-[#fbbf24] bg-[#0c0907] flex items-center justify-center text-[#fbbf24] shadow-[0_0_25px_rgba(251,191,36,0.7)] z-10 animate-[fadeScaleOut_1.5s_ease-in-out_forwards]">
            <i className="fas fa-lock-open text-2xl"></i>
          </div>
        </div>
      )}


      {activarDestello && (
        <div className="fixed inset-0 z-55 pointer-events-none flex items-center justify-center">
          <div className="w-full h-full super-destello"></div>
        </div>
      )}

      {/* 3. CINEMÁTICA INTERACTIVA: SALIDA ÉPICA */}
      {cerrandoPuerta && (
        <div className={`fixed inset-0 z-[60] flex overflow-hidden transition-opacity duration-1000 ${
          desvanecerCierre ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}>
          <div 
            className="w-1/2 h-full bg-[#120d0a] border-r border-[#5a462f] flex items-center justify-end relative select-none shadow-[10px_0_30px_rgba(0,0,0,0.8)] overflow-hidden animate-[closeLeft_1.2s_ease-in-out_forwards]"
          >
            {/* Contenedor interno que ocupa el ancho de pantalla completo */}
            <div 
              className="absolute top-0 left-0 w-[100vw] h-full pointer-events-none"
              style={{
                backgroundImage: "url('/puerta-de-las-mazmorras.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div className="absolute inset-0 bg-radial-gradient(circle at right, rgba(35, 25, 18, 0.4) 0%, rgba(5, 3, 2, 0.98) 100%) pointer-events-none"></div>
            <div className="text-[60px] text-[#735f3d]/15 font-serif absolute left-10 top-1/3 z-10">ᚲ</div>
          </div>
          <div 
            className="w-1/2 h-full bg-[#120d0a] border-l border-[#5a462f] flex items-center justify-start relative select-none shadow-[-10px_0_30px_rgba(0,0,0,0.8)] overflow-hidden animate-[closeRight_1.2s_ease-in-out_forwards]"
          >
            {/* Contenedor interno desplazado a la izquierda */}
            <div 
              className="absolute top-0 left-[-50vw] w-[100vw] h-full pointer-events-none"
              style={{
                backgroundImage: "url('/puerta-de-las-mazmorras.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat"
              }}
            />
            <div className="absolute inset-0 bg-radial-gradient(circle at left, rgba(35, 25, 18, 0.4) 0%, rgba(5, 3, 2, 0.98) 100%) pointer-events-none"></div>
            <div className="text-[60px] text-[#735f3d]/15 font-serif absolute right-10 top-1/3 z-10">ᚦ</div>
          </div>
          {/* Candado Central Completo que se cierra de golpe en el centro */}
          <div className="absolute left-1/2 top-1/2 w-20 h-20 rounded-full border-2 border-[#fbbf24] bg-[#0c0907] flex items-center justify-center text-[#fbbf24] shadow-[0_0_25px_rgba(251,191,36,0.7)] z-10 animate-[fadeScaleIn_1.2s_ease-in-out_forwards]">
            <i className="fas fa-lock text-2xl animate-pulse"></i>
          </div>

          {/* Mensaje Rúnico Invocando Nueva Visita */}
          {mostrarMensajeSellar && mensajeSellar && (
            <div className="absolute left-1/2 top-[62%] -translate-x-1/2 max-w-lg text-center px-6 z-10 animate-[fadeInInscription_1s_ease-out_forwards]">
              <span className="text-[#fbbf24] text-lg block mb-2 select-none animate-pulse">ᛉ</span>
              <p className="text-[#d1b880] text-sm md:text-base font-serif italic tracking-wide leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                &ldquo;{mensajeSellar}&rdquo;
              </p>
            </div>
          )}
        </div>
      )}


      {/* 4. SECCIÓN INTERIOR REALISTA: LA MAZMORRA DE PIEDRA Y BRUMAS */}
      {accesoConcedido && !mostrarMensajeSellar && (
        <>
          {/* CRIATURAS Y OBJETOS MÍSTICOS RENDERIZADOS A NIVEL PANTALLA COMPLETA (EN PAREDES LATERALES EXTERIORES, FUERA DE LA VENTANA DE CONTENIDO) */}
          <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
            {criaturas.map((c) => (
              <div
                key={c.id}
                className="fixed z-0 pointer-events-none select-none transition-all duration-1000"
                style={{
                  left: c.left <= 50 ? `${c.left}vw` : "auto",
                  right: c.left > 50 ? `${Math.max(100 - c.left, 2)}vw` : "auto",
                  top: `${c.top}vh`,
                  transform: `scale(${c.scale || 1})`,
                  animation: c.anim || "flotarHada 8s ease-in-out forwards"
                }}
              >
                {c.img ? (
                  <img 
                    src={c.img} 
                    alt={c.nombre || c.tipo} 
                    className={`w-12 h-12 md:w-16 md:h-16 object-contain filter ${c.shadow || "drop-shadow-[0_0_15px_#fbbf24]"}`}
                  />
                ) : (
                  <div className={`text-3xl filter ${c.color || "text-amber-300 drop-shadow-[0_0_10px_#fbbf24]"}`}>
                    {c.icono || "🔮"}
                  </div>
                )}
              </div>
            ))}
          </div>

          <div 
            className={`relative z-10 w-full max-w-[1040px] bg-black/65 backdrop-blur-[4px] border-2 p-6 md:p-8 rounded-md overflow-hidden animate-[scaleUp_0.5s_ease-out_forwards] ${
              modoEclipse ? "animate-eclipse" : "animate-neon-border"
            }`}

            style={{
              borderColor: modoEclipse ? undefined : "var(--laser-color-1)",
              boxShadow: modoEclipse ? undefined : "0 0 35px -5px var(--laser-color-1), 0 0 80px -15px var(--laser-color-2), 0 0 100px rgba(0,0,0,0.95)",
              "--laser-color-1": modoMagico === 1 ? "#22d3ee" : modoMagico === 2 ? "#c084fc" : modoMagico === 3 ? "#34d399" : "#fbbf24",
              "--laser-color-2": modoMagico === 1 ? "#06b6d4" : modoMagico === 2 ? "#a855f7" : modoMagico === 3 ? "#10b981" : "#fb923c"
            }}
          >
            
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(40,30,22,0.25)_0%,_rgba(5,4,3,0.88)_100%)] pointer-events-none z-0"></div>
            <div className="absolute inset-0 opacity-[0.02] bg-[linear-gradient(90deg,#735f3d_1px,transparent_1px),linear-gradient(#735f3d_1px,transparent_1px)] [background-size:60px_35px] pointer-events-none"></div>

            
            {/* PORTAL RÚNICO TRASERO GIGANTE */}
            <div className="absolute -right-32 -top-32 w-[600px] h-[600px] pointer-events-none z-0 select-none flex items-center justify-center">
              <svg 
                viewBox="0 0 200 200" 
                className={`w-full h-full portal-runico-fondo transition-colors duration-1000 ${obtenerColorPortal(modoMagico)}`}
                fill="none" 
                stroke="currentColor" 
                strokeWidth="0.8"
              >
                <circle cx="100" cy="100" r="85" strokeDasharray="3 3" />
                <circle cx="100" cy="100" r="75" />
                <circle cx="100" cy="100" r="55" />
                <path d="M100 15 L100 185 M15 100 L185 100 M40 40 L160 160 M40 160 L160 40" strokeWidth="0.4" />
              </svg>
            </div>

            {/* LUCES AMBIENTALES DINÁMICAS */}
            <div className={`absolute -left-10 top-1/4 w-32 h-60 blur-[50px] pointer-events-none transition-all duration-1000 z-0 ${obtenerColorGlowFondo(modoMagico, "izq")}`}></div>
            <div className={`absolute -right-10 top-1/3 w-32 h-60 blur-[50px] pointer-events-none transition-all duration-1000 z-0 ${obtenerColorGlowFondo(modoMagico, "der")}`}></div>


            {/* Orbes Fatuos */}
            {/* ORBES ESPIRITUALES DE COLOR */}
            {modoMagico !== 0 && (
              <div className="absolute inset-0 pointer-events-none z-0 select-none">
                <div className={`absolute top-[20%] left-[15%] w-48 h-48 blur-[80px] rounded-full orbe-espiritual ${
                  modoMagico === 1 ? "bg-cyan-600/12" : modoMagico === 2 ? "bg-purple-600/12" : "bg-emerald-600/12"
                }`}></div>
                <div className={`absolute bottom-[20%] right-[25%] w-60 h-60 blur-[95px] rounded-full orbe-espiritual ${
                  modoMagico === 1 ? "bg-teal-600/10" : modoMagico === 2 ? "bg-fuchsia-600/10" : "bg-green-600/10"
                }`} style={{ animationDelay: "-4s", animationDuration: "16s" }}></div>
              </div>
            )}
            
            <div className="absolute bottom-0 left-0 right-0 h-40 niebla-mazmorra pointer-events-none opacity-60 z-10"></div>





          {/* Cadenas SVG */}
          <svg className="absolute left-4 top-0 w-6 h-64 text-[#4a3a2a]/30 hidden md:block z-1" viewBox="0 0 20 200" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10,0 L10,20 L10,84 L10,155 L10,200" />
            <circle cx="10" cy="20" r="4" fill="#090706" stroke="currentColor" />
            <circle cx="10" cy="110" r="4" fill="#090706" stroke="currentColor" />
          </svg>
          <svg className="absolute right-4 top-0 w-6 h-56 text-[#4a3a2a]/30 hidden md:block z-1" viewBox="0 0 20 150" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M10,0 L10,15 L10,55 L10,95 L10,150" />
            <circle cx="10" cy="15" r="4" fill="#090706" stroke="currentColor" />
            <circle cx="10" cy="95" r="4" fill="#090706" stroke="currentColor" />
          </svg>

          {/* Cabecera de la Mazmorra */}
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-[#4e3a29]/40 pb-4 mb-6">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              
              <button
                onClick={() => setModoMagico((prev) => (prev === 0 ? 1 : 0))}
                className={`w-10 h-10 rounded-sm bg-[#221710] border flex items-center justify-center relative shadow-inner hover:scale-110 transition-all duration-300 group z-20 ${
                  modoMagico === 1 ? "text-cyan-400 border-cyan-500/50 hover:shadow-[0_0_12px_rgba(6,182,212,0.35)]" : "text-amber-500 border-[#735f3d]/60 hover:shadow-[0_0_12px_rgba(251,191,36,0.35)]"
                }`}
                title="Tocar antorcha mística (Cambiar de naranja a cian)"
              >
                <i className={`fas fa-fire text-lg z-10 transition-colors ${
                  modoMagico === 1 ? "antorcha-fatuo-fire text-cyan-400" : "antorcha-fuego text-amber-500"
                }`}></i>
                <span className={`absolute inset-1 rounded-full blur-md opacity-30 scale-125 transition-all duration-700 ${
                  modoMagico === 1 ? "bg-cyan-500 animate-pulse" : "bg-amber-500 animate-pulse"
                }`}></span>
              </button>


              <div>
                <span className="text-[9px] text-[#8da382] font-mono tracking-[0.25em] block uppercase">CÁMARA OCULTA Y ARCHIVOS INÉDITOS</span>
                <h3 
                  onClick={activarEasterEggEclipse}
                  className="font-serif text-3xl text-[#d1b880] tracking-wider uppercase cursor-pointer select-none hover:text-[#fbbf24] transition-colors" 
                  style={{ fontFamily: "'Cinzel', serif" }}
                  title="¿Desbloquear el secreto del eclipse?"
                >
                  Las Mazmorras
                </h3>
              </div>


            </div>

            {/* Pestañas de Contenido (Libro de Páginas Místicas) */}
            <div className="flex flex-wrap gap-1.5 bg-[#07090e]/95 p-1.5 border border-[#d1b880]/35 rounded-md shadow-[0_0_20px_rgba(0,0,0,0.9)] z-30 backdrop-blur-md">
              <button
                onClick={() => cambiarPestanaConLibro("audios")}
                className={`group px-2.5 md:px-3 py-1.5 text-[8.5px] md:text-[9.5px] tracking-wider font-bold uppercase transition-all duration-300 font-mono rounded-sm flex items-center ${
                  pestanaActiva === "audios"
                    ? "bg-gradient-to-r from-[#735f3d] to-[#b48f4b] text-amber-100 border border-[#fbbf24]/50 shadow-[0_0_12px_rgba(251,191,36,0.4)] scale-[1.03]"
                    : "text-gray-400 hover:text-amber-200 bg-black/60 hover:bg-black/90 border border-white/5 hover:border-amber-500/30"
                }`}
              >
                <span className="text-amber-400 text-xs md:text-sm mr-1.5 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">🎵</span>
                <span className="text-[8px] text-amber-500/80 font-serif mr-1 select-none">ᚠ</span>
                Grimorio
              </button>

              <button
                onClick={() => cambiarPestanaConLibro("fotos")}
                className={`group px-2.5 md:px-3 py-1.5 text-[8.5px] md:text-[9.5px] tracking-wider font-bold uppercase transition-all duration-300 font-mono rounded-sm flex items-center ${
                  pestanaActiva === "fotos"
                    ? "bg-gradient-to-r from-cyan-950 to-sky-900 text-cyan-100 border border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.4)] scale-[1.03]"
                    : "text-gray-400 hover:text-cyan-200 bg-black/60 hover:bg-black/90 border border-white/5 hover:border-cyan-500/30"
                }`}
              >
                <span className="text-cyan-400 text-xs md:text-sm mr-1.5 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_6px_rgba(56,189,248,0.6)]">🔮</span>
                <span className="text-[8px] text-cyan-400/80 font-serif mr-1 select-none">ᚦ</span>
                Visiones
              </button>

              <button
                onClick={() => cambiarPestanaConLibro("clips")}
                className={`group px-2.5 md:px-3 py-1.5 text-[8.5px] md:text-[9.5px] tracking-wider font-bold uppercase transition-all duration-300 font-mono rounded-sm flex items-center ${
                  pestanaActiva === "clips"
                    ? "bg-gradient-to-r from-orange-950 to-amber-900 text-orange-100 border border-orange-400/50 shadow-[0_0_12px_rgba(249,115,22,0.4)] scale-[1.03]"
                    : "text-gray-400 hover:text-orange-200 bg-black/60 hover:bg-black/90 border border-white/5 hover:border-orange-500/30"
                }`}
              >
                <span className="text-orange-500 text-xs md:text-sm mr-1.5 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_6px_rgba(249,115,22,0.7)] animate-pulse">🔥</span>
                <span className="text-[8px] text-orange-400/80 font-serif mr-1 select-none">ᛉ</span>
                Rituales
              </button>

              <button
                onClick={() => cambiarPestanaConLibro("contacto")}
                className={`group px-2.5 md:px-3 py-1.5 text-[8.5px] md:text-[9.5px] tracking-wider font-bold uppercase transition-all duration-300 font-mono rounded-sm flex items-center ${
                  pestanaActiva === "contacto"
                    ? "bg-gradient-to-r from-emerald-950 to-teal-900 text-emerald-100 border border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.4)] scale-[1.03]"
                    : "text-gray-400 hover:text-emerald-200 bg-black/60 hover:bg-black/90 border border-white/5 hover:border-emerald-500/30"
                }`}
              >
                <span className="text-emerald-400 text-xs md:text-sm mr-1.5 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_6px_rgba(52,211,153,0.6)]">⚔️</span>
                <span className="text-[8px] text-emerald-400/80 font-serif mr-1 select-none">ᛗ</span>
                Alianza
              </button>

              <button
                onClick={() => cambiarPestanaConLibro("buzon")}
                className={`group px-2.5 md:px-3 py-1.5 text-[8.5px] md:text-[9.5px] tracking-wider font-bold uppercase transition-all duration-300 font-mono rounded-sm flex items-center ${
                  pestanaActiva === "buzon"
                    ? "bg-gradient-to-r from-purple-950 to-fuchsia-900 text-purple-100 border border-purple-400/50 shadow-[0_0_12px_rgba(192,132,252,0.4)] scale-[1.03]"
                    : "text-gray-400 hover:text-purple-200 bg-black/60 hover:bg-black/90 border border-white/5 hover:border-purple-500/30"
                }`}
              >
                <span className="text-purple-400 text-xs md:text-sm mr-1.5 group-hover:scale-125 transition-transform duration-300 filter drop-shadow-[0_0_6px_rgba(192,132,252,0.6)]">📬</span>
                <span className="text-[8px] text-purple-400/80 font-serif mr-1 select-none">ᚺ</span>
                Buzón
              </button>
            </div>


            <button
              onClick={iniciarCierreEpico}
              className="mt-4 md:mt-0 px-4 py-2 border border-[#735f3d]/60 bg-black/40 text-xs text-gray-400 hover:text-[#fbbf24] hover:border-[#fbbf24] transition-all rounded-sm uppercase tracking-wider font-mono shadow-[0_0_8px_rgba(0,0,0,0.5)]"
            >
              Sellar Mazmorras
            </button>
          </div>

          {/* =========================================================================
             📖 MAZMORRA DISTRIBUIDA COMO UN LIBRO CON LOMO CENTRAL Y VOLTEO DE PÁGINAS
             ========================================================================= */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch bg-[#0e0a07] border border-[#523d26]/40 rounded-sm shadow-2xl overflow-hidden min-h-[440px]">
            
            {/* LADO IZQUIERDO: PÁGINA FIJA (Reproductor de Música + Diario) */}
            <div className="lg:col-span-5 p-5 flex flex-col justify-between relative bg-[#090706]/95 z-10 border-r border-[#523d26]/20">
              
              {/* Reproductor */}
              <div className={`p-4 rounded-sm transition-all duration-500 mb-4 bg-[#0a0705] border ${
                modoMagico === 1 ? "border-cyan-500/20 bg-cyan-950/5" :
                modoMagico === 2 ? "border-purple-500/20 bg-purple-950/5" :
                modoMagico === 3 ? "border-emerald-500/20 bg-emerald-950/5" :
                "border-[#735f3d]/20 bg-black/30"
              }`}>
                <span className="text-[8px] text-[#8da382] font-mono tracking-widest uppercase block mb-1">REPRODUCTOR DE LAS MAZMORRAS</span>
                <h4 className="text-sm font-serif text-white font-bold truncate">{cancionActivaDungeon?.titulo || "Selecciona una pista"}</h4>
                <p className="text-[9px] text-amber-500/80 font-mono mt-0.5">{cancionActivaDungeon?.tipo}</p>

                {/* Controles de audio */}
                <div className="mt-3 flex items-center justify-center space-x-3 bg-black/60 p-2.5 border border-[#735f3d]/20 rounded-sm">
                  <button
                    onClick={retrocederDungeon}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#735f3d]/30 border border-[#735f3d]/30 flex items-center justify-center text-[#d1b880] hover:text-white transition-colors"
                    disabled={!cancionActivaDungeon}
                    title="Retroceder 10s"
                  >
                    <i className="fas fa-undo-alt text-[10px]"></i>
                  </button>
                  <button
                    onClick={alternarReproduccionDungeon}
                    className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 flex-shrink-0 ${
                      modoMagico === 1 ? "bg-cyan-500 text-black hover:bg-white" :
                      modoMagico === 2 ? "bg-purple-500 text-black hover:bg-white" :
                      modoMagico === 3 ? "bg-emerald-500 text-black hover:bg-white" :
                      "bg-[#d1b880] text-[#060a13] hover:bg-white"
                    }`}
                    disabled={!cancionActivaDungeon}
                  >
                    <i className={`fas ${reproduciendoDungeon ? "fa-pause" : "fa-play"} text-xs pl-[1px]`}></i>
                  </button>
                  <button
                    onClick={adelantarDungeon}
                    className="w-8 h-8 rounded-full bg-black/40 hover:bg-[#735f3d]/30 border border-[#735f3d]/30 flex items-center justify-center text-[#d1b880] hover:text-white transition-colors"
                    disabled={!cancionActivaDungeon}
                    title="Adelantar 10s"
                  >
                    <i className="fas fa-redo-alt text-[10px]"></i>
                  </button>
                  <div className="flex-grow min-w-0">
                    <div 
                      onClick={manejarClickProgresoDungeon}
                      className="h-2 bg-[#1a140f] rounded-full overflow-hidden border border-black relative cursor-pointer"
                    >
                      <div 
                        className="h-full transition-all"
                        style={{ 
                          width: `${progresoAudio}%`,
                          backgroundColor: obtenerColorParticula(modoMagico)
                        }}
                      ></div>
                    </div>
                  </div>
                </div>


                {cancionActivaDungeon && (
                  <audio 
                    src={cancionActivaDungeon.enlace} 
                    ref={audioRefDungeon}
                    onEnded={() => setReproduciendoDungeon(false)}
                    crossOrigin="anonymous"
                  />
                )}
              </div>

              {/* Diario pergamino 3D */}
              <div className="bg-[#0b0806] border border-[#735f3d]/20 p-4 rounded-sm efecto-pergamino relative">
                <span className="text-[8px] text-[#d1b880]/70 font-mono tracking-widest uppercase block mb-1">MANUSCRITO COMPOSITIVO</span>
                <div className="text-[10px] text-gray-300 font-serif leading-relaxed italic space-y-1.5 border-l border-[#735f3d]/50 pl-2">
                  <p>&ldquo;Las hojas caen sobre las cuerdas... la zanfoña silba hoy una tormenta que habla de los caídos. Si grabamos a la luz del fuego fatuo sonarán eternas.&rdquo;</p>
                </div>
              </div>

            </div>




            {/* LADO DERECHO: PÁGINAS DEL LIBRO CON VOLTEO 3D (Pestanas) */}
            <div className="lg:col-span-7 relative min-h-[420px] libro-contenedor bg-[#0c0907]/98">
              



              {/* Página Estática Inferior (Página que se revela al voltear) */}
              {paginaVolteando && (
                <div className="libro-hoja-estatica">
                  {renderizarContenidoPaginaLibro(pestanaSiguiente)}
                </div>
              )}

              {/* Página Móvil Superior (Página que gira con su respectiva sombra de flexión) */}
              <div className={`libro-hoja ${paginaVolteando ? "hoja-volteada" : ""}`}>
                <div className="libro-sombra-hoja"></div>
                {renderizarContenidoPaginaLibro(pestanaActiva)}
              </div>

            </div>

          </div>

          {/* BANNER DE SUSURROS RÚNICOS INTERACTIVOS */}
          {susurroActivo && (
            <div className="absolute left-1/2 bottom-3 -translate-x-1/2 max-w-lg w-[85%] bg-[#0a0705]/98 border border-[#fbbf24]/30 p-2 rounded-sm shadow-2xl z-30 text-center animate-[fadeInInscription_0.5s_ease-out_forwards]">
              <span className="text-[7px] text-[#fbbf24] font-mono tracking-widest block uppercase mb-0.5">
                ᚱᚢᚾᛏᚫᛊ • TRADUCCIÓN DEL SUSURRO DE LA PIEDRA
              </span>
              <p className="text-[#d1b880] text-[10px] font-serif italic leading-relaxed">
                {susurroActivo}
              </p>
            </div>
          )}

          <style>{`
            @keyframes scaleUp {
              from { opacity: 0; transform: scale(0.97); }
              to { opacity: 1; transform: scale(1); }
            }
          `}</style>
        </div>
      </>
      )}





      {/* 5. MODAL DE VÍDEO EXCLUSIVO */}
      {videoModalAbierto && (
        <div className="fixed inset-0 z-55 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 md:p-8">
          <div className="relative w-full max-w-4xl bg-[#090706] border-2 border-[#fbbf24]/40 aspect-video rounded-sm shadow-2xl overflow-hidden animate-[scaleUp_0.3s_ease-out_forwards]">
            <button
              onClick={() => setVideoModalAbierto(false)}
              className="absolute top-4 right-4 text-white/70 hover:text-white bg-black/60 w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/90 transition-colors z-10"
              aria-label="Cerrar Vídeo"
            >
              <i className="fas fa-times"></i>
            </button>
            <iframe
              src={videoUrlActual}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
        </div>
      )}

    </div>
  );
}
