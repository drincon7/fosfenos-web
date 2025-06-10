// scripts/migrate-existing-data.ts (VERSIÓN FINAL CORREGIDA)
import { prisma } from '@/lib/database';

// Importar datos existentes
import equipoData from '../components/ourTeam/equipoData';
import brandData from '../components/Brands/brandData';
import { lilaData } from '../app/data/lilaData';
import { pescadorData } from '../app/data/pescadorData';
import { guilleycandeData } from '../app/data/guilleycandeData';

// Función helper para convertir status a enum de Prisma
function mapAwardStatus(status: string): 'GANADOR' | 'NOMINACION' | 'MENCION' {
  switch (status.toLowerCase()) {
    case 'ganador':
      return 'GANADOR';
    case 'nominacion':
      return 'NOMINACION';
    case 'mencion':
      return 'MENCION';
    default:
      console.warn(`Status desconocido: ${status}, usando NOMINACION como default`);
      return 'NOMINACION';
  }
}

// Función helper para sanitizar datos
function sanitizeString(str: string | undefined | null): string | null {
  if (!str || str.trim() === '') return null;
  return str.trim();
}

async function migrateTeamData() {
  console.log('🔄 Migrando datos del equipo...');
  
  try {
    for (const [index, miembro] of equipoData.entries()) {
      await prisma.teamMember.upsert({
        where: { 
          id: miembro.id || `team-${index}`
        },
        update: {
          nombre: miembro.nombre,
          cargo: miembro.cargo,
          imagen: miembro.imagen,
          imagenDark: miembro.imagenDark || miembro.imagen,
          order: index,
          active: true
        },
        create: {
          id: miembro.id || `team-${index}`,
          nombre: miembro.nombre,
          cargo: miembro.cargo,
          imagen: miembro.imagen,
          imagenDark: miembro.imagenDark || miembro.imagen,
          order: index,
          active: true
        }
      });
    }
    
    console.log(`✅ Migrados ${equipoData.length} miembros del equipo`);
  } catch (error) {
    console.error('❌ Error migrando equipo:', error);
    throw error;
  }
}

async function migrateBrandData() {
  console.log('🔄 Migrando datos de marcas...');
  
  try {
    for (const [index, brand] of brandData.entries()) {
      await prisma.brand.upsert({
        where: { 
          id: `brand-${brand.id}`
        },
        update: {
          name: brand.name,
          href: brand.href || '#',
          image: brand.image,
          imageLight: brand.imageLight || brand.image,
          order: index,
          active: true
        },
        create: {
          id: `brand-${brand.id}`,
          name: brand.name,
          href: brand.href || '#',
          image: brand.image,
          imageLight: brand.imageLight || brand.image,
          order: index,
          active: true
        }
      });
    }
    
    console.log(`✅ Migradas ${brandData.length} marcas`);
  } catch (error) {
    console.error('❌ Error migrando marcas:', error);
    throw error;
  }
}

