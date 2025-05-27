// types/content.ts
export interface Award {
  id: number;
  title: string;
  category: string;
  year: number;
  country: string;
  status: 'ganador' | 'nominacion' | 'mencion';
  festival: string;
}

export interface TechnicalInfo {
  formato: string;
  duracion: string;
  genero: string;
  publico: string;
  estado: string;
  empresaProductora: {
    nombre: string;
    pais: string;
  };
  empresaCoproductora?: {
    nombre: string;
    pais: string;
  };
}

export interface Platform {
  name: string;
  url: string;
  icon: string;
}

export interface ContentData {
  id: string;
  title: string;
  subtitle?: string;
  videoUrl: string;
  posterImage: string;
  synopsis: string;
  technicalInfo: TechnicalInfo;
  awards: Award[];
  platforms: Platform[];
  additionalInfo?: {
    pressbook?: string;
    website?: string;
    socialMedia?: {
      facebook?: string;
      instagram?: string;
    };
  };
}

// Constantes para iconos y colores
export const AWARD_COLORS = {
  ganador: 'bg-yellow-500',
  nominacion: 'bg-gray-400',
  mencion: 'bg-bronze-400'
} as const;

export const PLATFORM_ICONS = {
  'Amazon Prime': '🎬',
  'Movies': '🎭',
  'Luabooks': '📚',
  'Website': '🌐'
} as const;