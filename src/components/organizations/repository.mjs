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
        }
    })
}