import {prisma} from '../../database/database.mjs'

export async function save(organization){
    return await prisma.organization.create({
        data:{
            ...organization,
            organizers: {
                connect: [
                    ...organization.organizers
                ]
            }
        }
    })
}

export async function loadOrganizationByName(name){
    return await prisma.organization.findFirst({
        where:{
            name
        },
        include: {
            organizers: {
                select: {
                    id: true,
                    name: true,
                    password: false,
                    username: true
                }
            }
        }
    })
}

export async function loadOrganizationById(id){
    return await prisma.organization.findFirst({
        where:{
            id
        },
        include: {
            organizers: {
                select: {
                    id: true,
                    name: true,
                    password: false,
                    username: true
                }
            }
        }
    })
}

export async function updateMembers(organization, newMemberId){
    return await prisma.organization.update({
        where: {
            id: organization.id
        },
        data: {
            organizers : {
                connect: {id: newMemberId}
            }
        }
    })
}
