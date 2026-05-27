import prisma from "../../config/database";
import redis from "../../config/redis";
import { hashPassword, comparePassword } from "../../utils/hash.util";
import { signToken, getTokenExpiry } from "../../utils/jwt.util";
import { AppError } from "../../middlewares/error.middleware";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } });
  if (existing) {
    throw new AppError("Email already registered", 409);
  }

  const hashedPassword = await hashPassword(input.password);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      password: hashedPassword,
    },
    select: { id: true, name: true, email: true, role: true },
  });

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return { user, token };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } });
  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const valid = await comparePassword(input.password, user.password);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  const token = signToken({ sub: user.id, email: user.email, role: user.role });

  return {
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
    token,
  };
}

export async function logoutUser(token: string) {
  const ttl = getTokenExpiry(token);
  if (ttl > 0) {
    await redis.set(`blacklist:${token}`, "1", "EX", ttl);
  }
}
