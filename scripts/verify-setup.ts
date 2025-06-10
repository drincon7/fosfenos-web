// scripts/verify-setup.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function verifySetup() {
  try {
    console.log('🔍 Verificando configuración del admin panel...');
    console.log('');
    
    // Verificar variables de entorno
    console.log('📋 Variables de entorno:');
    const requiredEnvVars = ['NEXTAUTH_SECRET', 'NEXTAUTH_URL', 'DATABASE_URL'];
    let envOk = true;
    
    requiredEnvVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`   ✅ ${varName}: configurada`);
      } else {
        console.log(`   ❌ ${varName}: FALTANTE`);
        envOk = false;
      }
    });
    console.log('');
    
    if (!envOk) {
      console.log('❌ Algunas variables de entorno están faltantes.');
      console.log('💡 Asegúrate de que tu .env.local tenga:');
      console.log('   DATABASE_URL="file:./dev.db"');
      console.log('   NEXTAUTH_SECRET=fosfenos-super-secret-key-2024');
      console.log('   NEXTAUTH_URL=http://localhost:3000');
      return;
    }
    
    // Verificar conexión a la base de datos
    console.log('🔌 Verificando conexión a base de datos...');
    try {
      await prisma.$connect();
      console.log('   ✅ Conexión a base de datos OK');
    } catch (error) {
      console.log('   ❌ Error conectando a base de datos:', error);
      console.log('💡 Ejecuta: npx prisma generate && npx prisma db push');
      return;
    }
    
    // Verificar que existen las tablas y contar registros
    console.log('');
    console.log('📊 Estadísticas de la base de datos:');
    try {
      const userCount = await prisma.user.count();
      const teamCount = await prisma.teamMember.count();
      const contentCount = await prisma.childContent.count();
      
      console.log(`   👥 Usuarios: ${userCount}`);
      console.log(`   🤝 Miembros del equipo: ${teamCount}`);
      console.log(`   🎬 Contenido infantil: ${contentCount}`);
      
      // Verificar si existe usuario admin
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@fosfenosmedia.com' }
      });
      
      if (adminUser) {
        console.log('   ✅ Usuario administrador existe');
      } else {
        console.log('   ❌ Usuario administrador NO existe');
        console.log('💡 Ejecuta: npm run create-admin');
      }
      
    } catch (error) {
      console.log('   ❌ Error accediendo a las tablas:', error);
      console.log('💡 Ejecuta: npx prisma db push');
      return;
    }
    
    console.log('');
    console.log('🎉 Verificación completada exitosamente!');
    console.log('');
    console.log('🚀 Para acceder al panel de admin:');
    console.log('   1. Ejecuta: npm run dev');
    console.log('   2. Ve a: http://localhost:3000/admin/login');
    console.log('   3. Email: admin@fosfenosmedia.com');
    console.log('   4. Contraseña: admin123');
    
  } catch (error) {
    console.error('❌ Error en verificación:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifySetup();
