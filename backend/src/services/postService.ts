import { prisma } from '../lib/prisma.js';
import { PostStatus, Language } from '@prisma/client';
import slugifyLibrary from 'slugify';

const slugify = (slugifyLibrary as any).default || slugifyLibrary;

export interface PostCreationParams {
    authorId: number;
    slug: string;
    defaultLanguage?: Language;
    categoryIds?: number[];
}

export interface PostTranslationParams {
    language: Language;
    title: string;
    content: string;
}

export interface PostUpdateParams {
    slug?: string;
    status?: PostStatus;
    defaultLanguage?: Language;
    categoryIds?: number[];
}
export const createPost = async (params: PostCreationParams) => {

    const { authorId, slug, defaultLanguage, categoryIds } = params;

    const existingPost = await prisma.post.findFirst({ where: { slug } });
    if (existingPost) {
        throw new Error('A post with this slug already exists.');
    }

    return prisma.post.create({
        data: {
            slug,
            authorId,
            defaultLanguage,
            categories: {
                connect: categoryIds?.map(id => ({ id })) || []
            }
        },
    });
};


export const addOrUpdateTranslation = async (postId: number, params: PostTranslationParams) => {
    const { language, title, content } = params;
    return prisma.postTranslation.upsert({
        where: {
            postId_language: {
                postId: postId,
                language: language,
            }
        },
        update: { title, content },
        create: { postId, language, title, content }
    });
};
export const updatePost = async (postId: number, data: PostUpdateParams) => {
    const { categoryIds, ...restOfData } = data;
    return prisma.post.update({
        where: { id: postId },
        data: {
            ...restOfData,
            categories: categoryIds ? { set: categoryIds.map(id => ({ id })) } : undefined
        },
    });
};

export const deletePost = async (postId: number) => {
    return prisma.post.delete({ where: { id: postId } });
};

export const getPostBySlug = async (slug: string, lang: Language) => {
    const post = await prisma.post.findUnique({
        where: { slug, status: 'PUBLISHED' },
        include: {
            author: { select: { name: true } },
            categories: true,
            translations: true,
        },
    });

    if (!post) return null;

    let translation = post.translations.find(t => t.language === lang);
    if (!translation) {
        translation = post.translations.find(t => t.language === post.defaultLanguage);
    }
    if (!translation) {
        translation = post.translations[0];
    }

    if (!translation) return { ...post, title: 'No Content', content: '' };

    const { translations, ...restOfPost } = post;
    return {
        ...restOfPost,
        title: translation.title,
        content: translation.content,
        language: translation.language,
    };
};

export const getAllPublishedPosts = async (lang: Language) => {
    const posts = await prisma.post.findMany({
        where: { status: 'PUBLISHED' },
        orderBy: { createdAt: 'desc' },
        include: {
            author: { select: { name: true } },
            categories: true,
            translations: true,
        },
    });

    return posts.map(post => {
        let translation = post.translations.find(t => t.language === lang) || post.translations.find(t => t.language === post.defaultLanguage) || post.translations[0];

        const { translations, ...restOfPost } = post;
        return {
            ...restOfPost,
            title: translation?.title || 'No Title',
            content: translation?.content || '',
            language: translation?.language || post.defaultLanguage
        };
    }).filter(p => p.content);
};
