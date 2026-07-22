import {Request, Response} from 'express'
import { prisma } from '../prismaClient';

export const createRole = async (req: Request, res: Response) => {
    console.log('create role')
    try {
        const role = await prisma.role.create({
            data: {
                name: req.body.name,
                permissions: {
                    connect: req.body.permissions.map((permission: string) => ({name: permission})),
                }
            }
        })
        res.status(201).json(role)
    } catch (error) {
        console.error('Error creating role:', error)
        if((error as any).code === 'P2002') {
            res.status(400). json({ error: 'Role already exists' })
        } else {
            res.status(400). json({ error: 'Failed to create role' })
        }
    }
}

export const listRoles = async (req: Request, res: Response) => {
    const roles = await prisma.role.findMany({
        include: {
            permissions: true,
        }
    })
    console.log(roles)
    res.status(200).json(roles)
}

export const getRole = async (req: Request, res: Response) => {
    const { id } = req.params
    const role = await prisma.role.findUnique({
        where: { id: Number(id) },
        include: { permissions: true }
    })

    if(!role) {
        return res.status(404).json({ error: 'Role not found' })
    }

    return res.json(role)
}

export const updateRole = async (req: Request, res: Response) => {
    const { id } = req.params
    const roleId = Number(id)

    const currentRole = await prisma.role.findUnique({
        where: { id: roleId }
    })

    if(!currentRole) {
        return res.status(404).json({ error: 'Role not found' })
    }

    const { name, permissions } = req.body as { name?: string, permissions?: string[] }

    try {
        const updatedRole = await prisma.role.update({
            where: { id: roleId },
            data: {
                name: name ?? currentRole.name,
                ...(permissions ? { permissions: { set: permissions.map((permission) => ({ name: permission })) } } : {}),
            },
            include: { permissions: true }
        })
        return res.json(updatedRole)
    } catch(error) {
        console.error('Error updating role:', error)
        if((error as any).code === 'P2002') {
            return res.status(400).json({ error: 'Role already exists' })
        }
        return res.status(500).json({ error: 'Failed to update role' })
    }
}

export const deleteRole = async (req: Request, res: Response) => {
    const { id } = req.params
    const roleId = Number(id)

    const role = await prisma.role.findUnique({
        where: { id: roleId }
    })

    if(!role) {
        return res.status(404).json({ error: 'Role not found' })
    }

    await prisma.role.delete({
        where: { id: roleId }
    })

    return res.json({ message: 'Role deleted successfully' })
}

export const listPermissions = async (req: Request, res: Response) => {
    const permissions = await prisma.permission.findMany()
    res.status(200).json(permissions)
}