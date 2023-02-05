import {prisma} from '../../database/database.mjs'

export async function save(campaign){
    return await prisma.campaign.create({
        data: {
            ...campaign,
            pets: {
                connect: [
                    ...campaign.pets.map(p => ({id: p}))
                ]
            }
        }
    })
}

export async function loadCampaignByTitle(title){
    return await prisma.campaign.findFirst({
        where:{
            title
        },
        include: {
            pets: true
        }
    })
}