import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from 'process'

export const authentication = (req: Request, res: Response, next: NextFunction) => {
    const headerToken = req.headers['authorization']
    console.log('headerToken', headerToken)
    if(!headerToken) {
        return res.status(403).json({ error: 'Unauthorized' })
    }

    const token = headerToken.split(' ')[1]
    if(!token) {
        return res.status(403).json({ error: 'Unauthorized' })
    }

    const secretKey = env.JWT_SECRET_KEY
    if(!secretKey) {
        return res.status(500).json({ error: 'failed to verify token' })
    }
    try {
        
        const payload = jwt.verify(token, secretKey) as { userId: number, roleId: number }
        
        (req as any).user = payload
        
        next()
    } catch (error) {
        return res.status(403).json({ error: 'Unauthorized' })
    }
}