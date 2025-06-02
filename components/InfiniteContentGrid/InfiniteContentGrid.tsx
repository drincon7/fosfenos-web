'use client'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

// Definición de interfaces para tipar correctamente
interface ContentItem {
  id: number;
  title: string;
  shortDescription: string;
  description: string;
  image: string;
  details: string[];
}

interface GridItem extends ContentItem {
  gridId: string;
}

// Componente para el modal de información detallada
interface ContentModalProps {
  content: ContentItem | null;
  onClose: () => void;
}

const ContentModal: React.FC<ContentModalProps> = ({ content, onClose }) => {
  if (!content) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-auto shadow-xl">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-2xl font-bold text-purple-800">{content.title}</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl font-bold"
            >
              &times;
            </button>
          </div>
          
          <div className="mb-4">
            <div className="relative w-full h-48 rounded-md mb-4 overflow-hidden">
              <img 
                src={content.image} 
                alt={content.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <p className="text-gray-700 mb-2">{content.description}</p>
            
            {content.details && (
              <div className="mt-4 text-sm">
                <p className="font-semibold text-purple-700 mb-1">Detalles:</p>
                <ul className="list-disc pl-5">
                  {content.details.map((detail, idx) => (
                    <li key={idx} className="text-gray-600">{detail}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente para una sola tarjeta de contenido
interface ContentCardProps {
  content: ContentItem;
  onClick: (content: ContentItem) => void;
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
        <img 
          src={content.image} 
          alt={content.title} 
          className="w-full h-full object-cover"
          loading="lazy"
          draggable={false}
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none'
          } as React.CSSProperties}
          onDragStart={(e) => e.preventDefault()}
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
  const [activeContent, setActiveContent] = useState<ContentItem | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  
  // Estados para distinguir entre click y drag
  const [dragStartTime, setDragStartTime] = useState<number>(0);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [clickedContent, setClickedContent] = useState<ContentItem | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  
  // Configuración para determinar qué constituye un click vs drag
  const CLICK_THRESHOLD_TIME = 300; // milisegundos
  const CLICK_THRESHOLD_DISTANCE = 5; // píxeles
  
  // Datos de ejemplo para el contenido infantil
  const contentItems: ContentItem[] = [
    {
      id: 1,
      title: "Aventuras de Luna",
      shortDescription: "Serie animada educativa",
      description: "Una serie que estimula la imaginación y enseña valores a través de las aventuras de Luna y sus amigos.",
      image: "/images/content/assassins.webp",
      details: ["Edad recomendada: 3-6 años", "Duración: 15 minutos por episodio", "Temporadas disponibles: 2"]
    },
    {
      id: 2,
      title: "Los Exploradores",
      shortDescription: "Descubriendo el mundo",
      description: "Un grupo de niños que viajan por el mundo aprendiendo sobre diferentes culturas y ecosistemas.",
      image: "/images/content/castlevania.webp",
      details: ["Edad recomendada: 5-8 años", "Duración: 20 minutos por episodio", "Temporadas disponibles: 3"]
    },
    {
      id: 3,
      title: "Matemágicas",
      shortDescription: "Aprende matemáticas divirtiéndote",
      description: "Un show que hace de las matemáticas algo divertido y accesible para los más pequeños.",
      image: "/images/content/dune.webp",
      details: ["Edad recomendada: 6-9 años", "Duración: 15 minutos por episodio", "Temporadas disponibles: 1"]
    },
    {
      id: 4,
      title: "Pequeños Científicos",
      shortDescription: "Experimentos asombrosos",
      description: "Programa que introduce conceptos científicos básicos a través de experimentos sencillos y divertidos.",
      image: "/images/content/Shingeki_no_Kyojin.webp",
      details: ["Edad recomendada: 7-10 años", "Duración: 25 minutos por episodio", "Temporadas disponibles: 2"]
    },
    {
      id: 5,
      title: "Mundo Animal",
      shortDescription: "Descubre la fauna",
      description: "Una exploración del maravilloso mundo animal, diseñada para despertar la curiosidad y el respeto por la naturaleza.",
      image: "/images/content/sonic.jpg",
      details: ["Edad recomendada: 4-8 años", "Duración: 18 minutos por episodio", "Temporadas disponibles: 4"]
    },
    {
      id: 6,
      title: "El Bosque Mágico",
      shortDescription: "Fantasía y aventura",
      description: "Una serie encantadora sobre criaturas mágicas que habitan en un bosque misterioso.",
      image: "/images/content/transformers.jpg",
      details: ["Edad recomendada: 3-7 años", "Duración: 15 minutos por episodio", "Temporadas disponibles: 2"]
    },
    {
      id: 7,
      title: "Música para Crecer",
      shortDescription: "Aprendizaje musical",
      description: "Programa que introduce conceptos musicales básicos de manera divertida y participativa.",
      image: "/images/content/assassins.webp",
      details: ["Edad recomendada: 2-6 años", "Duración: 12 minutos por episodio", "Temporadas disponibles: 3"]
    },
    {
      id: 8,
      title: "Viaje al Espacio",
      shortDescription: "Astronomía para niños",
      description: "Una aventura espacial que enseña sobre planetas, estrellas y fenómenos espaciales.",
      image: "/images/content/dune.webp",
      details: ["Edad recomendada: 6-10 años", "Duración: 22 minutos por episodio", "Temporadas disponibles: 1"]
    },
    {
      id: 9,
      title: "Historias del Mundo",
      shortDescription: "Cuentos tradicionales",
      description: "Colección de cuentos y leyendas de diferentes culturas del mundo, narradas de forma amena para los más pequeños.",
      image: "/images/content/sonic.jpg",
      details: ["Edad recomendada: 4-9 años", "Duración: 15 minutos por episodio", "Temporadas disponibles: 5"]
    },
  ];

  // Función para generar una matriz de 5x5 con contenido repetido si es necesario
  const generateGrid = (): GridItem[] => {
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
        const contentIndex = sequence[row][col] % contentItems.length;
        
        grid.push({
          ...contentItems[contentIndex],
          gridId: `${row}-${col}-${contentItems[contentIndex].id}`
        });
      }
    }
    
    return grid;
  };

  // Animación automática para el desplazamiento lento
  useEffect(() => {
    if (isDragging) return;
    
    const autoScrollInterval = setInterval(() => {
      setPosition(prev => ({
        x: prev.x - 0.3,
        y: prev.y - 0.2
      }));
    }, 30);
    
    return () => clearInterval(autoScrollInterval);
  }, [isDragging]);

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

  // Manejadores de eventos mejorados
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevenir selección de texto
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
    e.preventDefault(); // Prevenir selección de texto
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
    
    // Marcar que hubo movimiento si se movió más del umbral
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
    
    // Marcar que hubo movimiento si se movió más del umbral
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
    
    // Solo abrir modal si fue un click válido y hay contenido seleccionado
    if (wasValidClick && clickedContent) {
      setActiveContent(clickedContent);
    }
    
    // Limpiar el contenido clickeado
    setClickedContent(null);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    const endTime = Date.now();
    // Para touch, usamos la última posición conocida
    const wasValidClick = endTime - dragStartTime < CLICK_THRESHOLD_TIME && !hasMoved;
    
    setIsDragging(false);
    
    // Solo abrir modal si fue un click válido y hay contenido seleccionado
    if (wasValidClick && clickedContent) {
      setActiveContent(clickedContent);
    }
    
    // Limpiar el contenido clickeado
    setClickedContent(null);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    setClickedContent(null);
  };

  // Función modificada para manejar clicks en tarjetas
  const handleCardClick = (content: ContentItem) => {
    // Solo almacenar el contenido, no abrir el modal inmediatamente
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
    <div 
      className="relative w-full h-screen overflow-hidden bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900 select-none"
      style={{
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none'
      } as React.CSSProperties}
    >
      {/* Contenedor de la cuadrícula con eventos mejorados */}
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
        } as React.CSSProperties as React.CSSProperties}
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
  );
};

export default InfiniteContentGrid;