// lib/upload.ts (REEMPLAZAR COMPLETAMENTE)
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface FileUploadResult {
  fileName: string;
  url: string;
  size: number;
  type: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

// Configuración de archivos permitidos
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg', 
  'image/png',
  'image/webp',
  'image/gif'
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export function validateImageFile(file: File): ValidationResult {
  // Verificar que sea un archivo válido
  if (!file || file.size === 0) {
    return {
      valid: false,
      error: 'No se ha seleccionado ningún archivo'
    };
  }

  // Verificar tipo de archivo
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Formatos permitidos: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }

  // Verificar tamaño
  if (file.size > MAX_FILE_SIZE) {
    const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
    return {
      valid: false,
      error: `El archivo es demasiado grande. Tamaño máximo: ${maxSizeMB}MB`
    };
  }

  return { valid: true };
}

export async function saveFile(file: File, folder: string): Promise<FileUploadResult> {
  try {
    // Crear nombre único para el archivo
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomSuffix}.${extension}`;
    
    // Crear ruta completa
    const uploadDir = join(process.cwd(), 'public', folder);
    const filePath = join(uploadDir, fileName);
    
    // Crear directorio si no existe
    if (!existsSync(uploadDir)) {
      await mkdir(uploadDir, { recursive: true });
    }
    
    // Convertir archivo a Uint8Array y guardarlo
    const bytes = await file.arrayBuffer();
    const uint8Array = new Uint8Array(bytes);
    await writeFile(filePath, uint8Array);
    
    return {
      fileName,
      url: `/${folder}/${fileName}`,
      size: file.size,
      type: file.type
    };
    
  } catch (error) {
    console.error('Error saving file:', error);
    throw new Error('Error al guardar el archivo');
  }
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

export function generateUniqueFilename(originalName: string): string {
  const timestamp = Date.now();
  const randomSuffix = Math.random().toString(36).substring(2, 8);
  const extension = getFileExtension(originalName);
  return `${timestamp}-${randomSuffix}.${extension}`;
}

// Función para limpiar nombres de archivo
export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Reemplazar caracteres especiales
    .replace(/_+/g, '_') // Reemplazar múltiples guiones bajos
    .toLowerCase();
}