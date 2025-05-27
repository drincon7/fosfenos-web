
import { Metadata } from 'next';
import ContentPage from '@/components/ContenPage/ContentPage';
import { guilleycandeData } from '@/app/data/guilleycandeData';

export const metadata: Metadata = {
  title: 'Guillermina y Candelario - Fosfenos Media',
  description: 'Guillermina y Candelario, es un proyecto pionero en su género en Colombia, inspirado en personajes afrodescendientes y escenarios del Pacífico colombiano',
  keywords: 'animación, película infantil, familia, fantasía, aventura, Fosfenos Media',
  openGraph: {
    title: 'Guillemrina y Candelario - Fosfenos Media',
    description: 'Una aventura mágica sobre la amistad y el poder de la fantasía',
    images: ['/images/content/lila-poster.jpg'],
  },
};

const GuillerminaYCandelarioPage = () => {
  return <ContentPage data={guilleycandeData} />;
};

export default GuillerminaYCandelarioPage;