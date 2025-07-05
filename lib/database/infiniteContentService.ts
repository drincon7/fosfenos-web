// lib/database/infiniteContentService.ts
import { PrismaClient } from '@prisma/client';
import type { 
  InfiniteContentItem, 
  InfiniteContentFilters, 
  InfiniteContentResponse,
  CreateInfiniteContentData,
  UpdateInfiniteContentData 
} from '@/types/infiniteContent';

const prisma = new PrismaClient();

export class InfiniteContentService {
  static async getAll(filters: InfiniteContentFilters): Promise<InfiniteContentResponse> {
    const {
      search,
      active,
      page = 1,
      pageSize = 10,
      orderBy = 'order',
      orderDirection = 'asc'
    } = filters;

    const skip = (page - 1) * pageSize;

    // Construir condiciones de filtro
    const where: any = {};

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { shortDescription: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (typeof active === 'boolean') {
      where.active = active;
    }

    try {
      const [items, total] = await Promise.all([
        prisma.infiniteContent.findMany({
          where,
          orderBy: { [orderBy]: orderDirection },
          skip,
          take: pageSize,
        }),
        prisma.infiniteContent.count({ where })
      ]);

      const totalPages = Math.ceil(total / pageSize);

      return {
        data: items.map(this.transformToInfiniteContentItem),
        total,
        page,
        pageSize,
        totalPages
      };
    } catch (error) {
      console.error('Error fetching infinite content:', error);
      throw new Error('Failed to fetch infinite content');
    }
  }

  static async getById(id: string): Promise<InfiniteContentItem | null> {
    try {
      const item = await prisma.infiniteContent.findUnique({
        where: { id }
      });

      return item ? this.transformToInfiniteContentItem(item) : null;
    } catch (error) {
      console.error('Error fetching infinite content by ID:', error);
      throw new Error('Failed to fetch infinite content');
    }
  }

  static async create(data: CreateInfiniteContentData): Promise<InfiniteContentItem> {
    try {
      // Obtener el siguiente número de orden
      const maxOrder = await prisma.infiniteContent.aggregate({
        _max: { order: true }
      });

      const newOrder = (maxOrder._max.order || 0) + 1;

      const item = await prisma.infiniteContent.create({
        data: {
          title: data.title,
          shortDescription: data.shortDescription,
          description: data.description,
          image: typeof data.image === 'string' ? data.image : '',
          details: JSON.stringify(data.details), // ESTA ES LA LÍNEA CORRECTA
          order: newOrder,
          active: data.active
        }
      });

      return this.transformToInfiniteContentItem(item);
    } catch (error) {
      console.error('Error creating infinite content:', error);
      throw new Error('Failed to create infinite content');
    }
  }

  static async update(id: string, data: Partial<CreateInfiniteContentData>): Promise<InfiniteContentItem> {
    try {
      const updateData: any = {};

      if (data.title !== undefined) updateData.title = data.title;
      if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription;
      if (data.description !== undefined) updateData.description = data.description;
      if (data.details !== undefined) updateData.details = JSON.stringify(data.details);
      if (data.active !== undefined) updateData.active = data.active;
      if (typeof data.image === 'string') updateData.image = data.image;

      const item = await prisma.infiniteContent.update({
        where: { id },
        data: updateData
      });

      return this.transformToInfiniteContentItem(item);
    } catch (error) {
      console.error('Error updating infinite content:', error);
      throw new Error('Failed to update infinite content');
    }
  }

  static async delete(id: string): Promise<void> {
    try {
      await prisma.infiniteContent.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting infinite content:', error);
      throw new Error('Failed to delete infinite content');
    }
  }

  static async reorder(items: { id: string; order: number }[]): Promise<void> {
    try {
      const updates = items.map(item => 
        prisma.infiniteContent.update({
          where: { id: item.id },
          data: { order: item.order }
        })
      );

      await Promise.all(updates);
    } catch (error) {
      console.error('Error reordering infinite content:', error);
      throw new Error('Failed to reorder infinite content');
    }
  }

  static async updateImage(id: string, imagePath: string): Promise<InfiniteContentItem> {
    try {
      const item = await prisma.infiniteContent.update({
        where: { id },
        data: { image: imagePath }
      });

      return this.transformToInfiniteContentItem(item);
    } catch (error) {
      console.error('Error updating infinite content image:', error);
      throw new Error('Failed to update infinite content image');
    }
  }

  private static transformToInfiniteContentItem(item: any): InfiniteContentItem {
    let details: string[] = [];
    
    try {
      if (item.details) {
        if (typeof item.details === 'string') {
          details = JSON.parse(item.details);
        } else if (Array.isArray(item.details)) {
          details = item.details;
        }
      }
    } catch (error) {
      console.warn('Error parsing details for item:', item.id, error);
      details = [];
    }

    return {
      id: item.id,
      title: item.title,
      shortDescription: item.shortDescription,
      description: item.description,
      image: item.image,
      details: Array.isArray(details) ? details : [],
      order: item.order,
      active: item.active,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString()
    };
  }
}

export default InfiniteContentService;