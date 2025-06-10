// lib/database.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Tipos para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Tipos para filtros
export interface ContentFilters {
  search?: string;
  published?: boolean;
  active?: boolean;
  orderBy?: 'createdAt' | 'updatedAt' | 'title' | 'order';
  orderDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

// ===================== CHILD CONTENT SERVICE =====================
export class ChildContentService {
  static async getAll(filters?: ContentFilters): Promise<PaginatedResponse<any>> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 10;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' as const } },
          { synopsis: { contains: filters.search, mode: 'insensitive' as const } }
        ]
      }),
      ...(filters?.published !== undefined && { published: filters.published })
    };

    const [data, total] = await Promise.all([
      prisma.childContent.findMany({
        where,
        include: {
          technicalInfo: true,
          awards: { orderBy: { order: 'asc' } },
          platforms: { orderBy: { order: 'asc' } },
          additionalInfo: true
        },
        orderBy: {
          [filters?.orderBy || 'order']: filters?.orderDirection || 'asc'
        },
        skip,
        take: pageSize
      }),
      prisma.childContent.count({ where })
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  static async getById(id: string) {
    return prisma.childContent.findUnique({
      where: { id },
      include: {
        technicalInfo: true,
        awards: { orderBy: { order: 'asc' } },
        platforms: { orderBy: { order: 'asc' } },
        additionalInfo: true
      }
    });
  }

  static async getBySlug(slug: string) {
    return prisma.childContent.findUnique({
      where: { slug },
      include: {
        technicalInfo: true,
        awards: { orderBy: { order: 'asc' } },
        platforms: { orderBy: { order: 'asc' } },
        additionalInfo: true
      }
    });
  }

  static async create(data: any) {
    const { technicalInfo, awards, platforms, additionalInfo, ...contentData } = data;

    return prisma.childContent.create({
      data: {
        ...contentData,
        slug: this.generateSlug(data.title),
        technicalInfo: technicalInfo ? { create: technicalInfo } : undefined,
        awards: awards && awards.length > 0 ? { create: awards } : undefined,
        platforms: platforms && platforms.length > 0 ? { create: platforms } : undefined,
        additionalInfo: additionalInfo ? { create: additionalInfo } : undefined
      },
      include: {
        technicalInfo: true,
        awards: { orderBy: { order: 'asc' } },
        platforms: { orderBy: { order: 'asc' } },
        additionalInfo: true
      }
    });
  }

  static async update(id: string, data: any) {
    const { technicalInfo, awards, platforms, additionalInfo, ...contentData } = data;

    // Eliminar relaciones existentes si se van a actualizar
    if (awards !== undefined) {
      await prisma.award.deleteMany({ where: { childContentId: id } });
    }
    if (platforms !== undefined) {
      await prisma.platform.deleteMany({ where: { childContentId: id } });
    }

    return prisma.childContent.update({
      where: { id },
      data: {
        ...contentData,
        ...(data.title && { slug: this.generateSlug(data.title) }),
        technicalInfo: technicalInfo ? {
          upsert: {
            create: technicalInfo,
            update: technicalInfo
          }
        } : undefined,
        awards: awards ? { create: awards } : undefined,
        platforms: platforms ? { create: platforms } : undefined,
        additionalInfo: additionalInfo ? {
          upsert: {
            create: additionalInfo,
            update: additionalInfo
          }
        } : undefined
      },
      include: {
        technicalInfo: true,
        awards: { orderBy: { order: 'asc' } },
        platforms: { orderBy: { order: 'asc' } },
        additionalInfo: true
      }
    });
  }

  static async delete(id: string) {
    await prisma.childContent.delete({ where: { id } });
  }

  private static generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
  }
}

// ===================== TEAM MEMBERS SERVICE =====================
export class TeamMemberService {
  static async getAll(filters?: ContentFilters): Promise<PaginatedResponse<any>> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.search && {
        OR: [
          { nombre: { contains: filters.search, mode: 'insensitive' as const } },
          { cargo: { contains: filters.search, mode: 'insensitive' as const } }
        ]
      }),
      ...(filters?.active !== undefined && { active: filters.active })
    };

    const [data, total] = await Promise.all([
      prisma.teamMember.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: pageSize
      }),
      prisma.teamMember.count({ where })
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  static async getById(id: string) {
    return prisma.teamMember.findUnique({
      where: { id }
    });
  }

  static async create(data: any) {
    return prisma.teamMember.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.teamMember.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    await prisma.teamMember.delete({ where: { id } });
  }

  static async reorder(items: { id: string; order: number }[]) {
    await prisma.$transaction(
      items.map(item => 
        prisma.teamMember.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      )
    );
  }
}

// ===================== SERVICES SERVICE =====================
export class ServiceService {
  static async getAll() {
    return prisma.service.findMany({
      include: {
        features: { orderBy: { order: 'asc' } }
      },
      orderBy: { order: 'asc' }
    });
  }

  static async getById(id: string) {
    return prisma.service.findUnique({
      where: { id },
      include: {
        features: { orderBy: { order: 'asc' } }
      }
    });
  }

  static async create(data: any) {
    const { features, ...serviceData } = data;

    return prisma.service.create({
      data: {
        ...serviceData,
        features: features && features.length > 0 ? { create: features } : undefined
      },
      include: {
        features: { orderBy: { order: 'asc' } }
      }
    });
  }

  static async update(id: string, data: any) {
    const { features, ...serviceData } = data;

    if (features !== undefined) {
      await prisma.serviceFeature.deleteMany({ where: { serviceId: id } });
    }

    return prisma.service.update({
      where: { id },
      data: {
        ...serviceData,
        features: features ? { create: features } : undefined
      },
      include: {
        features: { orderBy: { order: 'asc' } }
      }
    });
  }

  static async delete(id: string) {
    await prisma.service.delete({ where: { id } });
  }
}

// ===================== BRANDS SERVICE =====================
export class BrandService {
  static async getAll(filters?: ContentFilters): Promise<PaginatedResponse<any>> {
    const page = filters?.page || 1;
    const pageSize = filters?.pageSize || 20;
    const skip = (page - 1) * pageSize;

    const where = {
      ...(filters?.search && {
        name: { contains: filters.search, mode: 'insensitive' as const }
      }),
      ...(filters?.active !== undefined && { active: filters.active })
    };

    const [data, total] = await Promise.all([
      prisma.brand.findMany({
        where,
        orderBy: { order: 'asc' },
        skip,
        take: pageSize
      }),
      prisma.brand.count({ where })
    ]);

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  static async getById(id: string) {
    return prisma.brand.findUnique({
      where: { id }
    });
  }

  static async create(data: any) {
    return prisma.brand.create({ data });
  }

  static async update(id: string, data: any) {
    return prisma.brand.update({
      where: { id },
      data
    });
  }

  static async delete(id: string) {
    await prisma.brand.delete({ where: { id } });
  }
}