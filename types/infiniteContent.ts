// types/infiniteContent.ts
export interface InfiniteContentItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  details: string[];
  order: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateInfiniteContentData {
  title: string;
  shortDescription: string;
  description: string;
  image?: File | string | null;
  details: string[];
  active: boolean;
}

export interface UpdateInfiniteContentData extends CreateInfiniteContentData {
  id: string;
}

export interface InfiniteContentFilters {
  search?: string;
  active?: boolean;
  page: number;
  pageSize: number;
  orderBy?: 'title' | 'order' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface InfiniteContentResponse {
  data: InfiniteContentItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}