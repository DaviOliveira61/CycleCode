import { prisma } from '../lib/prisma.ts';
import { Language, PostStatus } from '@prisma/client';
import slugifyLibrary from 'slugify';
const slugify = (slugifyLibrary as any).default || slugifyLibrary;

// Interfaces
export interface PostCreationParams {
    authorId: number;
    // slug: string;
    defaultLanguage?: Language;
    categoryIds?: number[];
}

export interface PostTranslationParams {
    language: Language;
    title: string;
    content: string;
    slug: string;
}

export interface PostUpdateParams {
    slug?: string;
    status?: PostStatus;
    defaultLanguage?: Language;
    categoryIds?: number[];
}

export const createPost = async (params: PostCreationParams) => {
    const { authorId, defaultLanguage, categoryIds } = params;
    
    return prisma.post.create({
        data: {
            authorId,
            defaultLanguage,
            categories: {
                connect: categoryIds?.map(id => ({ id })) || []
            }
        },
    });
};

export const addOrUpdateTranslation = async (postId: number, params: PostTranslationParams) => {
    const { language, title, content, slug } = params;
    return prisma.postTranslation.upsert({
        where: { postId_language: { postId, language } },
        update: { title, content, slug },
        create: { postId, language, title, content, slug }
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
    const translation = await prisma.postTranslation.findUnique({
        where: { slug },
        include: {
            post: {
                include: {
                    author: { select: { name: true } },
                    categories: true,
                    translations: true,
                },
            },
        },
    });

    if (!translation || translation.post.status !== 'PUBLISHED') return null;

    const postContainer = translation.post;
    let finalTranslation = postContainer.translations.find(t => t.language === lang)
        || postContainer.translations.find(t => t.language === postContainer.defaultLanguage)
        || postContainer.translations[0];

    if (!finalTranslation) {
        return { ...postContainer, title: 'No Content Available', content: '', language: lang };
    }

    const { translations, ...restOfPost } = postContainer;
    return {
        ...restOfPost,
        title: finalTranslation.title,
        content: finalTranslation.content,
        slug: finalTranslation.slug,
        language: finalTranslation.language,
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
        let translation = post.translations.find(t => t.language === lang)
            || post.translations.find(t => t.language === post.defaultLanguage)
            || post.translations[0];

        const { translations, ...restOfPost } = post;
        const excerpt = translation ? translation.content.substring(0, 200) + '...' : '';

        return {
            ...restOfPost,
            title: translation?.title || 'No Title',
            content: excerpt,
            slug: translation?.slug || '',
            language: translation?.language || post.defaultLanguage,
        };
    }).filter(p => p.slug);
};
