import { NextResponse } from "next/server";
import { supabase, supabaseConfigured } from "@/app/lib/supabase";

// GET /api/store?key=conciertos
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Parámetro 'key' requerido" }, { status: 400 });
  }

  if (!supabaseConfigured || !supabase) {
    return NextResponse.json({ configured: false, data: null });
  }

  try {
    const { data, error } = await supabase
      .from("eiluve_store")
      .select("value")
      .eq("key", key)
      .maybeSingle();

    if (error) {
      console.error(`Error de lectura Supabase key='${key}':`, error);
      return NextResponse.json({ configured: true, data: null, error: error.message });
    }

    return NextResponse.json({
      configured: true,
      data: data ? data.value : null
    });
  } catch (err) {
    console.error("Excepción en GET /api/store:", err);
    return NextResponse.json({ configured: true, data: null, error: err.message });
  }
}

// POST /api/store  { key: "conciertos", data: [...] }
export async function POST(request) {
  if (!supabaseConfigured || !supabase) {
    return NextResponse.json({
      configured: false,
      message: "Supabase no está configurado aún en las variables de entorno."
    });
  }

  try {
    const body = await request.json();
    const { key, data } = body;

    if (!key) {
      return NextResponse.json({ error: "Se requiere la propiedad 'key'" }, { status: 400 });
    }

    const { error } = await supabase
      .from("eiluve_store")
      .upsert(
        {
          key,
          value: data,
          updated_at: new Date().toISOString()
        },
        { onConflict: "key" }
      );

    if (error) {
      console.error(`Error de escritura Supabase key='${key}':`, error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, key });
  } catch (err) {
    console.error("Excepción en POST /api/store:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
