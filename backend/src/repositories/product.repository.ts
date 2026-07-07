import { PrismaClient, Product } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class ProductRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async create(data: { name: string; image?: string; price: number; categoryId: number }): Promise<Product> {
    return this.db.product.create({
      data,
      include: { category: true },
    });
  }

  async findById(id: number): Promise<Product | null> {
    return this.db.product.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async findByUuid(uuid: string): Promise<Product | null> {
    return this.db.product.findUnique({
      where: { uuid },
      include: { category: true },
    });
  }

  async findAll(params: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    search?: string;
    categoryId?: string;
  }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const sortBy = params.sortBy || 'createdAt';
    const sortOrder = params.sortOrder || 'desc';
    const { search, categoryId } = params;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      const category = await this.db.category.findUnique({ where: { uuid: categoryId } });
      if (category) {
        where.categoryId = category.id;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { category: { name: { contains: search, mode: 'insensitive' } } },
      ];
    }

    const orderBy: any = sortBy === 'category' ? { category: { name: sortOrder } } : { [sortBy]: sortOrder };

    const [products, total] = await Promise.all([
      this.db.product.findMany({
        where,
        skip,
        take: limit,
        include: { category: true },
        orderBy,
      }),
      this.db.product.count({ where }),
    ]);

    return { products, total };
  }

  async update(id: number, data: { name?: string; image?: string; price?: number; categoryId?: number }): Promise<Product> {
    return this.db.product.update({
      where: { id },
      data,
      include: { category: true },
    });
  }

  async delete(id: number): Promise<void> {
    await this.db.product.delete({ where: { id } });
  }

  async createMany(products: Array<{ name: string; price: number; categoryId: number; image?: string }>) {
    return this.db.product.createMany({ data: products });
  }

  async count(): Promise<number> {
    return this.db.product.count();
  }

  async countByCategory(): Promise<Array<{ category: string; count: number; totalValue: number }>> {
    const results = await this.db.product.groupBy({
      by: ['categoryId'],
      _count: { id: true },
      _sum: { price: true },
    });

    const categories = await this.db.category.findMany();
    const categoryMap = new Map(categories.map((c) => [c.id, c.name]));

    return results.map((r) => ({
      category: categoryMap.get(r.categoryId) || 'Unknown',
      count: r._count.id,
      totalValue: r._sum.price || 0,
    }));
  }

  async findRecent(limit: number): Promise<Product[]> {
    return this.db.product.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { category: true },
    });
  }

  async findForExport() {
    return this.db.product.findMany({
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    });
  }
}
