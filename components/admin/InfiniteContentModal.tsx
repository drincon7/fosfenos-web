// components/admin/InfiniteContentModal.tsx
import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormField, Input, TextArea, Switch } from './FormField';
import { ImageUpload } from './ImageUpload';
import { Button } from './Button';
import { useInfiniteContentAdmin } from '@/lib/hooks/useInfiniteContentAdmin';
import type { InfiniteContentItem, CreateInfiniteContentData } from '@/types/infiniteContent';

interface InfiniteContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: InfiniteContentItem | null;
  onSaveSuccess: () => void;
}

export const InfiniteContentModal = ({ 
  isOpen, 
  onClose, 
  item, 
  onSaveSuccess 
}: InfiniteContentModalProps) => {
  const { createItem, updateItem, uploadImage, loading } = useInfiniteContentAdmin();
  
  const [formData, setFormData] = useState<CreateInfiniteContentData>({
    title: '',
    shortDescription: '',
    description: '',
    details: [],
    active: true
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [detailInput, setDetailInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);

  // Resetear formulario cuando se abre/cierra el modal o cambia el item
  useEffect(() => {
    if (isOpen) {
      if (item) {
        setFormData({
          title: item.title,
          shortDescription: item.shortDescription,
          description: item.description,
          details: [...item.details],
          active: item.active
        });
        setImagePreview(item.image);
      } else {
        setFormData({
          title: '',
          shortDescription: '',
          description: '',
          details: [],
          active: true
        });
        setImagePreview(null);
      }
      setImage(null);
      setDetailInput('');
      setErrors({});
    }
  }, [isOpen, item]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }
    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'La descripción corta es requerida';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }
    if (!item && !image && !imagePreview) {
      newErrors.image = 'La imagen es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CreateInfiniteContentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setImage(file);
    setImagePreview(previewUrl);
    if (errors.image) {
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const handleAddDetail = () => {
    if (detailInput.trim()) {
      const newDetails = [...formData.details, detailInput.trim()];
      setFormData(prev => ({ ...prev, details: newDetails }));
      setDetailInput('');
    }
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = formData.details.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, details: newDetails }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      let imageUrl = imagePreview;

      // Subir nueva imagen si existe
      if (image) {
        const uploadResult = await uploadImage(image);
        if (uploadResult.success) {
          imageUrl = uploadResult.url!;
        } else {
          setErrors({ submit: uploadResult.error || 'Error al subir la imagen' });
          return;
        }
      }

      const submitData = {
        ...formData,
        image: imageUrl
      };

      let result;
      if (item) {
        result = await updateItem(item.id, submitData);
      } else {
        result = await createItem(submitData);
      }

      if (result.success) {
        onSaveSuccess();
      } else {
        setErrors({ submit: result.error || 'Error al guardar' });
      }
    } catch (error) {
      console.error('Error saving item:', error);
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
      title={item ? 'Editar Contenido' : 'Nuevo Contenido'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.submit && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{errors.submit}</div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Columna izquierda */}
          <div className="space-y-6">
            <FormField label="Título" required error={errors.title}>
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Ej: Aventuras de Luna"
                error={!!errors.title}
                disabled={saving}
              />
            </FormField>

            <FormField label="Descripción Corta" required error={errors.shortDescription}>
              <Input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                placeholder="Ej: Serie animada educativa"
                error={!!errors.shortDescription}
                disabled={saving}
              />
            </FormField>

            <FormField label="Descripción Completa" required error={errors.description}>
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Descripción detallada del contenido..."
                rows={4}
                error={!!errors.description}
                disabled={saving}
              />
            </FormField>

            <FormField label="Estado">
              <Switch
                checked={formData.active}
                onChange={(checked) => handleInputChange('active', checked)}
                label="Contenido activo"
                description="Los contenidos inactivos no se mostrarán en el sitio web"
              />
            </FormField>
          </div>

          {/* Columna derecha */}
          <div className="space-y-6">
            <FormField label="Imagen" required={!item} error={errors.image}>
              <ImageUpload
                currentImage={imagePreview || undefined}
                onImageChange={handleImageChange}
                label=""
                error={errors.image}
              />
            </FormField>

            <FormField 
              label="Detalles" 
              description="Información adicional que se mostrará en el modal"
            >
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                    placeholder="Ej: Edad recomendada: 3-6 años"
                    disabled={saving}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddDetail();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={handleAddDetail}
                    disabled={!detailInput.trim() || saving}
                    size="sm"
                  >
                    Añadir
                  </Button>
                </div>

                {formData.details.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Detalles añadidos ({formData.details.length}):
                    </p>
                    <ul className="space-y-1">
                      {formData.details.map((detail, index) => (
                        <li 
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded px-3 py-2"
                        >
                          <span className="text-sm text-gray-700">{detail}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveDetail(index)}
                            className="text-red-500 hover:text-red-700 ml-2"
                            disabled={saving}
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </FormField>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving || loading}
          >
            {saving ? 'Guardando...' : item ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};