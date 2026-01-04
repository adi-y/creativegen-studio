// app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "CreativeGen Studio",
  description: "Ad Creative Builder Prototype",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&family=Open+Sans:wght@400;500;600;700&family=Montserrat:wght@400;500;600;700&family=Oswald:wght@400;500;700&family=Playfair+Display:wght@400;500;700&family=Lora:wght@400;500;700&family=Noto+Sans:wght@400;500;700&family=Ubuntu:wght@400;500;700&family=Merriweather:wght@400;700&family=Raleway:wght@400;500;700&family=PT+Sans:wght@400;700&family=Poppins:wght@400;500;600;700&family=Bebas+Neue&family=Dancing+Script:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
