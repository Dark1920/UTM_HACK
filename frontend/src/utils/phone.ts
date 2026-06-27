export function formatPhoneForWhatsApp(telephone: string): string {
  const cleaned = telephone.replace(/\D/g, '');
  if (cleaned.startsWith('226')) return cleaned;
  return `226${cleaned}`;
}

export function genererLienWhatsApp(telephone: string, message?: string): string {
  const phone = formatPhoneForWhatsApp(telephone);
  const text = message || 'Bonjour, je vous contacte depuis l\'annuaire des artisans.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}