async function migrateChildContentData() {
  console.log('🔄 Migrando contenido infantil...');
  
  const contents = [
    { ...lilaData, slug: 'el-libro-de-lila' },
    { ...pescadorData, slug: 'el-pescador-de-estrellas' },
    { ...guilleycandeData, slug: 'guillermina-y-candelario' }
  ];
  
  try {
    for (const content of contents) {
      console.log(`   📄 Procesando: ${content.title}`);
      
      // Crear el contenido principal
      const childContent = await prisma.childContent.upsert({
        where: { slug: content.slug },
        update: {
          title: content.title,
          synopsis: content.synopsis,
          videoUrl: content.videoUrl,
          posterImage: content.posterImage,
          published: true,
          order: contents.indexOf(content)
        },
        create: {
          id: content.id,
          slug: content.slug,
          title: content.title,
          synopsis: content.synopsis,
          videoUrl: content.videoUrl,
          posterImage: content.posterImage,
          published: true,
          order: contents.indexOf(content)
        }
      });

      // Crear información técnica si existe
      if (content.technicalInfo) {
        await prisma.technicalInfo.upsert({
          where: { childContentId: childContent.id },
          update: {
            formato: content.technicalInfo.formato,
            duracion: content.technicalInfo.duracion,
            genero: content.technicalInfo.genero,
            publico: content.technicalInfo.publico,
            estado: content.technicalInfo.estado,
            // Campos separados para empresa y país
            empresaProductora: content.technicalInfo.empresaProductora.nombre,
            paisProductora: content.technicalInfo.empresaProductora.pais,
            empresaCoproductora: content.technicalInfo.empresaCoproductora?.nombre || null,
            paisCoproductora: content.technicalInfo.empresaCoproductora?.pais || null
          },
          create: {
            childContentId: childContent.id,
            formato: content.technicalInfo.formato,
            duracion: content.technicalInfo.duracion,
            genero: content.technicalInfo.genero,
            publico: content.technicalInfo.publico,
            estado: content.technicalInfo.estado,
            // Campos separados para empresa y país
            empresaProductora: content.technicalInfo.empresaProductora.nombre,
            paisProductora: content.technicalInfo.empresaProductora.pais,
            empresaCoproductora: content.technicalInfo.empresaCoproductora?.nombre || null,
            paisCoproductora: content.technicalInfo.empresaCoproductora?.pais || null
          }
        });
      }

      // Migrar premios relacionados
      if (content.awards && content.awards.length > 0) {
        for (const [index, award] of content.awards.entries()) {
          await prisma.award.upsert({
            where: {
              id: `${content.id}-award-${award.id}`
            },
            update: {
              title: award.title,
              category: award.category,
              year: award.year,
              country: award.country,
              status: mapAwardStatus(award.status),
              festival: award.festival,
              order: index
            },
            create: {
              id: `${content.id}-award-${award.id}`,
              childContentId: childContent.id,
              title: award.title,
              category: award.category,
              year: award.year,
              country: award.country,
              status: mapAwardStatus(award.status),
              festival: award.festival,
              order: index
            }
          });
        }
      }

      // Migrar plataformas
      if (content.platforms && content.platforms.length > 0) {
        for (const [index, platform] of content.platforms.entries()) {
          await prisma.platform.upsert({
            where: {
              id: `${content.id}-platform-${index}`
            },
            update: {
              name: platform.name,
              url: platform.url,
              icon: platform.icon,
              order: index
            },
            create: {
              id: `${content.id}-platform-${index}`,
              childContentId: childContent.id,
              name: platform.name,
              url: platform.url,
              icon: platform.icon,
              order: index
            }
          });
        }
      }

      // Migrar información adicional si existe
      if (content.additionalInfo) {
        await prisma.additionalInfo.upsert({
          where: { childContentId: childContent.id },
          update: {
            pressbook: sanitizeString(content.additionalInfo.pressbook),
            website: sanitizeString(content.additionalInfo.website),
          },
          create: {
            childContentId: childContent.id,
            pressbook: sanitizeString(content.additionalInfo.pressbook),
            website: sanitizeString(content.additionalInfo.website),
          }
        });
      }
      
      console.log(`   ✅ Completado: ${content.title}`);
    }
    
    console.log(`✅ Migrados ${contents.length} contenidos infantiles`);
  } catch (error) {
    console.error('❌ Error migrando contenido infantil:', error);
    throw error;
  }
}

