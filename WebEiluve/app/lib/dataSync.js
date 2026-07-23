// Helper de sincronización híbrida: Supabase Cloud DB + localStorage fallback
export async function cargarDatoCloud(key, defaultValue) {
  if (typeof window === "undefined") return defaultValue;

  let localData = null;
  try {
    const raw = localStorage.getItem(`eiluve_${key}`);
    if (raw) localData = JSON.parse(raw);
  } catch (e) {
    console.error("Error al leer localStorage:", e);
  }

  try {
    const res = await fetch(`/api/store?key=${encodeURIComponent(key)}`);
    if (res.ok) {
      const json = await res.json();
      if (json.configured && json.data !== null && json.data !== undefined) {
        // Actualizar localStorage para caché local
        localStorage.setItem(`eiluve_${key}`, JSON.stringify(json.data));
        return json.data;
      }
    }
  } catch (e) {
    console.warn(`No se pudo conectar con Cloud DB para key='${key}', usando caché local:`, e);
  }

  return localData !== null ? localData : defaultValue;
}

export async function guardarDatoCloud(key, value) {
  if (typeof window === "undefined") return;

  // 1. Guardar en caché local inmediatamente
  try {
    localStorage.setItem(`eiluve_${key}`, JSON.stringify(value));
    window.dispatchEvent(new Event("eiluve_realtime_sync"));
  } catch (e) {
    console.error("Error guardando en localStorage:", e);
  }

  // 2. Transmitir a Supabase Cloud en segundo plano
  try {
    await fetch("/api/store", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, data: value })
    });
  } catch (e) {
    console.warn(`No se pudo enviar key='${key}' a la nube:`, e);
  }
}
