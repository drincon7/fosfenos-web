// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando migración de datos de Fosfenos Media...');

  // 1. Crear usuario administrador
  console.log('👤 Creando usuario administrador...');
  const hashedPassword = await bcrypt.hash('admin123', 10);
  
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fosfenosmedia.com' },
    update: {},
    create: {
      email: 'admin@fosfenosmedia.com',
      name: 'Administrador Fosfenos',
      password: hashedPassword,
      role: 'ADMIN'
    }
  });
  
  console.log('✅ Usuario administrador creado:', adminUser.email);

  // 2. Migrar contenido infantil existente
  console.log('🎬 Migrando contenido infantil...');
  
  // El Libro de Lila
  const lilaContent = await prisma.childContent.upsert({
    where: { slug: 'el-libro-de-lila' },
    update: {},
    create: {
      slug: 'el-libro-de-lila',
      title: 'El Libro de Lila',
      videoUrl: '/videos/lila-preview.mp4',
      posterImage: '/images/content/lila-poster.jpg',
      synopsis: `Lila es el personaje de un libro que repentinamente queda fuera de su mundo de papel y atrapada en otro al que no pertenece. Es así como inicia esta aventura donde Lila entenderá que solo Ramón puede salvarla, aunque ya no es el mismo de antes, ha crecido y no solamente ha dejado de leer sino de creer en la fantasía.

Es entonces cuando Lila y su amiga Manuela, tendrán que arreglárselas para convencerlo de emprender un arriesgado viaje. En esta aventura por mundos mágicos, los niños descubrirán el real valor de la amistad y el poder de la fantasía.`,
      published: true,
      order: 1,
      technicalInfo: {
        create: {
          formato: 'Largometraje animado',
          duracion: '76 min',
          genero: 'Aventura / Fantasía',
          publico: 'Familiar',
          estado: 'Finalizado',
          empresaProductora: 'Fosfenos Media',
          paisProductora: 'Colombia',
          empresaCoproductora: 'Palermo Estudio',
          paisCoproductora: 'Uruguay'
        }
      },
      awards: {
        create: [
          {
            title: 'Mejor Película Selección Programa',
            category: 'Festival Internacional de Entretenimiento',
            year: 2018,
            country: 'Colombia',
            status: 'GANADOR',
            festival: 'Cine Todo',
            order: 0
          },
          {
            title: 'Mejor Largometraje Fangente',
            category: 'Festival de Animación',
            year: 2018,
            country: 'Chile',
            status: 'GANADOR',
            festival: 'Ganador',
            order: 1
          },
          {
            title: 'Mejor Película Animada',
            category: 'Jurados Infantil',
            year: 2019,
            country: 'Valencia',
            status: 'GANADOR',
            festival: 'Cinema Jove',
            order: 2
          },
          {
            title: 'Mejor Película Animada',
            category: 'Festival Internacional',
            year: 2019,
            country: 'Cuba',
            status: 'GANADOR',
            festival: 'Centroamericano',
            order: 3
          },
          {
            title: 'Mejor Largometraje Animado de Animación',
            category: 'Festival de Animación',
            year: 2018,
            country: 'Caracas',
            status: 'GANADOR',
            festival: 'Anima Caracas',
            order: 4
          },
          {
            title: 'Premio del Público',
            category: 'Festival Internacional de Animación',
            year: 2019,
            country: 'Perú',
            status: 'GANADOR',
            festival: 'Lima 2019',
            order: 5
          },
          {
            title: 'Mejor Guión',
            category: 'Mejor Actor',
            year: 2018,
            country: 'Colombia',
            status: 'NOMINACION',
            festival: 'Cine Colombia',
            order: 6
          },
          {
            title: 'Mejor Película Animada',
            category: 'Primeros Visitados',
            year: 2019,
            country: 'México',
            status: 'NOMINACION',
            festival: 'Festival Internacional',
            order: 7
          },
          {
            title: 'Mejor Desarrollo Visual',
            category: 'Gráficos Gobierno de Animación',
            year: 2019,
            country: 'España',
            status: 'NOMINACION',
            festival: 'Desarrolla Europa',
            order: 8
          },
          {
            title: 'Mención de Honor',
            category: 'Internacional de Cine de Ejercicio',
            year: 2018,
            country: 'Chile',
            status: 'MENCION',
            festival: 'Ficvi',
            order: 9
          }
        ]
      },
      platforms: {
        create: [
          {
            name: 'Movies',
            url: '#movies',
            icon: '🎬',
            order: 0
          },
          {
            name: 'Amazon Prime',
            url: '#amazon',
            icon: '📺',
            order: 1
          }
        ]
      },
      additionalInfo: {
        create: {
          pressbook: '/downloads/lila-pressbook.pdf',
          website: 'https://www.ellibrodelila.com',
          facebook: '/ElLibroDeLila',
          instagram: '/ElLibroDeLila'
        }
      }
    }
  });

  // Guillermina y Candelario
  const guilleycandeContent = await prisma.childContent.upsert({
    where: { slug: 'guillermina-y-candelario' },
    update: {},
    create: {
      slug: 'guillermina-y-candelario',
      title: 'Guillermina y Candelario',
      videoUrl: '/videos/guillermina-preview.mp4',
      posterImage: '/images/content/guillermina-poster.jpg',
      synopsis: `Guillermina y Candelario, es un proyecto pionero en su género en Colombia, inspirado en personajes afrodescendientes y escenarios del Pacífico colombiano, que lleva a las distintas plataformas el exotismo natural y la alegría de los habitantes de esa región, mientras se recrean situaciones y vivencias del maravilloso universo infantil.

Guillermina y Candelario son un par de traviesos e ingeniosos hermanos que viven en una hermosa playa y que con su capacidad de soñar y fantasear, transforman cada día en una increíble aventura en compañía de sus abuelos, que con su gran sabiduría siempre encuentran la manera de ayudarles a comprender el mundo, inculcándoles amor y respeto por la naturaleza y los seres que la habitan, así como un profundo gusto musical, que llena de alegría cada momento en familia.`,
      published: true,
      order: 2,
      technicalInfo: {
        create: {
          formato: 'Serie animada de TV',
          duracion: '6 temporadas',
          genero: 'Aventura / Fantasía',
          publico: 'Familiar',
          estado: '6 temporadas finalizadas',
          empresaProductora: 'Fosfenos Media',
          paisProductora: 'Colombia',
          empresaCoproductora: 'Señal Colombia',
          paisCoproductora: 'Colombia'
        }
      },
      platforms: {
        create: [
          {
            name: 'Señal Colombia',
            url: '#senalcolombia',
            icon: '📺',
            order: 0
          }
        ]
      }
    }
  });

  // El Pescador de Estrellas
  const pescadorContent = await prisma.childContent.upsert({
    where: { slug: 'el-pescador-de-estrellas' },
    update: {},
    create: {
      slug: 'el-pescador-de-estrellas',
      title: 'El pescador de estrellas',
      videoUrl: '/videos/pescador-preview.mp4',
      posterImage: '/images/content/pescador-poster.jpg',
      synopsis: `Segundo es un chico de 11 años que animado por Máximo, su inseparable cómplice de aventuras, aprovecha un juego que hacen en la escuela para convertirse en el amigo secreto de Juana María y enamorarla con un hermoso regalo; al final de la historia la realidad se confunde con la fantasía, haciendo que Segundo termine viviendo el mágico amor de una leyenda de estrellas contada por un abuelo.`,
      published: true,
      order: 3,
      technicalInfo: {
        create: {
          formato: 'Cortometraje',
          duracion: '12 min',
          genero: 'Aventura / Fantasía',
          publico: 'Familiar',
          estado: 'Finalizado',
          empresaProductora: 'Fosfenos Media',
          paisProductora: 'Colombia'
        }
      }
    }
  });

  console.log('✅ Contenido infantil migrado');

  // 3. Migrar equipo
  console.log('👥 Migrando equipo...');
  
  const teamMembers = [
    { nombre: 'Marcela Rincón', cargo: 'Directora', order: 0 },
    { nombre: 'Maritza Rincón', cargo: 'Productora', order: 1 },
    { nombre: 'Tatiana Espitia', cargo: 'Diseño de producción', order: 2 },
    { nombre: 'Andrés López', cargo: 'Director de animación / Animador', order: 3 },
    { nombre: 'Monica Mondragón', cargo: 'Guionista', order: 4 },
    { nombre: 'Neyber Lenis', cargo: 'Director de producción', order: 5 },
    { nombre: 'Diogenes Mendoza', cargo: 'Director de animación / Animador', order: 6 },
    { nombre: 'Ulises de Jesús Ramos', cargo: 'Director de animación / Animador', order: 7 },
    { nombre: 'Andrea Serna', cargo: 'Guionista', order: 8 },
    { nombre: 'Alejandra Beltrán', cargo: 'Diseñadora de arte', order: 9 },
    { nombre: 'Stephany Vargas', cargo: 'Directora de producción', order: 10 },
    { nombre: 'David Patiño', cargo: 'Director de composición digital', order: 11 },
    { nombre: 'Vladimir Pérez', cargo: 'Guionista', order: 12 },
    { nombre: 'Andrew Peñaranda', cargo: 'Director de animación / Animador', order: 13 },
    { nombre: 'Eliana de la Pava', cargo: 'Coordinadora de producción', order: 14 }
  ];

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { 
        nombre_cargo: {
          nombre: member.nombre,
          cargo: member.cargo
        }
      },
      update: {},
      create: {
        nombre: member.nombre,
        cargo: member.cargo,
        imagen: '/images/team/default.jpg',
        imagenDark: '/images/team/default.jpg',
        order: member.order,
        active: true
      }
    });
  }

  console.log('✅ Equipo migrado');

  // 4. Migrar servicios
  console.log('🛠️ Migrando servicios...');
  
  const services = [
    {
      title: 'Conceptualización',
      description: 'Desarrollamos la idea central de tu proyecto, definiendo objetivos, audiencia y mensaje clave para crear una base sólida.',
      icon: 'Target',
      gradient: 'from-purple-600 to-blue-600',
      order: 0,
      features: [
        'Análisis de mercado y audiencia',
        'Desarrollo de propuesta creativa',
        'Definición de objetivos',
        'Investigación y benchmarking'
      ]
    },
    {
      title: 'Desarrollo',
      description: 'Convertimos conceptos en proyectos viables, estructurando la narrativa y planificando cada aspecto técnico y creativo.',
      icon: 'Zap',
      gradient: 'from-blue-600 to-cyan-600',
      order: 1,
      features: [
        'Desarrollo de narrativa',
        'Planificación técnica',
        'Estructura del proyecto',
        'Análisis de viabilidad'
      ]
    },
    {
      title: 'Preproducción',
      description: 'Preparamos meticulosamente cada detalle antes del rodaje, desde casting hasta locaciones y cronogramas.',
      icon: 'Camera',
      gradient: 'from-cyan-600 to-teal-600',
      order: 2,
      features: [
        'Casting y selección de talento',
        'Scouting de locaciones',
        'Planificación de cronograma',
        'Preparación de equipos'
      ]
    },
    {
      title: 'Diseño de Producción',
      description: 'Creamos la identidad visual del proyecto, definiendo estética, paleta de colores y elementos gráficos únicos.',
      icon: 'Palette',
      gradient: 'from-teal-600 to-green-600',
      order: 3,
      features: [
        'Desarrollo de identidad visual',
        'Diseño de escenografía',
        'Paleta de colores',
        'Arte conceptual'
      ]
    },
    {
      title: 'Guionización',
      description: 'Escribimos guiones cautivadores que conectan con la audiencia, equilibrando narrativa, diálogos y ritmo.',
      icon: 'PenTool',
      gradient: 'from-green-600 to-yellow-600',
      order: 4,
      features: [
        'Escritura de guión técnico',
        'Desarrollo de personajes',
        'Estructura narrativa',
        'Adaptaciones y rewrites'
      ]
    },
    {
      title: 'Creación de Formatos',
      description: 'Diseñamos formatos innovadores y escalables para diferentes plataformas y audiencias.',
      icon: 'Monitor',
      gradient: 'from-yellow-600 to-orange-600',
      order: 5,
      features: [
        'Desarrollo de formatos originales',
        'Adaptación multiplataforma',
        'Biblias de producción',
        'Estrategias de distribución'
      ]
    },
    {
      title: 'Producción',
      description: 'Ejecutamos el rodaje con equipos profesionales y tecnología de vanguardia para capturar cada momento perfectamente.',
      icon: 'Video',
      gradient: 'from-orange-600 to-red-600',
      order: 6,
      features: [
        'Dirección y supervisión',
        'Manejo de equipos técnicos',
        'Coordinación de talento',
        'Control de calidad en tiempo real'
      ]
    },
    {
      title: 'Postproducción',
      description: 'Damos vida al material grabado con edición profesional, efectos visuales, sonido y color de nivel cinematográfico.',
      icon: 'Sparkles',
      gradient: 'from-red-600 to-pink-600',
      order: 7,
      features: [
        'Edición y montaje',
        'Efectos visuales y VFX',
        'Corrección de color',
        'Diseño sonoro y mezcla'
      ]
    }
  ];

  for (const service of services) {
    const createdService = await prisma.service.upsert({
      where: { title: service.title },
      update: {},
      create: {
        title: service.title,
        description: service.description,
        icon: service.icon,
        gradient: service.gradient,
        order: service.order,
        active: true
      }
    });

    // Crear características del servicio
    for (let i = 0; i < service.features.length; i++) {
      await prisma.serviceFeature.upsert({
        where: {
          serviceId_title: {
            serviceId: createdService.id,
            title: service.features[i]
          }
        },
        update: {},
        create: {
          title: service.features[i],
          order: i,
          serviceId: createdService.id
        }
      });
    }
  }

  console.log('✅ Servicios migrados');

  // 5. Migrar marcas
  console.log('🏢 Migrando marcas...');
  
  const brands = [
    { name: 'Señal Colombia', href: '', image: '/images/brand/Señal_Colombia_logo.svg', order: 0 },
    { name: 'Telepacifico', href: '', image: '/images/brand/telepacifico.png', order: 1 },
    { name: 'Parquesoft', href: '', image: '/images/brand/Parquesoft.png', order: 2 },
    { name: 'ICESI', href: '', image: '/images/brand/icesi.png', order: 3 },
    { name: 'Antorcha', href: '', image: '/images/brand/antorcha light.png', order: 4 },
    { name: 'SESAME STREET', href: '', image: '/images/brand/Sesame_Street_logo.svg.png', order: 5 },
    { name: 'ABC', href: '', image: '/images/brand/ABC.webp', order: 6 },
    { name: 'Discovery Kids', href: '', image: '/images/brand/discoverykids.png', order: 7 },
    { name: 'Lulofilms', href: '', image: '/images/brand/Lulo.png', order: 8 }
  ];

  for (const brand of brands) {
    await prisma.brand.upsert({
      where: { name: brand.name },
      update: {},
      create: {
        name: brand.name,
        href: brand.href,
        image: brand.image,
        imageLight: brand.image, // Usar la misma imagen para light por defecto
        order: brand.order,
        active: true
      }
    });
  }

  console.log('✅ Marcas migradas');

  // 6. Crear algunas configuraciones del sitio
  console.log('⚙️ Creando configuraciones del sitio...');
  
  const siteConfigs = [
    { key: 'site_title', value: 'Fosfenos Media' },
    { key: 'site_description', value: 'Somos una familia creativa con el profundo deseo de contar historias para el público infantil.' },
    { key: 'contact_email', value: 'info@fosfenosmedia.com' },
    { key: 'hero_title', value: 'Somos una familia creativa' },
    { key: 'hero_description', value: 'Con el profundo deseo de contar historias para el público infantil. Desde hace 15 años venimos produciendo contenidos culturales y educativos.' }
  ];

  for (const config of siteConfigs) {
    await prisma.siteConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: {
        key: config.key,
        value: config.value,
        type: 'TEXT'
      }
    });
  }

  console.log('✅ Configuraciones creadas');

  console.log('🎉 ¡Migración completada exitosamente!');
  console.log('\n📋 Resumen:');
  console.log(`👤 Usuario admin: ${adminUser.email} (password: admin123)`);
  console.log(`🎬 Contenido infantil: ${await prisma.childContent.count()} elementos`);
  console.log(`👥 Miembros del equipo: ${await prisma.teamMember.count()} personas`);
  console.log(`🛠️ Servicios: ${await prisma.service.count()} servicios`);
  console.log(`🏢 Marcas: ${await prisma.brand.count()} marcas`);
  console.log(`⚙️ Configuraciones: ${await prisma.siteConfig.count()} configuraciones`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error durante la migración:', e);
    await prisma.$disconnect();
    process.exit(1);
  });