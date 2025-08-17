import { Request, Response } from 'express';
import * as postService from '../../../services/postService.js';
import { prisma } from '../../../lib/prisma.ts'; 

interface AuthRequest extends Request {
    user?: { userId: number; role: string };
}

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await postService.getAllPublishedPosts();
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch posts.' });
    }
};

export const getPost = async (req: Request, res: Response) => {
    try {
        const { slug } = req.params;
        const post = await postService.getPostBySlug(slug);

        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch post.' });
    }
};

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user?.userId;

        if (!authorId) {
            return res.status(403).json({ error: 'User not authenticated.' });
        }

        if (!title || !content) {
            return res.status(400).json({ error: 'Title and content are required.' });
        }

        const postData = { title, content, authorId };
        const newPost = await postService.createPost(postData);

        res.status(201).json(newPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create post.' });
    }
};

export const updatePost = async (req: AuthRequest, res: Response) => {

    try {
        const postId = parseInt(req.params.id, 10);
        const userId = req.user?.userId;
        const dataToUpdate = req.body;

        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post ID.' });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const updatedPost = await postService.updatePost(postId, dataToUpdate);
        res.status(200).json(updatedPost);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update post.' });
    }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const postId = parseInt(req.params.id, 10);

        if (isNaN(postId)) {
            return res.status(400).json({ error: 'Invalid post ID.' });
        }

        const post = await prisma.post.findUnique({ where: { id: postId } });
        if (!post) {
            return res.status(404).json({ error: 'Post not found.' });
        }

        const deletePost = await postService.deletePost(postId);
        res.status(204).send();

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete post.' });
    }
};
