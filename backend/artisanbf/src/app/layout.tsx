export const metadata = {
  title: "ArtisanBF API",
  description: "Backend API for FasoArtisan",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  )
}
