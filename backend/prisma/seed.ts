import { PrismaClient, Role } from '@prisma/client';

import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
/**
 * Seed the database with initial data
 * Cadastro dos usuários
 */
async function main() {
    const passwordHash = await bcrypt.hash('121212', 10);

    await prisma.user.upsert({
        where: { email: 'admin@mail.com' },
        update: {},
        create: {
            tenantId: '1',
            email: 'admin@mail.com',
            password: passwordHash,
            name: 'Admin User',
            role: Role.ADMIN,
        },
    });
    await prisma.user.upsert({
        where: { email: 'user@mail.com' },
        update: {},
        create: {
            tenantId: '1',
            email: 'user@mail.com',
            password: passwordHash,
            name: 'Admin User',
            role: Role.USER,
        },
    });

    await prisma.user.upsert({
        where: { email: 'guest@mail.com' },
        update: {},
        create: {
            tenantId: '1',
            email: 'guest@mail.com',
            password: passwordHash,
            name: 'Guest User',
            role: Role.GUEST,
        },
    });
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
