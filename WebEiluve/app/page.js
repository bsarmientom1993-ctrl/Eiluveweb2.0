"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Cargador from "./components/Cargador";
import BarraNavegacion from "./components/BarraNavegacion";
import Presentacion from "./components/Presentacion";
import Widgets from "./components/Widgets";
import Biografia from "./components/Biografia";
import Ritual from "./components/Ritual";
import FechasGira from "./components/FechasGira";
import FormularioContacto from "./components/FormularioContacto";
import PiePagina from "./components/PiePagina";
import ParticulasCanvas from "./components/ParticulasCanvas";
import PortalTransicion from "./components/PortalTransicion";
import Cronicas from "./components/Cronicas";
import Mazmorras from "./components/Mazmorras";
import Dashboard from "./components/Dashboard";

// =========================================================================
// 🎛️ AJUSTE MANUAL DE UN SOLO USO: FONDO DE LA PÁGINA HÉROE
// =========================================================================
// Edita estos valores para cambiar con precisión de píxel o porcentaje el fondo.
const CONFIG_FONDO = {
  imagenRuta: "/hero_background.jpg", // Ruta de la ilustración limpia
  posicionX: "center",                 // Posición centrada armónica
  posicionY: "center",                 // Posición vertical centrada
  escala: "cover",                     // Escala ajustada para ver toda la portada
  repetir: "no-repeat",               // Evitar repetición
  // Degradado veteado y lateral que oscurece contornos y resalta el árbol central
  degradado: "radial-gradient(ellipse at 55% 45%, rgba(6, 10, 19, 0) 20%, rgba(6, 10, 19, 0.45) 60%, rgba(6, 10, 19, 0.92) 100%), linear-gradient(to right, rgba(6, 10, 19, 0.92) 0%, rgba(6, 10, 19, 0.35) 18%, rgba(6, 10, 19, 0) 45%, rgba(6, 10, 19, 0) 65%, rgba(6, 10, 19, 0.35) 82%, rgba(6, 10, 19, 0.92) 100%)",
  // Transición sutil vertical para fundir con cabecera y sección inferior
  degradadoVertical: "linear-gradient(to top, rgba(6, 10, 19, 0.95) 0%, rgba(6, 10, 19, 0.1) 35%, rgba(6, 10, 19, 0.2) 100%)"
};

// OPCIÓN GLOBAL PARA ACTIVAR/DESACTIVAR EL EFECTO PARALLAX CON EL CURSOR
// Cambiar a 'true' para activar el movimiento tridimensional de capas de fondo con el ratón.
const ACTIVAR_PARALLAX = false;

// =========================================================================
// 🎛️ LISTA DE REPRODUCCIÓN (BLOQUE ESCUCHA)
// =========================================================================
// Para reproducir tus propias canciones .mp3:
// 1. Copia tus archivos .mp3 a la carpeta 'public/' (ej: public/somos_todos.mp3)
// 2. Configura el campo 'enlace' con la ruta del archivo (ej: enlace: "/somos_todos.mp3")
const CANCIONES = [
  {
    titulo: "Somos Todos",
    artista: "Eiluvë",
    enlace: "/somos-todos.mp3",
    portada: "/somos-todos.jpg",
    duracion: "6:12",
  },
  {
    titulo: "Tú Voz",
    artista: "Eiluvë",
    enlace: "/tu-voz.mp3",
    portada: "/Portada.jpg",
    duracion: "7:05",
  },
  {
    titulo: "Quizás manaña",
    artista: "Eiluvë",
    enlace: "/quizas-manana.mp3",
    portada: "/Portada.jpg",
    duracion: "5:44",
  },
  {
    titulo: "El matriqui del diablo",
    artista: "Eiluvë",
    enlace: "/el-matriqui-del-diablo.mp3",
    portada: "/el-matriqui-del-diablo.jpg",
    duracion: "5:44",
  }
];

