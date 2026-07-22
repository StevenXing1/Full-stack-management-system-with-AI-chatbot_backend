import { PERMISSIONS } from '../constants'
import { prisma } from '../prismaClient'

const seedPermissions = async () => {
    const permissions = [
        { name: PERMISSIONS.USERS.READ },
        { name: PERMISSIONS.USERS.EDIT },
        { name: PERMISSIONS.ROLES.READ },
        { name: PERMISSIONS.ROLES.EDIT },
        { name: PERMISSIONS.PRODUCTS.READ },
        { name: PERMISSIONS.PRODUCTS.EDIT },
        { name: PERMISSIONS.ORDERS.READ },
        { name: PERMISSIONS.ORDERS.EDIT },
    ]

    await prisma.permission.createMany({
        data: permissions,
        skipDuplicates: true,
    })

    console.log('Permissions seeded successfully')
}

seedPermissions()