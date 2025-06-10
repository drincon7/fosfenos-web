'use client';
import { Users, Building2, Baby, Briefcase, TrendingUp, Eye } from 'lucide-react';
import { StatsCard } from '@/components/admin/StatsCard';
import { Card } from '@/components/admin/Card';
import { PageHeader } from '@/components/admin/PageHeader';
import { useTeam } from '@/lib/hooks/useTeam';
import { useBrands } from '@/lib/hooks/useBrands';
import { useChildContent } from '@/lib/hooks/useChildContent';
import { useServices } from '@/lib/hooks/useServices';

export default function AdminDashboard() {
  const { data: teamMembers, loading: teamLoading } = useTeam();
  const { data: brands, loading: brandsLoading } = useBrands();
  const { data: childContent, loading: contentLoading } = useChildContent();
  const { data: services, loading: servicesLoading } = useServices();

  const isLoading = teamLoading || brandsLoading || contentLoading || servicesLoading;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Resumen general del contenido y estadísticas"
      />

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Miembros del Equipo"
          value={teamMembers?.length || 0}
          description="Miembros activos"
          icon={<Users size={24} />}
          color="blue"
          trend={{ value: 12, isPositive: true }}
        />
        
        <StatsCard
          title="Marcas Asociadas"
          value={brands?.length || 0}
          description="Socios y colaboradores"
          icon={<Building2 size={24} />}
          color="green"
          trend={{ value: 5, isPositive: true }}
        />
        
        <StatsCard
          title="Contenido Infantil"
          value={childContent?.length || 0}
          description="Proyectos publicados"
          icon={<Baby size={24} />}
          color="purple"
        />
        
        <StatsCard
          title="Servicios"
          value={services?.length || 0}
          description="Servicios ofrecidos"
          icon={<Briefcase size={24} />}
          color="yellow"
        />
      </div>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actividad Reciente</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nuevo miembro agregado</p>
                <p className="text-xs text-gray-500">Hace 2 horas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Contenido actualizado</p>
                <p className="text-xs text-gray-500">Hace 5 horas</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Nueva marca añadida</p>
                <p className="text-xs text-gray-500">Hace 1 día</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 gap-3">
            <a 
              href="/admin/team"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Users size={20} className="text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Gestionar Equipo</p>
                <p className="text-sm text-gray-500">Añadir o editar miembros</p>
              </div>
            </a>
            
            <a 
              href="/admin/content/child-content"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Baby size={20} className="text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Contenido Infantil</p>
                <p className="text-sm text-gray-500">Gestionar proyectos</p>
              </div>
            </a>
            
            <a 
              href="/admin/brands"
              className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Building2 size={20} className="text-purple-600 mr-3" />
              <div>
                <p className="font-medium text-gray-900">Marcas</p>
                <p className="text-sm text-gray-500">Administrar socios</p>
              </div>
            </a>
          </div>
        </Card>
      </div>

      {/* Content Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contenido Más Popular</h3>
          <div className="space-y-3">
            {childContent?.slice(0, 3).map((content, index) => (
              <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{content.title}</p>
                  <p className="text-sm text-gray-500">{content.synopsis.substring(0, 50)}...</p>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Eye size={16} />
                  <span>{Math.floor(Math.random() * 1000) + 100}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado del Sistema</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Base de Datos</span>
              <span className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Conectada
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">APIs</span>
              <span className="flex items-center text-sm text-green-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Funcionando
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Última sincronización</span>
              <span className="text-sm text-gray-500">Hace 5 min</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}