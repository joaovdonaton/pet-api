import {prisma} from '../../database/database.mjs'

export async function save(blogpost){
    return await prisma.blogpost.create({
        data: {
            ...blogpost
        }
    })
}