"use client";
import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { MiembroEquipo } from "@/types/miembroEquipo";

interface MiembroCardProps {
  miembro: MiembroEquipo;
}

const MiembroCard = ({ miembro }: MiembroCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const colorLayerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Función para manejar el efecto spotlight
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !cardRef.current || !spotlightRef.current || !colorLayerRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    spotlightRef.current.style.left = `${x}px`;
    spotlightRef.current.style.top = `${y}px`;
    colorLayerRef.current.style.opacity = '1';
  };

  // Función para ocultar el efecto spotlight
  const handleMouseLeave = () => {
    if (isMobile || !colorLayerRef.current) return;
    colorLayerRef.current.style.opacity = '0';
  };

  // Función para mover el spotlight en modo móvil
  const moveSpotlightAuto = () => {
    if (!isMobile || !cardRef.current || !spotlightRef.current || !colorLayerRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const x = rect.width / 2 + Math.sin(Date.now() / 1000) * (rect.width / 3);
    const y = rect.height / 2 + Math.cos(Date.now() / 1000) * (rect.height / 3);
    
    spotlightRef.current.style.left = `${x}px`;
    spotlightRef.current.style.top = `${y}px`;
    colorLayerRef.current.style.opacity = '1';
  };

  // Efecto para detectar tamaño de pantalla y configurar animación automática
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    handleResize(); // Inicializar
    window.addEventListener('resize', handleResize);
    
    let animationFrame: number;
    
    if (isMobile) {
      // Usar requestAnimationFrame para una animación más fluida
      const animate = () => {
        moveSpotlightAuto();
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isMobile]);

  return (
    <motion.div
      ref={cardRef}
      className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer aspect-square"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      {/* Capa base en escala de grises */}
      <div className="relative w-full h-full">
        <Image 
          src={miembro.imagen}
          alt={miembro.nombre} 
          fill 
          className="object-cover filter grayscale dark:hidden"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {miembro.imagenDark && (
          <Image 
            src={miembro.imagenDark}
            alt={miembro.nombre} 
            fill 
            className="object-cover filter grayscale hidden dark:block"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        )}
      </div>
      
      {/* Contenedor del efecto spotlight */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Capa de color original que se mostrará con el spotlight */}
        <div 
          ref={colorLayerRef}
          className="absolute top-0 left-0 w-full h-full opacity-0 transition-opacity duration-300"
        >
          <Image 
            src={miembro.imagen}
            alt=""
            fill 
            className="object-cover dark:hidden"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          {miembro.imagenDark && (
            <Image 
              src={miembro.imagenDark}
              alt=""
              fill 
              className="object-cover hidden dark:block"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        
        {/* Efecto spotlight */}
        <div 
          ref={spotlightRef}
          className="absolute w-32 h-32 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 mix-blend-overlay"
          style={{ 
            background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 70%)'
          }}
        ></div>
      </div>
      
      {/* Información del miembro */}
      <div className="absolute bottom-0 left-0 w-full p-4 text-white bg-gradient-to-t from-black/80 to-transparent">
        <h3 className="text-lg font-medium">{miembro.nombre}</h3>
        <p className="text-sm opacity-80">{miembro.cargo}</p>
      </div>
    </motion.div>
  );
};

export default MiembroCard;