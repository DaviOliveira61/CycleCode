import { Post } from '../../lib/types';

async function getPosts(): Promise<Post[]> {
    const res = await fetch('http://localhost:3001/api/v1/posts', { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch posts');
    }
    return res.json();
}

export default async function HomePage() {
    const posts = await getPosts();
    return (
        <main className="container mx-auto p-8">
            <h1 className="text-5xl front-extrabold tracking-tight mb-8">
                CycleCode Blog
            </h1>

            <section>
                <h2 className='text-3xl font-bold mb-6'>Últimos artigos</h2>
                <div className='grid gap-6'>
                    {posts.map((post) => (
                        <article key={post.id} className="p-6 border rounded-lg shadow-sm hover:shadow-md transition-shadow">
                            <h3 className='text-2xl font-semibold mb-2'>{post.title}</h3>
                            <p className='text-gray-600 mb-4'>{post.content}</p>
                            <a href='#' className='font-semibold text-blue-600 hover:underline'>
                                Ler mais →
                            </a>
                            <p className='text-gray-600 mb-4'>{post.slug}</p>
                        </article>
                    ))}
                </div>
            </section>
        </main>
    );
}
