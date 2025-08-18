export interface Post {
    id: number;
    slug: string;
    title: string;
    content: string;
    status: 'DRAFT' | 'PUBLISHED' | 'PRIVATE' | 'ARCHIVED';
    createdAt: string;
    author: {
        name: string;
    };
    categories: {
        name: string;
    }[];
}
