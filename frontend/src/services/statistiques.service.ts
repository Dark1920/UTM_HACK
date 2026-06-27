export interface StatistiqueItem {
  label: string;
  valeur: number;
  evolution?: number;
}

export interface PeriodStats {
  vues: StatistiqueItem;
  appels: StatistiqueItem;
  clicsWhatsApp: StatistiqueItem;
  favoris: StatistiqueItem;
}

export const statistiquesService = {
  async getCommerceStats(commerceId: string): Promise<PeriodStats> {
    await new Promise(r => setTimeout(r, 300));
    return {
      vues: {
        label: 'Vues',
        valeur: Math.floor(Math.random() * 500) + 50,
        evolution: Math.floor(Math.random() * 40) - 10,
      },
      appels: {
        label: 'Appels',
        valeur: Math.floor(Math.random() * 100) + 10,
        evolution: Math.floor(Math.random() * 30) - 15,
      },
      clicsWhatsApp: {
        label: 'Clics WhatsApp',
        valeur: Math.floor(Math.random() * 80) + 5,
        evolution: Math.floor(Math.random() * 25) - 10,
      },
      favoris: {
        label: 'Favoris',
        valeur: Math.floor(Math.random() * 50) + 5,
        evolution: Math.floor(Math.random() * 20) - 5,
      },
    };
  },

  async getChartData(commerceId: string, period: '7j' | '30j' | '90j'): Promise<{ date: string; vues: number; appels: number }[]> {
    await new Promise(r => setTimeout(r, 400));
    const days = period === '7j' ? 7 : period === '30j' ? 30 : 90;
    const data = [];
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      data.push({
        date: d.toISOString().split('T')[0],
        vues: Math.floor(Math.random() * 30) + 5,
        appels: Math.floor(Math.random() * 10),
      });
    }
    return data;
  },

  async getTopCommerces(): Promise<{ id: string; nom: string; vues: number }[]> {
    await new Promise(r => setTimeout(r, 300));
    return [
      { id: 'com-2', nom: 'Atelier Fatimata Couture', vues: 289 },
      { id: 'com-13', nom: 'Coiffure Aminata Beauty', vues: 245 },
      { id: 'com-7', nom: 'Salon Coiffure Boubacar', vues: 210 },
      { id: 'com-8', nom: 'Réparation Phone Rasmata', vues: 178 },
      { id: 'com-1', nom: 'Garage Amadou Moto', vues: 156 },
    ];
  },
};
