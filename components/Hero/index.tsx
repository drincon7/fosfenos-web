"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
// Importamos los iconos necesarios de Lucide React
import { Palette, Lightbulb, Wrench, MessageCircle } from "lucide-react";

// Definimos una interfaz para nuestros features para hacerlo más mantenible
interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Hero = () => {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const videoRef = useRef<HTMLDivElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const videoContainerRef = useRef<HTMLDivElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

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

  // Función mejorada para manejar clics, posición del mouse y scroll
  useEffect(() => {
    // Manejador de clics fuera del video
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isVideoExpanded &&
        videoRef.current &&
        !videoRef.current.contains(event.target as Node)
      ) {
        collapseVideo();
      }
    };

    // Función para cerrar el video al hacer scroll
    const handleScroll = () => {
      if (isVideoExpanded) {
        collapseVideo();
      }
    };

    // Función mejorada para verificar si el mouse está fuera del contenedor del video
    const handleMousePosition = (event: MouseEvent) => {
      if (!isVideoExpanded || isAnimating) return; // No verificar durante animaciones
      
      if (videoRef.current) {
        const rect = videoRef.current.getBoundingClientRect();
        
        // Aumentamos el margen para mejor detección
        const margin = 20;
        const isOutside = 
          event.clientX < rect.left - margin || 
          event.clientX > rect.right + margin || 
          event.clientY < rect.top - margin || 
          event.clientY > rect.bottom + margin;
        
        if (isOutside) {
          collapseVideo();
        }
      }
    };

    // Optimización: Solo añadir listeners necesarios
    if (isVideoExpanded) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll);
      document.addEventListener("mousemove", handleMousePosition);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousemove", handleMousePosition);
    };
  }, [isVideoExpanded, isAnimating]);

  // Asegurarse de que el video se reproduzca cuando cambie de estado
  useEffect(() => {
    if (videoElementRef.current) {
      videoElementRef.current.play().catch((error) => {
        console.error("Error reproduciendo el video:", error);
      });
    }
  }, [isVideoExpanded]);

  // Función mejorada para expandir el video con animación suavizada
  const expandVideo = () => {
    if (isAnimating) return; // Evitar múltiples expansiones durante la animación
    
    setIsAnimating(true);
    setIsVideoExpanded(true);
    
    // Resetear el estado de animación después de completarse
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // Tiempo ligeramente superior a la duración de la transición
  };

  // Función mejorada para contraer el video con animación suavizada
  const collapseVideo = () => {
    if (isAnimating) return; // Evitar múltiples contracciones durante la animación
    
    setIsAnimating(true);
    setIsVideoExpanded(false);
    
    // Resetear el estado de animación después de completarse
    setTimeout(() => {
      setIsAnimating(false);
    }, 1000); // Tiempo ligeramente superior a la duración de la transición
  };

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
              onMouseEnter={expandVideo}
              // onMouseLeave se maneja con la detección avanzada
            >
              {/* Marco decorativo que se desvanece con una transición más suave */}
              <VideoFrame isVisible={!isVideoExpanded} />
              
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
                  // Transición suavizada con curva personalizada
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
                  controls={isVideoExpanded}
                  style={{ 
                    zIndex: isVideoExpanded ? 100 : "auto",
                    // Transición adicional para el video interno
                    transition: "all 0.85s cubic-bezier(0.19, 1, 0.22, 1)"
                  }}
                >
                  <source src="/videos/hero.mp4" type="video/mp4" />
                  Tu navegador no soporta videos HTML5.
                </video>
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