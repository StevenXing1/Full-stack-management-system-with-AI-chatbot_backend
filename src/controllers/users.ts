import { Request, Response } from 'express';
import { prisma } from '../prismaClient';
import bcrypt from 'bcrypt';

export const createUser = async (req: Request, res: Response) => {
    try {
        const { email, name, roleId, password } = req.body as { 
            email: string, 
            name: string, 
            roleId: number, 
            password: string
        }

        const newUser = await prisma.user.create({
            data: {
                email: email,
                name: name, 
                role: {
                    connect: {
                        id: roleId
                    }
                },
                password: {
                    create: {
                        hash: bcrypt.hashSync(password, 10)
                    }
                }
            }
        })
        res.status(201).json(newUser)
    } catch (error) {
        console.error('Error creating user:', error)
        res.status(400).json({ error: 'Failed to create user' })
    }
}

export const listUsers = async (req: Request, res: Response) => {
    const users = await prisma.user.findMany({
        include: {
            role: true
        }
    })
   res.json(users)
}

export const getUser = async (req: Request, res: Response) => {
    console.log('req.params', req.params)
    const { id } = req.params

    const user = await prisma.user.findUnique({
        where: {
            id: Number(id)
        },
        include: {
            role: {
                include: {
                    permissions: true
                }
            }
        }
    })

    if (!user) {
        res.status(404).json({ error: 'User not found' })
        return
    }

    res.json(user)
}

export const updateUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = Number(id)

    const currentUser = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })

    if(!currentUser) {
        return res.status(404).json({ error: 'User not found' })
    }

    const { name, roleId, email } = req.body as { 
        name?: string, 
        roleId?: number, 
        email?: string
    }

    try {
        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                name: name || currentUser.name,
                email: email || currentUser.email,
                role: {
                    connect: {
                        id: roleId || currentUser.role_id
                    }
                }
            },
        })
        res.json(updatedUser)
    } catch(error) {
        console.error('Error updating user:', error)
        res.status(500).json({ error: 'Failed to update user' })
    }
}

export const deleteUser = async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = Number(id)

    const user = await prisma.user.findFirst({
        where: {
            id: userId
        }
    })

    if(!user) {
        return res.status(404).json({ error: 'User not found' })
    }

    await prisma.user.delete({
        where: {
            id: userId
        }
    })

    res.json({ message: 'User deleted successfully' })

}