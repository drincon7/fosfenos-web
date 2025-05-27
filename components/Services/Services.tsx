"use client";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
// Importamos los iconos necesarios de Lucide React
import { 
  Target, 
  Zap, 
  Camera, 
  Palette, 
  PenTool, 
  Monitor, 
  Video, 
  Sparkles,
  ArrowRight,
  Play
} from "lucide-react";

// Definimos interfaces para mantener el código tipado y escalable
interface Service {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  delay: number;
}

interface ProcessStep {
  number: number;
  title: string;
  isActive: boolean;
}

const Services = () => {
  const [activeService, setActiveService] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [processStep, setProcessStep] = useState(0);

  // Definimos nuestros servicios con estructura escalable
  const services: Service[] = [
    {
      icon: Target,
      title: "Conceptualización",
      description: "Desarrollamos la idea central de tu proyecto, definiendo objetivos, audiencia y mensaje clave para crear una base sólida.",
      features: [
        "Análisis de mercado y audiencia",
        "Desarrollo de propuesta creativa", 
        "Definición de objetivos",
        "Investigación y benchmarking"
      ],
      gradient: "from-purple-600 to-blue-600",
      delay: 0.1
    },
    {
      icon: Zap,
      title: "Desarrollo",
      description: "Convertimos conceptos en proyectos viables, estructurando la narrativa y planificando cada aspecto técnico y creativo.",
      features: [
        "Desarrollo de narrativa",
        "Planificación técnica",
        "Estructura del proyecto",
        "Análisis de viabilidad"
      ],
      gradient: "from-blue-600 to-cyan-600",
      delay: 0.2
    },
    {
      icon: Camera,
      title: "Preproducción",
      description: "Preparamos meticulosamente cada detalle antes del rodaje, desde casting hasta locaciones y cronogramas.",
      features: [
        "Casting y selección de talento",
        "Scouting de locaciones",
        "Planificación de cronograma",
        "Preparación de equipos"
      ],
      gradient: "from-cyan-600 to-teal-600",
      delay: 0.3
    },
    {
      icon: Palette,
      title: "Diseño de Producción",
      description: "Creamos la identidad visual del proyecto, definiendo estética, paleta de colores y elementos gráficos únicos.",
      features: [
        "Desarrollo de identidad visual",
        "Diseño de escenografía",
        "Paleta de colores",
        "Arte conceptual"
      ],
      gradient: "from-teal-600 to-green-600",
      delay: 0.4
    },
    {
      icon: PenTool,
      title: "Guionización",
      description: "Escribimos guiones cautivadores que conectan con la audiencia, equilibrando narrativa, diálogos y ritmo.",
      features: [
        "Escritura de guión técnico",
        "Desarrollo de personajes",
        "Estructura narrativa",
        "Adaptaciones y rewrites"
      ],
      gradient: "from-green-600 to-yellow-600",
      delay: 0.5
    },
    {
      icon: Monitor,
      title: "Creación de Formatos",
      description: "Diseñamos formatos innovadores y escalables para diferentes plataformas y audiencias.",
      features: [
        "Desarrollo de formatos originales",
        "Adaptación multiplataforma",
        "Biblias de producción",
        "Estrategias de distribución"
      ],
      gradient: "from-yellow-600 to-orange-600",
      delay: 0.6
    },
    {
      icon: Video,
      title: "Producción",
      description: "Ejecutamos el rodaje con equipos profesionales y tecnología de vanguardia para capturar cada momento perfectamente.",
      features: [
        "Dirección y supervisión",
        "Manejo de equipos técnicos",
        "Coordinación de talento",
        "Control de calidad en tiempo real"
      ],
      gradient: "from-orange-600 to-red-600",
      delay: 0.7
    },
    {
      icon: Sparkles,
      title: "Postproducción",
      description: "Damos vida al material grabado con edición profesional, efectos visuales, sonido y color de nivel cinematográfico.",
      features: [
        "Edición y montaje",
        "Efectos visuales y VFX",
        "Corrección de color",
        "Diseño sonoro y mezcla"
      ],
      gradient: "from-red-600 to-pink-600",
      delay: 0.8
    }
  ];

  // Pasos del proceso para la timeline
  const processSteps: ProcessStep[] = [
    { number: 1, title: "Conceptualización", isActive: processStep >= 0 },
    { number: 2, title: "Desarrollo", isActive: processStep >= 1 },
    { number: 3, title: "Preproducción", isActive: processStep >= 2 },
    { number: 4, title: "Producción", isActive: processStep >= 3 },
    { number: 5, title: "Postproducción", isActive: processStep >= 4 }
  ];

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

  // Animación automática del proceso
  useEffect(() => {
    if (isVisible) {
      const interval = setInterval(() => {
        setProcessStep((prev) => (prev + 1) % 5);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  // Componente para cada tarjeta de servicio
  const ServiceCard = ({ service, index }: { service: Service; index: number }) => {
    const IconComponent = service.icon;
    const isActive = activeService === index;
    
    return (
      <div
        className={`group relative overflow-hidden rounded-xl bg-white p-6 shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
          isVisible ? 'animate-fade-in-up' : 'opacity-0'
        }`}
        style={{ 
          animationDelay: `${service.delay}s`,
          animationFillMode: 'both'
        }}
        onMouseEnter={() => setActiveService(index)}
        onMouseLeave={() => setActiveService(null)}
      >
        {/* Gradient Border Effect */}
        <div className={`absolute inset-0 bg-gradient-to-r ${service.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-10 rounded-xl`} />
        
        {/* Icon Container */}
        <div className={`relative mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gradient-to-r ${service.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}>
          <IconComponent size={32} className="text-white" />
          
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
          {service.features.map((feature, featureIndex) => (
            <li 
              key={featureIndex}
              className="flex items-center text-xs text-gray-500 transition-all duration-300"
            >
              <div className={`mr-2 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${service.gradient} transition-transform duration-300 ${isActive ? 'scale-125' : 'scale-100'}`} />
              {feature}
            </li>
          ))}
        </ul>

        {/* Hover Arrow */}
        <div className={`absolute bottom-4 right-4 transition-all duration-300 ${isActive ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'}`}>
          <ArrowRight size={16} className="text-purple-600" />
        </div>
      </div>
    );
  };

  // Componente para el proceso timeline
  const ProcessTimeline = () => (
    <div className="relative">
      <div className="flex flex-wrap justify-center items-center gap-4 max-w-4xl mx-auto">
        {processSteps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`relative flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-500 ${
                step.isActive
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 border-purple-600 text-white scale-110'
                  : 'bg-white border-gray-300 text-gray-400'
              }`}
            >
              <span className="font-semibold text-sm">{step.number}</span>
              
              {/* Pulse effect for active step */}
              {step.isActive && (
                <div className="absolute inset-0 rounded-full bg-purple-600 animate-ping opacity-20" />
              )}
            </div>
            
            <span className={`ml-2 text-sm font-medium transition-colors duration-500 ${
              step.isActive ? 'text-purple-700' : 'text-gray-500'
            }`}>
              {step.title}
            </span>
            
            {/* Connector line */}
            {index < processSteps.length - 1 && (
              <div className={`hidden sm:block w-8 h-0.5 mx-4 transition-colors duration-500 ${
                processStep > index ? 'bg-purple-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

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
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 gap-6 mb-20 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard key={index} service={service} index={index} />
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