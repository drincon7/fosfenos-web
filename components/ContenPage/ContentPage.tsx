"use client";
import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";
import { Play, Download, Globe, Facebook, Instagram, ExternalLink, X, Pause, Maximize2, Minimize2 } from "lucide-react";
import { ContentData, AWARD_COLORS } from "@/types/content";

interface ContentPageProps {
  data: ContentData;
}

const ContentPage = ({ data }: ContentPageProps) => {
  const [isVideoExpanded, setIsVideoExpanded] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasBeenExpandedOnce, setHasBeenExpandedOnce] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const videoRef = useRef<HTMLDivElement | null>(null);
  const videoElementRef = useRef<HTMLVideoElement | null>(null);

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

  // Asegurar reproducción del video
  useEffect(() => {
    if (videoElementRef.current) {
      videoElementRef.current.play().catch((error) => {
        console.error("Error reproduciendo el video:", error);
      });
    }
  }, [isVideoExpanded]);

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

  // Componente de premio
  const AwardItem = ({ award }: { award: typeof data.awards[0] }) => (
    <div className="group relative rounded-lg border border-purple-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="mb-2 flex items-center justify-between">
        <span className={`inline-block rounded-full px-2 py-1 text-xs font-semibold text-white ${
          award.status === 'ganador' ? 'bg-yellow-500' : 
          award.status === 'nominacion' ? 'bg-gray-400' : 'bg-orange-400'
        }`}>
          {award.status === 'ganador' ? 'GANADOR' : 
           award.status === 'nominacion' ? 'NOMINACIÓN' : 'MENCIÓN'}
        </span>
        <span className="text-sm font-medium text-purple-600">{award.country}</span>
      </div>
      <h4 className="mb-1 font-semibold text-gray-800">{award.title}</h4>
      <p className="mb-2 text-sm text-gray-600">{award.category}</p>
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>{award.festival}</span>
        <span>{award.year}</span>
      </div>
    </div>
  );

  // Componente de información técnica
  const TechnicalInfoItem = ({ label, value }: { label: string; value: string }) => (
    <div className="text-center">
      <div className="mb-2 text-sm font-medium text-gray-600">{label}:</div>
      <div className="font-semibold text-purple-800">{value}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Sección de Video Principal */}
      <section className="relative overflow-hidden bg-gradient-to-r from-purple-900 to-purple-700 py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="flex flex-col items-center justify-center lg:flex-row lg:gap-12">
            {/* Video Container */}
            <div className="mb-8 w-full max-w-2xl lg:mb-0 lg:w-1/2">
              <div
                className="relative w-full"
                style={{ aspectRatio: "16/9" }}
                onMouseEnter={() => handleVideoInteraction('hover')}
                onClick={() => handleVideoInteraction('click')}
              >
                {/* Indicador visual para clicks posteriores */}
                {hasBeenExpandedOnce && !isVideoExpanded && (
                  <div className="absolute top-4 right-4 z-30 bg-black/50 backdrop-blur-sm rounded-full p-2">
                    <Maximize2 size={16} className="text-white" />
                  </div>
                )}
                
                <div
                  ref={videoRef}
                  className={`relative overflow-hidden rounded-lg shadow-2xl ${
                    !isVideoExpanded ? "cursor-pointer" : ""
                  }`}
                  style={{
                    position: isVideoExpanded ? "fixed" : "relative",
                    inset: isVideoExpanded ? "0" : "auto",
                    zIndex: isVideoExpanded ? "50" : "auto",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isVideoExpanded ? "rgba(0,0,0,0.9)" : "transparent",
                    padding: isVideoExpanded ? "2rem" : "0",
                    transition: "all 0.85s cubic-bezier(0.19, 1, 0.22, 1)",
                  }}
                >
                  <video
                    ref={videoElementRef}
                    className={`transition-all duration-850 ease-out ${
                      isVideoExpanded
                        ? "h-auto w-full max-w-[80vw] rounded"
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
                    <source src={data.videoUrl} type="video/mp4" />
                    Tu navegador no soporta videos HTML5.
                  </video>

                  {/* Play Overlay - Solo cuando no está expandido */}
                  {!isVideoExpanded && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 transition-opacity hover:bg-black/20">
                      <div className="rounded-full bg-white/20 p-4 backdrop-blur-sm transition-transform hover:scale-110">
                        <Play className="h-8 w-8 text-white" fill="white" />
                      </div>
                    </div>
                  )}

                  {/* Controles de video */}
                  <VideoControls />
                </div>
              </div>
            </div>

            {/* Información Principal */}
            <div className="w-full text-center text-white lg:w-1/2 lg:text-left">
              <h1 className="mb-4 text-4xl font-bold md:text-6xl">{data.title}</h1>
              {data.subtitle && (
                <p className="mb-6 text-xl text-purple-200">{data.subtitle}</p>
              )}
              <p className="mb-8 text-lg leading-relaxed text-purple-100">
                {data.synopsis}
              </p>
              
              {/* Botones de Acción */}
              <div className="flex flex-wrap justify-center gap-4 lg:justify-start">
                {data.platforms.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    className="flex items-center gap-2 rounded-full bg-white/20 px-6 py-3 font-semibold text-white transition-all hover:bg-white/30 hover:scale-105"
                  >
                    <span>{platform.icon}</span>
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Sinopsis y Ficha Técnica */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Sinopsis */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-purple-800">Sinopsis</h2>
              <div className="prose prose-lg text-gray-700">
                {data.synopsis.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>

            {/* Ficha Técnica */}
            <div>
              <h2 className="mb-6 text-3xl font-bold text-purple-800">Ficha Técnica</h2>
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                <TechnicalInfoItem 
                  label="Formato" 
                  value={data.technicalInfo.formato} 
                />
                <TechnicalInfoItem 
                  label="Duración" 
                  value={data.technicalInfo.duracion} 
                />
                <TechnicalInfoItem 
                  label="Género" 
                  value={data.technicalInfo.genero} 
                />
                <TechnicalInfoItem 
                  label="Público" 
                  value={data.technicalInfo.publico} 
                />
                <TechnicalInfoItem 
                  label="Estado" 
                  value={data.technicalInfo.estado} 
                />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-purple-100 p-4">
                  <h4 className="mb-2 font-semibold text-purple-800">Empresa Productora:</h4>
                  <p className="text-purple-600">
                    {data.technicalInfo.empresaProductora.nombre}
                    <br />
                    <span className="text-sm">({data.technicalInfo.empresaProductora.pais})</span>
                  </p>
                </div>
                
                {data.technicalInfo.empresaCoproductora && data.technicalInfo.empresaCoproductora.nombre && (
                  <div className="rounded-lg bg-purple-100 p-4">
                    <h4 className="mb-2 font-semibold text-purple-800">Empresa Coproductora:</h4>
                    <p className="text-purple-600">
                      {data.technicalInfo.empresaCoproductora.nombre}
                      <br />
                      <span className="text-sm">({data.technicalInfo.empresaCoproductora.pais})</span>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sección Premios y Nominaciones */}
      <section className="bg-purple-900 py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <h2 className="mb-12 text-center text-4xl font-bold">Premios y Nominaciones</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.awards.map((award) => (
              <AwardItem key={award.id} award={award} />
            ))}
          </div>
        </div>
      </section>

      {/* Sección CTA */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-20">
        <div className="mx-auto max-w-4xl px-4 text-center md:px-8">
          <h2 className="mb-6 text-4xl font-bold text-white">Conoce más:</h2>
          
          <div className="grid gap-8 md:grid-cols-2">
            {/* Disponible en */}
            <div>
              <h3 className="mb-4 text-2xl font-semibold text-white">Disponible en:</h3>
              <div className="space-y-3">
                {data.platforms.map((platform, index) => (
                  <a
                    key={index}
                    href={platform.url}
                    className="flex items-center justify-center gap-3 rounded-lg bg-white/20 p-4 font-semibold text-white transition-all hover:bg-white/30"
                  >
                    <span className="text-2xl">{platform.icon}</span>
                    {platform.name}
                  </a>
                ))}
              </div>
            </div>

            {/* Enlaces adicionales */}
            <div>
              <h3 className="mb-4 text-2xl font-semibold text-white">Más información:</h3>
              <div className="space-y-3">
                {data.additionalInfo?.pressbook && (
                  <a
                    href={data.additionalInfo.pressbook}
                    className="flex items-center justify-center gap-3 rounded-lg bg-white/20 p-4 font-semibold text-white transition-all hover:bg-white/30"
                  >
                    <Download className="h-5 w-5" />
                    PressBook Descargable
                  </a>
                )}
                
                {data.additionalInfo?.website && (
                  <a
                    href={data.additionalInfo.website}
                    className="flex items-center justify-center gap-3 rounded-lg bg-white/20 p-4 font-semibold text-white transition-all hover:bg-white/30"
                  >
                    <Globe className="h-5 w-5" />
                    Sitio Web Oficial
                  </a>
                )}

                {data.additionalInfo?.socialMedia && (
                  <div className="flex gap-3">
                    {data.additionalInfo.socialMedia.facebook && (
                      <a
                        href={data.additionalInfo.socialMedia.facebook}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/20 p-4 font-semibold text-white transition-all hover:bg-white/30"
                      >
                        <Facebook className="h-5 w-5" />
                        Facebook
                      </a>
                    )}
                    {data.additionalInfo.socialMedia.instagram && (
                      <a
                        href={data.additionalInfo.socialMedia.instagram}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-white/20 p-4 font-semibold text-white transition-all hover:bg-white/30"
                      >
                        <Instagram className="h-5 w-5" />
                        Instagram
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentPage;