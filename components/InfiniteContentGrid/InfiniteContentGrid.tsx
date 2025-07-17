// components/InfiniteContentGrid/InfiniteContentGrid.tsx
'use client';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Play, Calendar, Tag } from 'lucide-react';

// Tipos actualizados para coincidir con la base de datos
interface InfiniteContentItem {
  id: string;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  details: string[];
  active: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

interface GridItem extends InfiniteContentItem {
  size: 'small' | 'medium' | 'large';
  aspectRatio: string;
  position: { x: number; y: number };
  velocity: { x: number; y: number };
}

// Datos estáticos de fallback para mantener la apariencia original
const fallbackData: InfiniteContentItem[] = [
  {
    id: '1',
    title: 'Assassin\'s Creed',
    shortDescription: 'Serie de acción y aventura',
    description: 'Una épica serie de videojuegos de acción y aventura histórica.',
    image: '/images/content/assassins.webp',
    details: ['Acción', 'Aventura', 'Historia'],
    active: true,
    order: 1,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '2',
    title: 'Castlevania',
    shortDescription: 'Serie de terror gótico',
    description: 'Una serie animada basada en el famoso videojuego de terror gótico.',
    image: '/images/content/castlevania.webp',
    details: ['Terror', 'Gótico', 'Animación'],
    active: true,
    order: 2,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '3',
    title: 'Dune',
    shortDescription: 'Épica de ciencia ficción',
    description: 'Una adaptación cinematográfica de la obra maestra de Frank Herbert.',
    image: '/images/content/dune.webp',
    details: ['Ciencia Ficción', 'Épica', 'Aventura'],
    active: true,
    order: 3,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  },
  {
    id: '4',
    title: 'Attack on Titan',
    shortDescription: 'Anime de acción',
    description: 'Una serie de anime sobre la humanidad luchando contra titanes.',
    image: '/images/content/Shingeki_no_Kyojin.webp',
    details: ['Anime', 'Acción', 'Drama'],
    active: true,
    order: 4,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01'
  }
];

// Hook personalizado para obtener el contenido infinito
const useInfiniteContent = () => {
  const [items, setItems] = useState<InfiniteContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/public/infinite-content?pageSize=50');
      const data = await response.json();
      
      if (data.success && data.data && data.data.length > 0) {
        const activeItems = data.data
          .filter((item: InfiniteContentItem) => item.active)
          .sort((a: InfiniteContentItem, b: InfiniteContentItem) => a.order - b.order);
        setItems(activeItems);
      } else {
        console.log('No data in database, using fallback data');
        setItems(fallbackData);
      }
    } catch (err) {
      console.error('Error fetching infinite content:', err);
      setItems(fallbackData);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const refetch = () => {
    fetchContent();
  };

  return { items, loading, error, refetch };
};

// Función para generar posiciones y velocidades aleatorias tipo matrix
const generateMatrixItems = (items: InfiniteContentItem[]): GridItem[] => {
  const sizes = ['small', 'medium', 'large'] as const;
  const aspectRatios = {
    small: 'aspect-square',
    medium: 'aspect-[4/3]',
    large: 'aspect-[16/9]'
  };

  return items.map((item, index) => {
    const size = sizes[Math.floor(Math.random() * sizes.length)];
    return {
      ...item,
      size,
      aspectRatio: aspectRatios[size],
      position: {
        x: Math.random() * 100,
        y: Math.random() * 100
      },
      velocity: {
        x: (Math.random() - 0.5) * 0.2,
        y: (Math.random() - 0.5) * 0.2
      }
    };
  });
};

// Componente del modal de detalles
const DetailModal = ({ 
  item, 
  onClose 
}: { 
  item: GridItem | null; 
  onClose: () => void 
}) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <div className="aspect-video relative overflow-hidden rounded-t-xl">
              <Image
                src={item.image || '/images/content/default.jpg'}
                alt={item.title}
                fill
                className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/images/content/default.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h2>
            <p className="text-purple-600 text-sm font-medium mb-4">
              {item.shortDescription}
            </p>
            <div className="prose prose-gray max-w-none mb-6">
              <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>

