export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limite: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limite?: number;
  recherche?: string;
  categorieId?: string;
  ville?: string;
  noteMin?: number;
  latitude?: number;
  longitude?: number;
  rayon?: number;
  tri?: 'distance' | 'note' | 'date' | 'relevance';
}