import { PrismaClient, Language, UserRole } from '@prisma/client';
import { hashPassword } from '../src/utils/password.js';
import slugifyLibrary from 'slugify';
const slugify = (slugifyLibrary as any).default || slugifyLibrary;

const prisma = new PrismaClient();

async function main() {
    console.log(`Start seeding ...`);

    // 1. Criar utilizador Admin (apenas se ele não existir)
    const adminEmail = 'admin@example.com';
    let admin = await prisma.user.findUnique({ where: { email: adminEmail } });

    if (!admin) {
        const adminPassword = await hashPassword('admin123');
        admin = await prisma.user.create({
            data: {
                email: adminEmail,
                name: 'Admin User',
                password: adminPassword,
                role: UserRole.ADMIN,
            },
        });
        console.log(`Created admin user: ${admin.email}`);
    } else {
        console.log(`Admin user already exists.`);
    }

    // 2. Criar categorias (usando upsert para ser idempotente)
    const catNode = await prisma.category.upsert({
        where: { name: 'Node.js' },
        update: {},
        create: { name: 'Node.js' },
    });
    const catPrisma = await prisma.category.upsert({
        where: { name: 'Prisma' },
        update: {},
        create: { name: 'Prisma' },
    });
    console.log(`Categories are set up.`);

    // 3. Criar um post com traduções (usando upsert para ser idempotente)
    const postSlugPt = 'guia-completo-de-prisma';
    const existingPost = await prisma.postTranslation.findUnique({ where: { slug: postSlugPt } });

    if (!existingPost) {
        const post = await prisma.post.create({
            data: {
                authorId: admin.id,
                status: 'PUBLISHED',
                defaultLanguage: Language.PT_BR,
                categories: {
                    connect: [{ id: catNode.id }, { id: catPrisma.id }]
                },
                translations: {
                    create: [
                        {
                            language: Language.PT_BR,
                            title: 'Guia Completo de Prisma',
                            content: 'Este é o conteúdo em português sobre Prisma.',
                            slug: postSlugPt
                        },
                        {
                            language: Language.EN_US,
                            title: 'The Ultimate Prisma Guide',
                            content: 'This is the English content about Prisma.',
                            slug: 'the-ultimate-prisma-guide'
                        }
                    ]
                }
            }
        });
        console.log(`Created post with ID: ${post.id}`);
    } else {
        console.log(`Sample post already exists.`);
    }

    console.log(`Seeding finished.`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
