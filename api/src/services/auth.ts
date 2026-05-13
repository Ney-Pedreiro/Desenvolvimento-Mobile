import { AuthResponse } from '../types/index.js';
import { generateToken } from '../utils/jwt.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { ApiError } from '../utils/errors.js';
import { getPrismaClient } from '../lib/prisma.js';

const prisma = getPrismaClient();

export class AuthService {
  async register(
    email: string,
    password: string,
    name: string
  ): Promise<AuthResponse> {
    // Validar email
    if (!this.isValidEmail(email)) {
      throw new ApiError(400, 'INVALID_EMAIL', 'Invalid email format');
    }

    // Validar senha
    if (password.length < 6) {
      throw new ApiError(
        400,
        'WEAK_PASSWORD',
        'Password must be at least 6 characters long'
      );
    }

    // Verificar se usuário já existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ApiError(
        409,
        'USER_ALREADY_EXISTS',
        'Email already registered'
      );
    }

    // Hash da senha
    const hashedPassword = await hashPassword(password);

    // Criar novo usuário
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Gerar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Verificar senha
    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ApiError(401, 'INVALID_CREDENTIALS', 'Invalid email or password');
    }

    // Gerar token
    const token = generateToken({
      id: user.id,
      email: user.email,
      name: user.name,
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
