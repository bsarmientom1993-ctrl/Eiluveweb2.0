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

const obtenerFechaFormatoInput = (c) => {
  if (c.fechaCompleta) return c.fechaCompleta;
  const date = obtenerFechaObjeto(c);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

const convertirMedievalAFechaInput = (str) => {
  if (!str) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  const partes = str.trim().split(/\s+/);
  if (partes.length === 3) {
    const dia = partes[0].padStart(2, "0");
    const meses = {
      ENE: "01", FEB: "02", MAR: "03", ABR: "04", MAY: "05", JUN: "06",
      JUL: "07", AGO: "08", SEP: "09", OCT: "10", NOV: "11", DIC: "12"
    };
    const mesStr = partes[1].toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const mes = meses[mesStr.substring(0, 3)] ?? "06";
    const anio = partes[2];
    return `${anio}-${mes}-${dia}`;
  }
  return "";
};

const convertirFechaInputAMedieval = (str) => {
  if (!str) return "";
  const partes = str.split("-");
  if (partes.length === 3) {
    const anio = partes[0];
    const mesIndex = parseInt(partes[1]) - 1;
    const dia = partes[2].padStart(2, "0");
    const meses = [
      "ENE", "FEB", "MAR", "ABR", "MAY", "JUN",
      "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"
    ];
    const mesStr = meses[mesIndex] ?? "JUN";
    return `${dia} ${mesStr} ${anio}`;
  }
  return str;
};

const formatearFecha = (fechaStr) => {
  const date = new Date(fechaStr + "T12:00:00");
  const meses = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
  const dia = String(date.getDate()).padStart(2, "0");
  const mes = meses[date.getMonth()];
  return `${dia} ${mes}`;
};

export default function Dashboard({
  abierto,
  alCerrar,
  conciertos,
  setConciertos,
  bio,
  setBio,
  links,
  setLinks,
  heroBg,
  setHeroBg,
  presentacion,
  setPresentacion,
  merch,
  setMerch,
  noticias = [],
  setNoticias,
  mazmorrasData,
  setMazmorrasData,
  galeria = [],
  setGaleria,
  destacados = [],
  setDestacados,
  frases = [],
  setFrases,
  nfcCodes = [],
  setNfcCodes,
  fansRegistrados = [],
  setFansRegistrados,
  mensajesContacto = [],
  setMensajesContacto
}) {
  const [logged, setLogged] = useState(false);
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("gira"); // "gira", "bio", "links"

  // Campos del Formulario de Edición de Biografía
  const [bioTitulo, setBioTitulo] = useState(bio?.titulo || "");
  const [bioCita, setBioCita] = useState(bio?.cita || "");
  const [bioHistoria, setBioHistoria] = useState(bio?.historia || "");
  const [bioImg, setBioImg] = useState(bio?.imagenRuta || "");
  const [dest1T, setDest1T] = useState(bio?.destacados?.[0]?.titulo || "");
  const [dest1S, setDest1S] = useState(bio?.destacados?.[0]?.subtitulo || "");
  const [dest2T, setDest2T] = useState(bio?.destacados?.[1]?.titulo || "");
  const [dest2S, setDest2S] = useState(bio?.destacados?.[1]?.subtitulo || "");

  // Campos del Formulario de Redes y Fotos
  const [linkSpotify, setLinkSpotify] = useState(links?.spotify || "");
  const [linkYoutube, setLinkYoutube] = useState(links?.youtube || "");
  const [linkInstagram, setLinkInstagram] = useState(links?.instagram || "");
  const [linkFacebook, setLinkFacebook] = useState(links?.facebook || "");
  const [linkApple, setLinkApple] = useState(links?.apple || "");
  const [linkTiktok, setLinkTiktok] = useState(links?.tiktok || "");
  const [linkAlbum, setLinkAlbum] = useState(links?.album || "");
  const [linkVideo, setLinkVideo] = useState(links?.video || "");
  const [heroBgPath, setHeroBgPath] = useState(heroBg || "");

  // Campos del Formulario del Hero (Presentación Página Principal)
  const [presTitulo, setPresTitulo] = useState(presentacion?.titulo || "");
  const [presSub1, setPresSub1] = useState(presentacion?.subtitulo1 || "");
  const [presSub2, setPresSub2] = useState(presentacion?.subtitulo2 || "");
  const [presDesc, setPresDesc] = useState(presentacion?.descripcion || "");

  // Campos del Formulario de Merch
  const [merchImgPath, setMerchImgPath] = useState(merch?.imagen || "");
  const [merchLinkPath, setMerchLinkPath] = useState(merch?.enlace || "");

  // Campos del Formulario de Galería
  const [galeriaImg1, setGaleriaImg1] = useState(galeria?.[0] || "");
  const [galeriaImg2, setGaleriaImg2] = useState(galeria?.[1] || "");
  const [galeriaImg3, setGaleriaImg3] = useState(galeria?.[2] || "");
  const [galeriaImg4, setGaleriaImg4] = useState(galeria?.[3] || "");

  // Campos para Añadir/Editar Conciertos
  const [editId, setEditId] = useState(null);
  const [cFecha, setCFecha] = useState(() => {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  });
  const [cHora, setCHora] = useState("20:00");
  const [cNombre, setCNombre] = useState("");
  const [cLugar, setCLugar] = useState("");
  const [cPrecioG, setCPrecioG] = useState(25);
  const [cPrecioV, setCPrecioV] = useState(60);
  const [cX, setCX] = useState(500);
  const [cY, setCY] = useState(300);
  const [cEtiqueta, setCEtiqueta] = useState("");

  // Campos para Añadir/Editar Noticias
  const [editNoticiaId, setEditNoticiaId] = useState(null);
  const [noticiaFecha, setNoticiaFecha] = useState("");
  const [noticiaCat, setNoticiaCat] = useState("LANZAMIENTO");
  const [noticiaTitulo, setNoticiaTitulo] = useState("");
  const [noticiaImg, setNoticiaImg] = useState("");
  const [noticiaResumen, setNoticiaResumen] = useState("");
  const [noticiaContenido, setNoticiaContenido] = useState("");
  const [draggedIndex, setDraggedIndex] = useState(null);

  // Campos para editores de listas
  const [nuevaFotoRuta, setNuevaFotoRuta] = useState("");
  const [nuevoDestTitulo, setNuevoDestTitulo] = useState("");
  const [nuevoDestSubtitulo, setNuevoDestSubtitulo] = useState("");
  const [nuevoDestColor, setNuevoDestColor] = useState("#735f3d");
  const [editIntegranteIndex, setEditIntegranteIndex] = useState(null);
  const [nuevaFrase, setNuevaFrase] = useState("");

  // Campos para la gestión de las Mazmorras
  const [mPasscode, setMPasscode] = useState(mazmorrasData?.passcode || "bsm669");
  const [editMiembroId, setEditMiembroId] = useState(null);
  const [mNombre, setMNombre] = useState("");
  const [mRol, setMRol] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mMensajero, setMMensajero] = useState("Cuervo Rúnico");

  // Canciones de Mazmorras
  const [editCancionId, setEditCancionId] = useState(null);
  const [cTitulo, setCTitulo] = useState("");
  const [cTipo, setCTipo] = useState("Álbum Oficial");
  const [cEnlace, setCEnlace] = useState("");
  const [cDuracion, setCDuracion] = useState("");

  // Fotos de Mazmorras
  const [editFotoId, setEditFotoId] = useState(null);
  const [fTitulo, setFTitulo] = useState("");
  const [fDescripcion, setFDescripcion] = useState("");
  const [fSrc, setFSrc] = useState("");

  // Videos de Mazmorras
  const [editVideoId, setEditVideoId] = useState(null);
  const [vTitulo, setVTitulo] = useState("");
  const [vDescripcion, setVDescripcion] = useState("");
  const [vVideoUrl, setVVideoUrl] = useState("");
  const [vImagen, setVImagen] = useState("");

  // Códigos NFC de Mazmorras
  const [editNfcId, setEditNfcId] = useState(null);
  const [nfcTagId, setNfcTagId] = useState("");
  const [nfcCodigo6, setNfcCodigo6] = useState("");
  const [nfcDesc, setNfcDesc] = useState("");

  // Control de Chat de Fanáticos en Dashboard
  const [selectedFanId, setSelectedFanId] = useState(null);
  const [replyText, setReplyText] = useState("");

  // Control de Mensajes de Contacto en Dashboard
  const [selectedContactMsgId, setSelectedContactMsgId] = useState(null);

  // Lote de impresión de Mini CDs
  const [selectedBatchIndex, setSelectedBatchIndex] = useState(0);

  // Sincronizar estados cuando las propiedades cambian
  useEffect(() => {
    if (bio) {
      setBioTitulo(bio.titulo || "");
      setBioCita(bio.cita || "");
      setBioHistoria(bio.historia || "");
      setBioImg(bio.imagenRuta || "");
      setDest1T(bio.destacados?.[0]?.titulo || "");
      setDest1S(bio.destacados?.[0]?.subtitulo || "");
      setDest2T(bio.destacados?.[1]?.titulo || "");
      setDest2S(bio.destacados?.[1]?.subtitulo || "");
    }
    if (links) {
      setLinkSpotify(links.spotify || "");
      setLinkYoutube(links.youtube || "");
      setLinkInstagram(links.instagram || "");
      setLinkFacebook(links.facebook || "");
      setLinkApple(links.apple || "");
      setLinkTiktok(links.tiktok || "");
      setLinkAlbum(links.album || "");
      setLinkVideo(links.video || "");
    }
    if (heroBg) {
      setHeroBgPath(heroBg);
    }
    if (presentacion) {
      setPresTitulo(presentacion.titulo || "");
      setPresSub1(presentacion.subtitulo1 || "");
      setPresSub2(presentacion.subtitulo2 || "");
      setPresDesc(presentacion.descripcion || "");
    }
    if (merch) {
      setMerchImgPath(merch.imagen || "");
      setMerchLinkPath(merch.enlace || "");
    }
    if (mazmorrasData) {
      setMPasscode(mazmorrasData.passcode || "bsm669");
    }
    if (galeria && galeria.length >= 4) {
      setGaleriaImg1(galeria[0] || "");
      setGaleriaImg2(galeria[1] || "");
      setGaleriaImg3(galeria[2] || "");
      setGaleriaImg4(galeria[3] || "");
    }
  }, [bio, links, heroBg, presentacion, merch, mazmorrasData, galeria]);

  // Listado de roles disponibles en la banda
  const ROLES_DISPONIBLES = [
    "📰 Editor de Noticias y Crónicas",
    "🗺️ Gira y Conciertos",
    "🛍️ Merchandising y Tienda",
    "🔑 Mazmorras y NFC",
    "💬 Mensajes y Alianza de Fans",
    "👑 Administrador General"
  ];

  // 👥 GESTIÓN DE USUARIOS Y ROLES DEL PORTAL
  const [usuariosBanda, setUsuariosBanda] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eiluve_band_users");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      {
        id: "master_1",
        username: "bsarmientom1993",
        password: "jareck93",
        nombre: "B. Sarmiento",
        roles: ["👑 Maestro del Portal (Acceso Total)", "📰 Noticias y Crónicas", "🗺️ Gira y Conciertos", "🛍️ Merchandising", "🔑 Mazmorras y NFC", "💬 Fans y Mensajes"],
        rol: "Maestro del Portal",
        isMaster: true,
        fechaCreado: "2026-07-19"
      },
      {
        id: "editor_1",
        username: "eiluve",
        password: "clan_pagano_2026",
        nombre: "Banda Eiluvë",
        roles: ["📰 Editor de Noticias y Crónicas", "🛍️ Merchandising y Tienda"],
        rol: "Editor de Noticias y Merch",
        isMaster: false,
        fechaCreado: "2026-07-19"
      }
    ];
  });

  const [usuarioActual, setUsuarioActual] = useState(null);
  const [editUserId, setEditUserId] = useState(null);
  const [nuevoNombreUser, setNuevoNombreUser] = useState("");
  const [nuevoUsername, setNuevoUsername] = useState("");
  const [nuevaPassword, setNuevaPassword] = useState("");
  const [nuevoCorreoUser, setNuevoCorreoUser] = useState("");
  const [nuevoTelefonoUser, setNuevoTelefonoUser] = useState("");
  const [nuevosRolesUser, setNuevosRolesUser] = useState(["📰 Editor de Noticias y Crónicas"]);

  // Modal y formulario de edición de Perfil Propio
  const [modalPerfilAbierto, setModalPerfilAbierto] = useState(false);
  const [perfilNombre, setPerfilNombre] = useState("");
  const [perfilCorreo, setPerfilCorreo] = useState("");
  const [perfilTelefono, setPerfilTelefono] = useState("");
  const [perfilPassword, setPerfilPassword] = useState("");

  const abrirModalPerfil = () => {
    if (usuarioActual) {
      setPerfilNombre(usuarioActual.nombre || "");
      setPerfilCorreo(usuarioActual.correo || "");
      setPerfilTelefono(usuarioActual.telefono || "");
      setPerfilPassword(usuarioActual.password || "");
      setModalPerfilAbierto(true);
    }
  };

  const guardarMiPerfil = (e) => {
    e.preventDefault();
    if (!perfilNombre.trim() || !perfilPassword.trim()) {
      alert("El nombre completo y la contraseña son obligatorios.");
      return;
    }

    const cambialoPass = perfilPassword.trim() !== usuarioActual.password;
    let marcaModificado = usuarioActual.usernameModificado || false;

    if (cambialoPass && !usuarioActual.isMaster) {
      if (usuarioActual.usernameModificado) {
        alert("🔒 Tu contraseña solo puede ser modificada por ti una única vez. Si la has olvidado, únicamente el Usuario Maestro (bsarmientom1993) puede restablecerla o desbloquear tu cuenta.");
        setPerfilPassword(usuarioActual.password);
        return;
      } else {
        marcaModificado = true;
      }
    }

    const actualizado = {
      ...usuarioActual,
      nombre: perfilNombre.trim(),
      correo: perfilCorreo.trim() || `${usuarioActual.username}@eiluve.com`,
      telefono: perfilTelefono.trim() || "No especificado",
      password: perfilPassword.trim(),
      usernameModificado: marcaModificado
    };

    setUsuarioActual(actualizado);
    localStorage.setItem("eiluve_logged_band_user", JSON.stringify(actualizado));

    const usuariosNuevos = usuariosBanda.map((u) => u.id === actualizado.id ? actualizado : u);
    setUsuariosBanda(usuariosNuevos);
    localStorage.setItem("eiluve_band_users", JSON.stringify(usuariosNuevos));

    registrarLogAuditoria("Actualizó sus datos personales de perfil", "Perfil");
    setModalPerfilAbierto(false);
    alert("¡Tus datos de perfil han sido actualizados con éxito!");
  };

  const alternarBloqueoUsuario = (id) => {
    const target = usuariosBanda.find((u) => u.id === id);
    if (!target) return;
    if (target.isMaster) {
      alert("El Usuario Maestro no puede ser bloqueado.");
      return;
    }
    const nuevoEstado = !target.bloqueado;
    const actualizados = usuariosBanda.map((u) => u.id === id ? { ...u, bloqueado: nuevoEstado } : u);
    setUsuariosBanda(actualizados);
    localStorage.setItem("eiluve_band_users", JSON.stringify(actualizados));
    registrarLogAuditoria((nuevoEstado ? `Bloqueó la cuenta del usuario "${target.username}"` : `Desbloqueó la cuenta del usuario "${target.username}"`), "Usuarios");
    alert(`La cuenta de "${target.username}" ahora está ${nuevoEstado ? "BLOQUEADA 🔒" : "DESBLOQUEADA 🔓"}.`);
  };

  const restablecerPasswordUsuario = (user) => {
    if (!user) return;
    const nuevaClaveTemporal = prompt(`Ingresa la nueva contraseña para "${user.username}":`, "clan_pagano_2026");
    if (!nuevaClaveTemporal || !nuevaClaveTemporal.trim()) return;

    const actualizados = usuariosBanda.map((u) =>
      u.id === user.id
        ? {
            ...u,
            password: nuevaClaveTemporal.trim(),
            bloqueado: false,
            usernameModificado: false // Otorga 1 nueva oportunidad de cambio al usuario
          }
        : u
    );

    setUsuariosBanda(actualizados);
    localStorage.setItem("eiluve_band_users", JSON.stringify(actualizados));
    registrarLogAuditoria(`Restableció la contraseña y desbloqueó la cuenta de "${user.username}"`, "Usuarios");
    alert(`¡Contraseña restablecida con éxito para "${user.username}"! La nueva contraseña es "${nuevaClaveTemporal.trim()}". Se ha habilitado 1 nueva edición para el usuario.`);
  };

  const alternarRolNuevo = (rolNombre) => {
    if (nuevosRolesUser.includes(rolNombre)) {
      if (nuevosRolesUser.length === 1) {
        alert("El usuario debe tener asignado al menos 1 rol.");
        return;
      }
      setNuevosRolesUser(nuevosRolesUser.filter((r) => r !== rolNombre));
    } else {
      setNuevosRolesUser([...nuevosRolesUser, rolNombre]);
    }
  };

  // Auto-login persistence check
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedUser = localStorage.getItem("eiluve_logged_band_user");
      if (loggedUser) {
        try {
          const parsed = JSON.parse(loggedUser);
          setUsuarioActual(parsed);
          setLogged(true);
        } catch (e) {}
      }
    }
  }, []);

  // 📜 REGISTRO DE AUDITORÍA Y BITÁCORA DE ACTIVIDAD
  const [logsAuditoria, setLogsAuditoria] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("eiluve_audit_log");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return [
      {
        id: "log_1",
        usuario: "bsarmientom1993",
        nombreAutor: "B. Sarmiento",
        rol: "Maestro del Portal",
        accion: "Inicializó el Portal Rúnico del Clan y activó el Log de Auditoría",
        categoria: "Sistema",
        fecha: "2026-07-19 18:00"
      }
    ];
  });

  const registrarLogAuditoria = (accion, categoria = "General") => {
    const autorNombre = usuarioActual ? usuarioActual.nombre : "B. Sarmiento";
    const autorUser = usuarioActual ? usuarioActual.username : "bsarmientom1993";
    const autorRol = usuarioActual
      ? (usuarioActual.roles ? usuarioActual.roles.join(", ") : usuarioActual.rol)
      : "Maestro del Portal";

    const nuevoLog = {
      id: "log_" + Date.now(),
      usuario: autorUser,
      nombreAutor: autorNombre,
      rol: autorRol,
      accion: accion,
      categoria: categoria,
      fecha: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const actualizados = [nuevoLog, ...logsAuditoria];
    setLogsAuditoria(actualizados);
    localStorage.setItem("eiluve_audit_log", JSON.stringify(actualizados));
    window.dispatchEvent(new Event("eiluve_realtime_sync"));
  };

  // 💾 EXPORTAR / IMPORTAR REGISTRO LOCAL COMPLETO (LOCALSTORAGE)
  const exportarRegistroLocal = () => {
    const backupData = {
      version: "2.0",
      fechaExportacion: new Date().toISOString(),
      conciertos: conciertos,
      noticias: noticias,
      bio: bio,
      presentacion: presentacion,
      merch: merch,
      mazmorrasData: mazmorrasData,
      galeria: galeria,
      nfcCodes: nfcCodes,
      fansRegistrados: fansRegistrados,
      mensajesContacto: mensajesContacto,
      logsAuditoria: logsAuditoria
    };

    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `eiluve_registro_local_${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    registrarLogAuditoria("Exportó copia de seguridad del Registro Local a JSON", "Sistema");
  };

  const importarRegistroLocal = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (data.conciertos) {
          setConciertos(data.conciertos);
          localStorage.setItem("eiluve_conciertos", JSON.stringify(data.conciertos));
        }
        if (data.noticias) {
          setNoticias(data.noticias);
          localStorage.setItem("eiluve_noticias", JSON.stringify(data.noticias));
        }
        if (data.bio) {
          setBio(data.bio);
          localStorage.setItem("eiluve_bio", JSON.stringify(data.bio));
        }
        if (data.presentacion) {
          setPresentacion(data.presentacion);
          localStorage.setItem("eiluve_presentacion", JSON.stringify(data.presentacion));
        }
        if (data.merch) {
          setMerch(data.merch);
          localStorage.setItem("eiluve_merch", JSON.stringify(data.merch));
        }
        if (data.mazmorrasData) {
          setMazmorrasData(data.mazmorrasData);
          localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(data.mazmorrasData));
        }
        if (data.nfcCodes) {
          setNfcCodes(data.nfcCodes);
          localStorage.setItem("eiluve_nfc_codes", JSON.stringify(data.nfcCodes));
        }
        window.dispatchEvent(new Event("eiluve_realtime_sync"));
        registrarLogAuditoria("Importó copia de seguridad del Registro Local desde archivo JSON", "Sistema");
        alert("¡Registro Local restaurado e importado con éxito!");
      } catch (err) {
        alert("Error al leer el archivo de copia de seguridad. Verifica que sea un JSON válido.");
      }
    };
    reader.readAsText(file);
  };

  // Event listener para actualización en tiempo real de mensajes y auditoría
  useEffect(() => {
    const syncRealtimeDashboard = () => {
      const savedConciertos = localStorage.getItem("eiluve_conciertos");
      if (savedConciertos) {
        try { setConciertos(JSON.parse(savedConciertos)); } catch (e) {}
      }
      const savedNoticias = localStorage.getItem("eiluve_noticias");
      if (savedNoticias) {
        try { setNoticias(JSON.parse(savedNoticias)); } catch (e) {}
      }
      const savedFans = localStorage.getItem("eiluve_fans_registrados");
      if (savedFans) {
        try { setFansRegistrados(JSON.parse(savedFans)); } catch (e) {}
      }
      const savedLogs = localStorage.getItem("eiluve_audit_log");
      if (savedLogs) {
        try { setLogsAuditoria(JSON.parse(savedLogs)); } catch (e) {}
      }
    };
    window.addEventListener("eiluve_realtime_sync", syncRealtimeDashboard);
    window.addEventListener("storage", syncRealtimeDashboard);
    return () => {
      window.removeEventListener("eiluve_realtime_sync", syncRealtimeDashboard);
      window.removeEventListener("storage", syncRealtimeDashboard);
    };
  }, [setFansRegistrados, setLogsAuditoria, setConciertos, setNoticias]);

  // Manejar Login de la Banda (Acepta usuario maestro bsarmientom1993 / jareck93 y cualquier usuario creado por el maestro)
  const manejarLogin = (e) => {
    e.preventDefault();
    const u = usuario.trim().toLowerCase();
    const p = clave.trim();

    const usuarioValido = usuariosBanda.find(
      (user) => user.username.toLowerCase() === u && user.password === p
    );

    if (usuarioValido) {
      if (usuarioValido.bloqueado) {
        setErrorMsg("🔒 Tu cuenta ha sido BLOQUEADA por el Usuario Maestro. Solamente bsarmientom1993 puede restablecer tu contraseña o desbloquear tu acceso.");
        return;
      }
      setLogged(true);
      setUsuarioActual(usuarioValido);
      localStorage.setItem("eiluve_logged_band_user", JSON.stringify(usuarioValido));
      setErrorMsg("");
    } else {
      setErrorMsg("Credenciales incorrectas. El guardián del portal deniega el acceso.");
    }
  };

  const cerrarSesionBanda = () => {
    setLogged(false);
    setUsuarioActual(null);
    setUsuario("");
    setClave("");
    localStorage.removeItem("eiluve_logged_band_user");
  };

  const guardarUsuarioBanda = (e) => {
    e.preventDefault();
    if (!nuevoNombreUser.trim() || !nuevoUsername.trim() || !nuevaPassword.trim()) {
      alert("Por favor completa el nombre, usuario y contraseña para el miembro.");
      return;
    }

    if (nuevosRolesUser.length === 0) {
      alert("Selecciona al menos 1 rol para asignar.");
      return;
    }

    if (editUserId) {
      // Modificar usuario existente
      const actualizados = usuariosBanda.map((u) => {
        if (u.id === editUserId) {
          return {
            ...u,
            nombre: nuevoNombreUser.trim(),
            username: nuevoUsername.trim().toLowerCase(),
            password: nuevaPassword.trim(),
            correo: nuevoCorreoUser.trim() || `${nuevoUsername.trim().toLowerCase()}@eiluve.com`,
            telefono: nuevoTelefonoUser.trim() || "No especificado",
            roles: nuevosRolesUser,
            rol: nuevosRolesUser.join(" • ")
          };
        }
        return u;
      });
      setUsuariosBanda(actualizados);
      localStorage.setItem("eiluve_band_users", JSON.stringify(actualizados));
      setEditUserId(null);
      setNuevoNombreUser("");
      setNuevoUsername("");
      setNuevaPassword("");
      setNuevoCorreoUser("");
      setNuevoTelefonoUser("");
      setNuevosRolesUser(["📰 Editor de Noticias y Crónicas"]);
      registrarLogAuditoria(`Modificó datos y roles del usuario "${nuevoUsername.trim()}"`, "Usuarios");
      alert("¡Datos y roles del usuario actualizados correctamente!");
    } else {
      // Crear nuevo usuario
      const existe = usuariosBanda.some((u) => u.username.toLowerCase() === nuevoUsername.trim().toLowerCase());
      if (existe) {
        alert("El nombre de usuario ya existe en el portal. Elige otro.");
        return;
      }

      const nuevoUsuario = {
        id: "user_" + Date.now(),
        username: nuevoUsername.trim().toLowerCase(),
        password: nuevaPassword.trim(),
        nombre: nuevoNombreUser.trim(),
        correo: nuevoCorreoUser.trim() || `${nuevoUsername.trim().toLowerCase()}@eiluve.com`,
        telefono: nuevoTelefonoUser.trim() || "No especificado",
        roles: nuevosRolesUser,
        rol: nuevosRolesUser.join(" • "),
        isMaster: false,
        fechaCreado: new Date().toISOString().split("T")[0]
      };

      const actualizados = [...usuariosBanda, nuevoUsuario];
      setUsuariosBanda(actualizados);
      localStorage.setItem("eiluve_band_users", JSON.stringify(actualizados));

      setNuevoNombreUser("");
      setNuevoUsername("");
      setNuevaPassword("");
      setNuevoCorreoUser("");
      setNuevoTelefonoUser("");
      setNuevosRolesUser(["📰 Editor de Noticias y Crónicas"]);
      registrarLogAuditoria(`Registró al nuevo miembro "${nuevoUsuario.username}" con correo y teléfono`, "Usuarios");
      alert(`¡Usuario "${nuevoUsuario.username}" registrado correctamente!`);
    }
  };

  const seleccionarEditarUsuario = (user) => {
    setEditUserId(user.id);
    setNuevoNombreUser(user.nombre);
    setNuevoUsername(user.username);
    setNuevaPassword(user.password);
    setNuevoCorreoUser(user.correo || "");
    setNuevoTelefonoUser(user.telefono || "");
    if (user.roles && user.roles.length > 0) {
      setNuevosRolesUser(user.roles);
    } else if (user.rol) {
      setNuevosRolesUser([user.rol]);
    } else {
      setNuevosRolesUser(["📰 Editor de Noticias y Crónicas"]);
    }
  };

  const eliminarUsuarioBanda = (id) => {
    const user = usuariosBanda.find((u) => u.id === id);
    if (user && user.isMaster) {
      alert("El Usuario Maestro 'bsarmientom1993' no puede ser eliminado.");
      return;
    }
    if (confirm(`¿Seguro que deseas revocar el acceso a ${user ? user.username : "este usuario"}?`)) {
      const actualizados = usuariosBanda.filter((u) => u.id !== id);
      setUsuariosBanda(actualizados);
      localStorage.setItem("eiluve_band_users", JSON.stringify(actualizados));
    }
  };

  // Funciones para gestionar integrantes de biografía (destacados)
  const agregarIntegrante = () => {
    if (!nuevoDestTitulo.trim() || !nuevoDestSubtitulo.trim()) return;
    const nuevo = {
      titulo: nuevoDestTitulo.trim(),
      subtitulo: nuevoDestSubtitulo.trim(),
      colorBorde: nuevoDestColor
    };
    let actualizados;
    if (editIntegranteIndex !== null) {
      actualizados = destacados.map((item, i) => i === editIntegranteIndex ? nuevo : item);
      setEditIntegranteIndex(null);
    } else {
      actualizados = [...destacados, nuevo];
    }
    setDestacados(actualizados);
    localStorage.setItem("eiluve_destacados", JSON.stringify(actualizados));
    setNuevoDestTitulo("");
    setNuevoDestSubtitulo("");
    setNuevoDestColor("#735f3d");
  };

  const seleccionarEditarIntegrante = (index) => {
    const item = destacados[index];
    setEditIntegranteIndex(index);
    setNuevoDestTitulo(item.titulo);
    setNuevoDestSubtitulo(item.subtitulo);
    setNuevoDestColor(item.colorBorde || "#735f3d");
  };

  const eliminarIntegrante = (index) => {
    if (confirm("¿Seguro que deseas disolver a este integrante del pergamino?")) {
      const actualizados = destacados.filter((_, i) => i !== index);
      setDestacados(actualizados);
      localStorage.setItem("eiluve_destacados", JSON.stringify(actualizados));
      if (editIntegranteIndex === index) {
        setEditIntegranteIndex(null);
        setNuevoDestTitulo("");
        setNuevoDestSubtitulo("");
        setNuevoDestColor("#735f3d");
      }
    }
  };

  // Funciones para gestionar frases del cargador
  const agregarFrase = () => {
    if (!nuevaFrase.trim()) return;
    const actualizadas = [...frases, nuevaFrase.trim()];
    setFrases(actualizadas);
    localStorage.setItem("eiluve_frases_carga", JSON.stringify(actualizadas));
    setNuevaFrase("");
  };

  const eliminarFrase = (index) => {
    const actualizadas = frases.filter((_, i) => i !== index);
    setFrases(actualizadas);
    localStorage.setItem("eiluve_frases_carga", JSON.stringify(actualizadas));
  };

  // Guardar Cambios de Biografía
  const guardarBio = () => {
    const nuevaBio = {
      titulo: bioTitulo,
      cita: bioCita,
      historia: bioHistoria,
      imagenRuta: bioImg,
      imagenAlt: "Banda Eiluvë en el bosque",
      destacados: [
        { titulo: dest1T, subtitulo: dest1S, colorBorde: "#735f3d" },
        { titulo: dest2T, subtitulo: dest2S, colorBorde: "#8da382" }
      ]
    };
    setBio(nuevaBio);
    localStorage.setItem("eiluve_bio", JSON.stringify(nuevaBio));
    alert("¡Leyenda rúnica guardada con éxito!");
  };

  // Guardar Cambios del Hero (Presentación)
  const guardarPresentacion = () => {
    const nuevaPres = {
      titulo: presTitulo,
      subtitulo1: presSub1,
      subtitulo2: presSub2,
      descripcion: presDesc
    };
    setPresentacion(nuevaPres);
    localStorage.setItem("eiluve_presentacion", JSON.stringify(nuevaPres));
    alert("¡Textos de presentación de página principal guardados con éxito!");
  };

  // Guardar Cambios de Merch
  const guardarMerch = () => {
    const nuevoMerch = {
      imagen: merchImgPath,
      enlace: merchLinkPath
    };
    setMerch(nuevoMerch);
    localStorage.setItem("eiluve_merch", JSON.stringify(nuevoMerch));
    alert("¡Fotos y enlaces de merchandising guardados con éxito!");
  };

  // Guardar Cambios de Galería
  const guardarGaleria = () => {
    const nuevaGaleria = [
      galeriaImg1 || "/biografia/Bio1.jpg",
      galeriaImg2 || "/biografia/Bio2.jpg",
      galeriaImg3 || "/biografia/Bio3.jpg",
      galeriaImg4 || "/biografia/Bio4.jpg"
    ];
    setGaleria(nuevaGaleria);
    localStorage.setItem("eiluve_galeria", JSON.stringify(nuevaGaleria));
    alert("¡Mini galería de fotos guardada con éxito!");
  };

  // Guardar Cambios de Redes y Fotos
  const guardarLinks = () => {
    const nuevosLinks = {
      spotify: linkSpotify,
      youtube: linkYoutube,
      instagram: linkInstagram,
      facebook: linkFacebook,
      apple: linkApple,
      tiktok: linkTiktok,
      album: linkAlbum,
      video: linkVideo
    };
    setLinks(nuevosLinks);
    setHeroBg(heroBgPath);
    localStorage.setItem("eiluve_links", JSON.stringify(nuevosLinks));
    localStorage.setItem("eiluve_hero_bg", heroBgPath);

    // Guardar la foto de la banda de la biografía que se edita en esta misma pestaña
    const nuevaBio = {
      ...bio,
      imagenRuta: bioImg,
      // Si bio es undefined o nulo, proveer fallbacks
      titulo: bio?.titulo || "La Leyenda",
      cita: bio?.cita || `"Cuentos de esqueletos, tabernas escondidas y magos del bosque."`,
      historia: bio?.historia || `Invocamos la furia del metal pesado...`,
      imagenAlt: bio?.imagenAlt || "Banda Eiluvë en el bosque",
      destacados: bio?.destacados || [
        { titulo: "Esqueletos Reales", subtitulo: "Cuerdas y Hechizos", colorBorde: "#735f3d" },
        { titulo: "El Bestiario", subtitulo: "Batería Jurásica", colorBorde: "#8da382" }
      ]
    };
    setBio(nuevaBio);
    localStorage.setItem("eiluve_bio", JSON.stringify(nuevaBio));

    alert("¡Enlaces, fondo del portal y foto de la banda guardados con éxito!");
  };

  // Guardar/Editar Noticia (Blog)
  const guardarNoticia = (e) => {
    e.preventDefault();
    if (!noticiaFecha || !noticiaTitulo || !noticiaContenido) {
      alert("Por favor rellena los campos requeridos.");
      return;
    }

    const autorNombre = usuarioActual ? usuarioActual.nombre : "B. Sarmiento";
    const autorUser = usuarioActual ? usuarioActual.username : "bsarmientom1993";
    const autorFormateado = `${autorNombre} (@${autorUser})`;

    let nuevasNoticias;
    if (editNoticiaId) {
      nuevasNoticias = noticias.map((n) =>
        n.id === editNoticiaId
          ? {
              ...n,
              fecha: noticiaFecha,
              categoria: noticiaCat,
              titulo: noticiaTitulo,
              imagen: noticiaImg || "/Somos todos.jpg",
              resumen: noticiaResumen || noticiaContenido.substring(0, 100) + "...",
              contenido: noticiaContenido,
              autor: autorFormateado
            }
          : n
      );
      setEditNoticiaId(null);
      registrarLogAuditoria(`Modificó la crónica "${noticiaTitulo}"`, "Crónicas");
    } else {
      const nuevoId = noticias.length > 0 ? Math.max(...noticias.map((n) => n.id)) + 1 : 1;
      const nuevaNoticia = {
        id: nuevoId,
        fecha: noticiaFecha,
        categoria: noticiaCat,
        titulo: noticiaTitulo,
        imagen: noticiaImg || "/Somos todos.jpg",
        resumen: noticiaResumen || noticiaContenido.substring(0, 100) + "...",
        contenido: noticiaContenido,
        autor: autorFormateado
      };
      nuevasNoticias = [nuevaNoticia, ...noticias];
      registrarLogAuditoria(`Publicó la nueva crónica "${noticiaTitulo}"`, "Crónicas");
    }

    setNoticias(nuevasNoticias);
    localStorage.setItem("eiluve_noticias", JSON.stringify(nuevasNoticias));

    // Reset
    setNoticiaFecha("");
    setNoticiaCat("LANZAMIENTO");
    setNoticiaTitulo("");
    setNoticiaImg("");
    setNoticiaResumen("");
    setNoticiaContenido("");
  };

  const seleccionarEditarNoticia = (n) => {
    setEditNoticiaId(n.id);
    setNoticiaFecha(n.fecha);
    setNoticiaCat(n.categoria);
    setNoticiaTitulo(n.titulo);
    setNoticiaImg(n.imagen);
    setNoticiaResumen(n.resumen);
    setNoticiaContenido(n.contenido);
    
    // Smooth scroll the news form into view
    setTimeout(() => {
      document.getElementById("form-cronica")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 100);
  };

  const eliminarNoticia = (id) => {
    if (confirm("¿Deseas borrar este relato de las crónicas del bosque?")) {
      const borrada = noticias.find(n => n.id === id);
      const nuevas = noticias.filter((n) => n.id !== id);
      setNoticias(nuevas);
      localStorage.setItem("eiluve_noticias", JSON.stringify(nuevas));
      registrarLogAuditoria(`Eliminó la crónica "${borrada?.titulo || id}"`, "Crónicas");
    }
  };

  // Drag and Drop para reordenar Crónicas
  const handleDragStartNoticia = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverNoticia = (e) => {
    e.preventDefault();
  };

  const handleDropNoticia = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    const items = [...noticias];
    const draggedItem = items[draggedIndex];
    items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItem);

    setNoticias(items);
    localStorage.setItem("eiluve_noticias", JSON.stringify(items));
    setDraggedIndex(null);
  };

  const handleDragEndNoticia = () => {
    setDraggedIndex(null);
  };

  // Guardar Código de Sello (Passcode)
  const guardarPasscode = (e) => {
    e.preventDefault();
    const nuevosDatos = {
      ...mazmorrasData,
      passcode: mPasscode
    };
    setMazmorrasData(nuevosDatos);
    localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    alert("¡Código del sello rúnico actualizado con éxito!");
  };

  // Guardar/Editar Miembro de la Banda (Mazmorras)
  const guardarMiembro = (e) => {
    e.preventDefault();
    if (!mNombre || !mRol || !mDesc) {
      alert("Por favor rellena todos los campos del integrante.");
      return;
    }

    const miembrosActuales = mazmorrasData?.miembros || [];
    let nuevosMiembros;

    if (editMiembroId) {
      nuevosMiembros = miembrosActuales.map((m) =>
        m.id === editMiembroId
          ? { ...m, nombre: mNombre, rol: mRol, desc: mDesc, mensajero: mMensajero }
          : m
      );
      setEditMiembroId(null);
    } else {
      const nuevoId = miembrosActuales.length > 0 ? Math.max(...miembrosActuales.map((m) => m.id)) + 1 : 1;
      const nuevoMiembro = {
        id: nuevoId,
        nombre: mNombre,
        rol: mRol,
        desc: mDesc,
        mensajero: mMensajero
      };
      nuevosMiembros = [...miembrosActuales, nuevoMiembro];
    }

    const nuevosDatos = {
      ...mazmorrasData,
      miembros: nuevosMiembros
    };

    setMazmorrasData(nuevosDatos);
    localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));

    // Reset
    setMNombre("");
    setMRol("");
    setMDesc("");
    setMMensajero("Cuervo Rúnico");
  };

  const seleccionarEditarMiembro = (m) => {
    setEditMiembroId(m.id);
    setMNombre(m.nombre);
    setMRol(m.rol);
    setMDesc(m.desc);
    setMMensajero(m.mensajero || m.messenger || "Cuervo Rúnico");
  };

  const eliminarMiembro = (id) => {
    if (confirm("¿Deseas desterrar a este integrante de las mazmorras del clan?")) {
      const miembrosActuales = mazmorrasData?.miembros || [];
      const nuevosMiembros = miembrosActuales.filter((m) => m.id !== id);
      const nuevosDatos = {
        ...mazmorrasData,
        miembros: nuevosMiembros
      };
      setMazmorrasData(nuevosDatos);
      localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    }
  };

  // Gestión de Canciones en Mazmorras
  const guardarCancionDungeon = (e) => {
    e.preventDefault();
    if (!cTitulo || !cEnlace) {
      alert("Por favor rellena al menos el título y enlace de la pista.");
      return;
    }
    const cancionesActuales = mazmorrasData?.canciones || [
      { id: 1, titulo: "Somos todos", tipo: "Álbum Oficial", enlace: "/Somos todos.mp3", duracion: "6:12" },
      { id: 2, titulo: "Tú Voz (Demo Acústica)", tipo: "Maqueta Inédita", enlace: "/Tu voz.mp3", duracion: "7:05" },
      { id: 3, titulo: "Quizás mañana", tipo: "Álbum Oficial", enlace: "/Quizas mañana.mp3", duracion: "5:44" },
      { id: 4, titulo: "El matriqui del diablo", tipo: "Álbum Oficial", enlace: "/El matriqui del diablo.mp3", duracion: "5:44" }
    ];
    let nuevasCanciones;
    if (editCancionId) {
      nuevasCanciones = cancionesActuales.map((c) =>
        c.id === editCancionId
          ? { ...c, titulo: cTitulo, tipo: cTipo, enlace: cEnlace, duracion: cDuracion || "3:00" }
          : c
      );
      setEditCancionId(null);
    } else {
      const nuevoId = cancionesActuales.length > 0 ? Math.max(...cancionesActuales.map((c) => c.id)) + 1 : 1;
      const nuevaCancion = {
        id: nuevoId,
        titulo: cTitulo,
        tipo: cTipo,
        enlace: cEnlace,
        duracion: cDuracion || "3:00"
      };
      nuevasCanciones = [...cancionesActuales, nuevaCancion];
    }
    const nuevosDatos = { ...mazmorrasData, canciones: nuevasCanciones };
    setMazmorrasData(nuevosDatos);
    localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    setCTitulo("");
    setCTipo("Álbum Oficial");
    setCEnlace("");
    setCDuracion("");
  };

  const eliminarCancionDungeon = (id) => {
    if (confirm("¿Seguro que deseas eliminar esta canción de las mazmorras?")) {
      const cancionesActuales = mazmorrasData?.canciones || [];
      const nuevasCanciones = cancionesActuales.filter((c) => c.id !== id);
      const nuevosDatos = { ...mazmorrasData, canciones: nuevasCanciones };
      setMazmorrasData(nuevosDatos);
      localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    }
  };

  const seleccionarEditarCancion = (c) => {
    setEditCancionId(c.id);
    setCTitulo(c.titulo || "");
    setCTipo(c.tipo || "Álbum Oficial");
    setCEnlace(c.enlace || "");
    setCDuracion(c.duracion || "");
  };

  // Gestión de Fotos en Mazmorras
  const guardarFotoDungeon = (e) => {
    e.preventDefault();
    if (!fTitulo || !fSrc) {
      alert("Por favor rellena al menos el título y la ruta de la foto.");
      return;
    }
    const fotosActuales = mazmorrasData?.fotos || [
      { id: 1, titulo: "Retrato del Bardo", descripcion: "Sesión conceptual con zanfoña en el robledal sagrado.", src: "/Somos todos.jpg" },
      { id: 2, titulo: "El Cónclave Secreto", descripcion: "Ensayo nocturno a la luz de las antorchas.", src: "/Tu voz.jpg" },
      { id: 3, titulo: "La Ofrenda al Bosque", descripcion: "Detalle del altar rúnico tallado para la portada.", src: "/Quizas mañana.jpg" },
      { id: 4, titulo: "La Senda del Fuego", descripcion: "Boceto cromático descartado para el Ritual.", src: "/El matriqui del diablo.jpg" }
    ];
    let nuevasFotos;
    if (editFotoId) {
      nuevasFotos = fotosActuales.map((f) =>
        f.id === editFotoId
          ? { ...f, titulo: fTitulo, descripcion: fDescripcion, src: fSrc }
          : f
      );
      setEditFotoId(null);
    } else {
      const nuevoId = fotosActuales.length > 0 ? Math.max(...fotosActuales.map((f) => f.id)) + 1 : 1;
      const nuevaFoto = {
        id: nuevoId,
        titulo: fTitulo,
        descripcion: fDescripcion,
        src: fSrc
      };
      nuevasFotos = [...fotosActuales, nuevaFoto];
    }
    const nuevosDatos = { ...mazmorrasData, fotos: nuevasFotos };
    setMazmorrasData(nuevosDatos);
    localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    setFTitulo("");
    setFDescripcion("");
    setFSrc("");
  };

  const eliminarFotoDungeon = (id) => {
    if (confirm("¿Seguro que deseas eliminar esta foto de las mazmorras?")) {
      const fotosActuales = mazmorrasData?.fotos || [];
      const nuevasFotos = fotosActuales.filter((f) => f.id !== id);
      const nuevosDatos = { ...mazmorrasData, fotos: nuevasFotos };
      setMazmorrasData(nuevosDatos);
      localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    }
  };

  const seleccionarEditarFoto = (f) => {
    setEditFotoId(f.id);
    setFTitulo(f.titulo || "");
    setFDescripcion(f.descripcion || "");
    setFSrc(f.src || "");
  };

  // Gestión de Videos en Mazmorras
  const guardarVideoDungeon = (e) => {
    e.preventDefault();
    if (!vTitulo || !vVideoUrl) {
      alert("Por favor rellena al menos el título y el enlace de YouTube.");
      return;
    }
    const videosActuales = mazmorrasData?.videos || [
      { id: 1, titulo: "Ensayos bajo la Bruma", descripcion: "Metraje en crudo de los primeros ensayos de flauta y violín.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", imagen: "/Somos todos.jpg" },
      { id: 2, titulo: "Grabando Voces", descripcion: "Tomas descartadas en el estudio rústico de grabación.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", imagen: "/Tu voz.jpg" }
    ];
    let nuevosVideos;
    if (editVideoId) {
      nuevosVideos = videosActuales.map((v) =>
        v.id === editVideoId
          ? { ...v, titulo: vTitulo, descripcion: vDescripcion, videoUrl: vVideoUrl, imagen: vImagen || "/Somos todos.jpg" }
          : v
      );
      setEditVideoId(null);
    } else {
      const nuevoId = videosActuales.length > 0 ? Math.max(...videosActuales.map((v) => v.id)) + 1 : 1;
      const nuevoVideo = {
        id: nuevoId,
        titulo: vTitulo,
        descripcion: vDescripcion,
        videoUrl: vVideoUrl,
        imagen: vImagen || "/Somos todos.jpg"
      };
      nuevosVideos = [...videosActuales, nuevoVideo];
    }
    const nuevosDatos = { ...mazmorrasData, videos: nuevosVideos };
    setMazmorrasData(nuevosDatos);
    localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    setVTitulo("");
    setVDescripcion("");
    setVVideoUrl("");
    setVImagen("");
  };

  const eliminarVideoDungeon = (id) => {
    if (confirm("¿Seguro que deseas eliminar este vídeo de las mazmorras?")) {
      const videosActuales = mazmorrasData?.videos || [];
      const nuevasVideos = videosActuales.filter((v) => v.id !== id);
      const nuevosDatos = { ...mazmorrasData, videos: nuevasVideos };
      setMazmorrasData(nuevosDatos);
      localStorage.setItem("eiluve_mazmorras_data", JSON.stringify(nuevosDatos));
    }
  };

  const seleccionarEditarVideo = (v) => {
    setEditVideoId(v.id);
    setVTitulo(v.titulo || "");
    setVDescripcion(v.descripcion || "");
    setVVideoUrl(v.videoUrl || "");
    setVImagen(v.imagen || "");
  };

  // Agregar o Editar Código NFC
  const guardarNfcCode = (e) => {
    e.preventDefault();
    if (!nfcTagId.trim() || !nfcCodigo6.trim()) {
      alert("Por favor rellena los campos obligatorios del código NFC.");
      return;
    }

    // Validar que el código sea de 2 letras y 6 dígitos (ej: EV-983562)
    const esCodigoValido = /^([A-Za-z]{2}-?\d{6}|\d{6})$/.test(nfcCodigo6.trim());
    if (!esCodigoValido) {
      alert("El código de acceso debe contener 2 letras y 6 dígitos (ej: EV-983562).");
      return;
    }

    // Validar unicidad del código de acceso
    const duplicado = nfcCodes.some(
      (item) => item.codigo.toString().trim().toUpperCase() === nfcCodigo6.trim().toUpperCase() && item.id !== editNfcId
    );
    if (duplicado) {
      alert("Este código de acceso ya está registrado para otro Mini CD. Debe ser único.");
      return;
    }

    let nuevosNfcCodes;
    if (editNfcId) {
      // Editar existente
      nuevosNfcCodes = nfcCodes.map((item) =>
        item.id === editNfcId
          ? {
              ...item,
              nfcId: nfcTagId.trim(),
              codigo: nfcCodigo6.trim(),
              descripcion: nfcDesc.trim(),
            }
          : item
      );
      setEditNfcId(null);
    } else {
      // Crear nuevo
      const nuevoId = nfcCodes.length > 0 ? Math.max(...nfcCodes.map((item) => item.id)) + 1 : 1;
      const nuevoNfc = {
        id: nuevoId,
        nfcId: nfcTagId.trim(),
        codigo: nfcCodigo6.trim(),
        descripcion: nfcDesc.trim() || "Código de Mini CD NFC",
        fechaRegistro: new Date().toISOString().split("T")[0]
      };
      nuevosNfcCodes = [...nfcCodes, nuevoNfc];
    }

    setNfcCodes(nuevosNfcCodes);
    localStorage.setItem("eiluve_nfc_codes", JSON.stringify(nuevosNfcCodes));
    setNfcTagId("");
    setNfcCodigo6("");
    setNfcDesc("");
  };

  const eliminarNfcCode = (id) => {
    if (confirm("¿Seguro que deseas eliminar este código NFC? Los usuarios con este Mini CD perderán el acceso.")) {
      const nuevosNfcCodes = nfcCodes.filter((item) => item.id !== id);
      setNfcCodes(nuevosNfcCodes);
      localStorage.setItem("eiluve_nfc_codes", JSON.stringify(nuevosNfcCodes));
    }
  };

  const seleccionarEditarNfcCode = (item) => {
    setEditNfcId(item.id);
    setNfcTagId(item.nfcId || "");
    setNfcCodigo6(item.codigo || "");
    setNfcDesc(item.descripcion || "");
  };

  const codificarNfcId = (tagId) => {
    if (!tagId) return "";
    const salt = "EILUVE_SECRET_GATEWAY_RUNE_2026_PROD";
    let hash1 = 5381;
    let hash2 = 33;
    const combined = tagId.trim().toUpperCase() + salt;
    for (let i = 0; i < combined.length; i++) {
      const char = combined.charCodeAt(i);
      hash1 = ((hash1 << 5) + hash1) + char;
      hash1 = hash1 & hash1;
      hash2 = ((hash2 << 5) + hash2) ^ char;
      hash2 = hash2 & hash2;
    }
    
    // Generar 2 letras deterministas (A-Z)
    const char1 = String.fromCharCode(65 + (Math.abs(hash1) % 26));
    const char2 = String.fromCharCode(65 + (Math.abs(hash2) % 26));
    const prefijo = `${char1}${char2}`;
    
    // Generar 6 dígitos deterministas
    const hashFinal = Math.abs(hash1 * 31 + hash2) % 900000 + 100000;
    
    return `${prefijo}-${hashFinal}`;
  };

  const exportarLotePdf = () => {
    if (nfcCodes.length === 0) {
      alert("No hay códigos NFC registrados.");
      return;
    }
    
    // Obtener los códigos para el lote seleccionado (20 códigos por lote)
    const inicio = selectedBatchIndex * 20;
    const fin = Math.min(inicio + 20, nfcCodes.length);
    const codigosLote = nfcCodes.slice(inicio, fin);
    
    if (codigosLote.length === 0) {
      alert("No hay códigos en este lote.");
      return;
    }
    
    // Crear una ventana nueva limpia para imprimir
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Permite las ventanas emergentes en tu navegador para generar la planilla de impresión.");
      return;
    }
    
    // Generar el HTML para las etiquetas recortables (4x5 grid fits perfectly in A4)
    let labelsHtml = "";
    codigosLote.forEach((item, index) => {
      labelsHtml += `
        <div class="label-card">
          <div class="label-header-img">
            <img src="/logo_eiluve.png" alt="Eiluvë Logo" />
          </div>
          <div class="label-subheader">Sello Rúnico de las Mazmorras</div>
          
          <div class="label-instructions">
            Ingresa a <strong>www.eiluve.com</strong> ➔ Pulsa la Llave <img src="/pantalla de carga/Llave de las mazmorras.png" class="label-key-icon" alt="Llave" /> e ingresa tu código de acceso:
          </div>

          <div class="label-code">${item.codigo}</div>
          
          <div class="label-footer">
            <div>Mini CD: <strong>${item.nfcId}</strong></div>
            <div>Ref: <span>${item.descripcion ? item.descripcion.substring(0, 15) : "CD-NFC"}</span></div>
          </div>
          <div class="cut-line-top-left"></div>
          <div class="cut-line-bottom-right"></div>
        </div>
      `;
    });
    
    const pageHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Eiluvë - Lote de Impresión ${selectedBatchIndex + 1}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700&family=Courier+Prime:wght@700&family=Inter:wght@400;600&display=swap');
            
            @page {
              size: A4 portrait;
              margin: 5mm;
            }
            
            body {
              font-family: 'Inter', sans-serif;
              margin: 0;
              padding: 0;
              background: white;
              color: black;
              -webkit-print-color-adjust: exact;
            }
            
            .grid-container {
              display: grid;
              grid-template-columns: repeat(4, 46mm);
              grid-template-rows: repeat(5, 52mm);
              gap: 2.5mm;
              width: 195mm;
              height: 270mm;
              box-sizing: border-box;
              margin: 0 auto;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .label-card {
              border: 1px dashed #735f3d;
              border-radius: 4px;
              padding: 2mm 2.5mm;
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              position: relative;
              box-sizing: border-box;
              text-align: center;
              background: #faf8f5;
              overflow: hidden;
              height: 52mm;
              width: 46mm;
              page-break-inside: avoid;
              break-inside: avoid;
            }
            
            .label-header-img {
              height: 10mm;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 0.5mm;
              margin-bottom: 0.5mm;
            }
            
            .label-header-img img {
              max-height: 100%;
              max-width: 38mm;
              object-fit: contain;
            }
            
            .label-subheader {
              font-size: 6px;
              text-transform: uppercase;
              letter-spacing: 0.06em;
              color: #7f6e52;
              margin-top: 0.2mm;
              margin-bottom: 0.8mm;
              line-height: 1;
            }

            .label-instructions {
              font-size: 5.8px;
              line-height: 1.1;
              color: #444;
              margin: 0.5mm 0;
              padding: 0 0.5mm;
              text-align: center;
            }
            
            .label-instructions strong {
              color: #000;
              text-decoration: underline;
            }

            .label-key-icon {
              height: 3.2mm;
              width: auto;
              vertical-align: middle;
              display: inline-block;
              margin: 0 1px;
              filter: drop-shadow(0 0 1px rgba(0,0,0,0.5));
            }
            
            .label-code {
              font-family: 'Courier Prime', monospace;
              font-size: 18px;
              font-weight: 700;
              letter-spacing: 0.12em;
              color: #000;
              border: 1px solid #7f6e52;
              padding: 0.8mm 1.5mm;
              background: white;
              border-radius: 2px;
              box-shadow: inset 0 0 2px rgba(0,0,0,0.1);
              margin: 0.8mm 0;
              width: 92%;
              box-sizing: border-box;
            }
            
            .label-footer {
              font-size: 6.5px;
              width: 100%;
              text-align: left;
              border-top: 1px dotted #ccc;
              padding-top: 1mm;
              margin-top: 1mm;
              color: #555;
              display: flex;
              justify-content: space-between;
              line-height: 1.1;
            }
            
            .label-footer strong {
              color: #111;
            }
            
            .cut-line-top-left {
              position: absolute;
              top: 0;
              left: 0;
              width: 3mm;
              height: 3mm;
              border-top: 1px solid #ccc;
              border-left: 1px solid #ccc;
            }
            
            .cut-line-bottom-right {
              position: absolute;
              bottom: 0;
              right: 0;
              width: 3mm;
              height: 3mm;
              border-bottom: 1px solid #ccc;
              border-right: 1px solid #ccc;
            }
            
            @media print {
              @page {
                size: A4 portrait;
                margin: 5mm;
              }
              html, body {
                width: 200mm;
                height: 285mm;
                margin: 0;
                padding: 0;
                background: none;
                overflow: hidden;
              }
              .no-print {
                display: none !important;
              }
              .preview-container {
                padding: 0 !important;
                margin: 0 !important;
                background: none !important;
                min-height: 0 !important;
              }
              .grid-container {
                width: 195mm !important;
                height: 270mm !important;
                gap: 2.5mm !important;
                margin: 0 auto !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
              .label-card {
                height: 52mm !important;
                width: 46mm !important;
                page-break-inside: avoid !important;
                break-inside: avoid !important;
              }
            }
            
            /* Styles for window preview */
            .control-panel {
              background: #2a241e;
              color: #d1b880;
              padding: 15px;
              font-family: sans-serif;
              display: flex;
              justify-content: space-between;
              align-items: center;
              border-bottom: 3px solid #735f3d;
            }
            
            .btn-print {
              background: #735f3d;
              color: white;
              border: 1px solid #d1b880;
              padding: 8px 20px;
              cursor: pointer;
              font-weight: bold;
              font-size: 13px;
              text-transform: uppercase;
              letter-spacing: 0.1em;
              border-radius: 3px;
              transition: all 0.3s;
            }
            
            .btn-print:hover {
              background: #fbbf24;
              color: black;
            }
            
            .preview-container {
              padding: 15mm;
              display: flex;
              justify-content: center;
              background: #e5e5e5;
              min-height: calc(100vh - 60px);
            }
          </style>
        </head>
        <body>
          <div class="control-panel no-print">
            <div>
              <strong style="font-family: 'Cinzel', serif; font-size: 16px;">CLAN EILUVË • PLANTILLA DE ETIQUETAS RÚNICAS</strong>
              <span style="margin-left: 15px; font-size: 12px; color: #a49175;">Lote ${selectedBatchIndex + 1} (${inicio + 1} al ${fin} de ${nfcCodes.length} Mini CDs)</span>
            </div>
            <button class="btn-print" onclick="window.print()">🖨️ Imprimir / Guardar PDF</button>
          </div>
          
          <div class="preview-container">
            <div class="grid-container">
              ${labelsHtml}
            </div>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(pageHtml);
    printWindow.document.close();
  };

  // Enviar Respuesta a un Fanático
  const enviarRespuestaBanda = (e) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedFanId) return;

    const mensajeNuevo = {
      id: Date.now(),
      remitente: "banda",
      texto: replyText.trim(),
      fecha: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const nuevosFans = fansRegistrados.map((f) => {
      if (f.id === selectedFanId) {
        return {
          ...f,
          mensajes: [...(f.mensajes || []), mensajeNuevo]
        };
      }
      return f;
    });

    setFansRegistrados(nuevosFans);
    localStorage.setItem("eiluve_fans_registrados", JSON.stringify(nuevosFans));
    setReplyText("");
    window.dispatchEvent(new Event("eiluve_realtime_sync"));
  };

  const eliminarFanRegistrado = (id) => {
    if (confirm("¿Seguro que deseas eliminar este fanático de la base de datos? Sus mensajes y registros se perderán.")) {
      const nuevosFans = fansRegistrados.filter((f) => f.id !== id);
      setFansRegistrados(nuevosFans);
      localStorage.setItem("eiluve_fans_registrados", JSON.stringify(nuevosFans));
      if (selectedFanId === id) setSelectedFanId(null);
    }
  };

  const exportarAExcel = () => {
    if (fansRegistrados.length === 0) {
      alert("No hay fanáticos registrados para exportar.");
      return;
    }

    const headers = ["ID", "Nombre/Alias", "Correo Electronico", "Telefono", "Pais/Tierra Natal", "Codigo Usado (6 Digitos)", "Tag NFC CD (Fisico)", "Fecha de Registro"];
    
    const rows = fansRegistrados.map((f) => {
      // Buscar en nfcCodes el tag físico asociado a este código de 6 dígitos
      const nfcItem = nfcCodes && nfcCodes.find(
        (n) => n.codigo.toString().trim() === f.codigoUsado.toString().trim()
      );
      const nfcTagIdStr = nfcItem ? nfcItem.nfcId : "Código Maestro";

      return [
        f.id,
        f.nombre,
        f.correo,
        f.telefono || "No especificado",
        f.pais || "Tierra Desconocida",
        f.codigoUsado,
        nfcTagIdStr,
        f.fechaRegistro
      ];
    });

    const csvContent = 
      "\uFEFF" + 
      [headers.join(";"), ...rows.map((row) => row.map((val) => `"${val.toString().replace(/"/g, '""')}"`).join(";"))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `fanaticos_mazmorras_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Agregar o Editar Concierto
  const guardarConcierto = (e) => {
    e.preventDefault();
    if (!cFecha || !cNombre || !cLugar) {
      alert("Por favor rellena los campos esenciales (fecha, nombre, lugar).");
      return;
    }

    let nuevosConciertos;
    if (editId) {
      // Editar concierto existente
      nuevosConciertos = conciertos.map((c) =>
        c.id === editId
          ? {
              ...c,
              fecha: formatearFecha(cFecha),
              fechaCompleta: cFecha,
              hora: cHora,
              nombre: cNombre,
              lugar: cLugar,
              precioGeneral: parseFloat(cPrecioG),
              precioVip: parseFloat(cPrecioV),
              x: parseInt(cX),
              y: parseInt(cY),
              etiqueta: cEtiqueta || cLugar.split(",")[0]
            }
          : c
      );
      setEditId(null);
    } else {
      // Crear nuevo concierto
      const nuevoId = conciertos.length > 0 ? Math.max(...conciertos.map((c) => c.id)) + 1 : 1;
      const nuevoConcierto = {
        id: nuevoId,
        fecha: formatearFecha(cFecha),
        fechaCompleta: cFecha,
        hora: cHora,
        nombre: cNombre,
        lugar: cLugar,
        precioGeneral: parseFloat(cPrecioG),
        precioVip: parseFloat(cPrecioV),
        x: parseInt(cX),
        y: parseInt(cY),
        etiqueta: cEtiqueta || cLugar.split(",")[0]
      };
      nuevosConciertos = [nuevoConcierto, ...conciertos];
    }

    setConciertos(nuevosConciertos);
    localStorage.setItem("eiluve_conciertos", JSON.stringify(nuevosConciertos));
    
    // Limpiar formulario de concierto
    const hoyFormato = (() => {
      const date = new Date();
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    })();
    setCFecha(hoyFormato);
    setCHora("20:00");
    setCNombre("");
    setCLugar("");
    setCPrecioG(25);
    setCPrecioV(60);
    setCX(500);
    setCY(300);
    setCEtiqueta("");
  };

  // Cargar Concierto en Formulario para Editar
  const seleccionarEditar = (c) => {
    setEditId(c.id);
    setCFecha(obtenerFechaFormatoInput(c));
    setCHora(c.hora || "20:00");
    setCNombre(c.nombre);
    setCLugar(c.lugar);
    setCPrecioG(c.precioGeneral);
    setCPrecioV(c.precioVip);
    setCX(c.x);
    setCY(c.y);
    setCEtiqueta(c.etiqueta);
  };

  // Eliminar Concierto
  const eliminarConcierto = (id) => {
    if (confirm("¿Seguro que deseas disolver este concierto de la gira?")) {
      const nuevos = conciertos.filter((c) => c.id !== id);
      setConciertos(nuevos);
      localStorage.setItem("eiluve_conciertos", JSON.stringify(nuevos));
    }
  };

  if (!abierto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#040303]/95 backdrop-blur-xl flex items-center justify-center p-4 overflow-y-auto">
      {/* Botón de Cierre de Modal */}
      <button 
        onClick={alCerrar}
        className="absolute top-6 right-6 text-gray-500 hover:text-white transition-colors text-2xl"
        title="Volver a la arboleda"
      >
        <i className="fas fa-times"></i>
      </button>

      {/* 🔒 1. FORMULARIO DE LOGIN DE LA BANDA */}
      {!logged ? (
        <div className="w-full max-w-md bg-black/60 border border-[#735f3d]/40 p-8 rounded shadow-2xl relative overflow-hidden animate-[scaleUp_0.4s_ease-out_forwards]">
          {/* Filigranas góticas */}
          <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent"></div>
          <div className="text-center mb-6">
            <span className="text-[#fbbf24] text-3xl font-serif block mb-2">ᛉ</span>
            <h3 className="font-serif text-2xl text-[#d1b880] tracking-widest uppercase">Portal del Clan</h3>
            <p className="text-xs text-gray-500 mt-1 uppercase font-mono tracking-wider">Acceso Restringido a Miembros</p>
          </div>

          <form onSubmit={manejarLogin} className="space-y-4">
            <div>
              <label className="text-[10px] text-gray-400 font-mono block uppercase tracking-wider mb-1">Nombre en el Clan (Usuario)</label>
              <input
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                placeholder="Ej: usuario_clan"
                className="w-full bg-black/70 border border-[#735f3d]/30 text-sm text-white p-3 rounded focus:outline-none focus:border-[#fbbf24] transition-colors font-mono"
                required
              />
            </div>
            <div>
              <label className="text-[10px] text-gray-400 font-mono block uppercase tracking-wider mb-1">Palabra Rúnica Clave</label>
              <input
                type="password"
                value={clave}
                onChange={(e) => setClave(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black/70 border border-[#735f3d]/30 text-sm text-white p-3 rounded focus:outline-none focus:border-[#fbbf24] transition-colors"
                required
              />
            </div>

            {errorMsg && (
              <p className="text-red-500 text-xs font-mono text-center bg-red-950/20 py-2 border border-red-900/30 rounded">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-xs uppercase tracking-wider transition-all duration-300 rounded shadow-[0_0_15px_rgba(115,95,61,0.2)]"
            >
              Cruzar el Umbral
            </button>
          </form>
          
          <div className="text-center mt-6 text-[9px] text-gray-500 font-mono tracking-widest space-y-1">
            <div>BSM COMPILER • SECURE RUNE GATEWAY</div>
            <div className="text-[#d1b880]/70">Acceso exclusivo para miembros autorizados del clan</div>
          </div>
        </div>
      ) : (
        /* 🛠️ 2. DASHBOARD DE MIEMBROS DE LA BANDA */
        <div className="w-full max-w-4xl bg-[#090b10] border-2 border-[#735f3d]/40 rounded shadow-2xl p-6 relative flex flex-col min-h-[550px] max-h-[90vh] overflow-hidden animate-[scaleUp_0.4s_ease-out_forwards]">
          <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-[#735f3d] via-[#fbbf24] to-[#8da382]"></div>
          
          {/* Cabecera del Dashboard */}
          <div className="flex flex-wrap justify-between items-center border-b border-[#735f3d]/20 pb-4 mb-6 gap-3">
            <div>
              <h2 className="font-serif text-2xl text-[#d1b880] tracking-widest uppercase flex items-center gap-2">
                <span>Altar del Bardo</span>
                {usuarioActual?.isMaster && <span className="text-xs bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 font-mono">👑 MAESTRO</span>}
              </h2>
              <p className="text-xs text-gray-400 font-mono uppercase mt-1 flex items-center gap-2">
                <span>Sesión: <strong className="text-white">{usuarioActual ? usuarioActual.username : "bsarmientom1993"}</strong></span>
                <span className="text-gray-600">•</span>
                <span className="text-[#8da382]">{usuarioActual ? usuarioActual.nombre : "Administrador Maestro"} ({usuarioActual ? usuarioActual.rol : "Maestro del Portal"})</span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={abrirModalPerfil}
                className="py-1.5 px-3 border border-[#8da382]/40 bg-[#8da382]/10 hover:bg-[#8da382] text-[#8da382] hover:text-black text-xs font-mono rounded transition-all flex items-center gap-1.5 cursor-pointer"
                title="Editar mis datos personales (Nombre, Correo, Teléfono, Contraseña)"
              >
                👤 Mi Perfil
              </button>
              <button
                onClick={cerrarSesionBanda}
                className="py-1.5 px-3.5 border border-red-900/50 bg-red-950/20 hover:bg-red-950 text-red-400 hover:text-red-200 text-xs font-mono rounded transition-all flex items-center gap-1.5"
              >
                🔒 Salir del Portal
              </button>
            </div>
          </div>

          {/* Selector de Pestañas (Tab Control) */}
          <div className="flex flex-wrap gap-2 mb-6 border-b border-[#735f3d]/10 pb-3">
            <button
              onClick={() => setActiveTab("gira")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "gira"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-gray-400 hover:text-white bg-black/40 hover:bg-black/70"
              }`}
            >
              🗺️ Gira y Mapa (La Cacería)
            </button>
            <button
              onClick={() => setActiveTab("bio")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "bio"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-gray-400 hover:text-white bg-black/40 hover:bg-black/70"
              }`}
            >
              📝 La Leyenda (Biografía)
            </button>
            <button
              onClick={() => setActiveTab("links")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "links"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-gray-400 hover:text-white bg-black/40 hover:bg-black/70"
              }`}
            >
              🔗 Redes, Links y Merch
            </button>
            <button
              onClick={() => setActiveTab("cronicas")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "cronicas"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-gray-400 hover:text-white bg-black/40 hover:bg-black/70"
              }`}
            >
              📰 Crónicas / Blog
            </button>
            <button
              onClick={() => setActiveTab("mazmorras")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "mazmorras"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-gray-400 hover:text-white bg-black/40 hover:bg-black/70"
              }`}
            >
              🏰 Mazmorras
            </button>
            <button
              onClick={() => setActiveTab("fans")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "fans"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-gray-400 hover:text-white bg-black/40 hover:bg-black/70"
              }`}
            >
              📬 Fanáticos y Misivas
            </button>
            <button
              onClick={() => setActiveTab("cuervos")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all ${
                activeTab === "cuervos"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-gray-400 hover:text-white bg-black/40 hover:bg-black/70"
              }`}
            >
              📨 Mensajes de Contacto
            </button>
            {/* Solo visible para el usuario maestro bsarmientom1993 */}
            {usuarioActual?.isMaster && (
              <button
                onClick={() => setActiveTab("usuarios")}
                className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                  activeTab === "usuarios"
                    ? "bg-[#735f3d] text-white shadow"
                    : "text-[#d1b880] hover:text-white bg-black/40 hover:bg-black/70 border border-[#735f3d]/30"
                }`}
              >
                👥 Usuarios y Permisos <span className="text-[9px] bg-amber-500 text-black px-1 rounded font-bold">Maestro</span>
              </button>
            )}
            <button
              onClick={() => setActiveTab("bitacora")}
              className={`py-2 px-4 rounded text-xs font-mono uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                activeTab === "bitacora"
                  ? "bg-[#735f3d] text-white shadow"
                  : "text-[#8da382] hover:text-white bg-black/40 hover:bg-black/70 border border-[#8da382]/30"
              }`}
            >
              📜 Log de Auditoría ({logsAuditoria.length})
            </button>
          </div>

          {/* Contenedor Principal de la Pestaña Activa con scroll independiente */}
          <div className="flex-grow overflow-y-auto pr-2 space-y-6">

            {/* TAB 1: GIRA Y FECHAS (Mapa del tesoro) */}
            {activeTab === "gira" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Formulario Agregar/Editar */}
                <form onSubmit={guardarConcierto} className="lg:col-span-5 bg-black/40 p-4 border border-[#735f3d]/20 rounded space-y-3">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">
                    {editId ? "🖋️ Editar Concierto" : "➕ Tallar Nuevo Concierto"}
                  </h4>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="text-[9px] text-[#fbbf24] font-mono uppercase block">Fecha (Calendario)</label>
                      <input
                        type="date"
                        value={cFecha}
                        onChange={(e) => setCFecha(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-[10px] text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] scheme-dark"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-[#fbbf24] font-mono uppercase block">Hora (Taberna)</label>
                      <input
                        type="time"
                        value={cHora}
                        onChange={(e) => setCHora(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-[10px] text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] scheme-dark"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono uppercase block">Etiqueta Mapa</label>
                      <input
                        type="text"
                        value={cEtiqueta}
                        onChange={(e) => setCEtiqueta(e.target.value)}
                        placeholder="Vigo"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-[10px] text-white p-2 rounded focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-mono block">Nombre del Ritual / Festival</label>
                    <input
                      type="text"
                      value={cNombre}
                      onChange={(e) => setCNombre(e.target.value)}
                      placeholder="Celtica Rock"
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-mono block">Ubicación / Lugar (Ciudad, País)</label>
                    <input
                      type="text"
                      value={cLugar}
                      onChange={(e) => setCLugar(e.target.value)}
                      placeholder="Vigo, España"
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Precio Gral (€)</label>
                      <input
                        type="number"
                        value={cPrecioG}
                        onChange={(e) => setCPrecioG(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Precio VIP (€)</label>
                      <input
                        type="number"
                        value={cPrecioV}
                        onChange={(e) => setCPrecioV(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-[#735f3d]/10 pt-2">
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Mapa Coordenada X (0-1000)</label>
                      <input
                        type="number"
                        value={cX}
                        onChange={(e) => setCX(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                        min="0"
                        max="1000"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Mapa Coordenada Y (0-600)</label>
                      <input
                        type="number"
                        value={cY}
                        onChange={(e) => setCY(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                        min="0"
                        max="600"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-grow py-2 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-[10px] uppercase rounded transition-all"
                    >
                      {editId ? "Confirmar Edición" : "Inscribir en la Gira"}
                    </button>
                    {editId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditId(null);
                          const hoyFormato = (() => {
                            const date = new Date();
                            const yyyy = date.getFullYear();
                            const mm = String(date.getMonth() + 1).padStart(2, "0");
                            const dd = String(date.getDate()).padStart(2, "0");
                            return `${yyyy}-${mm}-${dd}`;
                          })();
                          setCFecha(hoyFormato);
                          setCHora("20:00");
                          setCNombre("");
                          setCLugar("");
                          setCPrecioG(25);
                          setCPrecioV(60);
                          setCX(500);
                          setCY(300);
                          setCEtiqueta("");
                        }}
                        className="py-2 px-3 bg-gray-800 text-gray-300 hover:bg-gray-700 text-[10px] font-mono rounded"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>
 
                {/* Tabla de Conciertos actuales */}
                <div className="lg:col-span-7 space-y-2">
                  <h4 className="text-[#d1b880] text-xs font-mono uppercase tracking-wider">Fechas Vigentes</h4>
                  <div className="border border-[#735f3d]/20 rounded overflow-hidden bg-black/20">
                    <div className="max-h-[300px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-black/50 text-[#735f3d] font-mono border-b border-[#735f3d]/20">
                            <th className="p-3 uppercase">Fecha / Hora</th>
                            <th className="p-3 uppercase">Ritual / Ciudad</th>
                            <th className="p-3 uppercase">Precios</th>
                            <th className="p-3 uppercase">Mapa (X, Y)</th>
                            <th className="p-3 text-right uppercase">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {conciertos.map((c) => (
                            <tr key={c.id} className="border-b border-[#735f3d]/10 hover:bg-black/40 text-gray-300">
                              <td className="p-3 font-bold text-white whitespace-nowrap">{c.fecha} {c.hora ? `(${c.hora})` : ""}</td>
                              <td className="p-3">
                                <div className="font-bold">{c.nombre}</div>
                                <div className="text-gray-500 text-[10px]">{c.lugar}</div>
                              </td>
                              <td className="p-3 font-mono">
                                <span className="text-emerald-500">{c.precioGeneral}€</span> / <span className="text-cyan-500">{c.precioVip}€</span>
                              </td>
                              <td className="p-3 font-mono text-[10px] text-gray-500">
                                {c.x}, {c.y}
                              </td>
                              <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                <button
                                  onClick={() => seleccionarEditar(c)}
                                  className="text-cyan-400 hover:text-cyan-200 transition-colors"
                                  title="Editar"
                                >
                                  <i className="fas fa-edit"></i>
                                </button>
                                <button
                                  onClick={() => eliminarConcierto(c.id)}
                                  className="text-red-500 hover:text-red-300 transition-colors"
                                  title="Eliminar"
                                >
                                  <i className="fas fa-trash-alt"></i>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: BIOGRAFÍA Y HISTORIA */}
            {activeTab === "bio" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono block uppercase mb-1">Título de Sección</label>
                    <input
                      type="text"
                      value={bioTitulo}
                      onChange={(e) => setBioTitulo(e.target.value)}
                      placeholder="La Leyenda"
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-3 rounded focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-gray-400 font-mono block uppercase mb-1">Cita Destacada</label>
                    <input
                      type="text"
                      value={bioCita}
                      onChange={(e) => setBioCita(e.target.value)}
                      placeholder='"Cuentos de esqueletos..."'
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-3 rounded focus:outline-none focus:border-[#fbbf24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 font-mono block uppercase mb-1">Historia del Clan (Texto principal)</label>
                  <textarea
                    value={bioHistoria}
                    onChange={(e) => setBioHistoria(e.target.value)}
                    rows="5"
                    className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-3 rounded focus:outline-none focus:border-[#fbbf24] resize-none"
                    placeholder="Invocamos la furia del metal..."
                  ></textarea>
                </div>

                {/* Gestor Dinámico de Integrantes (Destacados de la Banda) */}
                <div className="bg-black/20 p-4 border border-[#735f3d]/15 rounded space-y-4">
                  <h4 className="text-[#fbbf24] text-[10px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1">👥 Integrantes de la Banda (Firma en Biografía)</h4>
                  
                  {/* Lista de Integrantes Actuales */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {destacados.map((item, index) => {
                      const esEditando = editIntegranteIndex === index;
                      return (
                        <div 
                          key={index} 
                          className={`flex items-center justify-between bg-black/40 p-3 rounded border transition-all ${
                            esEditando ? "border-[#fbbf24] shadow-[0_0_8px_rgba(251,191,36,0.3)] bg-black/70" : "border-[#735f3d]/10"
                          }`} 
                          style={{ borderLeft: `3px solid ${item.colorBorde || "#735f3d"}` }}
                        >
                          <div>
                            <p className="font-bold text-white text-xs">{item.titulo}</p>
                            <p className="text-[10px] text-[#735f3d]">{item.subtitulo}</p>
                          </div>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => seleccionarEditarIntegrante(index)}
                              className="text-[#fbbf24] hover:text-white text-[10px] font-bold font-mono uppercase px-2 py-1 rounded hover:bg-black/50"
                            >
                              Editar
                            </button>
                            <button
                              type="button"
                              onClick={() => eliminarIntegrante(index)}
                              className="text-red-400 hover:text-red-600 text-[10px] font-bold font-mono uppercase px-2 py-1 rounded hover:bg-red-950/20"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Formulario para Añadir / Editar Integrante */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Nombre / Título</label>
                      <input
                        type="text"
                        value={nuevoDestTitulo}
                        onChange={(e) => setNuevoDestTitulo(e.target.value)}
                        placeholder="Valerius"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Rol / Subtítulo</label>
                      <input
                        type="text"
                        value={nuevoDestSubtitulo}
                        onChange={(e) => setNuevoDestSubtitulo(e.target.value)}
                        placeholder="Voz y Zanfoña"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Color Rúnico</label>
                      <div className="flex gap-2">
                        <select
                          value={nuevoDestColor}
                          onChange={(e) => setNuevoDestColor(e.target.value)}
                          className="flex-grow bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                        >
                          <option value="#735f3d">Dorado Bronce</option>
                          <option value="#8da382">Verde Musgo</option>
                          <option value="#4f46e5">Azul Rúnico</option>
                          <option value="#dc2626">Fuego Ancestral</option>
                          <option value="#06b6d4">Hielo Glacial</option>
                        </select>
                        <button
                          type="button"
                          onClick={agregarIntegrante}
                          className="px-4 py-2 bg-[#fbbf24] text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-all hover:bg-white flex-shrink-0"
                        >
                          {editIntegranteIndex !== null ? "Guardar" : "Añadir"}
                        </button>
                        {editIntegranteIndex !== null && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditIntegranteIndex(null);
                              setNuevoDestTitulo("");
                              setNuevoDestSubtitulo("");
                              setNuevoDestColor("#735f3d");
                            }}
                            className="px-3 py-2 bg-gray-800 text-white font-bold font-mono text-xs uppercase tracking-wider rounded transition-all hover:bg-gray-700 flex-shrink-0"
                          >
                            X
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex gap-4">
                  <button
                    type="button"
                    onClick={guardarBio}
                    className="py-2.5 px-6 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-all"
                  >
                    Guardar Leyenda y Biografía
                  </button>
                </div>

                {/* Gestor Dinámico de Frases de Pantalla de Carga */}
                <div className="bg-black/20 p-4 border border-[#735f3d]/15 rounded space-y-4">
                  <h4 className="text-[#fbbf24] text-[10px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1">⏳ Frases de la Pantalla de Carga</h4>
                  
                  {/* Lista de Frases */}
                  <div className="max-h-[160px] overflow-y-auto space-y-2 pr-1">
                    {frases.map((fraseStr, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/40 p-2 rounded border border-[#735f3d]/10">
                        <span className="text-xs text-gray-300 font-sans truncate mr-2">{fraseStr}</span>
                        <button
                          type="button"
                          onClick={() => eliminarFrase(index)}
                          className="text-red-400 hover:text-red-600 text-[10px] font-bold font-mono uppercase px-2 py-1 rounded hover:bg-red-950/20"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Formulario para Añadir Frase */}
                  <div className="flex gap-2 pt-2">
                    <input
                      type="text"
                      value={nuevaFrase}
                      onChange={(e) => setNuevaFrase(e.target.value)}
                      placeholder="Escribe una nueva profecía o relato..."
                      className="flex-grow bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={agregarFrase}
                      className="py-2 px-6 bg-[#fbbf24] text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-all hover:bg-white"
                    >
                      Inscribir Frase
                    </button>
                  </div>
                </div>

                <div className="border-t border-[#735f3d]/20 pt-4 mt-6">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider mb-3">🏠 Presentación de Página Principal (Hero)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="text-[10px] text-gray-400 font-mono block uppercase mb-1">Título Hero</label>
                      <input
                        type="text"
                        value={presTitulo}
                        onChange={(e) => setPresTitulo(e.target.value)}
                        placeholder="FOLK METAL"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-3 rounded focus:outline-none focus:border-[#fbbf24]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-mono block uppercase mb-1">Subtítulo 1</label>
                      <input
                        type="text"
                        value={presSub1}
                        onChange={(e) => setPresSub1(e.target.value)}
                        placeholder="Desde el Bosque"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-3 rounded focus:outline-none focus:border-[#fbbf24]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-gray-400 font-mono block uppercase mb-1">Subtítulo 2</label>
                      <input
                        type="text"
                        value={presSub2}
                        onChange={(e) => setPresSub2(e.target.value)}
                        placeholder="Para el Mundo"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-3 rounded focus:outline-none focus:border-[#fbbf24]"
                      />
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="text-[10px] text-gray-400 font-mono block uppercase mb-1">Descripción Hero</label>
                    <textarea
                      value={presDesc}
                      onChange={(e) => setPresDesc(e.target.value)}
                      rows="3"
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-3 rounded focus:outline-none focus:border-[#fbbf24] resize-none"
                      placeholder="Eiluvë es folk metal..."
                    ></textarea>
                  </div>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={guardarPresentacion}
                      className="py-2.5 px-6 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-all"
                    >
                      Guardar Textos Principales
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: REDES SOCIALES Y FOTOS */}
            {activeTab === "links" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Streaming e Integraciones */}
                  <div className="bg-black/20 p-4 border border-[#735f3d]/15 rounded space-y-3">
                    <h4 className="text-[#fbbf24] text-[10px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">🔗 Enlaces de Streaming</h4>
                    
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Spotify URL</label>
                      <input
                        type="url"
                        value={linkSpotify}
                        onChange={(e) => setLinkSpotify(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">YouTube URL</label>
                      <input
                        type="url"
                        value={linkYoutube}
                        onChange={(e) => setLinkYoutube(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Apple Music URL</label>
                      <input
                        type="url"
                        value={linkApple}
                        onChange={(e) => setLinkApple(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Enlace "Escuchar Álbum" (Widgets)</label>
                      <input
                        type="url"
                        value={linkAlbum}
                        onChange={(e) => setLinkAlbum(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Video del Ritual (YouTube Link/ID)</label>
                      <input
                        type="text"
                        value={linkVideo}
                        onChange={(e) => setLinkVideo(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=iijKLHCQw5g"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>
                  </div>

                  {/* Redes Sociales e Imágenes */}
                  <div className="bg-black/20 p-4 border border-[#735f3d]/15 rounded space-y-3">
                    <h4 className="text-[#8da382] text-[10px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">📱 Redes Sociales</h4>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Instagram URL</label>
                      <input
                        type="url"
                        value={linkInstagram}
                        onChange={(e) => setLinkInstagram(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Facebook URL</label>
                      <input
                        type="url"
                        value={linkFacebook}
                        onChange={(e) => setLinkFacebook(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">TikTok URL</label>
                      <input
                        type="url"
                        value={linkTiktok}
                        onChange={(e) => setLinkTiktok(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Rutas de Fotos */}
                <div className="bg-black/20 p-4 border border-[#735f3d]/15 rounded space-y-3">
                  <h4 className="text-[#fbbf24] text-[10px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">🖼️ Fotos del Portal</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Ruta de Foto de la Banda (Biografía)</label>
                      <input
                        type="text"
                        value={bioImg}
                        onChange={(e) => setBioImg(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Ruta de Ilustración Héroe (Fondo Principal)</label>
                      <input
                        type="text"
                        value={heroBgPath}
                        onChange={(e) => setHeroBgPath(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Merch Oficial */}
                <div className="bg-black/20 p-4 border border-[#735f3d]/15 rounded space-y-3">
                  <h4 className="text-[#8da382] text-[10px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">👕 Merchandising Oficial (Widget 4)</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Ruta de Imagen de Merch (ej: /merch_preview.png)</label>
                      <input
                        type="text"
                        value={merchImgPath}
                        onChange={(e) => setMerchImgPath(e.target.value)}
                        placeholder="/merch_preview.png"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Enlace de Destino (ej: #contacto o URL externa)</label>
                      <input
                        type="text"
                        value={merchLinkPath}
                        onChange={(e) => setMerchLinkPath(e.target.value)}
                        placeholder="#contacto"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={guardarMerch}
                      className="py-2.5 px-6 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-all"
                    >
                      Guardar Merchandising
                    </button>
                  </div>
                </div>

                {/* Galería Dinámica */}
                <div className="bg-black/20 p-4 border border-[#735f3d]/15 rounded space-y-4">
                  <h4 className="text-[#fbbf24] text-[10px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1">📸 Mini Galería del Clan (Lectura Biografía)</h4>
                  
                  {/* Lista de Fotos en la Galería */}
                  <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                    {galeria.map((foto, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/40 p-2 rounded border border-[#735f3d]/10">
                        <span className="text-xs text-gray-300 font-mono truncate mr-2">{foto}</span>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = galeria.filter((_, i) => i !== index);
                            setGaleria(updated);
                            localStorage.setItem("eiluve_galeria", JSON.stringify(updated));
                          }}
                          className="text-red-400 hover:text-red-600 text-xs font-bold font-mono uppercase px-2 py-0.5 rounded hover:bg-red-950/20"
                        >
                          Eliminar
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Formulario para Añadir Foto */}
                  <div className="flex gap-2 pt-2 border-t border-[#735f3d]/10">
                    <input
                      type="text"
                      value={nuevaFotoRuta}
                      onChange={(e) => setNuevaFotoRuta(e.target.value)}
                      placeholder="Añadir ruta (ej: /Somos todos.jpg)"
                      className="flex-grow bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (!nuevaFotoRuta.trim()) return;
                        const updated = [...galeria, nuevaFotoRuta.trim()];
                        setGaleria(updated);
                        localStorage.setItem("eiluve_galeria", JSON.stringify(updated));
                        setNuevaFotoRuta("");
                      }}
                      className="py-2 px-6 bg-[#fbbf24] text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-all hover:bg-white"
                    >
                      Añadir Foto
                    </button>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="button"
                    onClick={guardarLinks}
                    className="py-2.5 px-6 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-xs uppercase tracking-wider rounded transition-all"
                  >
                    Guardar Enlaces y Fotos
                  </button>
                </div>
              </div>
            )}

            {/* TAB 4: CRÓNICAS / BLOG */}
            {activeTab === "cronicas" && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start animate-[fadeIn_0.3s_ease-out]">
                {/* Formulario de agregar/editar noticia */}
                <form 
                  id="form-cronica" 
                  onSubmit={guardarNoticia} 
                  className={`lg:col-span-5 bg-black/40 p-4 border rounded space-y-3 transition-all ${
                    editNoticiaId ? "border-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.25)] bg-black/65" : "border-[#735f3d]/20"
                  }`}
                >
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">
                    {editNoticiaId ? "🖋️ Editar Crónica" : "📰 Redactar Nueva Crónica"}
                  </h4>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono uppercase block">Seleccionar Fecha</label>
                      <input
                        type="date"
                        value={convertirMedievalAFechaInput(noticiaFecha)}
                        onChange={(e) => setNoticiaFecha(convertirFechaInputAMedieval(e.target.value))}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-[9px] text-gray-400 font-mono uppercase block">Categoría (ej: LANZAMIENTO)</label>
                      <select
                        value={noticiaCat}
                        onChange={(e) => setNoticiaCat(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      >
                        <option value="LANZAMIENTO">LANZAMIENTO</option>
                        <option value="RODAJE">RODAJE</option>
                        <option value="ENTREVISTA">ENTREVISTA</option>
                        <option value="CONCIERTO">CONCIERTO</option>
                        <option value="OTRO">OTRO</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-mono block">Título de la Crónica</label>
                    <input
                      type="text"
                      value={noticiaTitulo}
                      onChange={(e) => setNoticiaTitulo(e.target.value)}
                      placeholder="Detalles exclusivos..."
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-mono block">Ruta de Imagen (ej: /album_cover2.jpg)</label>
                    <input
                      type="text"
                      value={noticiaImg}
                      onChange={(e) => setNoticiaImg(e.target.value)}
                      placeholder="/album_cover2.jpg"
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-mono block">Resumen Breve (Párrafo de entrada)</label>
                    <input
                      type="text"
                      value={noticiaResumen}
                      onChange={(e) => setNoticiaResumen(e.target.value)}
                      placeholder="Resumen corto..."
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[9px] text-gray-400 font-mono block">Contenido Escrito (Cuerpo completo)</label>
                    <textarea
                      value={noticiaContenido}
                      onChange={(e) => setNoticiaContenido(e.target.value)}
                      rows="4"
                      placeholder="Escribe el cuerpo del relato aquí..."
                      className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none resize-none"
                      required
                    ></textarea>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-grow py-2 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-[10px] uppercase rounded transition-all"
                    >
                      {editNoticiaId ? "Guardar Edición" : "Publicar Crónica"}
                    </button>
                    {editNoticiaId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditNoticiaId(null);
                          setNoticiaFecha("");
                          setNoticiaCat("LANZAMIENTO");
                          setNoticiaTitulo("");
                          setNoticiaImg("");
                          setNoticiaResumen("");
                          setNoticiaContenido("");
                        }}
                        className="py-2 px-3 bg-gray-800 text-gray-300 hover:bg-gray-700 text-[10px] font-mono rounded"
                      >
                        Cancelar
                      </button>
                    )}
                  </div>
                </form>

                {/* Lista de crónicas actuales */}
                <div className="lg:col-span-7 space-y-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-[#d1b880] text-xs font-mono uppercase tracking-wider">Crónicas Vigentes</h4>
                    <span className="text-[9px] text-[#8da382] font-mono">↕️ Arrastra las filas para reordenar</span>
                  </div>
                  <div className="border border-[#735f3d]/20 rounded overflow-hidden bg-black/20">
                    <div className="max-h-[350px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-black/50 text-[#735f3d] font-mono border-b border-[#735f3d]/20">
                            <th className="p-3 uppercase">Fecha/Categoría</th>
                            <th className="p-3 uppercase">Título / Vista</th>
                            <th className="p-3 text-right uppercase">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {noticias.map((n, index) => {
                            const esArrastrado = draggedIndex === index;
                            return (
                              <tr 
                                key={n.id} 
                                draggable="true"
                                onDragStart={(e) => handleDragStartNoticia(e, index)}
                                onDragOver={handleDragOverNoticia}
                                onDrop={(e) => handleDropNoticia(e, index)}
                                onDragEnd={handleDragEndNoticia}
                                className={`border-b border-[#735f3d]/10 hover:bg-black/40 text-gray-300 cursor-move transition-all duration-150 ${
                                  esArrastrado ? "opacity-30 bg-black/60 scale-[0.98]" : ""
                                }`}
                              >
                                <td className="p-3 font-mono whitespace-nowrap">
                                  <div className="flex items-center gap-2 select-none">
                                    <i className="fas fa-grip-lines text-[#735f3d]/50 text-xs"></i>
                                    <div>
                                      <div className="font-bold text-white">{n.fecha}</div>
                                      <div className="text-[10px] text-[#fbbf24]">{n.categoria}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="p-3">
                                  <div className="font-bold truncate max-w-[280px]">{n.titulo}</div>
                                  <div className="text-gray-500 text-[10px] truncate max-w-[280px]">{n.resumen}</div>
                                </td>
                                <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                  <button
                                    onClick={() => seleccionarEditarNoticia(n)}
                                    className="text-cyan-400 hover:text-cyan-200 transition-colors"
                                    title="Editar"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() => eliminarNoticia(n.id)}
                                    className="text-red-500 hover:text-red-300 transition-colors"
                                    title="Eliminar"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: MAZMORRAS */}
            {activeTab === "mazmorras" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                
                {/* Código de desbloqueo (Passcode) */}
                <form onSubmit={guardarPasscode} className="bg-black/40 p-4 border border-[#735f3d]/20 rounded space-y-3">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">🔑 Llave del Sello (Código de Acceso a Mazmorras)</h4>
                  <div className="flex gap-4 items-end max-w-md">
                    <div className="flex-grow">
                      <label className="text-[9px] text-gray-400 font-mono block">Código Secreto (por defecto: bsm669)</label>
                      <input
                        type="text"
                        value={mPasscode}
                        onChange={(e) => setMPasscode(e.target.value)}
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className="py-2.5 px-4 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-[10px] uppercase rounded transition-all"
                    >
                      Actualizar Sello
                    </button>
                  </div>
                </form>

                {/* Gestión de Integrantes de la Banda en Mazmorras */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Formulario integrante */}
                  <form onSubmit={guardarMiembro} className="lg:col-span-5 bg-black/40 p-4 border border-[#735f3d]/20 rounded space-y-3">
                    <h4 className="text-[#8da382] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">
                      {editMiembroId ? "🖋️ Editar Integrante" : "➕ Invocar Integrante"}
                    </h4>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Nombre</label>
                        <input
                          type="text"
                          value={mNombre}
                          onChange={(e) => setMNombre(e.target.value)}
                          placeholder="Valerius"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Ave Mensajera</label>
                        <select
                          value={mMensajero}
                          onChange={(e) => setMMensajero(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none"
                        >
                          <option value="Cuervo Rúnico">Cuervo Rúnico</option>
                          <option value="Halcón Peregrino">Halcón Peregrino</option>
                          <option value="Lechuza de Nieve">Lechuza de Nieve</option>
                          <option value="Águila Dorada">Águila Dorada</option>
                          <option value="Gran Búho Real">Gran Búho Real</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Rol en la Banda</label>
                      <input
                        type="text"
                        value={mRol}
                        onChange={(e) => setMRol(e.target.value)}
                        placeholder="El Bardo (Voz y Zanfoña)"
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[9px] text-gray-400 font-mono block">Descripción/Historia (Para envío de misivas)</label>
                      <textarea
                        value={mDesc}
                        onChange={(e) => setMDesc(e.target.value)}
                        rows="3"
                        placeholder="El guardián de los manuscritos..."
                        className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded resize-none"
                        required
                      ></textarea>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="submit"
                        className="flex-grow py-2 bg-[#735f3d] text-white hover:bg-[#fbbf24] hover:text-black font-bold font-mono text-[10px] uppercase rounded transition-all"
                      >
                        {editMiembroId ? "Guardar Cambios" : "Añadir Integrante"}
                      </button>
                      {editMiembroId && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditMiembroId(null);
                            setMNombre("");
                            setMRol("");
                            setMDesc("");
                            setMMensajero("Cuervo Rúnico");
                          }}
                          className="py-2 px-3 bg-gray-800 text-gray-300 hover:bg-gray-700 text-[10px] font-mono rounded"
                        >
                          Cancelar
                        </button>
                      )}
                    </div>
                  </form>

                  {/* Tabla integrantes actuales */}
                  <div className="lg:col-span-7 space-y-2">
                    <h4 className="text-[#d1b880] text-xs font-mono uppercase tracking-wider">Integrantes del Templo</h4>
                    <div className="border border-[#735f3d]/20 rounded overflow-hidden bg-black/20">
                      <div className="max-h-[300px] overflow-y-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-black/50 text-[#735f3d] font-mono border-b border-[#735f3d]/20">
                              <th className="p-3 uppercase">Nombre/Mensajero</th>
                              <th className="p-3 uppercase">Rol / Historia</th>
                              <th className="p-3 text-right uppercase">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(mazmorrasData?.miembros || []).map((m) => (
                              <tr key={m.id} className="border-b border-[#735f3d]/10 hover:bg-black/40 text-gray-300">
                                <td className="p-3 whitespace-nowrap">
                                  <div className="font-bold text-white">{m.nombre}</div>
                                  <div className="text-[10px] text-gray-500 font-mono">{m.mensajero || m.messenger}</div>
                                </td>
                                <td className="p-3">
                                  <div className="font-bold text-[#fbbf24]">{m.rol}</div>
                                  <div className="text-gray-500 text-[10px] truncate max-w-[200px]">{m.desc}</div>
                                </td>
                                <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                  <button
                                    onClick={() => seleccionarEditarMiembro(m)}
                                    className="text-cyan-400 hover:text-cyan-200 transition-colors"
                                    title="Editar"
                                  >
                                    <i className="fas fa-edit"></i>
                                  </button>
                                  <button
                                    onClick={() => eliminarMiembro(m.id)}
                                    className="text-red-500 hover:text-red-300 transition-colors"
                                    title="Eliminar"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🎶 Directorio de Canciones de las Mazmorras */}
                <div className="border-t border-[#735f3d]/20 pt-6">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider mb-4">🎶 Directorio de Canciones de las Mazmorras</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Formulario Canción */}
                    <form onSubmit={guardarCancionDungeon} className="lg:col-span-5 bg-black/40 p-4 border border-[#735f3d]/20 rounded space-y-3">
                      <h5 className="text-[#8da382] text-[11px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">
                        {editCancionId ? "🖋️ Editar Canción" : "➕ Añadir Canción"}
                      </h5>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Título de la Canción</label>
                        <input
                          type="text"
                          value={cTitulo}
                          onChange={(e) => setCTitulo(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: Somos todos"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-gray-400 font-mono block">Categoría / Tipo</label>
                          <input
                            type="text"
                            value={cTipo}
                            onChange={(e) => setCTipo(e.target.value)}
                            className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                            placeholder="Ej: Álbum Oficial, Demo, Inédita"
                          />
                        </div>
                        <div>
                          <label className="text-[9px] text-gray-400 font-mono block">Duración</label>
                          <input
                            type="text"
                            value={cDuracion}
                            onChange={(e) => setCDuracion(e.target.value)}
                            className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                            placeholder="Ej: 5:44"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Ruta del Archivo de Audio (MP3)</label>
                        <input
                          type="text"
                          value={cEnlace}
                          onChange={(e) => setCEnlace(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: /Somos todos.mp3 o URL"
                          required
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-grow py-2 bg-[#735f3d]/40 hover:bg-[#735f3d]/80 border border-[#d1b880]/30 text-white font-mono text-[10px] uppercase rounded transition-colors"
                        >
                          {editCancionId ? "Guardar Cambios" : "Añadir a las Mazmorras"}
                        </button>
                        {editCancionId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditCancionId(null);
                              setCTitulo("");
                              setCTipo("Álbum Oficial");
                              setCEnlace("");
                              setCDuracion("");
                            }}
                            className="py-2 px-3 bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 font-mono text-[10px] uppercase rounded transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Tabla de Canciones */}
                    <div className="lg:col-span-7 space-y-2">
                      <div className="border border-[#735f3d]/20 rounded overflow-hidden bg-black/20">
                        <div className="max-h-[250px] overflow-y-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-black/50 text-[#735f3d] font-mono border-b border-[#735f3d]/20">
                                <th className="p-3 uppercase">Pista</th>
                                <th className="p-3 uppercase">Ruta / Duración</th>
                                <th className="p-3 text-right uppercase">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(mazmorrasData?.canciones || [
                                { id: 1, titulo: "Somos todos", tipo: "Álbum Oficial", enlace: "/Somos todos.mp3", duracion: "6:12" },
                                { id: 2, titulo: "Tú Voz (Demo Acústica)", tipo: "Maqueta Inédita", enlace: "/Tu voz.mp3", duracion: "7:05" },
                                { id: 3, titulo: "Quizás mañana", tipo: "Álbum Oficial", enlace: "/Quizas mañana.mp3", duracion: "5:44" },
                                { id: 4, titulo: "El matriqui del diablo", tipo: "Álbum Oficial", enlace: "/El matriqui del diablo.mp3", duracion: "5:44" }
                              ]).map((c) => (
                                <tr key={c.id} className="border-b border-[#735f3d]/10 hover:bg-black/40 text-gray-300">
                                  <td className="p-3">
                                    <div className="font-bold text-white">{c.titulo}</div>
                                    <div className="text-[10px] text-amber-500/85 font-mono">{c.tipo}</div>
                                  </td>
                                  <td className="p-3">
                                    <div className="text-gray-500 font-mono truncate max-w-[180px]" title={c.enlace}>{c.enlace}</div>
                                    <div className="text-[10px] text-gray-400">{c.duracion}</div>
                                  </td>
                                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                    <button
                                      onClick={() => seleccionarEditarCancion(c)}
                                      className="text-cyan-400 hover:text-cyan-200 transition-colors"
                                      title="Editar"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => eliminarCancionDungeon(c.id)}
                                      className="text-red-500 hover:text-red-300 transition-colors"
                                      title="Eliminar"
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 📸 Fotografías Inéditas */}
                <div className="border-t border-[#735f3d]/20 pt-6">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider mb-4">🖼️ Fotografías Inéditas (Galería Privada)</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Formulario Foto */}
                    <form onSubmit={guardarFotoDungeon} className="lg:col-span-5 bg-black/40 p-4 border border-[#735f3d]/20 rounded space-y-3">
                      <h5 className="text-[#8da382] text-[11px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">
                        {editFotoId ? "🖋️ Editar Foto" : "➕ Añadir Foto"}
                      </h5>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Título de la Foto</label>
                        <input
                          type="text"
                          value={fTitulo}
                          onChange={(e) => setFTitulo(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: Ensayo Nocturno"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Descripción / Detalle</label>
                        <input
                          type="text"
                          value={fDescripcion}
                          onChange={(e) => setFDescripcion(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: Tras bambalinas en el concierto ritual."
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Ruta de la Imagen (JPG/PNG)</label>
                        <input
                          type="text"
                          value={fSrc}
                          onChange={(e) => setFSrc(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: /Somos todos.jpg o URL"
                          required
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-grow py-2 bg-[#735f3d]/40 hover:bg-[#735f3d]/80 border border-[#d1b880]/30 text-white font-mono text-[10px] uppercase rounded transition-colors"
                        >
                          {editFotoId ? "Guardar Cambios" : "Añadir Imagen"}
                        </button>
                        {editFotoId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditFotoId(null);
                              setFTitulo("");
                              setFDescripcion("");
                              setFSrc("");
                            }}
                            className="py-2 px-3 bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 font-mono text-[10px] uppercase rounded transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Tabla de Fotos */}
                    <div className="lg:col-span-7 space-y-2">
                      <div className="border border-[#735f3d]/20 rounded overflow-hidden bg-black/20">
                        <div className="max-h-[250px] overflow-y-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-black/50 text-[#735f3d] font-mono border-b border-[#735f3d]/20">
                                <th className="p-3 uppercase">Vista</th>
                                <th className="p-3 uppercase">Detalle / Ruta</th>
                                <th className="p-3 text-right uppercase">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(mazmorrasData?.fotos || [
                                { id: 1, titulo: "Retrato del Bardo", descripcion: "Sesión conceptual con zanfoña en el robledal sagrado.", src: "/Somos todos.jpg" },
                                { id: 2, titulo: "El Cónclave Secreto", descripcion: "Ensayo nocturno a la luz de las antorchas.", src: "/Tu voz.jpg" },
                                { id: 3, titulo: "La Ofrenda al Bosque", descripcion: "Detalle del altar rúnico tallado para la portada.", src: "/Quizas mañana.jpg" },
                                { id: 4, titulo: "La Senda del Fuego", descripcion: "Boceto cromático descartado para el Ritual.", src: "/El matriqui del diablo.jpg" }
                              ]).map((f) => (
                                <tr key={f.id} className="border-b border-[#735f3d]/10 hover:bg-black/40 text-gray-300">
                                  <td className="p-3 whitespace-nowrap">
                                    <div className="flex items-center gap-2">
                                      <div className="w-10 h-10 rounded border border-[#735f3d]/30 overflow-hidden relative bg-black">
                                        <img src={f.src} alt={f.titulo} className="w-full h-full object-cover" />
                                      </div>
                                      <div className="font-bold text-white">{f.titulo}</div>
                                    </div>
                                  </td>
                                  <td className="p-3">
                                    <div className="text-[10px] text-gray-400">{f.descripcion}</div>
                                    <div className="text-[10px] text-gray-500 font-mono truncate max-w-[180px]">{f.src}</div>
                                  </td>
                                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                    <button
                                      onClick={() => seleccionarEditarFoto(f)}
                                      className="text-cyan-400 hover:text-cyan-200 transition-colors"
                                      title="Editar"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => eliminarFotoDungeon(f.id)}
                                      className="text-red-500 hover:text-red-300 transition-colors"
                                      title="Eliminar"
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🎬 Clips de Vídeo Inéditos */}
                <div className="border-t border-[#735f3d]/20 pt-6">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider mb-4">🎥 Clips de Vídeo Inéditos</h4>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Formulario Video */}
                    <form onSubmit={guardarVideoDungeon} className="lg:col-span-5 bg-black/40 p-4 border border-[#735f3d]/20 rounded space-y-3">
                      <h5 className="text-[#8da382] text-[11px] font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-2">
                        {editVideoId ? "🖋️ Editar Vídeo" : "➕ Añadir Vídeo"}
                      </h5>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Título del Vídeo</label>
                        <input
                          type="text"
                          value={vTitulo}
                          onChange={(e) => setVTitulo(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: Ensayos bajo la Bruma"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Descripción</label>
                        <input
                          type="text"
                          value={vDescripcion}
                          onChange={(e) => setVDescripcion(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: Detrás de cámaras de la grabación."
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">URL de Inserción (YouTube Embed URL)</label>
                        <input
                          type="text"
                          value={vVideoUrl}
                          onChange={(e) => setVVideoUrl(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: https://www.youtube.com/embed/dQw4w9WgXcQ"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Ruta de Portada (Imagen)</label>
                        <input
                          type="text"
                          value={vImagen}
                          onChange={(e) => setVImagen(e.target.value)}
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          placeholder="Ej: /Somos todos.jpg o URL"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="submit"
                          className="flex-grow py-2 bg-[#735f3d]/40 hover:bg-[#735f3d]/80 border border-[#d1b880]/30 text-white font-mono text-[10px] uppercase rounded transition-colors"
                        >
                          {editVideoId ? "Guardar Cambios" : "Añadir Vídeo"}
                        </button>
                        {editVideoId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditVideoId(null);
                              setVTitulo("");
                              setVDescripcion("");
                              setVVideoUrl("");
                              setVImagen("");
                            }}
                            className="py-2 px-3 bg-red-950/40 hover:bg-red-950 border border-red-500/30 text-red-300 font-mono text-[10px] uppercase rounded transition-colors"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Tabla de Videos */}
                    <div className="lg:col-span-7 space-y-2">
                      <div className="border border-[#735f3d]/20 rounded overflow-hidden bg-black/20">
                        <div className="max-h-[250px] overflow-y-auto">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-black/50 text-[#735f3d] font-mono border-b border-[#735f3d]/20">
                                <th className="p-3 uppercase">Vídeo</th>
                                <th className="p-3 uppercase">Descripción / Enlace</th>
                                <th className="p-3 text-right uppercase">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {(mazmorrasData?.videos || [
                                { id: 1, titulo: "Ensayos bajo la Bruma", descripcion: "Metraje en crudo de los primeros ensayos de flauta y violín.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", imagen: "/Somos todos.jpg" },
                                { id: 2, titulo: "Grabando Voces", descripcion: "Tomas descartadas en el estudio rústico de grabación.", videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", imagen: "/Tu voz.jpg" }
                              ]).map((v) => (
                                <tr key={v.id} className="border-b border-[#735f3d]/10 hover:bg-black/40 text-gray-300">
                                  <td className="p-3">
                                    <div className="font-bold text-white">{v.titulo}</div>
                                    <div className="text-[9px] text-gray-500 font-mono truncate max-w-[120px]">{v.imagen}</div>
                                  </td>
                                  <td className="p-3">
                                    <div className="text-[10px] text-gray-400">{v.descripcion}</div>
                                    <div className="text-[10px] text-gray-500 font-mono truncate max-w-[180px]">{v.videoUrl}</div>
                                  </td>
                                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                    <button
                                      onClick={() => seleccionarEditarVideo(v)}
                                      className="text-cyan-400 hover:text-cyan-200 transition-colors"
                                      title="Editar"
                                    >
                                      <i className="fas fa-edit"></i>
                                    </button>
                                    <button
                                      onClick={() => eliminarVideoDungeon(v.id)}
                                      className="text-red-500 hover:text-red-300 transition-colors"
                                      title="Eliminar"
                                    >
                                      <i className="fas fa-trash-alt"></i>
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Registro y Gestión de Códigos NFC (Mini CDs) */}
                <div className="bg-black/20 p-4 border border-[#735f3d]/25 rounded space-y-4">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 flex items-center justify-between">
                    <span>🔑 Base de Datos NFC (Mini CDs y Códigos Únicos)</span>
                    <span className="text-[10px] text-gray-500 font-serif normal-case italic">Códigos de 6 dígitos vinculados a tags NFC</span>
                  </h4>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Formulario */}
                    <form onSubmit={guardarNfcCode} className="lg:col-span-5 bg-black/40 p-4 border border-[#735f3d]/15 rounded space-y-3">
                      <h5 className="text-[#d1b880] text-[11px] font-mono uppercase tracking-widest border-b border-[#735f3d]/10 pb-1">
                        {editNfcId ? "🖋️ Modificar Código NFC" : "➕ Registrar Nuevo NFC"}
                      </h5>
                      
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">ID del NFC CD (etiqueta única)</label>
                        <input
                          type="text"
                          value={nfcTagId}
                          onChange={(e) => setNfcTagId(e.target.value)}
                          placeholder="e.g. CD-NFC-04E2"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          required
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[9px] text-gray-400 font-mono block">Código de Acceso (2 letras + 6 dígitos)</label>
                          <input
                            type="text"
                            maxLength="12"
                            value={nfcCodigo6}
                            onChange={(e) => setNfcCodigo6(e.target.value.toUpperCase())}
                            placeholder="e.g. EV-583921"
                            className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] font-mono tracking-widest"
                            required
                          />
                        </div>
                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() => {
                              if (!nfcTagId.trim()) {
                                alert("Por favor ingresa primero el ID del NFC CD para encriptarlo y generar su código.");
                                return;
                              }
                              const codigoEncriptado = codificarNfcId(nfcTagId);
                              setNfcCodigo6(codigoEncriptado);
                            }}
                            className="w-full py-2.5 px-2 bg-[#735f3d]/45 hover:bg-[#735f3d] text-[#d1b880] hover:text-white border border-[#735f3d]/40 rounded font-mono text-[9.5px] uppercase transition-all"
                          >
                            Generar
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Descripción / Propietario</label>
                        <input
                          type="text"
                          value={nfcDesc}
                          onChange={(e) => setNfcDesc(e.target.value)}
                          placeholder="e.g. Mini CD #42 - Edición Limitada"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                        />
                      </div>

                      <div className="flex gap-2 pt-1">
                        <button
                          type="submit"
                          className="flex-grow py-2 bg-[#8da382]/30 hover:bg-[#8da382] text-[#8da382] hover:text-[#060a13] font-bold font-mono text-[10px] uppercase rounded border border-[#8da382]/40 transition-all"
                        >
                          {editNfcId ? "Guardar Cambios" : "Vincular Código"}
                        </button>
                        {editNfcId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditNfcId(null);
                              setNfcTagId("");
                              setNfcCodigo6("");
                              setNfcDesc("");
                            }}
                            className="py-2 px-3 bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-500 hover:text-white font-mono text-[10px] uppercase rounded transition-all"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>

                    {/* Tabla de Códigos */}
                    <div className="lg:col-span-7 space-y-2">
                      <div className="border border-[#735f3d]/20 rounded bg-black/55 overflow-hidden">
                        <div className="max-h-[280px] overflow-y-auto custom-scrollbar">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-black/60 text-[#d1b880]/80 font-mono text-[9px] border-b border-[#735f3d]/25 uppercase select-none">
                                <th className="p-3">ID NFC</th>
                                <th className="p-3">Código (6D)</th>
                                <th className="p-3">Descripción</th>
                                <th className="p-3">Registro</th>
                                <th className="p-3 text-right">Acciones</th>
                              </tr>
                            </thead>
                            <tbody>
                              {nfcCodes.length === 0 ? (
                                <tr>
                                  <td colSpan="5" className="p-4 text-center text-gray-500 font-mono text-[11px] italic">
                                    Ningún Mini CD NFC vinculado.
                                  </td>
                                </tr>
                              ) : (
                                nfcCodes.map((item) => (
                                  <tr key={item.id} className="border-b border-[#735f3d]/10 hover:bg-white/3 transition-colors">
                                    <td className="p-3 font-mono text-[11px] text-[#8da382] font-semibold">{item.nfcId}</td>
                                    <td className="p-3 font-mono text-[11px] text-[#fbbf24] tracking-widest font-bold">{item.codigo}</td>
                                    <td className="p-3 text-gray-300 max-w-[120px] truncate" title={item.descripcion}>{item.descripcion}</td>
                                    <td className="p-3 text-gray-500 text-[10px] font-mono">{item.fechaRegistro}</td>
                                    <td className="p-3 text-right space-x-2 whitespace-nowrap">
                                      <button
                                        onClick={() => seleccionarEditarNfcCode(item)}
                                        className="text-cyan-400 hover:text-cyan-200 transition-colors"
                                        title="Editar"
                                      >
                                        <i className="fas fa-edit"></i>
                                      </button>
                                      <button
                                        onClick={() => eliminarNfcCode(item.id)}
                                        className="text-red-500 hover:text-red-300 transition-colors"
                                        title="Eliminar"
                                      >
                                        <i className="fas fa-trash-alt"></i>
                                      </button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sección de Exportación a PDF por Lotes */}
                  <div className="border border-[#735f3d]/20 bg-black/45 p-4 rounded space-y-3 mt-4">
                    <h5 className="text-[#fbbf24] text-[11px] font-mono uppercase tracking-widest border-b border-[#735f3d]/10 pb-1 flex justify-between items-center select-none">
                      <span>🖨️ Plantillas de Impresión para Mini CDs (PDF / A4)</span>
                      <span className="text-[9px] text-[#8da382] font-mono bg-[#8da382]/10 px-2 py-0.5 rounded border border-[#8da382]/25">
                        Lotes de 20 Etiquetas
                      </span>
                    </h5>
                    <p className="text-[10px] text-gray-400 leading-normal">
                      Selecciona un lote de códigos vinculados. El sistema generará una plantilla de impresión con guías de corte recortables (cuadrícula de 4x5 etiquetas) diseñadas a medida para pegar en las carátulas físicas de tus Mini CDs.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={selectedBatchIndex}
                        onChange={(e) => setSelectedBatchIndex(parseInt(e.target.value))}
                        className="bg-black/60 border border-[#735f3d]/30 text-xs text-[#d1b880] p-2.5 rounded focus:outline-none focus:border-[#fbbf24] font-mono min-w-[240px]"
                      >
                        {(() => {
                          const numLotes = Math.ceil(nfcCodes.length / 20);
                          const options = [];
                          for (let i = 0; i < numLotes; i++) {
                            const inicio = i * 20 + 1;
                            const fin = Math.min((i + 1) * 20, nfcCodes.length);
                            options.push(
                              <option key={i} value={i}>
                                Lote {i + 1} (Mini CDs {inicio} al {fin})
                              </option>
                            );
                          }
                          return options.length > 0 ? options : (
                            <option value={0} disabled>Sin códigos NFC registrados</option>
                          );
                        })()}
                      </select>
                      
                      <button
                        type="button"
                        onClick={exportarLotePdf}
                        disabled={nfcCodes.length === 0}
                        className="py-2.5 px-4 bg-[#8da382]/30 hover:bg-[#8da382] disabled:opacity-40 disabled:hover:bg-[#8da382]/30 text-[#8da382] hover:text-black border border-[#8da382]/40 rounded font-mono text-xs uppercase font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed select-none"
                      >
                        <i className="fas fa-print"></i> Generar Plantilla Imprimible
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* TAB 6: FANS Y MENSAJES (Buzón y Base de Datos de Fans) */}
            {activeTab === "fans" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] h-full flex flex-col min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow min-h-0">
                  
                  {/* Listado de Fanáticos */}
                  <div className="lg:col-span-6 bg-black/40 p-4 border border-[#735f3d]/20 rounded flex flex-col min-h-[300px]">
                    <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-3 flex justify-between items-center">
                      <span>👥 Fanáticos del Clan</span>
                      <button
                        onClick={exportarAExcel}
                        className="py-1 px-2.5 bg-[#8da382]/30 hover:bg-[#8da382] text-[#8da382] hover:text-black border border-[#8da382]/40 rounded font-mono text-[9px] uppercase tracking-wider transition-all flex items-center gap-1 select-none"
                        title="Exportar a Excel (CSV)"
                      >
                        <i className="fas fa-file-excel"></i> Exportar Excel
                      </button>
                    </h4>
                    
                    <div className="flex-grow overflow-auto border border-[#735f3d]/15 rounded bg-black/60 custom-scrollbar">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-black/80 text-[#d1b880]/90 font-mono text-[9px] border-b border-[#735f3d]/25 uppercase select-none">
                            <th className="p-3">Nombre</th>
                            <th className="p-3">Tierra Natal</th>
                            <th className="p-3">Código Usado</th>
                            <th className="p-3 text-right">Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {fansRegistrados.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="p-4 text-center text-gray-500 font-serif italic text-xs">
                                Ningún fanático ha cruzado el umbral.
                              </td>
                            </tr>
                          ) : (
                            fansRegistrados.map((f) => (
                              <tr 
                                key={f.id} 
                                onClick={() => setSelectedFanId(f.id)}
                                className={`border-b border-[#735f3d]/10 hover:bg-white/5 cursor-pointer transition-colors ${
                                  selectedFanId === f.id ? "bg-[#735f3d]/25 border-l-2 border-l-[#fbbf24]" : ""
                                }`}
                              >
                                <td className="p-3">
                                  <div className="font-semibold text-white">{f.nombre}</div>
                                  <div className="text-[10px] text-gray-500 truncate max-w-[150px]">{f.correo}</div>
                                  {f.telefono && <div className="text-[9px] text-amber-500/70 font-mono mt-0.5">{f.telefono}</div>}
                                </td>
                                <td className="p-3 text-gray-300 font-serif">{f.pais}</td>
                                <td className="p-3 font-mono text-[10px] text-[#fbbf24]">{f.codigoUsado}</td>
                                <td className="p-3 text-right space-x-1 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => eliminarFanRegistrado(f.id)}
                                    className="text-red-500 hover:text-red-300 transition-colors p-1.5"
                                    title="Eliminar Fanático"
                                  >
                                    <i className="fas fa-trash-alt"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Buzón de Respuestas */}
                  <div className="lg:col-span-6 bg-black/40 p-4 border border-[#735f3d]/20 rounded flex flex-col min-h-[300px]">
                    <h4 className="text-[#8da382] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-3 flex justify-between items-center">
                      <span>📬 Conversación</span>
                      {selectedFanId && (
                        <span className="text-[9px] text-[#fbbf24] normal-case font-serif italic">
                          {fansRegistrados.find(f => f.id === selectedFanId)?.nombre}
                        </span>
                      )}
                    </h4>

                    {selectedFanId ? (
                      (() => {
                        const fan = fansRegistrados.find(f => f.id === selectedFanId);
                        if (!fan) return null;
                        return (
                          <div className="flex-grow flex flex-col justify-between min-h-0">
                            {/* Historial de Mensajes */}
                            <div className="flex-grow overflow-y-auto mb-3 space-y-2 pr-1 max-h-[220px] custom-scrollbar border border-black/30 p-2.5 bg-black/40 rounded-sm">
                              {(!fan.mensajes || fan.mensajes.length === 0) ? (
                                <p className="text-gray-500 font-serif italic text-xs text-center py-8">
                                  No hay mensajes de este fanático.
                                </p>
                              ) : (
                                fan.mensajes.map((m) => (
                                  <div
                                    key={m.id}
                                    className={`flex flex-col max-w-[85%] rounded p-2.5 border text-xs leading-relaxed ${
                                      m.remitente === "banda"
                                        ? "ml-auto bg-[#735f3d]/20 border-[#735f3d]/30 text-amber-100"
                                        : "mr-auto bg-black/60 border-[#fbbf24]/20 text-gray-200"
                                    }`}
                                  >
                                    <div className="flex justify-between items-center text-[8.5px] font-mono text-gray-500 mb-1 select-none">
                                      <span className="font-semibold uppercase tracking-wider">
                                        {m.remitente === "banda" ? "Banda (Tú)" : fan.nombre}
                                      </span>
                                      <span>{m.fecha}</span>
                                    </div>
                                    <p className="font-sans break-words">{m.texto}</p>
                                  </div>
                                ))
                              )}
                            </div>

                            {/* Responder */}
                            <form onSubmit={enviarRespuestaBanda} className="flex gap-2">
                              <textarea
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                placeholder="Escribe una respuesta para el fanático..."
                                rows="2"
                                className="flex-grow bg-black/60 border border-[#735f3d]/40 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] transition-colors resize-none placeholder-gray-600 font-sans"
                                required
                              ></textarea>
                              <button
                                type="submit"
                                className="px-4 bg-[#735f3d] hover:bg-[#fbbf24] text-white hover:text-black border border-[#735f3d]/50 hover:border-[#fbbf24] font-mono font-bold text-[9px] uppercase tracking-wider rounded transition-all duration-300 flex items-center justify-center"
                              >
                                Enviar
                              </button>
                            </form>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 font-serif italic text-xs p-6">
                        <i className="fas fa-comments text-3xl text-gray-700 mb-2"></i>
                        <p>« Selecciona un fanático del listado izquierdo para leer e iniciar el intercambio de misivas. »</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: MENSAJES DE CONTACTO (Cuervos) */}
            {activeTab === "cuervos" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out] h-full flex flex-col min-h-0">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch flex-grow min-h-0">
                  
                  {/* Listado de Mensajes */}
                  <div className="lg:col-span-7 bg-black/40 p-4 border border-[#735f3d]/20 rounded flex flex-col min-h-[350px]">
                    <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-3">
                      📨 Misivas del Bosque (Contacto)
                    </h4>
                    
                    <div className="flex-grow overflow-auto border border-[#735f3d]/15 rounded bg-black/60 custom-scrollbar max-h-[350px]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-black/80 text-[#d1b880]/90 font-mono text-[9px] border-b border-[#735f3d]/25 uppercase select-none">
                            <th className="p-3">Remitente</th>
                            <th className="p-3">Referencia</th>
                            <th className="p-3">Fecha</th>
                            <th className="p-3 text-right">Acción</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mensajesContacto.length === 0 ? (
                            <tr>
                              <td colSpan="4" className="p-6 text-center text-gray-500 font-serif italic text-xs">
                                Ningún cuervo ha traído mensajes aún.
                              </td>
                            </tr>
                          ) : (
                            mensajesContacto.map((msg) => (
                              <tr 
                                key={msg.id} 
                                onClick={() => setSelectedContactMsgId(msg.id)}
                                className={`border-b border-[#735f3d]/10 hover:bg-white/5 cursor-pointer transition-colors ${
                                  selectedContactMsgId === msg.id ? "bg-[#735f3d]/25 border-l-2 border-l-[#fbbf24]" : ""
                                }`}
                              >
                                <td className="p-3">
                                  <div className="font-semibold text-white">{msg.nombre}</div>
                                  <div className="text-[10px] text-gray-500 font-mono mt-0.5">{msg.correo}</div>
                                </td>
                                <td className="p-3 text-amber-100/90 italic font-serif truncate max-w-[120px]" title={msg.referencia}>
                                  {msg.referencia || "General / Pacto"}
                                </td>
                                <td className="p-3 text-gray-500 text-[10px] font-mono whitespace-nowrap">
                                  {msg.fecha}
                                </td>
                                <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                                  <button
                                    onClick={() => {
                                      if (confirm("¿Seguro que deseas archivar/eliminar esta misiva?")) {
                                        const nuevosMsgs = mensajesContacto.filter(m => m.id !== msg.id);
                                        setMensajesContacto(nuevosMsgs);
                                        localStorage.setItem("eiluve_mensajes_contacto", JSON.stringify(nuevosMsgs));
                                        if (selectedContactMsgId === msg.id) setSelectedContactMsgId(null);
                                      }
                                    }}
                                    className="text-red-500 hover:text-red-300 transition-colors p-1.5"
                                    title="Archivar Misiva"
                                  >
                                    <i className="fas fa-archive"></i>
                                  </button>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Lector Detallado del Mensaje */}
                  <div className="lg:col-span-5 bg-black/40 p-4 border border-[#735f3d]/20 rounded flex flex-col min-h-[350px]">
                    <h4 className="text-[#8da382] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-1 mb-3">
                      📖 Lector de Pergaminos
                    </h4>

                    {selectedContactMsgId ? (
                      (() => {
                        const msg = mensajesContacto.find(m => m.id === selectedContactMsgId);
                        if (!msg) return null;
                        return (
                          <div className="flex-grow flex flex-col justify-between space-y-4">
                            <div className="space-y-3 bg-black/60 p-4 border border-[#735f3d]/15 rounded-sm">
                              <div>
                                <span className="text-[8px] text-gray-500 font-mono uppercase block">Nombre / Clan</span>
                                <span className="text-white text-xs font-serif font-bold">{msg.nombre}</span>
                              </div>
                              
                              <div>
                                <span className="text-[8px] text-gray-500 font-mono uppercase block">Dirección de Pergamino (Correo)</span>
                                <span className="text-amber-500 font-mono text-[11px] select-all cursor-pointer hover:underline" title="Copiar correo">
                                  {msg.correo}
                                </span>
                              </div>

                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <span className="text-[8px] text-gray-500 font-mono uppercase block">Referencia</span>
                                  <span className="text-gray-300 text-xs italic font-serif">{msg.referencia || "General"}</span>
                                </div>
                                <div>
                                  <span className="text-[8px] text-gray-500 font-mono uppercase block">Recibido</span>
                                  <span className="text-gray-400 text-[10px] font-mono">{msg.fecha}</span>
                                </div>
                              </div>
                            </div>

                            {/* Contenedor del Mensaje Largo - Fácil de Leer y Hacer Scroll */}
                            <div className="flex-grow bg-black/80 border border-[#735f3d]/10 p-4 rounded-sm overflow-y-auto max-h-[160px] custom-scrollbar">
                              <span className="text-[8px] text-gray-500 font-mono uppercase block mb-1.5 border-b border-white/5 pb-1">Mensaje:</span>
                              <p className="text-gray-200 text-xs leading-relaxed font-sans whitespace-pre-wrap break-words">
                                {msg.mensaje}
                              </p>
                            </div>

                            <button
                              onClick={() => {
                                if (confirm("¿Deseas eliminar este mensaje permanentemente?")) {
                                  const nuevosMsgs = mensajesContacto.filter(m => m.id !== msg.id);
                                  setMensajesContacto(nuevosMsgs);
                                  localStorage.setItem("eiluve_mensajes_contacto", JSON.stringify(nuevosMsgs));
                                  setSelectedContactMsgId(null);
                                }
                              }}
                              className="w-full py-2 bg-red-950/40 border border-red-900/50 hover:bg-red-900 hover:text-white text-red-400 font-mono text-[10px] uppercase rounded tracking-wider transition-all duration-300"
                            >
                              <i className="fas fa-trash-alt mr-1"></i> Eliminar Mensaje
                            </button>
                          </div>
                        );
                      })()
                    ) : (
                      <div className="flex-grow flex flex-col items-center justify-center text-center text-gray-500 font-serif italic text-xs p-6">
                        <i className="fas fa-feather text-3xl text-gray-700 mb-2"></i>
                        <p>« Selecciona una misiva del listado de la izquierda para desenrollar el pergamino y leer el contenido completo. »</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 8: GESTIÓN DE USUARIOS Y MIEMBROS DEL PORTAL */}
            {activeTab === "usuarios" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                <div className="bg-black/40 p-4 border border-[#735f3d]/25 rounded space-y-4">
                  <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider border-b border-[#735f3d]/10 pb-2 flex justify-between items-center select-none">
                    <span className="flex items-center gap-2">👥 Usuarios y Guardianes del Portal de la Banda</span>
                    <span className="text-[10px] text-[#8da382] font-mono bg-[#8da382]/10 px-2.5 py-0.5 rounded border border-[#8da382]/25">
                      {usuarioActual?.isMaster ? "👑 Modo Maestro Activo" : "🛡️ Acceso de Usuario Activo"}
                    </span>
                  </h4>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* Formulario de Registro / Edición de Usuario (Solo Maestro) */}
                    <form onSubmit={guardarUsuarioBanda} className="lg:col-span-5 bg-black/50 p-4 border border-[#735f3d]/20 rounded space-y-3">
                      <h5 className="text-[#d1b880] text-[11px] font-mono uppercase tracking-widest border-b border-[#735f3d]/10 pb-1 flex justify-between items-center">
                        <span>{editUserId ? "🖋️ Modificar Roles de Usuario" : "➕ Registrar Miembro con Múltiples Roles"}</span>
                        {editUserId && (
                          <button
                            type="button"
                            onClick={() => {
                              setEditUserId(null);
                              setNuevoNombreUser("");
                              setNuevoUsername("");
                              setNuevaPassword("");
                              setNuevosRolesUser(["📰 Editor de Noticias y Crónicas"]);
                            }}
                            className="text-[9px] text-amber-500 hover:text-white uppercase font-mono"
                          >
                            Cancelar ↩
                          </button>
                        )}
                      </h5>
                      {!usuarioActual?.isMaster && (
                        <p className="text-[10px] text-amber-500/80 font-mono italic bg-amber-950/20 p-2 border border-amber-900/30 rounded">
                          Nota: Solo el Usuario Maestro del Clan puede modificar o revocar roles de usuarios.
                        </p>
                      )}
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Nombre Completo del Miembro</label>
                        <input
                          type="text"
                          value={nuevoNombreUser}
                          onChange={(e) => setNuevoNombreUser(e.target.value)}
                          placeholder="Ej: Nombre del Integrante"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          disabled={!usuarioActual?.isMaster}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Nombre de Usuario (Login)</label>
                        <input
                          type="text"
                          value={nuevoUsername}
                          onChange={(e) => setNuevoUsername(e.target.value)}
                          placeholder="Ej: usuario_editor"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] font-mono"
                          disabled={!usuarioActual?.isMaster}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Contraseña de Acceso</label>
                        <input
                          type="password"
                          value={nuevaPassword}
                          onChange={(e) => setNuevaPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24]"
                          disabled={!usuarioActual?.isMaster}
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Correo Electrónico</label>
                        <input
                          type="email"
                          value={nuevoCorreoUser}
                          onChange={(e) => setNuevoCorreoUser(e.target.value)}
                          placeholder="Ej: integrante@eiluve.com"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] font-mono"
                          disabled={!usuarioActual?.isMaster}
                        />
                      </div>
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block">Teléfono de Contacto</label>
                        <input
                          type="tel"
                          value={nuevoTelefonoUser}
                          onChange={(e) => setNuevoTelefonoUser(e.target.value)}
                          placeholder="Ej: +56 9 1234 5678"
                          className="w-full bg-black/60 border border-[#735f3d]/20 text-xs text-white p-2 rounded focus:outline-none focus:border-[#fbbf24] font-mono"
                          disabled={!usuarioActual?.isMaster}
                        />
                      </div>
                      
                      {/* Selección Múltiple de Roles */}
                      <div>
                        <label className="text-[9px] text-gray-400 font-mono block mb-1">
                          Seleccionar Múltiples Roles ({nuevosRolesUser.length} asignados):
                        </label>
                        <div className="space-y-1.5 max-h-[140px] overflow-y-auto p-2 bg-black/60 border border-[#735f3d]/20 rounded custom-scrollbar">
                          {ROLES_DISPONIBLES.map((rol) => {
                            const asignado = nuevosRolesUser.includes(rol);
                            return (
                              <label
                                key={rol}
                                className={`flex items-center space-x-2 text-[10px] font-mono cursor-pointer p-1.5 rounded transition-colors ${
                                  asignado ? "bg-[#735f3d]/30 text-amber-200 border border-[#fbbf24]/40" : "text-gray-400 hover:text-white"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={asignado}
                                  onChange={() => alternarRolNuevo(rol)}
                                  disabled={!usuarioActual?.isMaster}
                                  className="accent-[#fbbf24]"
                                />
                                <span>{rol}</span>
                              </label>
                            );
                          })}
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={!usuarioActual?.isMaster}
                        className="w-full py-2.5 bg-[#8da382]/30 hover:bg-[#8da382] disabled:opacity-40 disabled:hover:bg-[#8da382]/30 text-[#8da382] hover:text-black font-bold font-mono text-[10px] uppercase rounded border border-[#8da382]/40 transition-all cursor-pointer disabled:cursor-not-allowed"
                      >
                        {editUserId ? "Guardar Cambios de Usuario" : "Añadir Miembro al Portal"}
                      </button>
                    </form>

                    {/* Tabla de Usuarios Registrados */}
                    <div className="lg:col-span-7 bg-black/40 p-4 border border-[#735f3d]/15 rounded space-y-3">
                      <h5 className="text-[#d1b880] text-[11px] font-mono uppercase tracking-widest border-b border-[#735f3d]/10 pb-1">
                        📋 Lista de Miembros Registrados ({usuariosBanda.length})
                      </h5>
                      <div className="border border-[#735f3d]/15 rounded overflow-hidden bg-black/60 max-h-[360px] overflow-y-auto custom-scrollbar">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-black/80 text-[#d1b880]/90 font-mono text-[9px] border-b border-[#735f3d]/25 uppercase select-none">
                              <th className="p-3">Usuario / Miembro</th>
                              <th className="p-3">Contacto</th>
                              <th className="p-3">Roles</th>
                              <th className="p-3 text-right">Acciones</th>
                            </tr>
                          </thead>
                          <tbody>
                            {usuariosBanda.map((user) => (
                              <tr key={user.id} className="border-b border-[#735f3d]/10 hover:bg-white/5 text-gray-300">
                                <td className="p-3">
                                  <div className="font-bold text-white flex items-center gap-1.5">
                                    {user.isMaster && <span title="Usuario Maestro">👑</span>}
                                    {user.username}
                                    {user.bloqueado && (
                                      <span className="text-[8px] bg-red-950/80 text-red-400 border border-red-900/60 px-1 py-0.2 rounded font-mono">
                                        🔒 BLOQUEADO
                                      </span>
                                    )}
                                    {user.usernameModificado && !user.isMaster && (
                                      <span className="text-[8px] bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 px-1 py-0.2 rounded font-mono" title="Ha editado su clave una vez">
                                        ✓ Clave Modificada
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-gray-400">{user.nombre}</div>
                                </td>
                                <td className="p-3 text-[9.5px] font-mono text-gray-400">
                                  <div>✉️ {user.correo || `${user.username}@eiluve.com`}</div>
                                  <div>📞 {user.telefono || "No especificado"}</div>
                                </td>
                                <td className="p-3">
                                  {user.roles && user.roles.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                      {user.roles.map((r, idx) => (
                                        <span key={idx} className="text-[8.5px] font-mono px-1.5 py-0.5 rounded border bg-black/50 text-[#d1b880] border-[#735f3d]/30">
                                          {r}
                                        </span>
                                      ))}
                                    </div>
                                  ) : (
                                    <span className="text-[9.5px] font-mono px-2 py-0.5 rounded border bg-black/40 text-gray-300 border-gray-700">
                                      {user.rol || "Editor del Portal"}
                                    </span>
                                  )}
                                </td>
                                <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                                  {user.isMaster ? (
                                    <span className="text-[9px] text-amber-500/60 font-mono italic">Maestro</span>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => restablecerPasswordUsuario(user)}
                                        disabled={!usuarioActual?.isMaster}
                                        className="text-amber-400 hover:text-amber-200 disabled:opacity-30 transition-colors p-1"
                                        title="Restablecer Contraseña del Usuario"
                                      >
                                        <i className="fas fa-key"></i>
                                      </button>
                                      <button
                                        onClick={() => alternarBloqueoUsuario(user.id)}
                                        disabled={!usuarioActual?.isMaster}
                                        className={`${user.bloqueado ? "text-green-400 hover:text-green-200" : "text-amber-500 hover:text-amber-300"} disabled:opacity-30 transition-colors p-1`}
                                        title={user.bloqueado ? "Desbloquear Acceso del Usuario" : "Bloquear Acceso del Usuario"}
                                      >
                                        <i className={`fas ${user.bloqueado ? "fa-lock-open" : "fa-[#735f3d] fa-lock"}`}></i>
                                      </button>
                                      <button
                                        onClick={() => seleccionarEditarUsuario(user)}
                                        disabled={!usuarioActual?.isMaster}
                                        className="text-cyan-400 hover:text-cyan-200 disabled:opacity-30 transition-colors p-1"
                                        title={usuarioActual?.isMaster ? "Editar Usuario y Roles" : "Solo el Maestro puede editar"}
                                      >
                                        <i className="fas fa-user-edit"></i>
                                      </button>
                                      <button
                                        onClick={() => eliminarUsuarioBanda(user.id)}
                                        disabled={!usuarioActual?.isMaster}
                                        className="text-red-500 hover:text-red-300 disabled:opacity-30 transition-colors p-1"
                                        title={usuarioActual?.isMaster ? "Revocar Acceso" : "Solo el Maestro puede eliminar usuarios"}
                                      >
                                        <i className="fas fa-user-minus"></i>
                                      </button>
                                    </>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: LOG DE AUDITORÍA Y HISTORIAL DE CAMBIOS DEL CLAN */}
            {activeTab === "bitacora" && (
              <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
                
                {/* 💾 PANEL DE GESTIÓN DEL REGISTRO LOCAL */}
                <div className="bg-black/40 p-4 border border-[#735f3d]/25 rounded space-y-3">
                  <div className="flex flex-wrap justify-between items-center border-b border-[#735f3d]/15 pb-2.5 gap-2">
                    <div>
                      <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                        <span>💾 Registro Local del Clan (Fechas, Crónicas y Contenidos)</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Guarda, exporta e importa copias de seguridad de todas las fechas de gira, crónicas y datos almacenados en localStorage.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={exportarRegistroLocal}
                        className="py-1.5 px-3 bg-[#735f3d]/40 hover:bg-[#735f3d] border border-[#d1b880]/50 text-[#d1b880] hover:text-white text-[10px] font-mono rounded transition-colors uppercase flex items-center gap-1.5 cursor-pointer"
                        title="Descargar copia de seguridad en JSON"
                      >
                        📥 Exportar Registro (JSON)
                      </button>
                      <label className="py-1.5 px-3 bg-[#8da382]/20 hover:bg-[#8da382] border border-[#8da382]/40 text-[#8da382] hover:text-black text-[10px] font-mono rounded transition-colors uppercase flex items-center gap-1.5 cursor-pointer">
                        📤 Importar Backup (JSON)
                        <input
                          type="file"
                          accept=".json"
                          onChange={importarRegistroLocal}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 p-4 border border-[#735f3d]/25 rounded space-y-4">
                  <div className="flex flex-wrap justify-between items-center border-b border-[#735f3d]/10 pb-3 gap-2">
                    <div>
                      <h4 className="text-[#fbbf24] text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                        <span>📜 Bitácora de Auditoría y Registro de Cambios</span>
                        <span className="text-[10px] text-gray-400 bg-black/60 px-2 py-0.5 rounded border border-[#735f3d]/20">
                          {logsAuditoria.length} entradas
                        </span>
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono mt-0.5">
                        Historial inmutable de modificaciones, publicaciones y autorías realizadas en el portal.
                      </p>
                    </div>

                    {usuarioActual?.isMaster && (
                      <button
                        onClick={() => {
                          if (confirm("¿Seguro que deseas reiniciar el historial de la bitácora?")) {
                            const inicial = [
                              {
                                id: "log_" + Date.now(),
                                usuario: usuarioActual.username,
                                nombreAutor: usuarioActual.nombre,
                                rol: "Maestro del Portal",
                                accion: "Reinició el registro de auditoría del clan",
                                categoria: "Sistema",
                                fecha: new Date().toISOString().replace("T", " ").substring(0, 16)
                              }
                            ];
                            setLogsAuditoria(inicial);
                            localStorage.setItem("eiluve_audit_log", JSON.stringify(inicial));
                          }
                        }}
                        className="py-1 px-3 bg-red-950/40 hover:bg-red-900 border border-red-900/50 text-red-400 hover:text-white text-[10px] font-mono rounded transition-colors uppercase"
                      >
                        🗑️ Limpiar Bitácora
                      </button>
                    )}
                  </div>

                  {/* Tabla de Registros de Auditoría */}
                  <div className="border border-[#735f3d]/20 rounded overflow-hidden bg-black/60 max-h-[420px] overflow-y-auto custom-scrollbar">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-black/90 text-[#d1b880] font-mono text-[9px] border-b border-[#735f3d]/30 uppercase sticky top-0 z-10">
                          <th className="p-3">Fecha y Hora</th>
                          <th className="p-3">Autor / Usuario</th>
                          <th className="p-3">Rol</th>
                          <th className="p-3">Categoría</th>
                          <th className="p-3">Acción Realizada</th>
                        </tr>
                      </thead>
                      <tbody>
                        {logsAuditoria.length === 0 ? (
                          <tr>
                            <td colSpan="5" className="p-6 text-center text-gray-500 font-serif italic text-xs">
                              No hay registros de auditoría almacenados aún.
                            </td>
                          </tr>
                        ) : (
                          logsAuditoria.map((log) => (
                            <tr key={log.id} className="border-b border-[#735f3d]/10 hover:bg-white/5 text-gray-300 font-mono">
                              <td className="p-3 text-[10px] text-gray-400 whitespace-nowrap">
                                📅 {log.fecha}
                              </td>
                              <td className="p-3 whitespace-nowrap">
                                <div className="font-bold text-white text-xs flex items-center gap-1">
                                  <span>✍️ {log.nombreAutor}</span>
                                </div>
                                <div className="text-[9.5px] text-[#fbbf24]/80">@{log.usuario}</div>
                              </td>
                              <td className="p-3 text-[9.5px]">
                                <span className="px-2 py-0.5 rounded border bg-black/40 text-gray-300 border-gray-700">
                                  {log.rol}
                                </span>
                              </td>
                              <td className="p-3 text-[9.5px]">
                                <span className="px-2 py-0.5 rounded border bg-[#735f3d]/20 text-[#d1b880] border-[#735f3d]/40">
                                  {log.categoria}
                                </span>
                              </td>
                              <td className="p-3 text-xs text-gray-200">
                                {log.accion}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Pie del Dashboard */}
          <div className="border-t border-[#735f3d]/10 pt-3 mt-6 flex justify-between items-center text-[10px] text-gray-500 font-mono select-none">
            <span>© CLAN EILUVË • ACCESO MÁXIMO</span>
            <button
              onClick={alCerrar}
              className="text-[#d1b880] hover:underline uppercase"
            >
              ← Volver a la Arboleda
            </button>
          </div>
        </div>
      )}

      {/* 👤 MODAL EDICIÓN DE PERFIL PROPIO PARA CUALQUIER MIEMBRO DE LA BANDA */}
      {modalPerfilAbierto && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#090b10] border-2 border-[#735f3d]/50 rounded shadow-2xl p-6 max-w-md w-full relative animate-[fadeIn_0.3s_ease-out]">
            <button
              onClick={() => setModalPerfilAbierto(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors text-lg"
            >
              ✕
            </button>
            <h3 className="font-serif text-lg text-[#d1b880] tracking-widest uppercase mb-1 flex items-center gap-2">
              <span>👤 Mis Datos Personales</span>
            </h3>
            <p className="text-[10px] text-gray-400 font-mono mb-4">
              Edita tu información personal y actualiza tu palabra rúnica clave de acceso.
            </p>

            <form onSubmit={guardarMiPerfil} className="space-y-3">
              <div>
                <label className="text-[9px] text-gray-400 font-mono block">Nombre de Usuario (Login)</label>
                <input
                  type="text"
                  value={usuarioActual?.username || ""}
                  disabled
                  className="w-full bg-black/40 border border-gray-800 text-xs text-gray-500 p-2.5 rounded font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="text-[9px] text-[#fbbf24] font-mono block">Nombre Completo</label>
                <input
                  type="text"
                  value={perfilNombre}
                  onChange={(e) => setPerfilNombre(e.target.value)}
                  className="w-full bg-black/70 border border-[#735f3d]/30 text-xs text-white p-2.5 rounded focus:outline-none focus:border-[#fbbf24]"
                  required
                />
              </div>

              <div>
                <label className="text-[9px] text-[#fbbf24] font-mono block">Correo Electrónico</label>
                <input
                  type="email"
                  value={perfilCorreo}
                  onChange={(e) => setPerfilCorreo(e.target.value)}
                  placeholder="ejemplo@eiluve.com"
                  className="w-full bg-black/70 border border-[#735f3d]/30 text-xs text-white p-2.5 rounded focus:outline-none focus:border-[#fbbf24] font-mono"
                />
              </div>

              <div>
                <label className="text-[9px] text-[#fbbf24] font-mono block">Teléfono de Contacto</label>
                <input
                  type="tel"
                  value={perfilTelefono}
                  onChange={(e) => setPerfilTelefono(e.target.value)}
                  placeholder="+56 9 1234 5678"
                  className="w-full bg-black/70 border border-[#735f3d]/30 text-xs text-white p-2.5 rounded focus:outline-none focus:border-[#fbbf24] font-mono"
                />
              </div>

              <div>
                <label className="text-[9px] text-[#fbbf24] font-mono block flex justify-between items-center">
                  <span>Contraseña de Acceso</span>
                  {!usuarioActual?.isMaster && usuarioActual?.usernameModificado && (
                    <span className="text-[8.5px] text-amber-400 font-mono italic">
                      🔒 Modificado previamente
                    </span>
                  )}
                </label>
                <input
                  type="password"
                  value={perfilPassword}
                  onChange={(e) => setPerfilPassword(e.target.value)}
                  disabled={!usuarioActual?.isMaster && usuarioActual?.usernameModificado}
                  className={`w-full bg-black/70 border text-xs text-white p-2.5 rounded focus:outline-none transition-colors ${
                    !usuarioActual?.isMaster && usuarioActual?.usernameModificado
                      ? "border-gray-800 text-gray-500 cursor-not-allowed bg-black/40"
                      : "border-[#735f3d]/30 focus:border-[#fbbf24]"
                  }`}
                  required
                />
                {!usuarioActual?.isMaster && (
                  <p className="text-[8.5px] text-gray-400 font-mono mt-1 leading-tight">
                    {usuarioActual?.usernameModificado
                      ? "🔒 Tu contraseña ya fue editada por única vez. Si la olvidas, únicamente el Usuario Maestro (bsarmientom1993) puede restablecerla o desbloquear tu acceso."
                      : "⚡ Tienes 1 única oportunidad para personalizar tu contraseña. Guarda tu nueva contraseña en un lugar seguro."}
                  </p>
                )}
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setModalPerfilAbierto(false)}
                  className="w-1/2 py-2 border border-gray-700 hover:bg-white/10 text-gray-300 font-mono text-[10px] uppercase rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-[#735f3d] hover:bg-[#fbbf24] text-white hover:text-black font-bold font-mono text-[10px] uppercase rounded transition-colors"
                >
                  Guardar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
