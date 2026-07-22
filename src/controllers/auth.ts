import { Request, Response } from 'express'
import { prisma } from '../prismaClient'
import bcrypt from 'bcrypt'
import { env } from 'process'
import jwt from 'jsonwebtoken'

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body as { email: string, password: string }

    const user = await prisma.user.findUnique({
        where: {
            email: email
        },
        include: {
            password: true,
            role: {
                include: {
                    permissions: true
                }
            }
        }
    })

    if(!user) {
        return res.status(401).json({ error: 'user not found' })
    }

    if(!user.password) {
        return res.status(401).json({ error: 'password not found' })
    }

    if(!bcrypt.compareSync(password, user.password.hash)) {
        return res.status(401).json({ error: 'invalid credentials' })
    }

    const secretKey = env.JWT_SECRET_KEY
    if(!secretKey) {
        return res.status(500).json({ error: 'Not key configured' })
    }

    const payload = {
        userId: user.id,
        roleId: user.role_id,
    }

    const token = jwt.sign(payload, secretKey, { expiresIn: '24h' })

    res.json({
        token: token,
        user: {
            id: user.id,
            email: user.email,
            name: user.name,
            roleId: user.role_id,
            permissions: user.role.permissions.map((permission) => permission.name),
        }
    })
}