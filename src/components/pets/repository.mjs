import { prisma } from '../../database/database.mjs'

export async function save(pet){
    return await prisma.pet.create({
        data: {
            ...pet
        }
    })
}

export async function findAllPets(limit, page){
    return await prisma.pet.findMany({
        orderBy: [
            {
                createdAt: 'desc'
            }
        ],
        skip: page*limit,
        take: limit
    })
}