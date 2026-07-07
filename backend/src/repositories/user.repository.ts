import { PrismaClient, User } from '@prisma/client';
import { prisma } from '../utils/prisma';

export class UserRepository {
  private db: PrismaClient;

  constructor() {
    this.db = prisma;
  }

  async create(data: { email: string; password: string; name?: string; role?: string }): Promise<User> {
    return this.db.user.create({ data });
  }

  async findById(id: number): Promise<User | null> {
    return this.db.user.findUnique({ where: { id } });
  }

  async findByUuid(uuid: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { uuid } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.db.user.findUnique({ where: { email } });
  }

  async findAll(params: { page?: number; limit?: number; search?: string }) {
    const page = params.page || 1;
    const limit = params.limit || 10;
    const { search } = params;
    const skip = (page - 1) * limit;

    const where = search
      ? {
          OR: [
            { email: { contains: search, mode: 'insensitive' as const } },
            { name: { contains: search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      this.db.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          uuid: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.db.user.count({ where }),
    ]);

    return { users, total };
  }

  async update(id: number, data: { email?: string; name?: string; role?: string }): Promise<User> {
    return this.db.user.update({ where: { id }, data });
  }

  async delete(id: number): Promise<void> {
    await this.db.user.delete({ where: { id } });
  }
}
