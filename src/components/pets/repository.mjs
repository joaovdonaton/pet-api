import { prisma } from '../../database/database.mjs'

export async function save(pet){
    return await prisma.pet.create({
        data: {
            ...pet
        }
    })
}

export async function findAllPets(){
    
}