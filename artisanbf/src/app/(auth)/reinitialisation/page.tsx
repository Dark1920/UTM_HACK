// Page de réinitialisation de mot de passe (squelette)
// @ts-nocheck
import { resetPassword } from '@/actions/auth.actions';

export default function ReinitialisationPage() {
  return (
    <main>
      <h1>Réinitialisation du mot de passe</h1>
      <form action={resetPassword}>
        <input type="email" name="email" placeholder="Email" required />
        <button type="submit">Envoyer le lien de réinitialisation</button>
      </form>
      <p>TODO[FRONTEND-TEAM]: Design de la page de réinitialisation</p>
    </main>
  );
}
