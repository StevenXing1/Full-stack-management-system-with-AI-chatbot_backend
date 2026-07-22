import { prisma } from '../prismaClient'
import { PERMISSIONS } from '../constants'

const seedAdminRole = async () => {
    const adminRole = await prisma.role.create({
        data: {
            name: 'admin',
            permissions: {
                connect: [
                    { name: PERMISSIONS.USERS.READ },
                    { name: PERMISSIONS.USERS.EDIT },
                    { name: PERMISSIONS.ROLES.READ },
                    { name: PERMISSIONS.ROLES.EDIT },
                    { name: PERMISSIONS.PRODUCTS.READ },
                    { name: PERMISSIONS.PRODUCTS.EDIT },
                    { name: PERMISSIONS.ORDERS.READ },
                    { name: PERMISSIONS.ORDERS.EDIT },
                ]
            }
        },
    })

    console.log('Admin role seeded successfully')
}

seedAdminRole()