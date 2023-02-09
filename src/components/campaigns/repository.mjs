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

export async function findAllCampaigns(limit, page, sortBy, ascDesc, whereQuery){
    const orderByObj = {}
    orderByObj[sortBy] = ascDesc

    return await prisma.campaign.findMany({
        where: whereQuery,
        orderBy: [
            orderByObj
        ],
        skip: limit*page,
        take: limit
    })
}