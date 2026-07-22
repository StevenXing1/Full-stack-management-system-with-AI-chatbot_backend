import { prisma } from '../prismaClient'
import { faker } from '@faker-js/faker'
import { Prisma } from '../generated/prisma/client'


const seedOrders = async () => {
    const products = await prisma.product.findMany()

    const orders = Array(60).fill(0).map(() => {
        const orderProducts = faker.helpers.arrayElements(products, {min: 5, max: 10})

        const totalPrice = orderProducts.reduce((acc, product) => acc + product.price, 0).toFixed(2)


        return {
            email: faker.internet.email(),
            name: faker.person.fullName(),
            createdAt: faker.date.recent({days: 14}),
            totalPrice: Number(totalPrice),
            productsId: orderProducts.map(product => product.id),
        }
    })

    console.log(orders)

    for(const order of orders) {
        await prisma.order.create({
            data: {
                email: order.email,
                name: order.name,
                createdAt: order.createdAt,
                totalPrice: order.totalPrice,
                products: {
                    connect: order.productsId.map(id => ({id}))
                }
            },
        })
    }

    console.log('Orders seeded successfully')
}

seedOrders()