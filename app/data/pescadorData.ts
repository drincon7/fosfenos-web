// data/lilaData.ts
import { ContentData } from '@/types/content';

export const pescadorData: ContentData = {
  id: 'el-pescador-de-estrellas',
  title: 'El pescador de estrellas',
  videoUrl: '/videos/lila-preview.mp4', // Ruta del video
  posterImage: '/images/content/lila-poster.jpg',
  synopsis: `Segundo es un chico de 11 años que animado por Máximo, su inseparable cómplice de aventuras, aprovecha un juego que hacen en la escuela para convertirse en el amigo secreto de Juana María y enamorarla con un hermoso regalo; al final de la historia la realidad se confunde con la fantasía, haciendo que Segundo termine viviendo el mágico amor de una leyenda de estrellas contada por un abuelo.`,
  
  technicalInfo: {
    formato: 'Cortometraje',
    duracion: "12 min",
    genero: 'Aventura / Fantasía',
    publico: 'Familiar',
    estado: '-',
    empresaProductora: {
      nombre: 'Fosfenos Media',
      pais: 'Colombia'
    },
    empresaCoproductora: {
      nombre: '',
      pais: ''
    }
  },

  awards: [
    {
      id: 1,
      title: 'Mejor Película Selección Programa',
      category: 'Festival Internacional de Entretenimiento',
      year: 2018,
      country: 'Colombia',
      status: 'ganador',
      festival: 'Cine Todo'
    },
    {
      id: 2,
      title: 'Mejor Largometraje Fangente',
      category: 'Festival de Animación',
      year: 2018,
      country: 'Chile',
      status: 'ganador',
      festival: 'Ganador'
    },
    {
      id: 3,
      title: 'Mejor Película Animada',
      category: 'Jurados Infantil',
      year: 2019,
      country: 'Valencia',
      status: 'ganador',
      festival: 'Cinema Jove'
    },
    {
      id: 4,
      title: 'Mejor Película Animada',
      category: 'Festival Internacional',
      year: 2019,
      country: 'Cuba',
      status: 'ganador',
      festival: 'Centroamericano'
    },
    {
      id: 5,
      title: 'Mejor Largometraje Animado de Animación',
      category: 'Festival de Animación',
      year: 2018,
      country: 'Caracas',
      status: 'ganador',
      festival: 'Anima Caracas'
    },
    {
      id: 6,
      title: 'Premio del Público',
      category: 'Festival Internacional de Animación',
      year: 2019,
      country: 'Perú',
      status: 'ganador',
      festival: 'Lima 2019'
    },
    {
      id: 7,
      title: 'Mejor Guión',
      category: 'Mejor Actor',
      year: 2018,
      country: 'Colombia',
      status: 'nominacion',
      festival: 'Cine Colombia'
    },
    {
      id: 8,
      title: 'Mejor Película Animada',
      category: 'Primeros Visitados',
      year: 2019,
      country: 'México',
      status: 'nominacion',
      festival: 'Festival Internacional'
    },
    {
      id: 9,
      title: 'Mejor Desarrollo Visual',
      category: 'Gráficos Gobierno de Animación',
      year: 2019,
      country: 'España',
      status: 'nominacion',
      festival: 'Desarrolla Europa'
    },
    {
      id: 10,
      title: 'Mención de Honor',
      category: 'Internacional de Cine de Ejercicio',
      year: 2018,
      country: 'Chile',
      status: 'mencion',
      festival: 'Ficvi'
    }
  ],

  platforms: [
    {
      name: 'Movies',
      url: '#movies',
      icon: '🎬'
    },
    {
      name: 'Amazon Prime',
      url: '#amazon',
      icon: '📺'
    }
  ],

  additionalInfo: {
    pressbook: '/downloads/lila-pressbook.pdf',
    website: 'https://www.ellibrodelila.com',
    socialMedia: {
      facebook: '/ElLibroDeLila',
      instagram: '/ElLibroDeLila'
    }
  }
};