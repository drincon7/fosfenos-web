"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MiembroCard from "./MiembroCard";
import { useTeam } from "@/lib/hooks/useTeam";

const NuestroEquipo = () => {
  const { data: teamMembers, loading, error } = useTeam();

  if (loading) {
    return (
      <section className="relative py-20 bg-white dark:bg-blacksection" id="equipo">
        <div className="container mx-auto px-4 md:px-8 2xl:px-0 max-w-c-1390">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl font-bold text-black dark:text-white mb-4 xl:text-sectiontitle2">
              Nuestro Equipo
            </h2>
            <p className="text-base text-body-color dark:text-body-color-dark max-w-2xl mx-auto">
              Mentes creativas y corazones coloridos hacen realidad nuestros proyectos.
            </p>
          </div>
          
          {/* Loading State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square rounded-lg bg-gray-200 dark:bg-gray-700 animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-20 bg-white dark:bg-blacksection" id="equipo">
        <div className="container mx-auto px-4 md:px-8 2xl:px-0 max-w-c-1390">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-red-600 mb-4">Error</h2>
            <p className="text-red-500">No se pudo cargar el equipo: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative py-20 bg-white dark:bg-blacksection" id="equipo">
      <div className="absolute -top-16 -z-1 mx-auto h-[350px] w-[90%]">
        <Image
          fill
          className="dark:hidden"
          src="/images/shape/shape-dotted-light.svg"
          alt="Dotted Shape"
        />
        <Image
          fill
          className="hidden dark:block"
          src="/images/shape/shape-dotted-dark.svg"
          alt="Dotted Shape"
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 2xl:px-0 max-w-c-1390">
        <motion.div
          variants={{
            hidden: {
              opacity: 0,
              y: -20,
            },
            visible: {
              opacity: 1,
              y: 0,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl font-bold text-black dark:text-white mb-4 xl:text-sectiontitle2">
            Nuestro Equipo
          </h2>
          <p className="text-base text-body-color dark:text-body-color-dark max-w-2xl mx-auto">
            Mentes creativas y corazones coloridos hacen realidad nuestros proyectos.
          </p>
          <div className="mt-2 text-sm text-gray-500">
            {teamMembers ? `${teamMembers.length} miembros` : ''}
          </div>
        </motion.div>

        <motion.div
          variants={{
            hidden: {
              opacity: 0,
            },
            visible: {
              opacity: 1,
            },
          }}
          initial="hidden"
          whileInView="visible"
          transition={{ duration: 0.5, delay: 0.5 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6"
        >
          {teamMembers?.map((miembro) => (
            <MiembroCard key={miembro.id} miembro={miembro} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NuestroEquipo;