export default function Home() {
  const [indiceCancion, setIndiceCancion] = useState(0);
  const [reproduciendo, setReproduciendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [tiempoActual, setTiempoActual] = useState("0:00");
  const [portalActivo, setPortalActivo] = useState(false);
  const [tiempoTotal, setTiempoTotal] = useState("0:00");
  const [cargando, setCargando] = useState(true);
  const [mazmorrasAbierta, setMazmorrasAbierta] = useState(false);
  const [dashboardAbierto, setDashboardAbierto] = useState(false);
  const [esMovil, setEsMovil] = useState(false);

  // Estados dinámicos gestionados desde el Dashboard y persistidos en localStorage
  const [heroBg, setHeroBg] = useState("/hero_background.jpg");
  const [links, setLinks] = useState({
    facebook: "https://facebook.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    spotify: "https://spotify.com",
    apple: "https://music.apple.com",
    tiktok: "https://tiktok.com",
    album: "https://spotify.com",
    video: "https://www.youtube.com/watch?v=iijKLHCQw5g"
  });
  const [bio, setBio] = useState({
    titulo: "El Comienzo",
    cita: "“De los cimientos del vacío y el silencio inicuo estaba el principio preso de su vástago sueño. De esa oscuridad grisácea la ilusión perenne permite la luzy la armonía que abraza la música de Eilúve … ” Ger Nava",
    historia: `Eilúve es una banda boliviana de metal que abraza los gustos e influencias folk, celtas y rock. Lo que acompaña a su música son letras que provienen desde las vivencias personales, la búsqueda de mensajes de lucha, perseverancia bajo críticas sociales y culturales, hasta poemas y romances con tintes juglares.

Eilúve nace el 3 de Julio del año 2023 en La Paz, Bolivia. Sus fundadores son Gerson Nava y Sergio Laure quienes en anteriores proyectos compartieron experiencias musicales y escenarios con diferentes artistas tanto nacionales como internacionales. Con esta familiaridad musical decidieron dar rienda suelta y crearon Eilúve.

Para ello contaron con José María Alvarez (Dino) en la batería, a Blas Sarmiento en la 2da Guitarra, Patricia Paredes al violín, Mario Paz en la guitarra líder, a Jhon Mamani con el bajo, Silvia Baltazar y Maria Belén Quisbert como voces de acompañamiento. Esta primera formación fue más un sondeo de lo que más adelante sería el camino de Eilúve.

Una vez que los cimientos y principios de trabajo fueron establecidos, algunos apoyos iniciales tomaron otro rumbo pero que siempre estarán en la memoria de Eilúve. Como no faltaban amistades, llegaron Armin Jhamil Mostajo para ocupar el bajo, Milán Espinoza a la voz y Steven Guachalla como guitarra líder.

El agradecimiento siempre será reconocido a Jhon, Silvia, Mario, Belén y a Rodrigo Caballero, quien apoyó con su voz en las primeras maquetas.

En julio del 2025 Eilúve, lanzó su primer Single llamado Tu Voz. Una canción con mucha presencia de guitarras, teclados y poderosos arreglos de bajo que danzan con la batería. Con tintes folk y barroco por parte de los violines y flautas. Sin olvidar la estruendosa y melodiosa voz que da vida al tema. En septiembre del año 2025 Eilúve lanza su segundo sencillo oficial denominado Somos Todos, canción que lleva uno de los lemas más emblemáticos de la banda y que acompaña un mensaje musical profundo que habla de los sueños y lo importante que es creer en ellos. Ya en noviembre de ese mismo año sale a la luz su último sencillo oficial denominado Quizás Mañana, una canción que muestra una estructura diferente a lo ya escuchado. Este sería el cierre simbólico al mensaje profundo que los juglares desean transmitir mediante sus melodías y vivencias. Dando lugar a una variación musical en cada sencillo, siendo ésta experimentación un mundo abarcado de ideas, sueños y luchas internas para salir adelante.

Antes del esperado lanzamiento del primer álbum de la banda, Eilúve es contactado por el productor en jefe del estudio Sonic Boom Studios, para la realización de un trabajo independiente pero que conllevaría a ser un reto en el inicio de este camino musical. Para ello, fueron contratados para poder realizar un homenaje al folclor boliviano y hacer una versión de la ya tan famosa canción El Matriqui del Diablo de la agrupación Huayna Wila. En febrero del 2026, Eilúve lanza su versión de la canción, además lograron lanzar dicha versión acompañados por el gran Álvaro Velasco, co-fundador de la agrupación boliviana Huayna Wila y quien gustosamente aceptó trabajar en esta canción, aportando esa fuerza folclórica a los tintes juglares. 

El 17 de julio del año 2026, Eilúve después de mucho esfuerzo, trabajo, convicción y sueños lanza su primer álbum homónimo oficialmente. El camino de los juglares empieza y continua su camino junto a todas aquellas personas que se unen en su viaje por las tierras de Nirthiel, donde el principio comienza en los pasos límpidos de sus sueños y éstos, los llevarán hasta llegar a las tierras divinas de Zaluster más allá de lo que se pueden imaginar...   

Enciende la hoguera para seguir contando historias de trovadores y relatos de juglares. 

Somos Todos, Somos Eilúve.`,
    imagenRuta: "/band_members.jpg",
    imagenAlt: "Banda Eiluvë en el bosque",
    destacados: [
      { titulo: "Esqueletos Reales", subtitulo: "Cuerdas y Hechizos", colorBorde: "#735f3d" },
      { titulo: "El Bestiario", subtitulo: "Batería Jurásica", colorBorde: "#8da382" }
    ]
  });
  const [conciertos, setConciertos] = useState([
    { id: 5, fecha: "01 AGO", fechaCompleta: "2026-08-01", hora: "20:00", nombre: "Presentación del Disco ", lugar: "Teatro Inni, La Paz", precioGeneral: 25, precioVip: 60, x: 500, y: 300, etiqueta: "Inni" },
    { id: 4, fecha: "11 JUL", fechaCompleta: "2026-07-11", hora: "21:00", nombre: "Sonic Boom Fest Vol.6", lugar: "La Paz", precioGeneral: 0, precioVip: 0, x: 180, y: 360, etiqueta: "Inni" },
    { id: 3, fecha: "11 JUL", fechaCompleta: "2026-07-11", hora: "20:30", nombre: "Bolivia compone ", lugar: "La Paz, Bolivia", precioGeneral: 0, precioVip: 0, x: 480, y: 160, etiqueta: "La Paz" },
    { id: 2, fecha: "15 JUN", fechaCompleta: "2026-06-15", hora: "20:00", nombre: "Verbena de Unitel", lugar: "La Paz, Bolivia", precioGeneral: 25, precioVip: 60, x: 820, y: 220, etiqueta: "Plaza Abaroa" },
    { id: 1, fecha: "15 JUN", fechaCompleta: "2026-06-15", hora: "19:30", nombre: "Verbena Rock", lugar: "La Paz, Bolivia", precioGeneral: 35, precioVip: 75, x: 520, y: 440, etiqueta: "Manzana 2" }
  ]);

  const [presentacion, setPresentacion] = useState({
    titulo: "Bienvenidos sean al inicio del camino....",
    subtitulo1: "buena compañía, arte ",
    subtitulo2: "sueños y melodías ",
    descripcion: "Eiluvë es folk metal, es cuento y es tormenta. Melodías ancestrales, instrumentos de leyenda y la fuerza del metal se unen en cada historia."
  });

  const [merch, setMerch] = useState({
    imagen: "/merch_preview.png",
    enlace: "#contacto"
  });

  const [noticias, setNoticias] = useState([
    { id: 4, fecha: "18 JUL 2026", categoria: "CONCIERTO", titulo: "Eilúve en vivo en Teatro Inni", imagen: "/arte-eiluve-inni.png", resumen: "Presentación del primer álbum en vivo con Templario como banda invitada.", contenido: "Toda leyenda tiene un comienzo. El 1 de agosto daremos el primer paso de este viaje, donde el folk metal, el violín y las melodías ancestrales darán vida a nuevas historias. Para compartir este momento tan especial, nos acompañará la banda invitada Templario, con quien celebraremos una noche de música y energía. Este será el comienzo de Eilúve." },
    { id: 1, fecha: "08 JUL 2026", categoria: "LANZAMIENTO", titulo: "Lanzamiento Oficial del Álbum Homónimo", imagen: "/somos-todos.jpg", resumen: "Nos adentramos en el proceso de composición y grabación de nuestro primer larga duración.", contenido: "El clan de Eiluvë se enorgullece de presentar su álbum homónimo. Este trabajo ha sido forjado con dedicación, entrelazando las melodías celtas con potentes riffs de guitarras y una batería demoledora. Las canciones narran historias de antiguos clanes, rituales paganos y noches de taberna." },
    { id: 2, fecha: "25 JUN 2026", categoria: "RODAJE", titulo: "Videoclip Oficial 'Somos Todos'", imagen: "/ritual_concert.jpg", resumen: "Crónica de la grabación rodeados de hogueras y antiguos espíritus.", contenido: "Para plasmar la magia de 'Somos Todos', trasladamos a todo el equipo de producción a un antiguo escenario rodeado de naturaleza. Con hogueras encendidas bajo las estrellas, logramos capturar la esencia rústica. Queremos agradecer a todos los seguidores que asistieron para formar parte de la cacería nocturna del videoclip." }
  ]);

  const [mazmorrasData, setMazmorrasData] = useState({
    passcode: "bsm669",
    miembros: [
      { id: 5, nombre: "Drakon", rol: "El Guardián (Batería y Percusión)", desc: "Marca el latido del bosque con el doble pedal y los tambores de guerra. Sus golpes despiertan a los gigantes de la roca.", mensajero: "Gran Búho Real" }
    ],
    canciones: [
      { id: 1, titulo: "El Principio", tipo: "Álbum Oficial", enlace: "/album/01-el-principio.mp3", duracion: "1:15" },
      { id: 2, titulo: "Eilúve", tipo: "Álbum Oficial", enlace: "/album/02-eiluve.mp3", duracion: "5:08" },
      { id: 3, titulo: "Océanos de Paz", tipo: "Álbum Oficial", enlace: "/album/03-oceanos-de-paz.mp3", duracion: "4:36" },
      { id: 4, titulo: "Somos Todos", tipo: "Álbum Oficial", enlace: "/album/04-somos-todos.mp3", duracion: "6:47" },
      { id: 5, titulo: "Path to the Ruins", tipo: "Álbum Oficial", enlace: "/album/05-path-to-the-ruins.mp3", duracion: "4:57" },
      { id: 6, titulo: "Cuando te Vi", tipo: "Álbum Oficial", enlace: "/album/06-cuando-te-vi.mp3", duracion: "6:23" },
      { id: 7, titulo: "Quizás Mañana", tipo: "Álbum Oficial", enlace: "/album/07-quizas-manana.mp3", duracion: "4:07" },
      { id: 8, titulo: "Paiza", tipo: "Álbum Oficial", enlace: "/album/08-paiza.mp3", duracion: "6:29" },
      { id: 9, titulo: "Viviré (Diafanitat Veritatis)", tipo: "Álbum Oficial", enlace: "/album/09-vivire.mp3", duracion: "5:03" },
      { id: 10, titulo: "Tu Voz", tipo: "Álbum Oficial", enlace: "/album/10-tu-voz.mp3", duracion: "4:20" },
      { id: 11, titulo: "Andrómeda", tipo: "Álbum Oficial", enlace: "/album/11-andromeda.mp3", duracion: "8:39" }
    ],
    fotos: [
      { id: 1, titulo: "Retrato del Bardo", descripcion: "Sesión conceptual con zanfoña en el robledal sagrado.", src: "/somos-todos.jpg" },
      { id: 2, titulo: "El Cónclave Secreto", descripcion: "Ensayo nocturno a la luz de las antorchas.", src: "/band_members.jpg" },
      { id: 3, titulo: "La Ofrenda al Bosque", descripcion: "Detalle del altar rúnico tallado para la portada.", src: "/ritual_concert.jpg" },
      { id: 4, titulo: "La Senda del Fuego", descripcion: "Boceto cromático descartado para el Ritual.", src: "/el-matriqui-del-diablo.jpg" }
    ],
    videos: [
      { id: 1, titulo: "Ensayos bajo la Bruma", descripcion: "Metraje en crudo de los primeros ensayos de flauta y violín.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", imagen: "/somos-todos.jpg" },
      { id: 2, titulo: "Grabando Voces", descripcion: "Tomas descartadas en el estudio rústico de grabación.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", imagen: "/ritual_concert.jpg" }
    ]
  });

  const [galeria, setGaleria] = useState([
    "/biografia/bio1.jpg",
    "/biografia/bio2.jpg",
    "/biografia/bio3.jpg",
    "/biografia/bio4.jpg"
  ]);

  const [nfcCodes, setNfcCodes] = useState([
    { id: 1, nfcId: "NFC-CD-773194", codigo: "EV-773194", descripcion: "Mini CD de Prueba #1", fechaRegistro: "2026-07-19" },
    { id: 2, nfcId: "NFC-CD-884102", codigo: "EV-884102", descripcion: "Mini CD de Prueba #2", fechaRegistro: "2026-07-19" },
    { id: 3, nfcId: "NFC-CD-995113", codigo: "EV-995113", descripcion: "Mini CD Promocional", fechaRegistro: "2026-07-19" }
  ]);

  const [fansRegistrados, setFansRegistrados] = useState([
    {
      id: "fan_1",
      nombre: "Arthur Pendragon",
      pais: "Reino Unido",
      correo: "arthur.camelot@grail.com",
      telefono: "+44 7911 123456",
      codigoUsado: "EV-773194",
      fechaRegistro: "2026-07-19",
      mensajes: [
        { id: 1, remitente: "fan", texto: "¡Excelente acústica en Andromeda! Saludos desde Glastonbury.", fecha: "2026-07-19 14:10" },
        { id: 2, remitente: "banda", texto: "¡Gracias Arthur! Que el roble sagrado guíe tus pasos.", fecha: "2026-07-19 14:15" }
      ]
    },
    {
      id: "fan_2",
      nombre: "Sabela Castro",
      pais: "España",
      correo: "sabela.castro@galicia.es",
      telefono: "+34 612 345 678",
      codigoUsado: "789012",
      fechaRegistro: "2026-07-19",
      mensajes: [
        { id: 1, remitente: "fan", texto: "Me encantan las melodías de zanfoña, transmiten pura bruma celta.", fecha: "2026-07-19 14:22" }
      ]
    }
  ]);

  const [destacados, setDestacados] = useState([
    { titulo: "Esqueletos Reales", subtitulo: "Cuerdas y Hechizos", colorBorde: "#735f3d" },
    { titulo: "El Bestiario", subtitulo: "Batería Jurásica", colorBorde: "#8da382" }
  ]);

  // Estados para el formulario de contacto externo (Cuervo)
  const [referenciaContacto, setReferenciaContacto] = useState("");
  const [mensajesContacto, setMensajesContacto] = useState([
    { id: 1, nombre: "Elrond de Rivendel", correo: "elrond@imladris.org", referencia: "Alianza Celta", mensaje: "Que las estrellas brillen sobre vuestro próximo concierto. Esperamos colaborar pronto.", fecha: "2026-07-19 12:00" },
    { id: 2, nombre: "Frodo Bolsón", correo: "frodo@la-comarca.com", referencia: "Adquisición de Capa Eiluvë", mensaje: "Me gustaría adquirir dos capas verdes con bordados rúnicos.", fecha: "2026-07-19 12:45" }
  ]);

  const [frasesCarga, setFrasesCarga] = useState([
    "La vida es corta pero hay tiempo para todo...", //  milan
    "El tiempo será eterno cuando mis pasos ya no dejen huella...", //armin
    "Nuestros sueños han despertado...", //sergio 
    "Nai hiruvalyë cálë, ar nai i lindalë ná tië", //gersion
    "Preparando el banquete antes de que caiga la noche...",
    "Consultando las runas para trazar nuestro destino...",
    "Añadiendo lúpulo a la cerveza, templando el acero...",
    "Escuchando los susurros de los antiguos dioses...",
    "El juglar cuenta historias que el tiempo olvidó...",
    "Un guerrero no muere cuando cae, sino cuando su nombre es olvidado", //mariela paredes 
    "Esperando a que la luna llena ilumine el escenario...", // bsm 
    "En sintonía con la naturaleza...",
    "La leyenda está por comenzar...",
    "El bardo se quedó dormido, despertándolo con un barril de hidromiel...",
    "Estamos escondiendo las monedas de oro de los saqueadores...",
    "Buscando la taberna más cercana, un momento...",
    "Asegurándonos de que nadie se haya llevado el mapa del tesoro..."
  ]);

  // Cargar estados desde localStorage al montar el componente en el cliente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedHeroBg = localStorage.getItem("eiluve_hero_bg");
      if (savedHeroBg) setHeroBg(savedHeroBg);

      const savedLinks = localStorage.getItem("eiluve_links");
      if (savedLinks) setLinks(JSON.parse(savedLinks));

      const savedBio = localStorage.getItem("eiluve_bio");
      if (savedBio) setBio(JSON.parse(savedBio));

      const savedConciertos = localStorage.getItem("eiluve_conciertos");
      if (savedConciertos) setConciertos(JSON.parse(savedConciertos));

      const savedPresentacion = localStorage.getItem("eiluve_presentacion");
      if (savedPresentacion) setPresentacion(JSON.parse(savedPresentacion));

      const savedMerch = localStorage.getItem("eiluve_merch");
      if (savedMerch) setMerch(JSON.parse(savedMerch));

      const savedNoticias = localStorage.getItem("eiluve_noticias");
      if (savedNoticias) setNoticias(JSON.parse(savedNoticias));

      const savedMazmorrasData = localStorage.getItem("eiluve_mazmorras_data");
      if (savedMazmorrasData) {
        const parsed = JSON.parse(savedMazmorrasData);
        if (!parsed.canciones || parsed.canciones.some(c => c.enlace && c.enlace.includes(" "))) {
          parsed.canciones = [
            { id: 1, titulo: "El Principio", tipo: "Álbum Oficial", enlace: "/album/01-el-principio.mp3", duracion: "1:15" },
            { id: 2, titulo: "Eilúve", tipo: "Álbum Oficial", enlace: "/album/02-eiluve.mp3", duracion: "5:08" },
            { id: 3, titulo: "Océanos de Paz", tipo: "Álbum Oficial", enlace: "/album/03-oceanos-de-paz.mp3", duracion: "4:36" },
            { id: 4, titulo: "Somos Todos", tipo: "Álbum Oficial", enlace: "/album/04-somos-todos.mp3", duracion: "6:47" },
            { id: 5, titulo: "Path to the Ruins", tipo: "Álbum Oficial", enlace: "/album/05-path-to-the-ruins.mp3", duracion: "4:57" },
            { id: 6, titulo: "Cuando te Vi", tipo: "Álbum Oficial", enlace: "/album/06-cuando-te-vi.mp3", duracion: "6:23" },
            { id: 7, titulo: "Quizás Mañana", tipo: "Álbum Oficial", enlace: "/album/07-quizas-manana.mp3", duracion: "4:07" },
            { id: 8, titulo: "Paiza", tipo: "Álbum Oficial", enlace: "/album/08-paiza.mp3", duracion: "6:29" },
            { id: 9, titulo: "Viviré (Diafanitat Veritatis)", tipo: "Álbum Oficial", enlace: "/album/09-vivire.mp3", duracion: "5:03" },
            { id: 10, titulo: "Tu Voz", tipo: "Álbum Oficial", enlace: "/album/10-tu-voz.mp3", duracion: "4:20" },
            { id: 11, titulo: "Andrómeda", tipo: "Álbum Oficial", enlace: "/album/11-andromeda.mp3", duracion: "8:39" }
          ];
          localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(parsed));
        }
        setMazmorrasData(parsed);
      }

      const savedGaleria = localStorage.getItem("eiluve_galeria");
      if (savedGaleria) setGaleria(JSON.parse(savedGaleria));

      const savedDestacados = localStorage.getItem("eiluve_destacados");
      if (savedDestacados) setDestacados(JSON.parse(savedDestacados));

      const savedFrasesCarga = localStorage.getItem("eiluve_frases_carga");
      if (savedFrasesCarga) setFrasesCarga(JSON.parse(savedFrasesCarga));

      const savedNfcCodes = localStorage.getItem("eiluve_nfc_codes");
      if (savedNfcCodes) setNfcCodes(JSON.parse(savedNfcCodes));

      const savedFansRegistrados = localStorage.getItem("eiluve_fans_registrados");
      if (savedFansRegistrados) setFansRegistrados(JSON.parse(savedFansRegistrados));

      const savedMensajesContacto = localStorage.getItem("eiluve_mensajes_contacto");
      if (savedMensajesContacto) setMensajesContacto(JSON.parse(savedMensajesContacto));
    }
  }, []);

  // Escuchar sincronizaciones de mensajería, conciertos y crónicas en tiempo real
  useEffect(() => {
    const syncRealtimePage = () => {
      const savedConciertos = localStorage.getItem("eiluve_conciertos");
      if (savedConciertos) {
        try { setConciertos(JSON.parse(savedConciertos)); } catch (e) {}
      }
      const savedNoticias = localStorage.getItem("eiluve_noticias");
      if (savedNoticias) {
        try { setNoticias(JSON.parse(savedNoticias)); } catch (e) {}
      }
      const savedBio = localStorage.getItem("eiluve_bio");
      if (savedBio) {
        try { setBio(JSON.parse(savedBio)); } catch (e) {}
      }
      const savedPresentacion = localStorage.getItem("eiluve_presentacion");
      if (savedPresentacion) {
        try { setPresentacion(JSON.parse(savedPresentacion)); } catch (e) {}
      }
      const savedMerch = localStorage.getItem("eiluve_merch");
      if (savedMerch) {
        try { setMerch(JSON.parse(savedMerch)); } catch (e) {}
      }
      const savedFans = localStorage.getItem("eiluve_fans_registrados");
      if (savedFans) {
        try { setFansRegistrados(JSON.parse(savedFans)); } catch (e) {}
      }
      const savedMsg = localStorage.getItem("eiluve_mensajes_contacto");
      if (savedMsg) {
        try { setMensajesContacto(JSON.parse(savedMsg)); } catch (e) {}
      }
    };
    window.addEventListener("eiluve_realtime_sync", syncRealtimePage);
    window.addEventListener("storage", syncRealtimePage);
    return () => {
      window.removeEventListener("eiluve_realtime_sync", syncRealtimePage);
      window.removeEventListener("storage", syncRealtimePage);
    };
  }, []);

  // Escuchar el evento de abrir el dashboard enviado desde el footer
  useEffect(() => {
    const manejarAbrirDashboard = () => {
      setDashboardAbierto(true);
    };
    window.addEventListener("abrir-dashboard", manejarAbrirDashboard);
    return () => window.removeEventListener("abrir-dashboard", manejarAbrirDashboard);
  }, []);

  useEffect(() => {
    const checkMobile = () => setEsMovil(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);


  // Callback estable para prevenir bucles de actualización infinita
  const terminarCargaCallback = useCallback(() => {
    setCargando(false);
  }, []);

  // Parallax para Dirección de Arte Premium
  const [desplazamientoRaton, setDesplazamientoRaton] = useState({ x: 0, y: 0 });

  const reproductorRef = useRef(null);

  // Escuchar parallax reactivo al cursor (Solo si está activo)
  useEffect(() => {
    if (!ACTIVAR_PARALLAX) return;

    const manejarMouseParallax = (e) => {
      if (window.innerWidth < 768) return;
      // Movimientos de rango seguro para el parallax (-0.5 a 0.5)
      const normX = (e.clientX / window.innerWidth) - 0.5;
      const normY = (e.clientY / window.innerHeight) - 0.5;
      setDesplazamientoRaton({ x: normX, y: normY });
    };

    window.addEventListener("mousemove", manejarMouseParallax, { passive: true });
    return () => window.removeEventListener("mousemove", manejarMouseParallax);
  }, []);

  // Formatear segundos a MM:SS
  const formatearTiempo = (segundos) => {
    if (isNaN(segundos) || segundos === null) return "0:00";
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = Math.floor(segundos % 60);
    return `${minutos}:${segsRestantes < 10 ? "0" : ""}${segsRestantes}`;
  };

  // Controles de Play y Pause
  const alternarReproduccion = () => {
    if (!reproductorRef.current) return;
    if (reproduciendo) {
      reproductorRef.current.pause();
      setReproduciendo(false);
    } else {
      reproductorRef.current.play().catch((error) => {
        console.log("Reproducción de audio bloqueada o con error:", error);
      });
      setReproduciendo(true);
    }
  };

  // Reproducir una canción específica por su índice
  const reproducirCancion = (indice) => {
    setIndiceCancion(indice);
    setReproduciendo(true);

    // Pequeño timeout para permitir que se actualice la ruta en el elemento html de audio
    setTimeout(() => {
      if (reproductorRef.current) {
        reproductorRef.current.load();
        reproductorRef.current.play().catch((error) => {
          console.log("Reproducción de audio bloqueada o con error:", error);
        });
      }
    }, 50);
  };

  // Siguiente / Anterior canción
  const siguienteCancion = () => {
    const nuevoIndice = (indiceCancion + 1) % CANCIONES.length;
    reproducirCancion(nuevoIndice);
  };

  const anteriorCancion = () => {
    const nuevoIndice = (indiceCancion - 1 + CANCIONES.length) % CANCIONES.length;
    reproducirCancion(nuevoIndice);
  };

  // Manejar el desplazamiento desde la barra de progreso
  const desplazar = (porcentaje) => {
    if (!reproductorRef.current || !reproductorRef.current.duration) return;
    const nuevoTiempo = porcentaje * reproductorRef.current.duration;
    reproductorRef.current.currentTime = nuevoTiempo;
    setProgress(porcentaje * 100);
  };

  const adelantarDiezSegundos = () => {
    if (!reproductorRef.current) return;
    reproductorRef.current.currentTime = Math.min(reproductorRef.current.duration, reproductorRef.current.currentTime + 10);
  };

  const retrocederDiezSegundos = () => {
    if (!reproductorRef.current) return;
    reproductorRef.current.currentTime = Math.max(0, reproductorRef.current.currentTime - 10);
  };

  const setProgress = (valor) => {
    setProgreso(valor);
  };

  // Actualizar la barra y el tiempo actual
  const manejarActualizacionTiempo = () => {
    if (!reproductorRef.current) return;
    const actual = reproductorRef.current.currentTime;
    const total = reproductorRef.current.duration || 0;

    setTiempoActual(formatearTiempo(actual));

    if (total > 0) {
      setProgreso((actual / total) * 100);
    }
  };

  // Actualizar duración del audio al cargarse metadatos
  const manejarMetadatosCargados = () => {
    if (!reproductorRef.current) return;
    setTiempoTotal(formatearTiempo(reproductorRef.current.duration));
  };

  // Reproducir la siguiente canción automáticamente cuando termine la actual
  const manejarFinAudio = () => {
    siguienteCancion();
  };

  // Configurar Intersection Observer para animaciones en scroll (Aleatorias por Sección)
  useEffect(() => {
    // Retraso de 200ms para asegurar la correcta hidratación y renderizado en DOM de todos los componentes
    const temporizador = setTimeout(() => {
      const elementos = document.querySelectorAll(
        ".reveal, .reveal-left, .reveal-right, .reveal-scale"
      );

      const lineasMagicas = document.querySelectorAll(".magic-line");
      const seccionesMagicas = document.querySelectorAll(".seccion-magica");

      // Inicializar cada elemento revelable con una animación y desfase aleatorio orgánico
      elementos.forEach((el) => {
        const randomX = (Math.random() - 0.5) * 50;        // Desplazamiento X: -25px a 25px
        const randomY = Math.random() * 35 + 20;           // Desplazamiento Y: 20px a 55px
        const randomScale = Math.random() * 0.06 + 0.93;   // Escala: 0.93 a 0.99
        const randomBlur = Math.random() * 4 + 6;          // Blur: 6px a 10px
        const randomDuration = Math.random() * 0.7 + 0.9;  // Duración: 0.9s a 1.6s
        const randomDelay = Math.random() * 0.25;          // Delay: 0s a 0.25s

        el.style.opacity = "0";
        el.style.filter = `blur(${randomBlur}px)`;
        el.style.transform = `translate(${randomX}px, ${randomY}px) scale(${randomScale})`;
        el.style.transition = `opacity ${randomDuration}s cubic-bezier(0.25, 1, 0.5, 1) ${randomDelay}s, filter ${randomDuration}s cubic-bezier(0.25, 1, 0.5, 1) ${randomDelay}s, transform ${randomDuration}s cubic-bezier(0.25, 1, 0.5, 1) ${randomDelay}s`;
      });

      const observador = new IntersectionObserver(
        (entradas) => {
          entradas.forEach((entrada) => {
            if (entrada.isIntersecting) {
              entrada.target.classList.add("active");

              if (
                entrada.target.classList.contains("reveal") ||
                entrada.target.classList.contains("reveal-left") ||
                entrada.target.classList.contains("reveal-right") ||
                entrada.target.classList.contains("reveal-scale")
              ) {
                entrada.target.style.opacity = "1";
                entrada.target.style.filter = "blur(0px)";
                entrada.target.style.transform = "translate(0px, 0px) scale(1)";
              }
            } else {
              // Si la sección sale del foco de pantalla, la regresamos al estado de niebla mística
              if (entrada.target.classList.contains("seccion-magica")) {
                entrada.target.classList.remove("active");
              }
            }
          });
        },
        { threshold: 0.12 }
      );

      elementos.forEach((el) => observador.observe(el));
      lineasMagicas.forEach((el) => observador.observe(el));
      seccionesMagicas.forEach((el) => observador.observe(el));

      return () => {
        elementos.forEach((el) => observador.unobserve(el));
        lineasMagicas.forEach((el) => observador.unobserve(el));
        seccionesMagicas.forEach((el) => observador.unobserve(el));
      };
    }, 200);

    return () => clearTimeout(temporizador);
  }, []);

  // Interceptar clicks en enlaces para la animación mágica de transición portal
  useEffect(() => {
    const manejarClickEnlace = (e) => {
      const enlace = e.target.closest("a");
      if (!enlace) return;

      const href = enlace.getAttribute("href");
      if (href && href.startsWith("#")) {
        const idDestino = href.substring(1);
        const elementoDestino = document.getElementById(idDestino);

        if (elementoDestino) {
          e.preventDefault();
          setPortalActivo(true);

          // Desplazar la vista de forma suave a mitad de la animación del portal
          setTimeout(() => {
            elementoDestino.scrollIntoView({ behavior: "smooth" });
          }, 450);

          // Apagar el portal al completar la transición
          setTimeout(() => {
            setPortalActivo(false);
          }, 1250);
        }
      }
    };

    document.addEventListener("click", manejarClickEnlace);
    return () => document.removeEventListener("click", manejarClickEnlace);
  }, []);

  return (
    <div className="relative h-screen overflow-y-auto scroll-smooth md:snap-y md:snap-mandatory bg-[#060a13] text-[#dfdcd3] font-sans">
      {/* Portal de Transición Mágica */}
      <PortalTransicion activo={portalActivo} />

      {/* 1. Cargador de pantalla (Invocación) */}
      <Cargador alTerminarCarga={terminarCargaCallback} frases={frasesCarga} />

      {/* Lluvia de partículas global en Canvas (flota sobre todas las secciones) */}
      {!cargando && <ParticulasCanvas />}

      {/* Menú de navegación flotante global (visible en todas las secciones) */}
      {!cargando && <BarraNavegacion />}

      {/* Reproductor de Audio Oculto */}
      <audio
        ref={reproductorRef}
        src={CANCIONES[indiceCancion].enlace}
        onTimeUpdate={manejarActualizacionTiempo}
        onLoadedMetadata={manejarMetadatosCargados}
        onEnded={manejarFinAudio}
        crossOrigin="anonymous"
      />

      {/* 2. Contenedor Héroe con fondo e interactividades */}
      <div
        id="home"
        className="relative min-h-screen flex flex-col justify-between overflow-hidden snap-start snap-always seccion-magica"
      >
        {/* Capa de Fondo Parallax (con imagen, atenuador de galaxias y filtros) */}
        <div
          className="absolute inset-0 z-0 capa-parallax"
          style={{
            backgroundImage: `
              linear-gradient(to bottom, rgba(6, 10, 19, 0.95) 0%, rgba(6, 10, 19, 0.5) 25%, rgba(6, 10, 19, 0) 60%),
              ${CONFIG_FONDO.degradadoVertical},
              ${CONFIG_FONDO.degradado},
              url('${esMovil ? "/hero_background_movil.png" : heroBg}')
            `,
            backgroundSize: esMovil ? "cover" : CONFIG_FONDO.escala,
            backgroundPosition: esMovil ? "center center" : `${CONFIG_FONDO.posicionX} ${CONFIG_FONDO.posicionY}`,
            backgroundRepeat: CONFIG_FONDO.repetir,
            transform: esMovil ? "none" : `scale(1.06) translate(${desplazamientoRaton.x * -16}px, ${desplazamientoRaton.y * -10}px)`,
          }}
        />

        {/* Resplandor Pulsante de la Puerta del Árbol (Ubicación física sincronizada) */}
        <div
          className="absolute left-1/2 -translate-x-1/2 lg:left-auto lg:right-[15%] bottom-[20%] lg:bottom-[32%] w-60 h-60 lg:w-72 lg:h-72 rounded-full resplandor-puerta-pulsante z-1 max-md:hidden"
          style={{
            transform: `translate(${desplazamientoRaton.x * -8}px, ${desplazamientoRaton.y * -5}px)`,
          }}
        />

        {/* Hojas y elementos del bosque caen dinámicamente renderizados en el Canvas de partículas */}

        {/* Niebla Volumétrica Parallax 1 (Vibrante color violeta y dorado cálido) */}
        <div
          className="absolute w-[200%] h-full top-0 left-0 capa-niebla-1 pointer-events-none mix-blend-color-dodge z-2"
          style={{
            background: "radial-gradient(circle at 25% 65%, rgba(139, 92, 246, 0.22) 0%, transparent 60%), radial-gradient(circle at 75% 25%, rgba(245, 158, 11, 0.16) 0%, transparent 50%)",
            transform: `translate(${desplazamientoRaton.x * 20}px, ${desplazamientoRaton.y * 12}px)`,
            filter: "blur(60px)"
          }}
        />

        {/* Niebla Volumétrica Parallax 2 (Vibrante color cian y esmeralda místico) */}
        <div
          className="absolute w-[200%] h-full top-0 left-0 capa-niebla-2 pointer-events-none mix-blend-color-dodge z-2"
          style={{
            background: "radial-gradient(circle at 15% 35%, rgba(6, 182, 212, 0.18) 0%, transparent 40%), radial-gradient(circle at 85% 75%, rgba(16, 185, 129, 0.18) 0%, transparent 50%)",
            transform: `translate(${desplazamientoRaton.x * -12}px, ${desplazamientoRaton.y * -8}px)`,
            filter: "blur(60px)"
          }}
        />

        {/* Las partículas globales flotan sobre el fondo */}

        {/* El menú de navegación global flota sobre todas las secciones */}

        {/* Barra de Redes Sociales Flotante Vertical Premium (Visible solo en Inicio, se desplaza con él) */}
        <div className="absolute right-3 md:right-5 lg:right-6 top-[36%] -translate-y-1/2 hidden md:flex flex-col items-center space-y-4 z-30 select-none">
          <span className="text-[10px] text-[#735f3d] tracking-[0.25em] uppercase [writing-mode:vertical-lr] rotate-180 mb-1 font-mono font-bold opacity-80">SEGUIDNOS</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-transparent via-[#d1b880]/30 to-[#d1b880]/60"></div>

          {links.facebook && (
            <a
              href={links.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/80 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#fbbf24] hover:shadow-[0_0_12px_rgba(251,191,36,0.5)] hover:scale-110 transition-all duration-300 text-sm"
              aria-label="Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </a>
          )}
          {links.instagram && (
            <a
              href={links.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/80 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#fbbf24] hover:shadow-[0_0_12px_rgba(251,191,36,0.5)] hover:scale-110 transition-all duration-300 text-sm"
              aria-label="Instagram"
            >
              <i className="fab fa-instagram"></i>
            </a>
          )}
          {links.youtube && (
            <a
              href={links.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/80 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#fbbf24] hover:shadow-[0_0_12px_rgba(251,191,36,0.5)] hover:scale-110 transition-all duration-300 text-sm"
              aria-label="YouTube"
            >
              <i className="fab fa-youtube"></i>
            </a>
          )}
          {links.spotify && (
            <a
              href={links.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/80 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#fbbf24] hover:shadow-[0_0_12px_rgba(251,191,36,0.5)] hover:scale-110 transition-all duration-300 text-sm"
              aria-label="Spotify"
            >
              <i className="fab fa-spotify"></i>
            </a>
          )}
          {links.apple && (
            <a
              href={links.apple}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/80 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#fbbf24] hover:shadow-[0_0_12px_rgba(251,191,36,0.5)] hover:scale-110 transition-all duration-300 text-sm"
              aria-label="Apple Music"
            >
              <i className="fab fa-apple"></i>
            </a>
          )}
          {links.tiktok && (
            <a
              href={links.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full border border-[#d1b880]/20 bg-[#060a13]/80 flex items-center justify-center text-[#d1b880] hover:text-white hover:border-[#fbbf24] hover:shadow-[0_0_12px_rgba(251,191,36,0.5)] hover:scale-110 transition-all duration-300 text-sm"
              aria-label="TikTok"
            >
              <i className="fab fa-tiktok"></i>
            </a>
          )}

          <div className="w-[1px] h-12 bg-gradient-to-t from-transparent via-[#d1b880]/30 to-[#d1b880]/60"></div>
        </div>

        {/* Presentación (Sección izquierda) */}
        <main className="flex-grow flex items-center max-md:items-start max-md:pt-14 relative z-10 px-6 md:px-8 lg:px-16 mt-10 lg:mt-0">
          <Presentacion
            presentacion={presentacion}
            heroBg={heroBg}
            activeCover={CANCIONES[indiceCancion].portada || "/Somos todos.jpg"}
            socialLinks={links}
          />
        </main>

        <Widgets
          cancionActual={CANCIONES[indiceCancion]}
          reproduciendo={reproduciendo}
          alternarReproduccion={alternarReproduccion}
          progreso={progreso}
          desplazar={desplazar}
          adelantar={adelantarDiezSegundos}
          retroceder={retrocederDiezSegundos}
          tiempoActual={tiempoActual}
          tiempoTotal={tiempoTotal}
          siguienteCancion={siguienteCancion}
          anteriorCancion={anteriorCancion}
          alHacerClickLlave={() => setMazmorrasAbierta(true)}
          albumLink={links.album}
          merchImg={merch.imagen}
          merchLink={merch.enlace}
          alHacerClickMerch={() => {
            setReferenciaContacto("Adquisición de Merchandising");
          }}
          conciertos={conciertos}
        />



        {/* Difuminado de transición de fondo hacia el pie de página */}
        <div className="absolute bottom-0 w-full h-24 bg-gradient-to-t from-[#060a13] to-transparent z-10 pointer-events-none"></div>
      </div>

      {/* Llave Secreta flotante móvil (fija en la esquina inferior derecha, solo visible en móviles) */}
      {!cargando && (
        <div className="fixed bottom-20 right-4 z-40 md:hidden llave-flotante-container">
          <button
            onClick={() => setMazmorrasAbierta(true)}
            className="w-14 h-14 rounded-full border-2 border-[#fbbf24]/60 bg-[#060a13]/95 flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-300 shadow-2xl p-2.5 animate-pulse glow-pulsing-llave animate-bounce"
            style={{ animationDuration: "3s" }}
            aria-label="Llave de las Mazmorras"
          >
            <div className="relative w-full h-full animate-pulse">
              <Image
                src="/pantalla-de-carga/llave-de-las-mazmorras.png"
                alt="Llave"
                fill
                unoptimized
                className="object-contain"
              />
            </div>
          </button>
        </div>
      )}

      {/* 3. Sección Biografía (La Leyenda) */}
      <Biografia bio={bio} galeria={galeria} destacados={destacados} />

      {/* 4. Sección Ritual (Video) */}
      <Ritual videoLink={links.video} />

      {/* 4.5. Sección Crónicas (Blog / Noticias del Clan) */}
      <Cronicas noticias={noticias} />

      {/* 5. Sección Gira (La Cacería) */}
      <FechasGira conciertos={conciertos} />

      {/* 8. Sección Formulario de Contacto (Envía un Cuervo) + Pie de página reunidos en la última sección snap */}
      <div className="min-h-screen flex flex-col justify-between snap-start snap-always bg-[#060a13] relative overflow-hidden seccion-magica">
        {/* Elementos Mágicos del Bosque (Max 5) */}
        <div className="elemento-magico-runa text-4xl text-[#d1b880]/45 left-[12%] top-[30%] select-none font-serif">ᚷ</div>
        <div className="elemento-magico-runa text-3xl text-[#d1b880]/35 right-[12%] top-[25%] select-none font-serif [animation-delay:2s]">ᚺ</div>
        <div className="elemento-magico-runa text-3xl text-[#d1b880]/40 right-[10%] bottom-[35%] select-none font-serif [animation-delay:4.5s]">ᛗ</div>
        {/* Luces del Destino */}
        <div className="absolute left-[8%] top-[55%] w-7 h-7 rounded-full bg-cyan-500/32 blur-md animate-pulse pointer-events-none z-0"></div>
        <div className="absolute right-[15%] top-[50%] w-6 h-6 rounded-full bg-purple-500/32 blur-lg animate-pulse pointer-events-none z-0"></div>

        <div className="flex-grow flex items-center py-8 relative z-10">
          <div className="w-full">
            <FormularioContacto 
              referenciaProp={referenciaContacto}
              setReferenciaProp={setReferenciaContacto}
              alEnviarMensaje={(msg) => {
                const nuevoMensaje = {
                  id: Date.now(),
                  ...msg,
                  fecha: new Date().toISOString().replace("T", " ").substring(0, 16)
                };
                const nuevosMensajes = [nuevoMensaje, ...mensajesContacto];
                setMensajesContacto(nuevosMensajes);
                localStorage.setItem("eiluve_mensajes_contacto", JSON.stringify(nuevosMensajes));
              }}
            />
          </div>
        </div>
        <PiePagina />
      </div>

      {/* Sección Secreta: Las Mazmorras */}
      <Mazmorras
        abierta={mazmorrasAbierta}
        alCerrar={() => setMazmorrasAbierta(false)}
        passcode={mazmorrasData.passcode}
        miembros={mazmorrasData.miembros}
        canciones={mazmorrasData.canciones}
        fotos={mazmorrasData.fotos}
        videos={mazmorrasData.videos}
        nfcCodes={nfcCodes}
        fansRegistrados={fansRegistrados}
        setFansRegistrados={setFansRegistrados}
      />

      {/* Dashboard para Miembros de la Banda */}
      <Dashboard
        abierto={dashboardAbierto}
        alCerrar={() => setDashboardAbierto(false)}
        conciertos={conciertos}
        setConciertos={setConciertos}
        bio={bio}
        setBio={setBio}
        links={links}
        setLinks={setLinks}
        heroBg={heroBg}
        setHeroBg={setHeroBg}
        presentacion={presentacion}
        setPresentacion={setPresentacion}
        merch={merch}
        setMerch={setMerch}
        noticias={noticias}
        setNoticias={setNoticias}
        mazmorrasData={mazmorrasData}
        setMazmorrasData={setMazmorrasData}
        galeria={galeria}
        setGaleria={setGaleria}
        destacados={destacados}
        setDestacados={setDestacados}
        frases={frasesCarga}
        setFrases={setFrasesCarga}
        nfcCodes={nfcCodes}
        setNfcCodes={setNfcCodes}
        fansRegistrados={fansRegistrados}
        setFansRegistrados={setFansRegistrados}
        mensajesContacto={mensajesContacto}
        setMensajesContacto={setMensajesContacto}
      />


    </div>
  );
}
