import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "@/components/ui/toast";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ArtisansBF — Le bon artisan près de chez vous",
  description: "Le premier annuaire intelligent des artisans du Burkina Faso. Mécaniciens, couturiers, électriciens et bien plus. Trouvez le bon artisan en un clic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-bg-primary text-text-primary font-sans antialiased scroll-smooth">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
