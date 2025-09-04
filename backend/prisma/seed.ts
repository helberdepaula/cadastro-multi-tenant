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
        where: { email: 'adminTenant1@mail.com' },
        update: {},
        create: {
            tenantId: '1',
            email: 'adminTenant1@mail.com',
            password: passwordHash,
            name: 'Admin User',
            role: Role.ADMIN,
        },
    });
    await prisma.user.upsert({
        where: { email: 'userTenant1@mail.com' },
        update: {},
        create: {
            tenantId: '1',
            email: 'userTenant1@mail.com',
            password: passwordHash,
            name: 'User Tenant 1',
            role: Role.USER,
        },
    });

    await prisma.user.upsert({
        where: { email: 'guestTenant1@mail.com' },
        update: {},
        create: {
            tenantId: '1',
            email: 'guestTenant1@mail.com',
            password: passwordHash,
            name: 'Guest User',
            role: Role.GUEST,
        },
    });

    await prisma.user.upsert({
        where: { email: 'adminTenant2@mail.com' },
        update: {},
        create: {
            tenantId: '2',
            email: 'adminTenant2@mail.com',
            password: passwordHash,
            name: 'Admin User',
            role: Role.ADMIN,
        },
    });
    await prisma.user.upsert({
        where: { email: 'userTenant2@mail.com' },
        update: {},
        create: {
            tenantId: '2',
            email: 'userTenant2@mail.com',
            password: passwordHash,
            name: 'User Tenant 2',
            role: Role.USER,
        },
    });

    await prisma.user.upsert({
        where: { email: 'guestTenant2@mail.com' },
        update: {},
        create: {
            tenantId: '2',
            email: 'guestTenant2@mail.com',
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
