import { Request, Response } from 'express';
import * as postService from '../services/postService.js';

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