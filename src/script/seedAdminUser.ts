import { prisma } from '../prismaClient';
import bcrypt from 'bcrypt';

// '123456' -> hash function -> hash string1
// '123455' -> hash function -> hash string2

export const seedAdminUser = async () => {
    const user = await prisma.user.create({
        data: {
            email: 'admin@google.com',
            name: 'Admin',
            role: {
                connect: {
                    name: 'admin',
                }
            },
            password: {
                create: {
                    hash: bcrypt.hashSync('123456', 10),
                }
            }
        }
    })
    console.log('Admin user seeded successfully', user)
}

seedAdminUser()