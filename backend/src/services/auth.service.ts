import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { config } from '../config';
import { JwtPayload } from '../types';
import { ConflictError, UnauthorizedError, NotFoundError } from '../utils/errors';

export class AuthService {
  private userRepo: UserRepository;

  constructor() {
    this.userRepo = new UserRepository();
  }

  async register(data: { email: string; password: string; name?: string }) {
    const existingUser = await this.userRepo.findByEmail(data.email);
    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(data.password, 12);
    const user = await this.userRepo.create({
      ...data,
      password: hashedPassword,
    });

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async login(data: { email: string; password: string }) {
    const user = await this.userRepo.findByEmail(data.email);
    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = this.generateToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, token };
  }

  async getProfile(userId: number) {
    const user = await this.userRepo.findById(userId);
    if (!user) {
      throw new NotFoundError('User');
    }

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  private generateToken(user: { id: number; uuid: string; email: string; role: string }): string {
    const payload: JwtPayload = {
      id: user.id,
      uuid: user.uuid,
      email: user.email,
      role: user.role,
    };

    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn as string & { __brand: 'StringValue' },
    } as jwt.SignOptions);
  }
}
