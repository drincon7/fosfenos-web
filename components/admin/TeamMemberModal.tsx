import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormField, Input, Switch } from './FormField';
import { ImageUpload } from './ImageUpload';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member?: any | null;
  onSave: (data: {
    nombre: string;
    cargo: string;
    imagen?: File | null;
    imagenDark?: File | null;
    active: boolean;
  }) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

export const TeamMemberModal = ({ 
  isOpen, 
  onClose, 
  member, 
  onSave, 
  loading = false 
}: TeamMemberModalProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    cargo: '',
    active: true
  });
  const [images, setImages] = useState<{
    imagen?: File | null;
    imagenDark?: File | null;
  }>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (member) {
        setFormData({
          nombre: member.nombre,
          cargo: member.cargo,
          active: member.active
        });
      } else {
        setFormData({
          nombre: '',
          cargo: '',
          active: true
        });
      }
      setImages({});
      setErrors({});
    }
  }, [isOpen, member]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }
    if (!formData.cargo.trim()) {
      newErrors.cargo = 'El cargo es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const result = await onSave({
        ...formData,
        ...images
      });

      if (result.success) {
        onClose();
      } else {
        setErrors({ submit: result.error || 'Error al guardar' });
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión' });
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    if (!saving) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={member ? 'Editar Miembro del Equipo' : 'Añadir Miembro del Equipo'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.submit}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField label="Nombre" required error={errors.nombre}>
            <Input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              placeholder="Ej: María García"
              error={!!errors.nombre}
              disabled={saving}
            />
          </FormField>

          <FormField label="Cargo" required error={errors.cargo}>
            <Input
              type="text"
              value={formData.cargo}
              onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
              placeholder="Ej: Directora de Animación"
              error={!!errors.cargo}
              disabled={saving}
            />
          </FormField>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <FormField label="Imagen Principal" required={!member} error={errors.imagen}>
            <ImageUpload
              currentImage={member?.imagen}
              onImageChange={(file) => setImages(prev => ({ ...prev, imagen: file }))}
              label=""
              error={errors.imagen}
            />
          </FormField>

          <FormField 
            label="Imagen para Modo Oscuro" 
            description="Opcional. Si no se proporciona, se usará la imagen principal."
          >
            <ImageUpload
              currentImage={member?.imagenDark}
              onImageChange={(file) => setImages(prev => ({ ...prev, imagenDark: file }))}
              label=""
            />
          </FormField>
        </div>

        <FormField label="Estado">
          <Switch
            checked={formData.active}
            onChange={(checked) => setFormData({ ...formData, active: checked })}
            label="Miembro activo"
            description="Los miembros inactivos no se mostrarán en el sitio web"
          />
        </FormField>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={handleClose}
            disabled={saving}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={saving || loading}
            className="px-4 py-2 text-sm font-medium text-white bg-purple-600 border border-transparent rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : member ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </Modal>
  );
};