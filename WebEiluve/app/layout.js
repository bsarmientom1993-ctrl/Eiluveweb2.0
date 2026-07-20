import "./globals.css";

export const metadata = {
  title: "Eiluvë | Folk Metal Band",
  description:
    "Eiluvë es folk metal, es cuento y es tormenta. Melodías ancestrales, instrumentos de leyenda y la fuerza del metal se unen en cada historia.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="h-full scroll-smooth">
      <head>
        {/* Preconectar a Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Importar Fuentes (Cinzel, Cinzel Decorative, Montserrat) */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400..900&family=Cinzel+Decorative:wght@700&family=Montserrat:wght@100..900&display=swap"
          rel="stylesheet"
        />

        {/* FontAwesome para iconos rúnicos y sociales */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
