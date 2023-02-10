import {prisma} from '../../database/database.mjs'

export async function save(blogpost){
    return await prisma.blogpost.create({
        data: {
            ...blogpost
        }
    })
}

export async function findAllBlogpostsByCampaign(limit, page, ascDesc, campaignId){
    return await prisma.blogpost.findMany({
        where: {
            campaignId
        },
        orderBy: [
            {
                createdAt: ascDesc
            }
        ],
        skip: limit*page,
        take: limit
    })
}