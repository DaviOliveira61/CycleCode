import { Request, Response } from 'express';
import * as categoryService from '../../../services/categoryService.js';
import { Prisma } from '@prisma/client';
import { AuthRequest } from '../middleware/auth.js';

export const getAllCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategories();
        res.status(200).json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch categories.' });
    }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        const { name } = req.body;
        if (!name) {
            return res.status(400).json({ error: 'Category name is required' });
        }
        const newCategory = await categoryService.createCategory(name);
        return res.status(201).json(newCategory);
    } catch (error) {
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            return res.status(409).json({ error: 'A category with this name already exists.' });
        }
        console.error(error);
        res.status(500).json({ error: 'Failed to create category.' });
    }
};

export const updateCategory = async (req: AuthRequest, res: Response) => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        const { name } = req.body;
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID.' });
        }

        if (!name) {
            return res.status(400).json({ error: 'New category name is required.' });
        }

        const updatedCategory = await categoryService.updateCategory(categoryId, name);
        res.status(200).json(updatedCategory);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update category.' });
    }
};

export const deleteCategory = async (req: AuthRequest, res: Response) => {
    try {
        const categoryId = parseInt(req.params.id, 10);
        if (isNaN(categoryId)) {
            return res.status(400).json({ error: 'Invalid category ID.' });
        }
        await categoryService.deleteCategory(categoryId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete category.' });
    }
};
