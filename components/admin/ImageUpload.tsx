// components/admin/ImageUpload.tsx
import { useState, useRef } from 'react';
import { Upload, X, ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (file: File | null, previewUrl: string | null) => void;
  label?: string;
  error?: string;
  accept?: string;
  maxSize?: number; // en MB
}

export const ImageUpload = ({ 
  currentImage, 
  onImageChange, 
  label = 'Imagen',
  error,
  accept = 'image/*',
  maxSize = 5
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (file: File) => {
    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      alert(`El archivo es demasiado grande. Máximo ${maxSize}MB.`);
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Solo se permiten archivos de imagen.');
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const previewUrl = e.target?.result as string;
      setPreview(previewUrl);
      onImageChange(file, previewUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeImage = () => {
    setPreview(null);
    onImageChange(null, null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="space-y-3">
        {/* Preview */}
        {preview && (
          <div className="relative inline-block">
            <div className="relative h-32 w-32 rounded-lg overflow-hidden border-2 border-gray-200">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="object-cover"
              />
            </div>
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Upload Area */}
        <div
          className={`
            relative border-2 border-dashed rounded-lg p-6 text-center hover:border-purple-400 transition-colors cursor-pointer
            ${dragOver ? 'border-purple-400 bg-purple-50' : 'border-gray-300'}
            ${error ? 'border-red-300' : ''}
          `}
          onDrop={handleDrop}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileInput}
            className="hidden"
          />
          
          <div className="space-y-2">
            <div className="mx-auto h-12 w-12 text-gray-400">
              {preview ? <ImageIcon size={48} /> : <Upload size={48} />}
            </div>
            <div className="text-sm text-gray-600">
              <span className="font-medium text-purple-600 hover:text-purple-500">
                Haz clic para subir
              </span>{' '}
              o arrastra y suelta
            </div>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF hasta {maxSize}MB
            </p>
          </div>
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};