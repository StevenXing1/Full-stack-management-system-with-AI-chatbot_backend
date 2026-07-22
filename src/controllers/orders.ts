import { Request, Response } from "express";
import { prisma } from "../prismaClient";

export const listOrders = async (req: Request, res: Response) => {
    const orders = await prisma.order.findMany({
        include: {
            products: {
                select: {
                    id: true,
                }
            },
        }
    })
    return res.json(orders)
}

export const getOrder = async (req: Request, res: Response) => {
    const { id } = req.params
    const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
            products: true
        }
    })
    if(!order) {
        return res.status(404).json({ error: 'Order not found' })
    }
    return res.json(order)
}

export const createOrder = async (req: Request, res: Response) => {
    const { email, name, productIds, totalPrice } = req.body as { email: string, name: string, productIds: number[], totalPrice: number }
    try {

        const order = await prisma.order.create({
            data: {
                email,
                name,
                products: {
                    connect: productIds.map(productId => ({ id: productId }))
                },
                totalPrice,
            }
        })
        return res.json(order)
    } catch(e) {
        console.error(e)
        return res.status(500).json({ error: 'Failed to create order' })
    }

}

export const updateOrder = async (req: Request, res: Response) => {
    const { id } = req.params
    const orderId = Number(id)

    const currentOrder = await prisma.order.findUnique({
        where: { id: orderId }
    })

    if(!currentOrder) {
        return res.status(404).json({ error: 'Order not found' })
    }

    const { email, name, productIds, totalPrice } = req.body as {
        email?: string, name?: string, productIds?: number[], totalPrice?: number
    }

    try {
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                email: email ?? currentOrder.email,
                name: name ?? currentOrder.name,
                totalPrice: totalPrice ?? currentOrder.totalPrice,
                ...(productIds ? { products: { set: productIds.map(productId => ({ id: productId })) } } : {}),
            }
        })
        return res.json(updatedOrder)
    } catch(error) {
        console.error('Error updating order:', error)
        return res.status(500).json({ error: 'Failed to update order' })
    }
}

export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params
    const orderId = Number(id)

    const order = await prisma.order.findUnique({
        where: { id: orderId }
    })

    if(!order) {
        return res.status(404).json({ error: 'Order not found' })
    }

    await prisma.order.delete({
        where: { id: orderId }
    })

    return res.json({ message: 'Order deleted successfully' })
}