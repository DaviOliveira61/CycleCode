import { prisma } from '../lib/prisma.js';
import { User } from '@prisma/client';
import { hashPassword } from '../utils/password.js';

export type UserCreationParams = Omit<User, 'id' | 'createdAt' | 'updatedAt'>;

export const createUser = async (params: UserCreationParams) => {
    const hashedPassword = await hashPassword(params.password);

    return prisma.user.create({
        data: {
            ...params,
            password: hashedPassword,
        },
        select: {
            id: true,
            email: true,
            name: true,
            role: true,
            createdAt: true,
        }
    });
};

export const findUserByEmail = async (email: string) => {
    return prisma.user.findUnique({
        where: {
            email,
        },
    });
};
