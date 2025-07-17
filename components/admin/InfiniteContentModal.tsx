// components/admin/InfiniteContentModal.tsx
import { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { FormField, Input, TextArea, Switch } from './FormField';
import { ImageUpload } from './ImageUpload';
import { Button } from './Button';
import { useInfiniteContentAdmin } from '@/lib/hooks/useInfiniteContentAdmin';
import { 
  validateInfiniteContentData,
  INFINITE_CONTENT_CONSTANTS 
} from '@/types/infiniteContent';
import type { 
  InfiniteContentItem, 
  CreateInfiniteContentData,
  InfiniteContentValidationErrors 
} from '@/types/infiniteContent';

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
  const { createItem, updateItem, loading } = useInfiniteContentAdmin();
  
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
  const [errors, setErrors] = useState<InfiniteContentValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

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
      setTouched({});
    }
  }, [isOpen, item]);

  // Validación en tiempo real
  useEffect(() => {
    if (Object.keys(touched).length > 0) {
      const validationErrors = validateInfiniteContentData({
        ...formData,
        image: image || imagePreview || undefined
      });
      setErrors(validationErrors);
    }
  }, [formData, image, imagePreview, touched]);

  const handleInputChange = (field: keyof CreateInfiniteContentData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleInputBlur = (field: keyof CreateInfiniteContentData) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const handleImageChange = (file: File | null, previewUrl: string | null) => {
    setImage(file);
    setImagePreview(previewUrl);
    setTouched(prev => ({ ...prev, image: true }));
  };

  const handleAddDetail = () => {
    const trimmedDetail = detailInput.trim();
    if (trimmedDetail && (formData.details || []).length < INFINITE_CONTENT_CONSTANTS.MAX_DETAILS) {
      const newDetails = [...(formData.details || []), trimmedDetail];
      setFormData(prev => ({ ...prev, details: newDetails }));
      setDetailInput('');
      setTouched(prev => ({ ...prev, details: true }));
    }
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = (formData.details || []).filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, details: newDetails }));
    setTouched(prev => ({ ...prev, details: true }));
  };

  const handleEditDetail = (index: number, newValue: string) => {
    const newDetails = [...(formData.details || [])];
    newDetails[index] = newValue;
    setFormData(prev => ({ ...prev, details: newDetails }));
    setTouched(prev => ({ ...prev, details: true }));
  };

  const validateForm = (): boolean => {
    // Marcar todos los campos como touched para mostrar errores
    setTouched({
      title: true,
      shortDescription: true,
      description: true,
      image: true,
      details: true
    });

    const validationErrors = validateInfiniteContentData({
      ...formData,
      image: image || imagePreview || undefined
    });

    // Validación adicional para imagen requerida en nuevos elementos
    if (!item && !image && !imagePreview) {
      validationErrors.image = 'La imagen es requerida';
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    
    try {
      const submitData: CreateInfiniteContentData = {
        ...formData,
        image: image || imagePreview || undefined
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

  const hasUnsavedChanges = () => {
    if (!item) {
      return formData.title || formData.shortDescription || formData.description || 
             (formData.details || []).length > 0 || image;
    }
    
    return (
      formData.title !== item.title ||
      formData.shortDescription !== item.shortDescription ||
      formData.description !== item.description ||
      formData.active !== item.active ||
      JSON.stringify(formData.details || []) !== JSON.stringify(item.details || []) ||
      image !== null
    );
  };

  const handleCloseWithConfirmation = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm('¿Estás seguro de que quieres cerrar? Los cambios no guardados se perderán.')) {
        handleClose();
      }
    } else {
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCloseWithConfirmation}
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
            <FormField 
              label="Título" 
              required 
              error={touched.title ? errors.title : undefined}
              description={`${formData.title.length}/${INFINITE_CONTENT_CONSTANTS.TITLE_MAX_LENGTH} caracteres`}
            >
              <Input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                onBlur={() => handleInputBlur('title')}
                placeholder="Ej: Aventuras de Luna"
                error={touched.title && !!errors.title}
                disabled={saving}
                maxLength={INFINITE_CONTENT_CONSTANTS.TITLE_MAX_LENGTH}
              />
            </FormField>

            <FormField 
              label="Descripción Corta" 
              required 
              error={touched.shortDescription ? errors.shortDescription : undefined}
              description={`${formData.shortDescription.length}/${INFINITE_CONTENT_CONSTANTS.SHORT_DESCRIPTION_MAX_LENGTH} caracteres`}
            >
              <Input
                type="text"
                value={formData.shortDescription}
                onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                onBlur={() => handleInputBlur('shortDescription')}
                placeholder="Ej: Serie animada educativa"
                error={touched.shortDescription && !!errors.shortDescription}
                disabled={saving}
                maxLength={INFINITE_CONTENT_CONSTANTS.SHORT_DESCRIPTION_MAX_LENGTH}
              />
            </FormField>

            <FormField 
              label="Descripción Completa" 
              required 
              error={touched.description ? errors.description : undefined}
              description={`${formData.description.length}/${INFINITE_CONTENT_CONSTANTS.DESCRIPTION_MAX_LENGTH} caracteres`}
            >
              <TextArea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                onBlur={() => handleInputBlur('description')}
                placeholder="Descripción detallada del contenido..."
                rows={4}
                error={touched.description && !!errors.description}
                disabled={saving}
                maxLength={INFINITE_CONTENT_CONSTANTS.DESCRIPTION_MAX_LENGTH}
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
            <FormField 
              label="Imagen" 
              required={!item} 
              error={touched.image ? errors.image : undefined}
            >
              <ImageUpload
                currentImage={imagePreview || undefined}
                onImageChange={handleImageChange}
                label=""
                error={touched.image ? errors.image : undefined}
                maxSize={INFINITE_CONTENT_CONSTANTS.IMAGE_MAX_SIZE / (1024 * 1024)}
                accept={INFINITE_CONTENT_CONSTANTS.SUPPORTED_IMAGE_TYPES.join(',')}
              />
            </FormField>

            <FormField 
              label="Detalles" 
              description={`Información adicional (${(formData.details || []).length}/${INFINITE_CONTENT_CONSTANTS.MAX_DETAILS} máximo)`}
              error={touched.details ? errors.details : undefined}
            >
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={detailInput}
                    onChange={(e) => setDetailInput(e.target.value)}
                    placeholder="Ej: Edad recomendada: 3-6 años"
                    disabled={saving || (formData.details || []).length >= INFINITE_CONTENT_CONSTANTS.MAX_DETAILS}
                    maxLength={INFINITE_CONTENT_CONSTANTS.DETAIL_MAX_LENGTH}
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
                    disabled={
                      !detailInput.trim() || 
                      saving || 
                      (formData.details || []).length >= INFINITE_CONTENT_CONSTANTS.MAX_DETAILS
                    }
                    size="sm"
                  >
                    Añadir
                  </Button>
                </div>

                {(formData.details || []).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">
                      Detalles añadidos:
                    </p>
                    <ul className="space-y-1 max-h-40 overflow-y-auto">
                      {(formData.details || []).map((detail, index) => (
                        <li 
                          key={index}
                          className="flex items-center justify-between bg-gray-50 rounded px-3 py-2 group"
                        >
                          <input
                            type="text"
                            value={detail}
                            onChange={(e) => handleEditDetail(index, e.target.value)}
                            className="flex-1 bg-transparent text-sm text-gray-700 border-none outline-none focus:bg-white focus:px-2 focus:py-1 focus:rounded"
                            maxLength={INFINITE_CONTENT_CONSTANTS.DETAIL_MAX_LENGTH}
                            disabled={saving}
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveDetail(index)}
                            className="text-red-500 hover:text-red-700 ml-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            disabled={saving}
                            title="Eliminar detalle"
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

        {/* Indicador de cambios no guardados */}
        {hasUnsavedChanges() && (
          <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.96-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            Tienes cambios sin guardar
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="secondary"
            onClick={handleCloseWithConfirmation}
            disabled={saving}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={saving || loading || Object.keys(errors).some(key => key !== 'submit' && errors[key as keyof typeof errors])}
          >
            {saving ? 'Guardando...' : item ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};