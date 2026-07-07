import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { NotFoundError, ConflictError } from '../utils/errors';

export class UserService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async create(data: { email: string; password: string; name?: string; role?: string }) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getById(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async getByUuid(uuid: string) {
    const user = await this.userRepo.findByUuid(uuid);
    if (!user) {
      throw new NotFoundError('User');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async list(params: { page: number; limit: number; search?: string }) {
    const result = await this.userRepo.findAll(params);
    return { users: result.users, total: result.total };
  }

  async update(id: number, data: { email?: string; name?: string; role?: string }) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    if (data.email && data.email !== user.email) {
      const existingUser = await this.userRepo.findByEmail(data.email);
      if (existingUser) {
        throw new ConflictError('Email already exists');
      }
    }

    const updatedUser = await this.userRepo.update(id, data);
    const { password: _, ...userWithoutPassword } = updatedUser;
    return userWithoutPassword;
  }

  async delete(id: number) {
    const user = await this.userRepo.findById(id);
    if (!user) {
      throw new NotFoundError('User');
    }

    await this.userRepo.delete(id);
  }
}
