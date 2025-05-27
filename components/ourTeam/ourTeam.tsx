"use client";
import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import MiembroCard from "./MiembroCard";
import equipoData from "./equipoData";

const NuestroEquipo = () => {
  return (
    <section className="relative py-20 bg-white dark:bg-blacksection"
    id="equipo">
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
          {equipoData.map((miembro) => (
            <MiembroCard key={miembro.id} miembro={miembro} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default NuestroEquipo;