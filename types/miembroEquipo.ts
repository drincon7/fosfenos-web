// /types/miembroEquipo.ts
export interface MiembroEquipo {
    id: string;
    nombre: string;
    cargo: string;
    imagen: string;
    imagenDark?: string; // Opcional para compatibilidad con modo oscuro
  }