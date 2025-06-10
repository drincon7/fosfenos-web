echo "🚀 Iniciando proceso de migración completo..."

# Verificar que Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instala Node.js primero."
    exit 1
fi

# Verificar que npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm no está instalado. Por favor instala npm primero."
    exit 1
fi

# Instalar dependencias si no existen
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependencias..."
    npm install
fi

# Verificar que el archivo .env.local existe
if [ ! -f ".env.local" ]; then
    echo "⚠️  El archivo .env.local no existe. Copiando desde .env.example..."
    cp .env.example .env.local
    echo "📝 Por favor, edita .env.local con tus configuraciones específicas."
    echo "⏸️  Pausa para que puedas editar el archivo .env.local..."
    read -p "Presiona Enter cuando hayas configurado .env.local..."
fi

# Generar cliente de Prisma
echo "🔧 Generando cliente de Prisma..."
npm run db:generate

# Aplicar migraciones
echo "🗄️  Aplicando migraciones de base de datos..."
npm run db:push

# Ejecutar migración de datos
echo "📊 Migrando datos existentes..."
npm run db:seed

# Verificar migración
echo "✅ Verificando migración..."
npm run verify:migration

echo "🎉 ¡Migración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "   1. Ejecuta 'npm run dev' para iniciar el servidor de desarrollo"
echo "   2. Visita http://localhost:3000 para verificar que todo funciona"
echo "   3. Visita http://localhost:3000/admin para acceder al panel de administración"
echo "   4. Usa las credenciales: admin@fosfenosmedia.com / admin123"
echo ""
echo "🔧 Comandos útiles:"
echo "   - 'npm run db:studio' para abrir Prisma Studio"
echo "   - 'npm run backup:data' para hacer backup de los datos"