export const whatsappService = {
  generateShareLink(
    commerceName: string,
    message?: string
  ): string {
    const text = message || `Découvrez ${commerceName} sur ArtisansBF !`;
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  },

  generateContactLink(
    phoneNumber: string,
    message?: string
  ): string {
    const cleaned = phoneNumber.replace(/[^0-9]/g, '');
    const text = message || 'Bonjour, je vous contacte via ArtisansBF.';
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
  },

  generateBusinessLink(
    phoneNumber: string,
    commerceName: string
  ): string {
    const cleaned = phoneNumber.replace(/[^0-9]/g, '');
    const text = `Bonjour, je suis intéressé par les services de ${commerceName}. Pouvez-vous me donner plus d'informations ?`;
    return `https://wa.me/${cleaned}?text=${encodeURIComponent(text)}`;
  },
};
