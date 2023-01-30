import { prisma } from '../../database/database.mjs'

export async function save(pet){
    return await prisma.pet.create({
        data: {
            ...pet
        }
    })
}

export async function findAllPets(limit, page, sortBy, ascDesc){
    const orderByObj = {}
    orderByObj[sortBy] = ascDesc

    return await prisma.pet.findMany({
        orderBy: [
            orderByObj
        ],
        skip: page*limit,
        take: limit
    })
}

export async function findPetById(id){
    return await prisma.pet.findFirst({
        where:{
            id
        }
    })
}