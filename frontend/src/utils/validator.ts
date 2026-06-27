export function validerEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validerTelephone(tel: string): boolean {
  return /^\+?[0-9]{8,15}$/.test(tel.replace(/\s/g, ''));
}

export function validerUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
