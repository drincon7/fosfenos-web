// scripts/rollback-migration.ts
import { prisma } from '@/lib/database';

async function rollbackMigration() {
  console.log('🔄 Iniciando rollback de la migración...\n');
  
  const confirmRollback = process.argv.includes('--confirm');
  
  if (!confirmRollback) {
    console.log('⚠️  ADVERTENCIA: Este script eliminará TODOS los datos migrados.');
    console.log('');
    console.log('Para confirmar el rollback, ejecuta:');
    console.log('   npm run rollback:migration -- --confirm');
    console.log('');
    console.log('❌ Rollback cancelado por seguridad');
    return;
  }
  
  try {
    console.log('🗑️  Eliminando datos en el siguiente orden:');
    
    // Eliminar en orden inverso para respetar las foreign keys
    console.log('   1. Eliminando características de servicios...');
    const deletedFeatures = await prisma.serviceFeature.deleteMany();
    console.log(`   ✅ Eliminadas ${deletedFeatures.count} características`);
    
    console.log('   2. Eliminando servicios...');
    const deletedServices = await prisma.service.deleteMany();
    console.log(`   ✅ Eliminados ${deletedServices.count} servicios`);
    
    console.log('   3. Eliminando información adicional...');
    const deletedAdditionalInfo = await prisma.additionalInfo.deleteMany();
    console.log(`   ✅ Eliminada ${deletedAdditionalInfo.count} info adicional`);
    
    console.log('   4. Eliminando plataformas...');
    const deletedPlatforms = await prisma.platform.deleteMany();
    console.log(`   ✅ Eliminadas ${deletedPlatforms.count} plataformas`);
    
    console.log('   5. Eliminando premios...');
    const deletedAwards = await prisma.award.deleteMany();
    console.log(`   ✅ Eliminados ${deletedAwards.count} premios`);
    
    console.log('   6. Eliminando información técnica...');
    const deletedTechnicalInfo = await prisma.technicalInfo.deleteMany();
    console.log(`   ✅ Eliminada ${deletedTechnicalInfo.count} info técnica`);
    
    console.log('   7. Eliminando contenido infantil...');
    const deletedContent = await prisma.childContent.deleteMany();
    console.log(`   ✅ Eliminados ${deletedContent.count} contenidos`);
    
    console.log('   8. Eliminando marcas...');
    const deletedBrands = await prisma.brand.deleteMany();
    console.log(`   ✅ Eliminadas ${deletedBrands.count} marcas`);
    
    console.log('   9. Eliminando miembros del equipo...');
    const deletedTeam = await prisma.teamMember.deleteMany();
    console.log(`   ✅ Eliminados ${deletedTeam.count} miembros del equipo`);
    
    console.log('\n🎉 Rollback completado exitosamente!');
    console.log('\n📝 La base de datos está ahora limpia.');
    console.log('💡 Puedes volver a ejecutar la migración con: npm run db:seed');
    
  } catch (error) {
    console.error('❌ Error durante el rollback:', error);
    console.log('\n🚨 El rollback puede haber sido parcial.');
    console.log('💡 Considera ejecutar: npm run db:reset (elimina TODO)');
    process.exit(1);
  }
}

// Script para resetear completamente la base de datos
async function resetDatabase() {
  console.log('🔄 Reseteando base de datos completamente...\n');
  
  const confirmReset = process.argv.includes('--confirm');
  
  if (!confirmReset) {
    console.log('⚠️  ADVERTENCIA: Este script eliminará TODO en la base de datos.');
    console.log('');
    console.log('Para confirmar el reset, ejecuta:');
    console.log('   npm run db:reset -- --confirm');
    console.log('');
    console.log('❌ Reset cancelado por seguridad');
    return;
  }
  
  try {
    // Usar el comando de Prisma para reset completo
    const { execSync } = require('child_process');
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    
    console.log('\n🎉 Base de datos reseteada completamente!');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. npm run db:push (aplicar schema)');
    console.log('   2. npm run db:seed (migrar datos)');
    
  } catch (error) {
    console.error('❌ Error durante el reset:', error);
    process.exit(1);
  }
}

// Determinar qué función ejecutar basado en argumentos
const command = process.argv[2];

if (command === 'rollback') {
  rollbackMigration()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
} else if (command === 'reset') {
  resetDatabase();
} else {
  console.log('📋 Scripts de rollback disponibles:');
  console.log('');
  console.log('   npm run rollback:migration -- --confirm');
  console.log('   (Elimina solo los datos migrados)');
  console.log('');
  console.log('   npm run db:reset -- --confirm');
  console.log('   (Reset completo de la base de datos)');
  console.log('');
}

export { rollbackMigration, resetDatabase };