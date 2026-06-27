// Page détail d'un commerce (squelette)
export default function CommerceDetailPage({ params }: { params: { id: string } }) {
  return (
    <main>
      <h1>Détail commerce</h1>
      <p>ID: {params.id}</p>
      <p>TODO[FRONTEND-TEAM]: Page détail avec photos, avis, localisation</p>
    </main>
  );
}
