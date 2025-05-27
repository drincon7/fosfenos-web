// app/contenido-infantil/el-libro-de-lila

import { Metadata } from 'next';
import ContentPage from '@/components/ContenPage/ContentPage';
import { lilaData } from '@/app/data/lilaData';

export const metadata: Metadata = {
  title: 'El Libro de Lila - Fosfenos Media',
  description: 'Lila es el personaje de un libro que repentinamente queda fuera de su mundo de papel y atrapada en otro al que no pertenece. Una aventura mágica sobre la amistad y el poder de la fantasía.',
  keywords: 'animación, película infantil, familia, fantasía, aventura, Fosfenos Media',
  openGraph: {
    title: 'El Libro de Lila - Fosfenos Media',
    description: 'Una aventura mágica sobre la amistad y el poder de la fantasía',
    images: ['/images/content/lila-poster.jpg'],
  },
};

const ElLibroDeLilaPage = () => {
  return <ContentPage data={lilaData} />;
};

export default ElLibroDeLilaPage;