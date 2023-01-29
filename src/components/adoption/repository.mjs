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

export async function update(profile){
    return await prisma.adoptionProfile.update({
        where: {
            userId: profile.userId
        },
        data: {
            ...profile
        }
    })
}

export async function findProfilesByParams(params){
    return await prisma.adoptionProfile.findMany({
        where: {
            ...params
        }
    })
}