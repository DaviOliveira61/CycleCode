import { Request, Response } from 'express';
import * as postService from '../../../services/postService.js';
import { AuthRequest } from '../middleware/auth.js';
import { prisma } from '../../../lib/prisma.ts';
import { getLanguage } from '../../../utils/language.js';

export const getPosts = async (req: Request, res: Response) => {
    try {
        const lang = getLanguage(req);
        const posts = await postService.getAllPublishedPosts(lang);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
};

export const getPost = async (req: Request, res: Response) => {
    try {
        const lang = getLanguage(req);
        const { slug } = req.params;
        const post = await postService.getPostBySlug(slug, lang);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch post.' });
    }
};

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { categoryIds, defaultLanguage } = req.body;
        const authorId = req.user?.userId;

        if (!authorId) {
            return res.status(403).json({ error: 'User not authenticated.' });
        }

        const postData = { authorId, categoryIds, defaultLanguage };
        const newPost = await postService.createPost(postData);

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post.' });
    }
};

export const addTranslation = async (req: AuthRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const { language, title, content, slug } = req.body;
        if (isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID.' });
        if (!language || !title || !content) return res.status(400).json({ error: 'Language, title, and content are required.' });

        const translationData = { language, title, content, slug };
        const newTranslation = await postService.addOrUpdateTranslation(postId, translationData);
        res.status(201).json(newTranslation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to add translation.' });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        if (isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID.' });

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return res.status(404).json({ error: 'Post not found.' });

        const updatedPost = await postService.updatePost(postId, req.body);
        res.status(200).json(updatedPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update post.' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);
        if (isNaN(postId)) return res.status(400).json({ error: 'Invalid post ID.' });

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) return res.status(404).json({ error: 'Post not found.' });

        await postService.deletePost(postId);
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete post.' });
    }
};
