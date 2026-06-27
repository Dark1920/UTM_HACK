// Page de connexion (squelette)
// @ts-nocheck
import { connexion } from '@/actions/auth.actions';

export default function ConnexionPage() {
  return (
    <main>
      <h1>Connexion</h1>
      <form action={connexion}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Mot de passe" required />
        <button type="submit">Se connecter</button>
      </form>
      <p>TODO[FRONTEND-TEAM]: Design du formulaire de connexion</p>
    </main>
  );
}
