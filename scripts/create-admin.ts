import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    console.log('👤 Creando usuario administrador...');
    
    // Verificar si ya existe un admin
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@fosfenosmedia.com' }
    });

    if (existingAdmin) {
      console.log('ℹ️  El usuario admin ya existe');
      console.log('📧 Email: admin@fosfenosmedia.com');
      console.log('🔑 Contraseña: admin123');
      return;
    }

    // Crear hash de la contraseña
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Crear usuario admin
    const admin = await prisma.user.create({
      data: {
        email: 'admin@fosfenosmedia.com',
        name: 'Administrador',
        password: hashedPassword,
        role: 'ADMIN'
      }
    });

    console.log('✅ Usuario administrador creado exitosamente');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Contraseña: admin123');
    console.log('🚨 IMPORTANTE: Cambia la contraseña después del primer login');

  } catch (error) {
    console.error('❌ Error creando usuario administrador:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();