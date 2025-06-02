"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { Palette, Lightbulb, Wrench, MessageCircle, X, Play, Pause, Maximize2, Minimize2 } from "lucide-react";

// Definimos una interfaz para nuestros features para hacerlo más mantenible
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Hero = () => {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasBeenExpandedOnce, setHasBeenExpandedOnce] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const videoRef = useRef<HTMLDivElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);

  // Definimos nuestras features con sus correspondientes iconos
  const features: Feature[] = [
    {
      icon: <Palette size={24} className="text-white" />,
      title: "Creación",
      description: "Creamos, gestionamos y producimos nuestros propios proyectos."
    },
    {
      icon: <Lightbulb size={24} className="text-white" />,
      title: "Asesorías",
      description: "Guiones, proyectos audiovisuales, procesos de formación."
    },
    {
      icon: <Wrench size={24} className="text-white" />,
      title: "Servicios",
      description: "Préstamos servicios de producción para productoras y canales nacionales e internacionales."
    },
    {
      icon: <MessageCircle size={24} className="text-white" />,
      title: "Charlas",
      description: "Compartimos nuestra experiencia como creadoras, productoras y emprendedoras del sector cultural."
    }
  ];

  // Función para expandir el video (optimizada con useCallback)
  const expandVideo = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsVideoExpanded(true);
    setHasBeenExpandedOnce(true);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [isAnimating]);

  // Función para contraer el video (optimizada con useCallback)
  const collapseVideo = useCallback(() => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setIsVideoExpanded(false);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000);
  }, [isAnimating]);

  // Función para manejar play/pause
  const togglePlayPause = useCallback(() => {
    if (videoElementRef.current) {
      if (isPlaying) {
        videoElementRef.current.pause();
        setIsPlaying(false);
      } else {
        videoElementRef.current.play().catch(console.error);
        setIsPlaying(true);
      }
    }
  }, [isPlaying]);

  // Manejo de eventos mejorado
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVideoExpanded &&
        videoRef.current &&
        !videoRef.current.contains(event.target as Node)
      ) {
        collapseVideo();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isVideoExpanded) {
        collapseVideo();
      }
    };

    const handleScroll = () => {
      if (isVideoExpanded) {
        collapseVideo();
      }
    };

    // Solo agregar listeners cuando el video está expandido
    if (isVideoExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscape);
      window.addEventListener("scroll", handleScroll);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isVideoExpanded, collapseVideo]);

  // Manejo del video para asegurar reproducción
  useEffect(() => {
    if (videoElementRef.current) {
      videoElementRef.current.play().catch((error) => {
        console.error("Error reproduciendo el video:", error);
      });
    }
  }, [isVideoExpanded]);

  // Componente de marco decorativo que se desvanece
  const VideoFrame = ({ isVisible }: { isVisible: boolean }) => (
    <div
      className={`absolute z-20 pointer-events-none transition-opacity duration-700 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{
        position: "absolute",
        top: "-115px",
        left: "-75px",
        right: "-115px",
        bottom: "-115px",
      }}
    >
      <div className="relative w-full h-full">
        <Image
          src="/images/hero/VideoFrame.png"
          alt="Marco decorativo"
          fill
          className="object-fill"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>
    </div>
  );

  // Componente para renderizar cada feature con su icono correspondiente
  const FeatureItem = ({ feature }: { feature: Feature }) => (
    <div className="group rounded-lg">
      <h3 className="mb-2 flex items-center text-2xl font-semibold">
        <span className="mr-2 flex h-10 w-10 items-center justify-center rounded-full border-2 border-white bg-purple-800/50 transition-colors group-hover:bg-purple-700">
          {feature.icon}
        </span>
        {feature.title}
      </h3>
      <p className="text-sm">
        {feature.description}
      </p>
    </div>
  );

  // Componente de controles de video
  const VideoControls = () => (
    <div className={`absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-4 bg-black/50 backdrop-blur-sm rounded-full px-6 py-3 transition-all duration-300 ${
      isVideoExpanded ? 'opacity-100 visible' : 'opacity-0 invisible'
    }`}>
      <button
        onClick={togglePlayPause}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label={isPlaying ? "Pausar video" : "Reproducir video"}
      >
        {isPlaying ? (
          <Pause size={20} className="text-white" />
        ) : (
          <Play size={20} className="text-white ml-1" />
        )}
      </button>
      
      <button
        onClick={collapseVideo}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
        aria-label="Minimizar video"
      >
        <Minimize2 size={20} className="text-white" />
      </button>
      
      <button
        onClick={collapseVideo}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-red-500/70 hover:bg-red-500/90 transition-colors"
        aria-label="Cerrar video"
      >
        <X size={20} className="text-white" />
      </button>
    </div>
  );

  // Función para manejar la interacción inicial (hover o click)
  const handleVideoInteraction = (eventType: 'hover' | 'click') => {
    if (isVideoExpanded) return;
    
    // Si nunca se ha expandido, responder al hover
    // Si ya se expandió una vez, solo responder al click
    if (!hasBeenExpandedOnce && eventType === 'hover') {
      expandVideo();
    } else if (hasBeenExpandedOnce && eventType === 'click') {
      expandVideo();
    }
  };

  return (
    <>
      <section className="relative min-h-screen overflow-hidden">
        {/* Imagen de fondo que ocupa todo el hero */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/background/hero-bg.jpg"
            alt="Fondo Hero"
            fill
            className="object-cover"
            priority
          />
          {/* Capa de color para mejorar contraste del texto */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/80 to-purple-900/60" />
        </div>

        {/* Contenido principal con estructura de dos columnas */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center px-4 md:flex-row md:px-8">
          {/* Columna izquierda - Video */}
          <div className="flex w-full items-center justify-center py-6 md:w-1/2 md:py-12">
            <div 
              className="relative w-full max-w-md" 
              style={{ 
                aspectRatio: "16/9",
                position: "relative"
              }}
              ref={videoContainerRef}
              onMouseEnter={() => handleVideoInteraction('hover')}
              onClick={() => handleVideoInteraction('click')}
            >
              {/* Marco decorativo que se desvanece con una transición más suave */}
              <VideoFrame isVisible={!isVideoExpanded} />
              
              {/* Indicador visual para clicks posteriores */}
              {hasBeenExpandedOnce && !isVideoExpanded && (
                <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-sm rounded-full p-2">
                  <Maximize2 size={16} className="text-white" />
                </div>
              )}
              
              {/* Contenedor del video con transición mejorada */}
              <div
                ref={videoRef}
                className={`relative overflow-hidden rounded-lg shadow-xl ${
                  !isVideoExpanded ? "cursor-pointer" : ""
                }`}
                style={{
                  position: isVideoExpanded ? "fixed" : "relative",
                  inset: isVideoExpanded ? "0" : "auto",
                  zIndex: isVideoExpanded ? "50" : "auto",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: isVideoExpanded ? "rgba(0,0,0,0.8)" : "transparent",
                  padding: isVideoExpanded ? "1rem" : "0",
                  transition: "all 0.85s cubic-bezier(0.19, 1, 0.22, 1)",
                }}
              >
                {/* Video con transición mejorada */}
                <video
                  ref={videoElementRef}
                  className={`transition-all duration-850 ease-out ${
                    isVideoExpanded
                      ? "h-auto w-full max-w-[70vw] mx-auto rounded"
                      : "h-full w-full object-cover"
                  }`}
                  autoPlay
                  muted
                  loop
                  playsInline
                  style={{ 
                    zIndex: isVideoExpanded ? 100 : "auto",
                    transition: "all 0.85s cubic-bezier(0.19, 1, 0.22, 1)"
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                  Tu navegador no soporta videos HTML5.
                </video>

                {/* Controles de video */}
                <VideoControls />
              </div>
            </div>
          </div>

          {/* Columna derecha - Texto */}
          <div className="flex w-full flex-col justify-center py-6 text-white md:w-1/2 md:py-12">
            <h1 className="mb-2 text-5xl font-bold md:text-7xl">
              Somos una
              <br />
              familia creativa
            </h1>

            <p className="mb-8 max-w-lg text-lg leading-relaxed">
              Con el profundo deseo de contar historias para el público infantil.
              Desde hace 15 años venimos produciendo contenidos culturales y
              educativos, en diversos formatos, que hablan de lo que somos y sentimos
              con mucha identidad y una gran pertinencia universal.
            </p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              {/* Renderizamos los features mediante un map para mayor mantenibilidad */}
              {features.map((feature, index) => (
                <FeatureItem key={index} feature={feature} />
              ))}
            </div>
          </div>
        </div>

        {/* Ondas decorativas en la parte inferior */}
        {!isVideoExpanded && (
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
              className="w-full"
            >
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,224L60,218.7C120,213,240,203,360,197.3C480,192,600,192,720,192C840,192,960,192,1080,197.3C1200,203,1320,213,1380,218.7L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
              ></path>
            </svg>
          </div>
        )}
      </section>
    </>
  );
};

export default Hero;