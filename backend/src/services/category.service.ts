import { CategoryRepository } from '../repositories/category.repository';
import { NotFoundError, ConflictError } from '../utils/errors';

export class CategoryService {
  private categoryRepo: CategoryRepository;

  constructor() {
    this.categoryRepo = new CategoryRepository();
  }

  async create(data: { name: string }) {
    const existingCategory = await this.categoryRepo.findByName(data.name);
    if (existingCategory) {
      throw new ConflictError('Category name already exists');
    }

    return this.categoryRepo.create(data);
  }

  async getById(id: number) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Category');
    }
    return category;
  }

  async getByUuid(uuid: string) {
    const category = await this.categoryRepo.findByUuid(uuid);
    if (!category) {
      throw new NotFoundError('Category');
    }
    return category;
  }

  async list(params: { page: number; limit: number; search?: string }) {
    const result = await this.categoryRepo.findAll(params);
    return { categories: result.categories, total: result.total };
  }

  async listAll() {
    return this.categoryRepo.findAllSimple();
  }

  async update(id: number, data: { name?: string }) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Category');
    }

    if (data.name && data.name !== category.name) {
      const existingCategory = await this.categoryRepo.findByName(data.name);
      if (existingCategory) {
        throw new ConflictError('Category name already exists');
      }
    }

    return this.categoryRepo.update(id, data);
  }

  async delete(id: number) {
    const category = await this.categoryRepo.findById(id);
    if (!category) {
      throw new NotFoundError('Category');
    }

    await this.categoryRepo.delete(id);
  }
}
