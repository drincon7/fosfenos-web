'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Users, 
  Building2, 
  Baby, 
  Settings, 
  Briefcase,
  ChevronDown,
  ChevronRight,
  BarChart3,
  FileText,
  Image
} from 'lucide-react';

interface MenuItem {
  id: string;
  title: string;
  icon: React.ComponentType<any>;
  href?: string;
  children?: MenuItem[];
}

const menuItems: MenuItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    icon: Home,
    href: '/admin'
  },
  {
    id: 'content',
    title: 'Contenido',
    icon: FileText,
    children: [
      {
        id: 'child-content',
        title: 'Contenido Infantil',
        icon: Baby,
        href: '/admin/content/child-content'
      },
      {
        id: 'blog',
        title: 'Blog',
        icon: FileText,
        href: '/admin/content/blog'
      }
    ]
  },
  {
    id: 'team',
    title: 'Equipo',
    icon: Users,
    href: '/admin/team'
  },
  {
    id: 'brands',
    title: 'Marcas',
    icon: Building2,
    href: '/admin/brands'
  },
  {
    id: 'services',
    title: 'Servicios',
    icon: Briefcase,
    href: '/admin/services'
  },
  {
    id: 'media',
    title: 'Media',
    icon: Image,
    href: '/admin/media'
  },
  {
    id: 'analytics',
    title: 'Estadísticas',
    icon: BarChart3,
    href: '/admin/analytics'
  },
  {
    id: 'settings',
    title: 'Configuración',
    icon: Settings,
    href: '/admin/settings'
  }
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>(['content']);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.id);
    const Icon = item.icon;

    if (hasChildren) {
      return (
        <div key={item.id}>
          <button
            onClick={() => toggleExpanded(item.id)}
            className={`
              w-full flex items-center px-4 py-3 text-left text-gray-300 hover:bg-purple-700 hover:text-white transition-colors
              ${level > 0 ? 'pl-12' : ''}
            `}
          >
            <Icon size={20} className="mr-3" />
            <span className="flex-1">{item.title}</span>
            {isExpanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </button>
          
          {isExpanded && (
            <div className="bg-purple-900">
              {item.children?.map(child => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        href={item.href!}
        className={`
          flex items-center px-4 py-3 text-gray-300 hover:bg-purple-700 hover:text-white transition-colors
          ${level > 0 ? 'pl-12' : ''}
          ${isActive(item.href!) ? 'bg-purple-700 text-white border-r-2 border-purple-300' : ''}
        `}
      >
        <Icon size={20} className="mr-3" />
        {item.title}
      </Link>
    );
  };

  return (
    <div className="w-64 bg-purple-800 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-purple-700">
        <h1 className="text-xl font-bold">Fosfenos Admin</h1>
        <p className="text-purple-300 text-sm">Panel de Administración</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>

      {/* User Info */}
      <div className="p-4 border-t border-purple-700">
        <div className="flex items-center">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">A</span>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium">Administrador</p>
            <p className="text-xs text-purple-300">admin@fosfenos.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
