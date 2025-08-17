import { prisma } from '../lib/prisma.js';
import { PostStatus } from '@prisma/client';
import slugifyLibrary from 'slugify';

const slugify = (slugifyLibrary as any).default || slugifyLibrary;

export const getAllPublishedPosts = async () => {
    return prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { name: true } },
            categories: { select: { name: true } },
        },
    });
};

export const getPostBySlug = async (slug: string) => {
    return prisma.post.findUnique({
        where: {
            slug: slug,
            status: 'PUBLISHED',
        },
        include: {
            author: { select: { name: true } },
            categories: { select: { name: true } },
            comments: {
                where: { parentId: null },
                include: {
                    author: { select: { name: true } },
                    replies: true,
                },
            },
        },
    });
};

export interface PostCreationParams {
    title: string;
    content: string;
    authorId: number;
}

export const createPost = async (params: PostCreationParams) => {
    const { title, content, authorId } = params;

    const baseSlug = slugify(title, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g,
    });

    const existingPost = await prisma.post.findFirst({ where: { slug: baseSlug } });
    const slug = existingPost ? `${baseSlug}-${Date.now()}` : baseSlug;

    return prisma.post.create({
        data: {
            title,
            content,
            slug,
            authorId,
        },
    });
};

export interface PostUpdateParams {
    title?: string;
    content?: string;
    status?: PostStatus;
}

export const updatePost = async (postId: number, data: PostUpdateParams) => {
    return prisma.post.update({
        where: {
            id: postId,
        },
        data: data,
    });
};

export const deletePost = async (postId: number) => {

    return prisma.post.delete({
        where: {
            id: postId,
        },
    });
};