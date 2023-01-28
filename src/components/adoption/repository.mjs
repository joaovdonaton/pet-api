import {prisma} from '../../database/database.mjs'

export async function save(profile){
    await prisma.adoptionProfile.create({
        data: {
            ...profile
        }
    })
}