// Page d'inscription (squelette)
// @ts-nocheck
import { inscription } from '@/actions/auth.actions';

export default function InscriptionPage() {
  return (
    <main>
      <h1>Inscription</h1>
      <form action={inscription}>
        <input type="text" name="nom" placeholder="Nom complet" required />
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Mot de passe" required />
        <input type="tel" name="telephone" placeholder="Téléphone" />
        <select name="role">
          <option value="citoyen">Citoyen</option>
          <option value="artisan">Artisan</option>
        </select>
        <button type="submit">S'inscrire</button>
      </form>
      <p>TODO[FRONTEND-TEAM]: Design du formulaire d'inscription</p>
    </main>
  );
}
