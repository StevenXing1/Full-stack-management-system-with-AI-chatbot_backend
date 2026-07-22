import {Request, Response} from 'express'
import { prisma } from '../prismaClient'

export const listProducts = async (req: Request, res: Response) => {

    console.log('req.query', req.query)

    const products = await prisma.product.findMany({
        where: {
            price: {
                gte: Number(req.query.minPrice) || undefined,
                lte: Number(req.query.maxPrice) || undefined,
            }
        }
    })

    return res.json(products)
}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const product = await prisma.product.findUnique({
        where: { id: Number(id) }
    })

    if(!product) {
        return res.status(404).json({ error: 'Product not found' })
    }

    return res.json(product)
}

export const createProduct = async (req: Request, res: Response) => {
    const { title, description, price } = req.body
    const product = await prisma.product.create({
        data: { title, description, price }
    })

    return res.json(product)
}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const productId = Number(id)

    const currentProduct = await prisma.product.findUnique({
        where: { id: productId }
    })

    if(!currentProduct) {
        return res.status(404).json({ error: 'Product not found' })
    }

    const { title, description, price } = req.body as { title?: string, description?: string, price?: number }

    try {
        const updatedProduct = await prisma.product.update({
            where: { id: productId },
            data: {
                title: title ?? currentProduct.title,
                description: description ?? currentProduct.description,
                price: price ?? currentProduct.price,
            }
        })
        return res.json(updatedProduct)
    } catch(error) {
        console.error('Error updating product:', error)
        return res.status(500).json({ error: 'Failed to update product' })
    }
}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const productId = Number(id)

    const product = await prisma.product.findUnique({
        where: { id: productId }
    })

    if(!product) {
        return res.status(404).json({ error: 'Product not found' })
    }

    await prisma.product.delete({
        where: { id: productId }
    })

    return res.json({ message: 'Product deleted successfully' })
}