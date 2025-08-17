import { prisma } from '../lib/prisma.js';


export const getAllCategories = async () => {
    return prisma.category.findMany({
        orderBy: { name: 'asc' },
    });
};

export const createCategory = async (name: string) => {
    return prisma.category.create({
        data: { name },
    });
};

export const updateCategory = async (categoryId: number, newName: string) => {
    return prisma.category.update({
        where: { id: categoryId },
        data: { name: newName },
    });
};

export const deleteCategory = async(categoryId: number) => {
    return prisma.category.delete({
        where: { id: categoryId },
    });
};
