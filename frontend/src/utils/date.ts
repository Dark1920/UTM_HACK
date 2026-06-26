export function estAujourdhui(date: string): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}

export function estRecent(date: string, jours: number = 7): boolean {
  const d = new Date(date);
  const maintenant = new Date();
  const diff = maintenant.getTime() - d.getTime();
  return diff < jours * 24 * 60 * 60 * 1000;
}
