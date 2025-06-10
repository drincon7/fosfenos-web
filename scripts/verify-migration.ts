// scripts/verify-migration.ts (VERSIÓN MEJORADA)
import { prisma } from '@/lib/database';

async function verifyMigration() {
  console.log('🔍 Verificando migración de datos...\n');
  
  try {
    // Verificar miembros del equipo
    console.log('👥 EQUIPO:');
    const teamCount = await prisma.teamMember.count();
    console.log(`   Total: ${teamCount} miembros`);
    
    if (teamCount > 0) {
      const teamMembers = await prisma.teamMember.findMany({ take: 3 });
      teamMembers.forEach((member, index) => {
        console.log(`   ${index + 1}. ${member.nombre} - ${member.cargo}`);
        console.log(`      Imagen: ${member.imagen}`);
        console.log(`      Activo: ${member.active ? '✅' : '❌'}`);
      });
    }
    
    // Verificar marcas
    console.log('\n🏢 MARCAS:');
    const brandsCount = await prisma.brand.count();
    console.log(`   Total: ${brandsCount} marcas`);
    
    if (brandsCount > 0) {
      const brands = await prisma.brand.findMany({ take: 3 });
      brands.forEach((brand, index) => {
        console.log(`   ${index + 1}. ${brand.name}`);
        console.log(`      URL: ${brand.href}`);
        console.log(`      Activa: ${brand.active ? '✅' : '❌'}`);
      });
    }
    
    // Verificar contenido infantil con relaciones
    console.log('\n🎬 CONTENIDO INFANTIL:');
    const contentCount = await prisma.childContent.count();
    console.log(`   Total: ${contentCount} contenidos`);
    
    if (contentCount > 0) {
      const contents = await prisma.childContent.findMany({
        include: {
          technicalInfo: true,
          awards: true,
          platforms: true,
          additionalInfo: true
        }
      });
      
      contents.forEach((content, index) => {
        console.log(`   ${index + 1}. ${content.title}`);
        console.log(`      Slug: ${content.slug}`);
        console.log(`      Publicado: ${content.published ? '✅' : '❌'}`);
        console.log(`      Info técnica: ${content.technicalInfo ? '✅' : '❌'}`);
        console.log(`      Premios: ${content.awards.length}`);
        console.log(`      Plataformas: ${content.platforms.length}`);
        console.log(`      Info adicional: ${content.additionalInfo ? '✅' : '❌'}`);
        
        // Verificar campos de empresa separados
        if (content.technicalInfo) {
          console.log(`      Productora: ${content.technicalInfo.empresaProductora} (${content.technicalInfo.paisProductora})`);
          
          if (content.technicalInfo.empresaCoproductora) {
            console.log(`      Coproductora: ${content.technicalInfo.empresaCoproductora} (${content.technicalInfo.paisCoproductora})`);
          }
        }
        
        // Verificar status de premios
        if (content.awards.length > 0) {
          const statusTypes = content.awards.map(a => a.status);
          console.log(`      Status premios: ${[...new Set(statusTypes)].join(', ')}`);
        }
      });
    }
    
    // Verificar servicios con características
    console.log('\n⚙️  SERVICIOS:');
    const servicesCount = await prisma.service.count();
    console.log(`   Total: ${servicesCount} servicios`);
    
    if (servicesCount > 0) {
      const services = await prisma.service.findMany({
        include: {
          features: true
        },
        take: 3
      });
      
      services.forEach((service, index) => {
        console.log(`   ${index + 1}. ${service.title}`);
        console.log(`      Descripción: ${service.description.substring(0, 50)}...`);
        console.log(`      Características: ${service.features.length}`);
        console.log(`      Activo: ${service.active ? '✅' : '❌'}`);
        console.log(`      Gradiente: ${service.gradient}`);
      });
    }
    
    // Verificar totales
    console.log('\n📊 RESUMEN:');
    const totals = await Promise.all([
      prisma.teamMember.count(),
      prisma.brand.count(),
      prisma.childContent.count(),
      prisma.service.count(),
      prisma.award.count(),
      prisma.platform.count(),
      prisma.technicalInfo.count(),
      prisma.additionalInfo.count(),
      prisma.serviceFeature.count()
    ]);
    
    console.log(`   👥 Miembros del equipo: ${totals[0]}`);
    console.log(`   🏢 Marcas: ${totals[1]}`);
    console.log(`   🎬 Contenidos: ${totals[2]}`);
    console.log(`   ⚙️  Servicios: ${totals[3]}`);
    console.log(`   🏆 Premios: ${totals[4]}`);
    console.log(`   📱 Plataformas: ${totals[5]}`);
    console.log(`   📋 Info técnica: ${totals[6]}`);
    console.log(`   📝 Info adicional: ${totals[7]}`);
    console.log(`   🔧 Características de servicios: ${totals[8]}`);
    
    console.log('\n✅ Verificación de estructura completada exitosamente');
    
    // Verificar integridad de datos
    console.log('\n🔗 Verificando integridad de relaciones...');
    
    // Verificar que todo contenido tenga info técnica
    const contentWithoutTech = await prisma.childContent.count({
      where: {
        technicalInfo: null
      }
    });
    
    if (contentWithoutTech > 0) {
      console.log(`   ⚠️  ${contentWithoutTech} contenido(s) sin información técnica`);
    } else {
      console.log(`   ✅ Todos los contenidos tienen información técnica`);
    }
    
    // Verificar que los servicios tienen características
    const servicesWithoutFeatures = await prisma.service.count({
      where: {
        features: {
          none: {}
        }
      }
    });
    
    if (servicesWithoutFeatures > 0) {
      console.log(`   ⚠️  ${servicesWithoutFeatures} servicio(s) sin características`);
    } else {
      console.log(`   ✅ Todos los servicios tienen características`);
    }
    
    console.log('\n🎉 ¡Verificación completada exitosamente!');
    console.log('\n📋 Próximos pasos:');
    console.log('   1. Ejecutar: npm run dev');
    console.log('   2. Probar APIs: curl http://localhost:3000/api/public/team');
    console.log('   3. Verificar frontend: http://localhost:3000');
    console.log('   4. Opcional: npm run db:studio (para explorar datos)');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
    
    if (error instanceof Error) {
      console.log('\n🔧 Detalles del error:');
      console.log(`   Mensaje: ${error.message}`);
      console.log(`   Stack: ${error.stack?.split('\n')[0]}`);
    }
    
    console.log('\n💡 Posibles soluciones:');
    console.log('   1. Verificar que Prisma está actualizado: npm run db:generate');
    console.log('   2. Verificar que las migraciones se aplicaron: npm run db:push');
    console.log('   3. Revisar el schema de Prisma');
    
    process.exit(1);
  }
}

// Función adicional para probar conexiones a APIs (opcional)
async function testApiEndpoints() {
  console.log('\n🌐 Probando endpoints de API...');
  
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  
  const endpoints = [
    '/api/public/team',
    '/api/public/brands', 
    '/api/public/child-content',
    '/api/public/services'
  ];
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log(`   ✅ ${endpoint} - ${response.status} (${data.data?.length || 0} items)`);
      } else {
        console.log(`   ❌ ${endpoint} - ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.log(`   ❌ ${endpoint} - Error de conexión`);
    }
  }
}

verifyMigration()
  .catch((e) => {
    console.error('💥 Error fatal en verificación:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('\n📤 Conexión a base de datos cerrada');
  });