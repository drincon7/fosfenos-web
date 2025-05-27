// data/lilaData.ts
import { ContentData } from '@/types/content';

export const guilleycandeData: ContentData = {
  id: 'guilermina-y-candelario',
  title: 'Guillermina y Candelario',
  videoUrl: '/videos/lila-preview.mp4', // Ruta del video
  posterImage: '/images/content/lila-poster.jpg',
  synopsis: `Guillermina y Candelario, es un proyecto pionero en su género en Colombia, inspirado en personajes afrodescendientes y escenarios del Pacífico colombiano, que lleva a las distintas plataformas el exotismo natural y la alegría de los habitantes de esa región, mientras se recrean situaciones y vivencias del maravilloso universo infantil.

Guillermina y Candelario son un par de traviesos e ingeniosos hermanos que viven en una hermosa playa y que con su capacidad de soñar y fantasear, transforman cada día en una increíble aventura en compañía de sus abuelos, que con su gran sabiduría siempre encuentran la manera de ayudarles a comprender el mundo, inculcándoles amor y respeto por la naturaleza y los seres que la habitan, así como un profundo gusto musical, que llena de alegría cada momento en familia.`,
  
  technicalInfo: {
    formato: 'Serie animada de TV',
    duracion: "-",
    genero: 'Aventura / Fantasía',
    publico: 'Familiar',
    estado: '6 temporadas finalizadas',
    empresaProductora: {
      nombre: 'Fosfenos Media',
      pais: 'Colombia'
    },
    empresaCoproductora: {
      nombre: 'Señal Colombia',
      pais: 'Colombia'
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