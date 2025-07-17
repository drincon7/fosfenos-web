// lib/database/infiniteContentService.ts (CORREGIDO)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export interface InfiniteContentFilters {
  search?: string;
  active?: boolean;
  orderBy?: 'order' | 'title' | 'createdAt' | 'updatedAt';
  orderDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface CreateInfiniteContentData {
  title: string;
  shortDescription: string;
  description: string;
  image?: string;
  details: string[]; // Siempre es array, no opcional
  active: boolean;
  order?: number;
}

export interface UpdateInfiniteContentData extends Partial<CreateInfiniteContentData> {}

class InfiniteContentService {
  // Función helper para convertir JsonArray a string[]
  private convertDetailsToStringArray(details: any): string[] {
    if (!details) return [];
    if (Array.isArray(details)) {
      return details.filter(item => typeof item === 'string');
    }
    return [];
  }

  // Obtener todos los elementos con filtros y paginación
  async getAll(filters: InfiniteContentFilters = {}) {
    const {
      search,
      active,
      orderBy = 'order',
      orderDirection = 'asc',
      page = 1,
      pageSize = 10
    } = filters;

    const where: any = {};

    // Aplicar filtros
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (active !== undefined) {
      where.active = active;
    }

    // Contar total de elementos
    const total = await prisma.infiniteContent.count({ where });

    // Obtener elementos paginados
    const rawData = await prisma.infiniteContent.findMany({
      where,
      orderBy: { [orderBy]: orderDirection },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    // Convertir datos de Prisma a nuestro formato
    const data = rawData.map(item => ({
      ...item,
      details: this.convertDetailsToStringArray(item.details)
    }));

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  // Obtener por ID
  async getById(id: string) {
    const item = await prisma.infiniteContent.findUnique({
      where: { id }
    });

    if (!item) return null;

    return {
      ...item,
      details: this.convertDetailsToStringArray(item.details)
    };
  }

  // Crear nuevo elemento
  async create(data: CreateInfiniteContentData) {
    // Si no se especifica un orden, asignar el siguiente disponible
    if (!data.order) {
      const lastItem = await prisma.infiniteContent.findFirst({
        orderBy: { order: 'desc' }
      });
      data.order = lastItem ? lastItem.order + 1 : 1;
    }

    const created = await prisma.infiniteContent.create({
      data: {
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        image: data.image || '',
        details: data.details, // Prisma maneja automáticamente la conversión a Json
        active: data.active,
        order: data.order
      }
    });

    return {
      ...created,
      details: this.convertDetailsToStringArray(created.details)
    };
  }

  // Actualizar elemento
  async update(id: string, data: UpdateInfiniteContentData) {
    const updateData: any = {};

    // Solo incluir campos que se están actualizando
    if (data.title !== undefined) updateData.title = data.title;
    if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.image !== undefined) updateData.image = data.image;
    if (data.details !== undefined) updateData.details = data.details;
    if (data.active !== undefined) updateData.active = data.active;
    if (data.order !== undefined) updateData.order = data.order;

    const updated = await prisma.infiniteContent.update({
      where: { id },
      data: updateData
    });

    return {
      ...updated,
      details: this.convertDetailsToStringArray(updated.details)
    };
  }

  // Eliminar elemento
  async delete(id: string) {
    return await prisma.infiniteContent.delete({
      where: { id }
    });
  }

  // Reordenar elementos
  async reorder(items: { id: string; order: number }[]) {
    // Usar transacción para asegurar consistencia
    return await prisma.$transaction(async (tx) => {
      const updates = items.map(item =>
        tx.infiniteContent.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      );
      
      return await Promise.all(updates);
    });
  }

  // Alternar estado activo
  async toggleActive(id: string) {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Elemento no encontrado');
    }

    return await this.update(id, { active: !current.active });
  }

  // Obtener el siguiente número de orden disponible
  async getNextOrder() {
    const lastItem = await prisma.infiniteContent.findFirst({
      orderBy: { order: 'desc' }
    });
    return lastItem ? lastItem.order + 1 : 1;
  }

  // Duplicar un elemento
  async duplicate(id: string) {
    const original = await this.getById(id);
    if (!original) {
      throw new Error('Elemento no encontrado');
    }

    const nextOrder = await this.getNextOrder();

    return await this.create({
      title: `${original.title} (Copia)`,
      shortDescription: original.shortDescription,
      description: original.description,
      image: original.image,
      details: original.details, // Ya es string[] gracias a convertDetailsToStringArray
      active: false, // Crear como inactivo por defecto
      order: nextOrder
    });
  }

  // Mover elemento hacia arriba en el orden
  async moveUp(id: string) {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Elemento no encontrado');
    }

    // Encontrar el elemento inmediatamente anterior
    const previous = await prisma.infiniteContent.findFirst({
      where: { order: { lt: current.order } },
      orderBy: { order: 'desc' }
    });

    if (previous) {
      // Intercambiar órdenes
      await this.reorder([
        { id: current.id, order: previous.order },
        { id: previous.id, order: current.order }
      ]);
    }

    return await this.getById(id);
  }

  // Mover elemento hacia abajo en el orden
  async moveDown(id: string) {
    const current = await this.getById(id);
    if (!current) {
      throw new Error('Elemento no encontrado');
    }

    // Encontrar el elemento inmediatamente siguiente
    const next = await prisma.infiniteContent.findFirst({
      where: { order: { gt: current.order } },
      orderBy: { order: 'asc' }
    });

    if (next) {
      // Intercambiar órdenes
      await this.reorder([
        { id: current.id, order: next.order },
        { id: next.id, order: current.order }
      ]);
    }

    return await this.getById(id);
  }

  // Obtener estadísticas
  async getStats() {
    const [total, active, inactive] = await Promise.all([
      prisma.infiniteContent.count(),
      prisma.infiniteContent.count({ where: { active: true } }),
      prisma.infiniteContent.count({ where: { active: false } })
    ]);

    return {
      total,
      active,
      inactive,
      percentage: total > 0 ? Math.round((active / total) * 100) : 0
    };
  }

  // Buscar elementos similares por título
  async findSimilar(title: string, excludeId?: string) {
    const where: any = {
      title: { contains: title, mode: 'insensitive' }
    };

    if (excludeId) {
      where.id = { not: excludeId };
    }

    return await prisma.infiniteContent.findMany({
      where,
      select: { id: true, title: true, active: true },
      take: 5
    });
  }
}

export default new InfiniteContentService();