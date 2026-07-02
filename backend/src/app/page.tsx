const endpoints = [
  { method: 'GET', path: '/api-docs', description: 'Documentation Swagger' },
  { method: 'POST', path: '/api/ai/analyze', description: 'Analyse de commentaire' },
  { method: 'POST', path: '/api/auth/connexion', description: 'Connexion utilisateur' },
  { method: 'GET', path: '/api/categories', description: 'Liste des catégories' },
  { method: 'GET', path: '/api/recherche', description: 'Recherche des commerces' },
]

const statusItems = [
  'API Next.js active',
  'Routes /api disponibles',
  'Backend connecté au démarrage',
]

export default function HomePage() {
  const now = new Date().toLocaleString('fr-FR', {
    dateStyle: 'full',
    timeStyle: 'medium',
  })

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        margin: 0,
        padding: '32px 20px',
        background:
          'radial-gradient(circle at top, rgba(34, 197, 94, 0.16), transparent 30%), linear-gradient(180deg, #07111f 0%, #0b1324 45%, #111827 100%)',
        color: '#e5e7eb',
        fontFamily:
          'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <section
        style={{
          width: '100%',
          maxWidth: 920,
          border: '1px solid rgba(148, 163, 184, 0.22)',
          borderRadius: 24,
          background: 'rgba(15, 23, 42, 0.82)',
          backdropFilter: 'blur(18px)',
          boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '22px 26px',
            borderBottom: '1px solid rgba(148, 163, 184, 0.14)',
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 10,
                padding: '8px 14px',
                borderRadius: 999,
                background: 'rgba(34, 197, 94, 0.12)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#86efac',
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#22c55e',
                  boxShadow: '0 0 0 6px rgba(34, 197, 94, 0.16)',
                }}
              />
              Backend en live
            </div>
            <h1 style={{ margin: '18px 0 8px', fontSize: 44, lineHeight: 1.05 }}>
              ArtisanBF API
            </h1>
            <p style={{ margin: 0, maxWidth: 680, color: '#cbd5e1', fontSize: 17, lineHeight: 1.7 }}>
              Le backend répond correctement. Cette page sert de point d’entrée visuel pour confirmer
              que le service Next.js est démarré et que les routes API sont prêtes.
            </p>
          </div>

          <div
            style={{
              minWidth: 220,
              padding: 18,
              borderRadius: 18,
              background: 'rgba(15, 118, 110, 0.18)',
              border: '1px solid rgba(45, 212, 191, 0.22)',
            }}
          >
            <div style={{ fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.12em', color: '#94a3b8' }}>
              Dernière mise à jour
            </div>
            <div style={{ marginTop: 8, fontSize: 15, fontWeight: 600, color: '#f8fafc' }}>{now}</div>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 16,
            padding: 26,
          }}
        >
          <div
            style={{
              padding: 20,
              borderRadius: 20,
              background: 'rgba(30, 41, 59, 0.92)',
              border: '1px solid rgba(148, 163, 184, 0.14)',
            }}
          >
            <h2 style={{ margin: '0 0 14px', fontSize: 18 }}>État du service</h2>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'grid', gap: 12 }}>
              {statusItems.map((item) => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#cbd5e1' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: 20,
              borderRadius: 20,
              background: 'rgba(30, 41, 59, 0.92)',
              border: '1px solid rgba(148, 163, 184, 0.14)',
            }}
          >
            <h2 style={{ margin: '0 0 14px', fontSize: 18 }}>Endpoints utiles</h2>
            <div style={{ display: 'grid', gap: 12 }}>
              {endpoints.map((endpoint) => (
                <div
                  key={endpoint.path}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 14,
                    background: 'rgba(15, 23, 42, 0.78)',
                    border: '1px solid rgba(148, 163, 184, 0.12)',
                  }}
                >
                  <div style={{ display: 'flex', gap: 10, alignItems: 'baseline', flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 800, color: '#93c5fd', minWidth: 46 }}>{endpoint.method}</span>
                    <span style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', color: '#f8fafc' }}>
                      {endpoint.path}
                    </span>
                  </div>
                  <div style={{ marginTop: 6, fontSize: 14, color: '#94a3b8' }}>{endpoint.description}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
