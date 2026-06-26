import { mockCommerces } from '@/lib/mock-data';
import type { Commerce, CreateCommerceData } from '@/types/commerce';

const commerces = [...mockCommerces];

export interface CommerceFilters {
  categorieId?: string;
  ville?: string;
  search?: string;
  artisanId?: string;
}

export const commerceService = {
  async getAll(filters?: CommerceFilters): Promise<Commerce[]> {
    await new Promise(r => setTimeout(r, 300));
    let result = commerces.filter(c => c.estPublic);

    if (filters?.categorieId) {
      result = result.filter(c => c.categorieId === filters.categorieId);
    }
    if (filters?.ville) {
      result = result.filter(c => c.ville.toLowerCase() === filters.ville!.toLowerCase());
    }
    if (filters?.artisanId) {
      result = result.filter(c => c.artisanId === filters.artisanId);
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      result = result.filter(c =>
        c.nom.toLowerCase().includes(s) ||
        c.description.toLowerCase().includes(s) ||
        c.adresse.toLowerCase().includes(s)
      );
    }

    return result;
  },

  async getById(id: string): Promise<Commerce | undefined> {
    await new Promise(r => setTimeout(r, 200));
    return commerces.find(c => c.id === id);
  },

  async create(data: CreateCommerceData, artisanId: string): Promise<Commerce> {
    await new Promise(r => setTimeout(r, 400));
    const newCommerce: Commerce = {
      ...data,
      id: 'com-' + Date.now(),
      artisanId,
      photos: [],
      note: 0,
      nombreAvis: 0,
      nombreVues: 0,
      nombreAppels: 0,
      nombreClicsWhatsApp: 0,
      estPublic: true,
      dateCreation: new Date().toISOString(),
      dateModification: new Date().toISOString(),
    };
    commerces.push(newCommerce);
    return newCommerce;
  },

  async update(id: string, data: Partial<CreateCommerceData>): Promise<Commerce> {
    await new Promise(r => setTimeout(r, 400));
    const index = commerces.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Commerce non trouvé');
    commerces[index] = {
      ...commerces[index],
      ...data,
      dateModification: new Date().toISOString(),
    };
    return commerces[index];
  },

  async delete(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 300));
    const index = commerces.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Commerce non trouvé');
    commerces.splice(index, 1);
  },

  async incrementView(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 100));
    const commerce = commerces.find(c => c.id === id);
    if (commerce) commerce.nombreVues += 1;
  },

  async incrementCall(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 100));
    const commerce = commerces.find(c => c.id === id);
    if (commerce) commerce.nombreAppels += 1;
  },

  async incrementWhatsAppClick(id: string): Promise<void> {
    await new Promise(r => setTimeout(r, 100));
    const commerce = commerces.find(c => c.id === id);
    if (commerce) commerce.nombreClicsWhatsApp += 1;
  },
};
