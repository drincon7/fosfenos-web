// lib/api-helpers.ts
// Helpers para transformar datos entre el formato de la base de datos y el formato del frontend

export interface TechnicalInfoDB {
  formato: string;
  duracion: string;
  genero: string;
  publico: string;
  estado: string;
  empresaProductora: string;
  paisProductora: string;
  empresaCoproductora: string | null;
  paisCoproductora: string | null;
}

export interface TechnicalInfoFrontend {
  formato: string;
  duracion: string;
  genero: string;
  publico: string;
  estado: string;
  empresaProductora: {
    nombre: string;
    pais: string;
  };
  empresaCoproductora?: {
    nombre: string;
    pais: string;
  };
}

// Convertir de formato DB a formato Frontend
export function transformTechnicalInfoForFrontend(dbData: TechnicalInfoDB): TechnicalInfoFrontend {
  const result: TechnicalInfoFrontend = {
    formato: dbData.formato,
    duracion: dbData.duracion,
    genero: dbData.genero,
    publico: dbData.publico,
    estado: dbData.estado,
    empresaProductora: {
      nombre: dbData.empresaProductora,
      pais: dbData.paisProductora
    }
  };

  // Agregar coproductora si existe
  if (dbData.empresaCoproductora && dbData.paisCoproductora) {
    result.empresaCoproductora = {
      nombre: dbData.empresaCoproductora,
      pais: dbData.paisCoproductora
    };
  }

  return result;
}

// Convertir de formato Frontend a formato DB
export function transformTechnicalInfoForDB(frontendData: TechnicalInfoFrontend): Omit<TechnicalInfoDB, 'id' | 'childContentId' | 'createdAt' | 'updatedAt'> {
  return {
    formato: frontendData.formato,
    duracion: frontendData.duracion,
    genero: frontendData.genero,
    publico: frontendData.publico,
    estado: frontendData.estado,
    empresaProductora: frontendData.empresaProductora.nombre,
    paisProductora: frontendData.empresaProductora.pais,
    empresaCoproductora: frontendData.empresaCoproductora?.nombre || null,
    paisCoproductora: frontendData.empresaCoproductora?.pais || null
  };
}

// Transformar contenido completo para el frontend
export function transformContentForFrontend(dbContent: any) {
  const transformed = {
    ...dbContent,
    // Transformar información técnica si existe
    technicalInfo: dbContent.technicalInfo 
      ? transformTechnicalInfoForFrontend(dbContent.technicalInfo)
      : null
  };

  return transformed;
}