import { GoogleGenAI, Type, ToolUnion, Part, Content } from '@google/genai';
import { Request, Response } from 'express';
import { env } from 'process';
import { prisma } from '../prismaClient';
import { PERMISSIONS } from '../constants';

const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY as string,
})

const TOOL_PERMISSIONS: Record<string, string> = {
    get_all_users: PERMISSIONS.USERS.READ,
    get_all_orders: PERMISSIONS.ORDERS.READ,
    get_all_products: PERMISSIONS.PRODUCTS.READ,
}

const tools: ToolUnion[] = [
    {
        functionDeclarations: [
            {   
                name: 'get_all_users',
                description: 'Get all users including id, name, email, and role',
                parameters: {type: Type.OBJECT, properties:{}}
            },
            {
                name: 'get_all_orders',
                description: 'Get all orders including id, user_id, name, createdAt, product_ids, and total_price',
                parameters: {type: Type.OBJECT, properties:{}}
            },
            {
                name: 'get_all_products',
                description: 'Get all products including id, title, description, price and order ids',
                parameters: {type: Type.OBJECT, properties:{}}
            }
        ]
    }
]

async function executeTool(name: string, userPermissions: string[]): Promise<unknown> {
    const requiredPermission = TOOL_PERMISSIONS[name]
    if(!requiredPermission) {
        return {error: 'Invalid tool name'}
    }

    if(!userPermissions.includes(requiredPermission)) {
        return {error: `Permission denied: missing '${requiredPermission}' permission`}
    }

    if(name === 'get_all_users') {
        return await prisma.user.findMany({include: {role: true}})
    }
    if(name === 'get_all_orders') {
        return await prisma.order.findMany()
    }
    if(name === 'get_all_products') {
        return await prisma.product.findMany()
    }

    return {error: 'Invalid tool name'}
}

export const chat = async (req: Request, res: Response) => {

    const { messages } = req.body as {
        messages: {role: 'user' | 'assistant'; content: string}[]
    }

    if(!messages) {
        return res.status(400).json({error: 'Messages are required'})
    }

    const user = (req as any).user as { userId: number, roleId: number }
    const role = await prisma.role.findUnique({
        where: { id: user.roleId },
        include: { permissions: true }
    })
    const userPermissions = role?.permissions.map((permission) => permission.name) ?? []

    const contents: Content[] = messages.map((message) => ({
        role: message.role === 'assistant' ? 'model' : 'user',
        parts: [{text: message.content}]
    }))

    const systemInstruction = `You are a data assistant that helps users query and analyze business data (users, orders, products). When the user asks a question, use the provided tools to fetch raw data, then compute and analyze based on the specific question. Reply in the same language the user uses.`

    while(true) {
        const response = await ai.models.generateContent({
            model: 'gemini-flash-latest',
            contents: contents,
            config: {
                systemInstruction,
                tools
            }
        })

        const condidate = response.candidates?.[0]
        if(!condidate) {
            break
        }

        const parts: Part[] = condidate.content?.parts ?? []
        const functionCallParts = parts.filter((part) => part.functionCall)

        if(functionCallParts.length === 0) {
            const text = parts.map((part) => part.text).join('')
            return res.json({text})
        }

        contents.push({
            role: 'model',
            parts: parts
        })

        const resultParts = await Promise.all(
            functionCallParts.map(async (part) => {
                const result = await executeTool(part.functionCall!.name!, userPermissions)
                return {
                    functionResponse: {
                        name: part.functionCall!.name!,
                        response: {result}
                    }
                } as Part
            })
        )

        contents.push({
            role: 'user',
            parts: resultParts
        })
    }

    return res.status(500).json({error: 'No response from AI'})
}