async function migrateServicesData() {
  console.log('🔄 Migrando datos de servicios...');
  
  const services = [
    {
      id: 'conceptualizacion',
      title: "Conceptualización",
      description: "Desarrollamos la idea central de tu proyecto, definiendo objetivos, audiencia y mensaje clave para crear una base sólida.",
      icon: '/images/icons/target.svg',
      gradient: "from-purple-600 to-blue-600",
      order: 1,
      features: [
        "Análisis de mercado y audiencia",
        "Desarrollo de propuesta creativa", 
        "Definición de objetivos",
        "Investigación y benchmarking"
      ]
    },
    {
      id: 'desarrollo',
      title: "Desarrollo",
      description: "Convertimos conceptos en proyectos viables, estructurando la narrativa y planificando cada aspecto técnico y creativo.",
      icon: '/images/icons/zap.svg',
      gradient: "from-blue-600 to-cyan-600",
      order: 2,
      features: [
        "Desarrollo de narrativa",
        "Planificación técnica",
        "Estructura del proyecto",
        "Análisis de viabilidad"
      ]
    },
    {
      id: 'preproduccion',
      title: "Preproducción",
      description: "Preparamos meticulosamente cada detalle antes del rodaje, desde casting hasta locaciones y cronogramas.",
      icon: '/images/icons/camera.svg',
      gradient: "from-cyan-600 to-teal-600",
      order: 3,
      features: [
        "Casting y selección de talento",
        "Scouting de locaciones",
        "Planificación de cronograma",
        "Preparación de equipos"
      ]
    },
    {
      id: 'diseno-produccion',
      title: "Diseño de Producción",
      description: "Creamos la identidad visual del proyecto, definiendo estética, paleta de colores y elementos gráficos únicos.",
      icon: '/images/icons/palette.svg',
      gradient: "from-teal-600 to-green-600",
      order: 4,
      features: [
        "Desarrollo de identidad visual",
        "Diseño de escenografía",
        "Paleta de colores",
        "Arte conceptual"
      ]
    },
    {
      id: 'guionizacion',
      title: "Guionización",
      description: "Escribimos guiones cautivadores que conectan con la audiencia, equilibrando narrativa, diálogos y ritmo.",
      icon: '/images/icons/pen-tool.svg',
      gradient: "from-green-600 to-yellow-600",
      order: 5,
      features: [
        "Escritura de guión técnico",
        "Desarrollo de personajes",
        "Estructura narrativa",
        "Adaptaciones y rewrites"
      ]
    },
    {
      id: 'creacion-formatos',
      title: "Creación de Formatos",
      description: "Diseñamos formatos innovadores y escalables para diferentes plataformas y audiencias.",
      icon: '/images/icons/monitor.svg',
      gradient: "from-yellow-600 to-orange-600",
      order: 6,
      features: [
        "Desarrollo de formatos originales",
        "Adaptación multiplataforma",
        "Biblias de producción",
        "Estrategias de distribución"
      ]
    },
    {
      id: 'produccion',
      title: "Producción",
      description: "Ejecutamos el rodaje con equipos profesionales y tecnología de vanguardia para capturar cada momento perfectamente.",
      icon: '/images/icons/video.svg',
      gradient: "from-orange-600 to-red-600",
      order: 7,
      features: [
        "Dirección y supervisión",
        "Manejo de equipos técnicos",
        "Coordinación de talento",
        "Control de calidad en tiempo real"
      ]
    },
    {
      id: 'postproduccion',
      title: "Postproducción",
      description: "Damos vida al material grabado con edición profesional, efectos visuales, sonido y color de nivel cinematográfico.",
      icon: '/images/icons/sparkles.svg',
      gradient: "from-red-600 to-pink-600",
      order: 8,
      features: [
        "Edición y montaje",
        "Efectos visuales y VFX",
        "Corrección de color",
        "Diseño sonoro y mezcla"
      ]
    }
  ];
  
  try {
    for (const service of services) {
      console.log(`   ⚙️  Procesando servicio: ${service.title}`);
      const { features, ...serviceData } = service;
      
      // Crear el servicio
      const createdService = await prisma.service.upsert({
        where: { id: service.id },
        update: {
          title: serviceData.title,
          description: serviceData.description,
          icon: serviceData.icon,
          gradient: serviceData.gradient,
          order: serviceData.order,
          active: true
        },
        create: {
          id: serviceData.id,
          title: serviceData.title,
          description: serviceData.description,
          icon: serviceData.icon,
          gradient: serviceData.gradient,
          order: serviceData.order,
          active: true
        }
      });

      // Eliminar características existentes antes de recrear
      await prisma.serviceFeature.deleteMany({
        where: { serviceId: createdService.id }
      });

      // Crear las características del servicio
      for (const [index, feature] of features.entries()) {
        await prisma.serviceFeature.create({
          data: {
            id: `${service.id}-feature-${index}`,
            serviceId: createdService.id,
            title: feature,
            order: index
          }
        });
      }
      
      console.log(`   ✅ Completado: ${service.title} (${features.length} características)`);
    }
    
    console.log(`✅ Migrados ${services.length} servicios`);
  } catch (error) {
    console.error('❌ Error migrando servicios:', error);
    throw error;
  }
}

async function main() {
  console.log('🚀 Iniciando migración de datos existentes...\n');
  
  try {
    await migrateTeamData();
    console.log('');
    
    await migrateBrandData();
    console.log('');
    
    await migrateChildContentData();
    console.log('');
    
    await migrateServicesData();
    console.log('');
    
    console.log('🎉 ¡Migración completada exitosamente!');
    console.log('📝 Próximos pasos:');
    console.log('   1. Ejecutar: npm run verify:migration');
    console.log('   2. Ejecutar: npm run dev');
    console.log('   3. Probar las APIs en: http://localhost:3000/api/public/');
    console.log('   4. Verificar que el frontend carga correctamente');
    
  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    console.log('\n🔧 Para solucionar problemas:');
    console.log('   1. Verificar que la base de datos existe: npm run db:push');
    console.log('   2. Verificar el schema de Prisma');
    console.log('   3. Revisar los logs de error arriba');
    console.log('   4. Ejecutar rollback si es necesario: npm run rollback:migration -- --confirm');
    process.exit(1);
  }
}

main()
  .catch((e) => {
    console.error('💥 Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('📤 Conexión a base de datos cerrada');
  });

// Exportar funciones para uso individual si es necesario
export {
  migrateTeamData,
  migrateBrandData,
  migrateChildContentData,
  migrateServicesData
};