'use client';
import { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Eye } from 'lucide-react';
import Image from 'next/image';

interface ContentItem {
  id: string;
  title: string;
  slug: string;
  synopsis: string;
  format: string;
  duration: string;
  status: string;
  posterImage: string;
  published: boolean;
  createdAt: string;
}

const ContentCard = ({ 
  content, 
  onEdit, 
  onDelete,
  onView 
}: { 
  content: ContentItem; 
  onEdit: (content: ContentItem) => void;
  onDelete: (id: string) => void;
  onView: (content: ContentItem) => void;
}) => (
  <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
    <div className="aspect-video relative">
      <Image
        src={content.posterImage || '/images/content/default.jpg'}
        alt={content.title}
        fill
        className="object-cover rounded-t-lg"
      />
      <div className="absolute top-2 right-2">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
          content.published 
            ? 'bg-green-100 text-green-800' 
            : 'bg-gray-100 text-gray-800'
        }`}>
          {content.published ? 'Publicado' : 'Borrador'}
        </span>
      </div>
    </div>
    
    <div className="p-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
        {content.title}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {content.synopsis}
      </p>
      
      <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
        <span>{content.format}</span>
        <span>{content.duration}</span>
        <span>{content.status}</span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-400">
          {new Date(content.createdAt).toLocaleDateString()}
        </span>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(content)}
            className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-full"
            title="Ver detalles"
          >
            <Eye size={16} />
          </button>
          <button
            onClick={() => onEdit(content)}
            className="p-2 text-green-600 hover:text-green-800 hover:bg-green-50 rounded-full"
            title="Editar"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(content.id)}
            className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-full"
            title="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default function ContentManagement() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/admin/child-content');
      const data = await response.json();
      
      if (data.success) {
        setContent(data.data);
      }
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (content: ContentItem) => {
    console.log('Edit content:', content);
    // Implementar en el siguiente paso
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contenido?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/child-content/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchContent();
      }
    } catch (error) {
      console.error('Error deleting content:', error);
    }
  };

  const handleView = (content: ContentItem) => {
    // Abrir modal con detalles
    console.log('View content:', content);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contenido Infantil</h1>
          <p className="text-gray-600">Gestiona el contenido audiovisual</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
          <Plus size={20} className="mr-2" />
          Añadir Contenido
        </button>
      </div>

      {content.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2h4a1 1 0 011 1v1a1 1 0 01-1 1v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7a1 1 0 01-1-1V5a1 1 0 011-1h4zM9 3v1h6V3H9z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No hay contenido disponible
          </h3>
          <p className="text-gray-600 mb-4">
            Comienza añadiendo tu primer contenido infantil.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            <Plus size={20} className="mr-2" />
            Añadir Contenido
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {content.map((item) => (
            <ContentCard
              key={item.id}
              content={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onView={handleView}
            />
          ))}
        </div>
      )}
    </div>
  );
}