"use client";
import React from "react";
import Image from "next/image";
import { useBrands } from "@/lib/hooks/useBrands";

const Brands = () => {
  const { data: brands, loading, error } = useBrands();

  if (loading) {
    return (
      <section className="border border-x-0 border-y-stroke bg-alabaster py-11 dark:border-y-strokedark dark:bg-black overflow-hidden">
        <div className="brands-wrapper">
          <div className="marquee-container">
            <div className="marquee">
              {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="brand-item">
                  <div className="relative block h-12 w-[120px] bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !brands || brands.length === 0) {
    return null; // No mostrar nada si hay error o no hay marcas
  }

  // Cuadruplicar las marcas para efecto infinito
  const repeatedBrands = [...brands, ...brands, ...brands, ...brands];

  return (
    <>
      <section className="border border-x-0 border-y-stroke bg-alabaster py-11 dark:border-y-strokedark dark:bg-black overflow-hidden">
        <div className="brands-wrapper">
          {/* Primera fila de marcas - movimiento hacia la derecha */}
          <div className="marquee-container">
            <div className="marquee">
              {repeatedBrands.map((brand, key) => (
                <BrandItem brand={brand} key={`row1-${key}`} />
              ))}
            </div>
          </div>
          
          {/* Segunda fila de marcas - movimiento hacia la izquierda */}
          <div className="marquee-container">
            <div className="marquee marquee-reverse">
              {[...repeatedBrands].reverse().map((brand, key) => (
                <BrandItem brand={brand} key={`row2-${key}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .brands-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
        
        .marquee-container {
          width: 100vw;
          overflow: hidden;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
        }
        
        .marquee {
          display: flex;
          animation: marquee 40s linear infinite;
          white-space: nowrap;
          will-change: transform;
        }
        
        .marquee-reverse {
          animation: marquee-reverse 35s linear infinite;
        }
        
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-25%);
          }
        }
        
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-25%);
          }
          100% {
            transform: translateX(0);
          }
        }
        
        .brand-item {
          flex: 0 0 auto;
          margin: 0 1.5rem;
          opacity: 0.65;
          transition: opacity 0.3s ease;
        }
        
        .brand-item:hover {
          opacity: 1;
        }
      `}</style>
    </>
  );
};

// Componente individual para cada marca
const BrandItem = ({ brand }: { brand: any }) => {
  const { image, href, name, imageLight } = brand;

  return (
    <a href={href || '#'} className="brand-item relative block h-12 w-[120px]">
      <Image
        className="transition-all duration-300 dark:hidden"
        src={image}
        alt={name}
        fill
        style={{ objectFit: 'contain' }}
      />
      <Image
        className="hidden transition-all duration-300 dark:block"
        src={imageLight}
        alt={name}
        fill
        style={{ objectFit: 'contain' }}
      />
    </a>
  );
};

export default Brands;
