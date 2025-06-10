"use client";
import { useState, useRef, useEffect } from "react";
import { useServices } from "@/lib/hooks/useServices";

const Services = () => {
  const { data: services, loading, error } = useServices();
  const [activeService, setActiveService] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Intersection Observer para animaciones al scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  if (loading) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-gray-50" ref={sectionRef} id="servicios">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-gray-800 md:text-6xl">
              Cargando Servicios...
            </h2>
          </div>
          
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div
                key={index}
                className="rounded-xl bg-gray-200 p-6 animate-pulse"
                style={{ height: '280px' }}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-gray-50" ref={sectionRef} id="servicios">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-red-600">Error</h2>
            <p className="text-red-500">No se pudieron cargar los servicios: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  if (!services || services.length === 0) {
    return (
      <section className="relative min-h-screen overflow-hidden bg-gray-50" ref={sectionRef} id="servicios">
        <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
          <div className="text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-800">No hay servicios disponibles</h2>
          </div>
        </div>
      </section>
    );
  }

  // Componente para cada tarjeta de servicio
  const ServiceCard = ({ service, index }: { service: any; index: number }) => {
    const isActive = activeService === index;
    
    return (
      <div
        className={`group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: `${index * 0.1}s`,
          animationFillMode: 'both'
        }}
        onMouseEnter={() => setActiveService(index)}
        onMouseLeave={() => setActiveService(null)}
      >
        {/* Gradient Border Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10 rounded-xl`} />
        
        {/* Icon Container */}
        <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          <div className="text-white text-2xl">{service.icon}</div>
          
          {/* Shine Effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        </div>

        {/* Content */}
        <h3 className="mb-3 text-xl font-semibold text-gray-800 transition-colors duration-300 group-hover:text-purple-700">
          {service.title}
        </h3>
        
        <p className="mb-4 text-sm text-gray-600 leading-relaxed">
          {service.description}
        </p>

        {/* Features List */}
        <ul className="space-y-2">
          {service.features?.map((feature: any, featureIndex: number) => (
            <li 
              key={featureIndex}
              className="flex items-center text-xs text-gray-500 transition-all duration-300"
            >
              <div className={`mr-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${service.gradient} transition-transform duration-300 ${isActive ? 'scale-125' : 'scale-100'}`} />
              {feature.title}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gray-50" ref={sectionRef} id="servicios">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 py-16 md:px-8 md:py-24">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <h2 className="mb-4 text-4xl font-bold text-gray-800 md:text-6xl">
              Nuestros{' '}
              <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Servicios
              </span>
            </h2>
            
            <p className="mx-auto max-w-2xl text-lg text-gray-600 leading-relaxed">
              Transformamos ideas en experiencias audiovisuales extraordinarias. 
              Desde la conceptualización hasta la postproducción, te acompañamos en cada etapa 
              con la misma pasión que ponemos en nuestros propios proyectos.
            </p>
            
            <div className="mt-2 text-sm text-gray-500">
              {services.length} servicios disponibles
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 mb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={service.id} service={service} index={index} />
          ))}
        </div>
      </div>

      {/* CSS para las animaciones personalizadas */}
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}</style>
    </section>
  );
};

export default Services;