            {item.details && item.details.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Tag size={18} />
                  Detalles
                </h3>
                <ul className="space-y-2">
                  {item.details.map((detail, index) => (
                    <li key={index} className="flex items-start gap-2 text-gray-600">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>Actualizado: {new Date(item.updatedAt).toLocaleDateString()}</span>
              </div>
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente principal con animación tipo matrix
const InfiniteContentGrid = () => {
  const { items, loading } = useInfiniteContent();
  const [selectedItem, setSelectedItem] = useState<GridItem | null>(null);
  const [matrixItems, setMatrixItems] = useState<GridItem[]>([]);

  // Generar items con posiciones tipo matrix
  useEffect(() => {
    if (items.length > 0) {
      const processedItems = generateMatrixItems(items);
      setMatrixItems(processedItems);
    }
  }, [items]);

  // Animación continua tipo matrix
  useEffect(() => {
    if (matrixItems.length === 0) return;

    const interval = setInterval(() => {
      setMatrixItems(prevItems => 
        prevItems.map(item => ({
          ...item,
          position: {
            x: (item.position.x + item.velocity.x + 100) % 100,
            y: (item.position.y + item.velocity.y + 100) % 100
          }
        }))
      );
    }, 50);

    return () => clearInterval(interval);
  }, [matrixItems.length]);

  if (loading) {
    return (
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Contenido
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Cargando contenido...
            </p>
          </motion.div>
          
          {/* Loading Matrix Animation */}
          <div className="relative h-96 overflow-hidden rounded-xl bg-black/5">
            {Array.from({ length: 12 }).map((_, index) => (
              <motion.div
                key={index}
                className="absolute w-20 h-20 bg-purple-200 rounded-lg opacity-30"
                animate={{
                  x: [Math.random() * 800, Math.random() * 800],
                  y: [Math.random() * 300, Math.random() * 300],
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-16 lg:py-24 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header de la sección */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Nuestro Contenido
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Explora nuestra colección de contenido infinito, donde cada historia 
              cobra vida a través de la magia de la animación.
            </p>
          </motion.div>

          {/* Container Matrix de contenido */}
          <div className="relative h-[600px] overflow-hidden rounded-xl bg-gradient-to-r from-black/5 to-purple-900/10 backdrop-blur-sm">
            {matrixItems.map((item, index) => {
              const sizeClasses = {
                small: 'w-24 h-24',
                medium: 'w-32 h-24',
                large: 'w-40 h-24'
              };

              return (
                <motion.div
                  key={item.id}
                  className={`absolute ${sizeClasses[item.size]} cursor-pointer group`}
                  style={{
                    left: `${item.position.x}%`,
                    top: `${item.position.y}%`,
                  }}
                  animate={{
                    left: `${item.position.x}%`,
                    top: `${item.position.y}%`,
                  }}
                  transition={{
                    duration: 0.05,
                    ease: "linear"
                  }}
                  whileHover={{
                    scale: 1.1,
                    zIndex: 10,
                  }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg group-hover:shadow-2xl transition-all duration-300">
                    <Image
                      src={item.image || '/images/content/default.jpg'}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/images/content/default.jpg';
                      }}
                    />
                    
                    {/* Overlay que aparece al hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="absolute bottom-2 left-2 right-2">
                        <h3 className="text-white text-xs font-bold line-clamp-1 mb-1">
                          {item.title}
                        </h3>
                        <p className="text-gray-200 text-xs line-clamp-1">
                          {item.shortDescription}
                        </p>
                      </div>
                      
                      {/* Indicador de interactividad */}
                      <div className="absolute top-2 right-2 w-6 h-6 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                        <Play size={12} className="text-white ml-0.5" />
                      </div>
                    </div>

                    {/* Efecto de brillo tipo matrix */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 transform translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </div>
                </motion.div>
              );
            })}

            {/* Efectos de partículas adicionales */}
            {Array.from({ length: 20 }).map((_, index) => (
              <motion.div
                key={`particle-${index}`}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                animate={{
                  x: [0, Math.random() * 1200],
                  y: [0, Math.random() * 600],
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 5 + Math.random() * 5,
                  repeat: Infinity,
                  ease: "linear",
                  delay: Math.random() * 5
                }}
              />
            ))}
          </div>

          {/* Información adicional */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-center mt-8"
          >
            <p className="text-sm text-gray-500">
              Haz clic en cualquier elemento para ver más detalles
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modal de detalles */}
      <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
};

export default InfiniteContentGrid;