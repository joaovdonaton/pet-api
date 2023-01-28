import {prisma} from '../../database/database.mjs'

export async function save(profile){
    return await prisma.adoptionProfile.create({
        data: {
            ...profile
        }
    })
}

export async function findProfileByUserId(userId){
    return await prisma.adoptionProfile.findFirst({
        where:{
            userId
        }
    })
}