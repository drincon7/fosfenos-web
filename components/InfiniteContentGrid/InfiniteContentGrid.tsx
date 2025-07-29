// components/InfiniteContentGrid/InfiniteContentGrid.tsx
'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Tag, Loader2, RefreshCw } from 'lucide-react';
import { useInfiniteContent } from '@/lib/hooks/useInfiniteContent';
import type { InfiniteContentItem } from '@/types/infiniteContent';

// Tipos específicos para el componente
interface GridItem extends InfiniteContentItem {
  gridId: string;
}

// Datos de fallback mejorados
const FALLBACK_DATA: InfiniteContentItem[] = [
  {
    id: 'fallback-1',
    title: 'Assassin\'s Creed',
    shortDescription: 'Serie épica de acción histórica',
    description: 'Una saga que combina historia, acción y aventura a través de diferentes épocas.',
    image: '/images/content/assassins.webp',
    details: ['Acción', 'Historia', 'Aventura', 'Sigilo'],
    active: true,
    order: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'fallback-2',
    title: 'Castlevania',
    shortDescription: 'Terror gótico animado',
    description: 'Una serie que reimagina el clásico videojuego con una narrativa madura y visceral.',
    image: '/images/content/castlevania.webp',
    details: ['Terror', 'Gótico', 'Animación', 'Vampiros'],
    active: true,
    order: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'fallback-3',
    title: 'Dune',
    shortDescription: 'Épica de ciencia ficción',
    description: 'La adaptación definitiva de la obra maestra de Frank Herbert sobre poder, religión y ecología.',
    image: '/images/content/dune.webp',
    details: ['Ciencia Ficción', 'Épica', 'Política', 'Ecología'],
    active: true,
    order: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'fallback-4',
    title: 'Attack on Titan',
    shortDescription: 'Anime de supervivencia',
    description: 'La humanidad lucha por sobrevivir contra titanes gigantes en un mundo post-apocalíptico.',
    image: '/images/content/Shingeki_no_Kyojin.webp',
    details: ['Anime', 'Acción', 'Drama', 'Supervivencia'],
    active: true,
    order: 4,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

// Hook personalizado para gestión de datos
const useContentData = () => {
  const { data: dbData, loading, error, refresh } = useInfiniteContent({
    active: true,
    pageSize: 50,
    orderBy: 'order',
    orderDirection: 'asc'
  });

  const items = React.useMemo(() => {
    if (dbData && dbData.length > 0) {
      return dbData;
    }
    return FALLBACK_DATA;
  }, [dbData]);

  const isUsingFallback = React.useMemo(() => {
    return !dbData || dbData.length === 0;
  }, [dbData]);

  return { items, loading, error, refresh, isUsingFallback };
};

// Componente para el modal de información detallada
interface ContentModalProps {
  content: InfiniteContentItem | null;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ content, onClose }) => {
  if (!content) return null;
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 50 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 50 }}
          transition={{ type: "spring", duration: 0.5 }}
          className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header de la imagen */}
          <div className="relative h-64 md:h-80 overflow-hidden rounded-t-2xl">
            <Image
              src={content.image || '/images/content/default.jpg'}
              alt={content.title}
              fill
              className="object-cover transition-transform duration-700 hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/images/content/default.jpg';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            
            {/* Botón de cerrar */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-3 bg-black/30 hover:bg-black/50 rounded-full text-white transition-all duration-200 backdrop-blur-sm"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>

            {/* Título superpuesto */}
            <div className="absolute bottom-6 left-6 right-16">
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
                {content.title}
              </h2>
              <p className="text-purple-200 font-medium">
                {content.shortDescription}
              </p>
            </div>
          </div>

          {/* Contenido */}
          <div className="p-6 md:p-8">
            {/* Descripción */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Descripción</h3>
              <p className="text-gray-700 leading-relaxed text-base">
                {content.description}
              </p>
            </div>

            {/* Detalles */}
            {content.details && content.details.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Tag size={20} className="text-purple-600" />
                  Características
                </h3>
                <div className="flex flex-wrap gap-2">
                  {content.details.map((detail, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 bg-purple-100 text-purple-800 rounded-full text-sm font-medium hover:bg-purple-200 transition-colors"
                    >
                      {detail}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Footer con metadatos */}
            <div className="pt-6 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>
                  Actualizado: {new Date(content.updatedAt).toLocaleDateString('es-ES', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors font-medium"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente para una sola tarjeta de contenido
interface ContentCardProps {
  content: InfiniteContentItem;
  onClick: (content: InfiniteContentItem) => void;
}

const ContentCard: React.FC<ContentCardProps> = ({ content, onClick }) => {
  return (
    <div 
      className="w-64 h-64 overflow-hidden rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer hover:shadow-xl relative select-none"
      onClick={() => onClick(content)}
      style={{ 
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      } as React.CSSProperties}
    >
      <div className="w-full h-full relative">
        <Image
          src={content.image || '/images/content/default.jpg'}
          alt={content.title}
          fill
          className="object-cover"
          loading="lazy"
          draggable={false}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          } as React.CSSProperties}
          onDragStart={(e) => e.preventDefault()}
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/content/default.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 select-none">
          <h3 className="text-white text-lg font-bold select-none">{content.title}</h3>
          <p className="text-white text-sm opacity-90 select-none">{content.shortDescription}</p>
        </div>
      </div>
    </div>
  );
};

// Componente principal de la cuadrícula infinita
const InfiniteContentGrid: React.FC = () => {
  const { items, loading, error, refresh, isUsingFallback } = useContentData();
  const [activeContent, setActiveContent] = useState<InfiniteContentItem | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  // Estados para distinguir entre click y drag
  const [dragStartTime, setDragStartTime] = useState<number>(0);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [clickedContent, setClickedContent] = useState<InfiniteContentItem | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Configuración para determinar qué constituye un click vs drag
  const CLICK_THRESHOLD_TIME = 300; // milisegundos
  const CLICK_THRESHOLD_DISTANCE = 5; // píxeles

  // Función para generar una matriz de 5x5 con contenido repetido si es necesario
  const generateGrid = useCallback((): GridItem[] => {
    if (items.length === 0) return [];
    
    const grid: GridItem[] = [];
    const gridSize = 5;
    
    const sequence = [
      [0, 1, 2, 3, 4],
      [5, 6, 7, 8, 0],
      [1, 2, 3, 4, 5],
      [6, 7, 8, 0, 1],
      [2, 3, 4, 5, 6]
    ];
    
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const contentIndex = sequence[row][col] % items.length;
        
        grid.push({
          ...items[contentIndex],
          gridId: `${row}-${col}-${items[contentIndex].id}`
        });
      }
    }
    
    return grid;
  }, [items]);

  // Animación automática para el desplazamiento lento
  useEffect(() => {
    if (isDragging || loading) return;
    
    const autoScrollInterval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x - 0.3,
        y: prev.y - 0.2
      }));
    }, 30);
    
    return () => clearInterval(autoScrollInterval);
  }, [isDragging, loading]);

  // Función para calcular la distancia entre dos puntos
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  };

  // Función para determinar si fue un click válido
  const isValidClick = (endTime: number, endX: number, endY: number): boolean => {
    const timeElapsed = endTime - dragStartTime;
    const distanceMoved = calculateDistance(dragStartPos.x, dragStartPos.y, endX, endY);
    
    return timeElapsed < CLICK_THRESHOLD_TIME && distanceMoved < CLICK_THRESHOLD_DISTANCE && !hasMoved;
  };

  // Manejadores de eventos
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    const currentTime = Date.now();
    setDragStartTime(currentTime);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setHasMoved(false);
    setIsDragging(true);
    setStartPosition({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    const currentTime = Date.now();
    setDragStartTime(currentTime);
    setDragStartPos({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    setHasMoved(false);
    setIsDragging(true);
    setStartPosition({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const newX = e.clientX - startPosition.x;
    const newY = e.clientY - startPosition.y;
    
    const distanceMoved = calculateDistance(dragStartPos.x, dragStartPos.y, e.clientX, e.clientY);
    if (distanceMoved > CLICK_THRESHOLD_DISTANCE) {
      setHasMoved(true);
    }
    
    setPosition({ x: newX, y: newY });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const newX = e.touches[0].clientX - startPosition.x;
    const newY = e.touches[0].clientY - startPosition.y;
    
    const distanceMoved = calculateDistance(dragStartPos.x, dragStartPos.y, e.touches[0].clientX, e.touches[0].clientY);
    if (distanceMoved > CLICK_THRESHOLD_DISTANCE) {
      setHasMoved(true);
    }
    
    setPosition({ x: newX, y: newY });
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const endTime = Date.now();
    const wasValidClick = isValidClick(endTime, e.clientX, e.clientY);
    
    setIsDragging(false);
    
    if (wasValidClick && clickedContent) {
      setActiveContent(clickedContent);
    }
    
    setClickedContent(null);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const endTime = Date.now();
    const wasValidClick = endTime - dragStartTime < CLICK_THRESHOLD_TIME && !hasMoved;
    
    setIsDragging(false);
    
    if (wasValidClick && clickedContent) {
      setActiveContent(clickedContent);
    }
    
    setClickedContent(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setClickedContent(null);
  };

  // Función para manejar clicks en tarjetas
  const handleCardClick = (content: InfiniteContentItem) => {
    setClickedContent(content);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setActiveContent(null);
  };

  // Implementación del efecto de "wraparound" infinito
  const wrapValue = (value: number, range: number): number => {
    const modulo = value % range;
    return modulo < 0 ? modulo + range : modulo;
  };

  // Estado de loading
  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 flex items-center justify-center">
        <div className="text-center text-white">
          <Loader2 size={48} className="animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Cargando contenido...</h2>
          <p className="opacity-80">Preparando la experiencia infinita</p>
        </div>
      </section>
    );
  }

  // Configuración de dimensiones
  const cardWidth = 280;
  const cardHeight = 280;
  const cardMargin = 20;
  
  const gridWidth = 5 * (cardWidth + cardMargin);
  const gridHeight = 5 * (cardHeight + cardMargin);

  // Aplicar efecto de "wraparound"
  const wrappedX = wrapValue(position.x, gridWidth);
  const wrappedY = wrapValue(position.y, gridHeight);

  return (
    <>
      {/* Header con controles */}
      <section className="py-8 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900">
                Nuestro Contenido
              </h2>
              {isUsingFallback && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">
                  Demo
                </span>
              )}
            </div>
            
            <button
              onClick={refresh}
              disabled={loading}
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              aria-label="Actualizar contenido"
            >
              <RefreshCw size={20} className={`${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <p className="text-lg text-gray-600 max-w-2xl">
            Explora nuestra colección de contenido infinito. Arrastra para navegar, haz clic para ver detalles.
          </p>
        </div>
      </section>

      {/* Grid infinito */}
      <div 
        className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 select-none"
        style={{
          userSelect: 'none',
          WebkitUserSelect: 'none',
          MozUserSelect: 'none',
          msUserSelect: 'none'
        } as React.CSSProperties}
      >
        <div
          ref={gridRef}
          className={`absolute inset-0 select-none grid-container ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDragStart={(e) => e.preventDefault()}
          style={{ 
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          } as React.CSSProperties}
        >
          {/* Cuadrícula principal y sus clones circundantes para efecto infinito */}
          {[-1, 0, 1].map(yOffset => (
            [-1, 0, 1].map(xOffset => (
              <div
                key={`${xOffset}-${yOffset}`}
                className="absolute grid grid-cols-5 gap-5 p-2"
                style={{
                  transform: `translate(${wrappedX + xOffset * gridWidth}px, ${wrappedY + yOffset * gridHeight}px)`,
                  width: gridWidth,
                  height: gridHeight
                }}
              >
                {generateGrid().map(item => (
                  <ContentCard
                    key={`${xOffset}-${yOffset}-${item.gridId}`}
                    content={item}
                    onClick={handleCardClick}
                  />
                ))}
              </div>
            ))
          ))}
        </div>
        
        {/* Modal para mostrar información detallada */}
        <ContentModal content={activeContent} onClose={handleCloseModal} />
        
        {/* CSS global para prevenir selección */}
        <style jsx>{`
          * {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
          }
          
          img {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            pointer-events: none;
          }
          
          .grid-container * {
            -webkit-user-select: none !important;
            -moz-user-select: none !important;
            -ms-user-select: none !important;
            user-select: none !important;
          }
        `}</style>
      </div>
    </>
  );
};

export default InfiniteContentGrid;