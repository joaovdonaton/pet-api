import { prisma } from "../../database/database.mjs";

export async function save(request) {
    return await prisma.adoptionRequest.create({
        data: {
            ...request,
        },
    });
}

export async function findRequestsByReceiverId(receiverId, limit, page) {
    return await prisma.adoptionRequest.findMany({
        where: {
            receiverId,
        },
        skip: page * limit,
        take: limit,
    });
}

export async function findRequestsBySenderId(senderId, limit, page) {
    return await prisma.adoptionRequest.findMany({
        where: {
            senderId,
        },
        skip: page * limit,
        take: limit,
    });
}

// encontra todos os requests em que o id é o sender ou o receiver
export async function findRequestsBySenderIdOrReceiverId(id, limit, page) {
    return await prisma.adoptionRequest.findMany({
        where: {
            OR: [
                {
                    receiverId: id,
                },
                { 
                    senderId: id 
                },
            ],
        },
        skip: page*limit,
        take: limit
    });
}

export async function findRequestById(id) {
    return await prisma.adoptionRequest.findFirst({
        where: {
            id,
        },
    });
}

export async function update(request) {
    return await prisma.adoptionRequest.update({
        data: {
            ...request,
        },
        where: {
            id: request.id,
        },
    });
}
