import { prisma } from '../prismaClient'
import { faker } from '@faker-js/faker'

const seedProducts = async () => {
    const products = Array(30).fill(0).map(() => {
        return {
            title: faker.commerce.productName(),
            description: faker.commerce.productDescription(),
            price: Number(faker.commerce.price({min: 0, max: 1000})),
        }
    })
    await prisma.product.createMany({
        data: products
    })

    console.log('Products seeded successfully')
}

seedProducts()