import { PrismaClient, Category } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class CategoryRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async create(data: { name: string }): Promise<Category> {
    return this.db.category.create({ data });
  }

  async findById(id: number): Promise<Category | null> {
    return this.db.category.findUnique({ where: { id } });
  }

  async findByUuid(uuid: string): Promise<Category | null> {
    return this.db.category.findUnique({ where: { uuid } });
  }

  async findByName(name: string): Promise<Category | null> {
    return this.db.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    });
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const { search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? { name: { contains: search, mode: 'insensitive' as const } }
      : {};

    const [categories, total] = await Promise.all([
      this.db.category.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { _count: { select: { products: true } } },
      }),
      this.db.category.count({ where }),
    ]);

    return { categories, total };
  }

  async findAllSimple(): Promise<Category[]> {
    return this.db.category.findMany({ orderBy: { name: 'asc' } });
  }

  async update(id: number, data: { name?: string }): Promise<Category> {
    return this.db.category.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.db.category.delete({ where: { id } });
  }

  async exists(id: number): Promise<boolean> {
    const category = await this.db.category.findUnique({ where: { id } });
    return category !== null;
  }
}
