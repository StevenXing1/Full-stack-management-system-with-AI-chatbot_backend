import { Request, Response, NextFunction } from 'express'
import { prisma } from '../prismaClient'

export const authorization = (targetPermission: string) => {
    return  async (req: Request, res: Response, next: NextFunction) => {
        const user = (req as any).user as { userId: number, roleId: number }
        const roleId = user.roleId
        const role = await prisma.role.findUnique({
            where: {
                id: roleId
            },
            include: {
                permissions: true
            }
        })
        if(!role) {
            return res.status(403).json({ error: 'Unauthorized' })
        }

        const userPermissions = role.permissions.map(p => p.name)

        const hasPermission = userPermissions.includes(targetPermission)

        if(!hasPermission) {
            return res.status(403).json({ error: 'Unauthorized' })
        }


        next()
    }
}