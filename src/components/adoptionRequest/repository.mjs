import {prisma} from '../../database/database.mjs'

export async function save(request){
    return await prisma.adoptionRequest.create({
        data: {
            ...request
        }
    })
}