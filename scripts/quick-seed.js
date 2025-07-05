// scripts/quick-seed.js
// Script temporal para poblar datos sin TypeScript

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const sampleContent = [
  {
    title: "Aventuras de Luna",
    shortDescription: "Serie animada educativa",
    description: "Una serie que estimula la imaginación y enseña valores a través de las aventuras de Luna y sus amigos.",
    image: "/images/content/assassins.webp",
    details: JSON.stringify(["Edad recomendada: 3-6 años", "Duración: 15 minutos por episodio", "Temporadas disponibles: 2"]),
    order: 1,
    active: true
  },
  {
    title: "El Mundo de Colores",
    shortDescription: "Programa interactivo",
    description: "Un programa interactivo donde los niños aprenden sobre colores, formas y creatividad a través de juegos divertidos.",
    image: "/images/content/castlevania.webp",
    details: JSON.stringify(["Edad recomendada: 2-5 años", "Episodios: 20", "Incluye actividades"]),
    order: 2,
    active: true
  },
  {
    title: "Pequeños Científicos",
    shortDescription: "Experimentos para niños",
    description: "Una serie educativa que introduce conceptos básicos de ciencia a través de experimentos seguros y divertidos.",
    image: "/images/content/dune.webp",
    details: JSON.stringify(["Edad recomendada: 5-8 años", "Supervisión adulta recomendada", "Material educativo incluido"]),
    order: 3,
    active: true
  },
  {
    title: "Cuentos de la Abuela",
    shortDescription: "Historias tradicionales",
    description: "Una colección de cuentos tradicionales narrados de manera moderna, preservando valores culturales importantes.",
    image: "/images/content/Shingeki_no_Kyojin.webp",
    details: JSON.stringify(["Todas las edades", "Basado en folklore local", "Incluye moralejas"]),
    order: 4,
    active: true
  }
];

async function quickSeed() {
  console.log('🌱 Iniciando sembrado rápido...');

  try {
    for (const content of sampleContent) {
      await prisma.infiniteContent.create({
        data: content
      });
      console.log(`✅ Creado: ${content.title}`);
    }

    console.log(`🎉 Sembrado completado! Se crearon ${sampleContent.length} elementos.`);

  } catch (error) {
    console.error('❌ Error durante el sembrado:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickSeed();