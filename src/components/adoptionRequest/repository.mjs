import {prisma} from '../../database/database.mjs'

export async function save(request){
    return await prisma.adoptionRequest.create({
        data: {
            ...request
        }
    })
}

export async function findRequestsByReceiverId(receiverId){
    return await prisma.adoptionRequest.findMany({
        where:{
            receiverId
        }
    })
}

export async function findRequestById(id){
    return await prisma.adoptionRequest.findFirst({
        where:{
            id
        }
    })
}

export async function update(request){
    return await prisma.adoptionRequest.update({
        data: {
            ...request
        },
        where: {
            id: request.id
        }
    })
}
