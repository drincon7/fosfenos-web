// lib/upload.ts
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export interface FileUploadResult {
  success: boolean;
  path: string;
  url: string;
  filename: string;
  error?: string;
}

export interface FileValidation {
  valid: boolean;
  error?: string;
}

const UPLOAD_DIR = 'public/uploads';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export function validateImageFile(file: File): FileValidation {
  // Validar tamaño
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `El archivo es demasiado grande. Máximo ${MAX_FILE_SIZE / 1024 / 1024}MB permitidos.`
    };
  }

  // Validar tipo
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Tipo de archivo no permitido. Solo se permiten: ${ALLOWED_IMAGE_TYPES.join(', ')}`
    };
  }

  return { valid: true };
}

export async function saveFile(file: File, folder: string = 'general'): Promise<FileUploadResult> {
  try {
    // Validar el archivo
    const validation = validateImageFile(file);
    if (!validation.valid) {
      return {
        success: false,
        path: '',
        url: '',
        filename: '',
        error: validation.error
      };
    }

    // Crear directorio si no existe
    const uploadPath = join(process.cwd(), UPLOAD_DIR, folder);
    if (!existsSync(uploadPath)) {
      await mkdir(uploadPath, { recursive: true });
    }

    // Generar nombre único
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const filename = `${timestamp}-${randomString}.${extension}`;

    // Guardar archivo
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadPath, filename);
    await writeFile(filePath, new Uint8Array(buffer));

    // Retornar información del archivo
    const publicPath = `/uploads/${folder}/${filename}`;
    
    return {
      success: true,
      path: publicPath,
      url: publicPath,
      filename: filename
    };

  } catch (error) {
    console.error('Error saving file:', error);
    return {
      success: false,
      path: '',
      url: '',
      filename: '',
      error: 'Error interno del servidor al guardar el archivo'
    };
  }
}

export async function deleteFile(path: string): Promise<boolean> {
  try {
    const { unlink } = await import('fs/promises');
    const fullPath = join(process.cwd(), 'public', path);
    
    if (existsSync(fullPath)) {
      await unlink(fullPath);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}