import { prisma } from "../../database/database.mjs";
import bcrypt from 'bcrypt'
import { notFound, unauthorized } from "../../security/errors.mjs";

const USER_FIELDS = {
    name: true,
    username: true, 
    roles: true,
    id: true,
    pets: false, 
    password: false,
    profile: true,
}

export async function formatUser(user){
    if(!user) return user;
    return {...user, password: undefined}
}

// params aqui seriam as relações que queremos buscar, por exemplo {incomingRequests: true, outgoingRequests: true} retornará o user com todos os AdoptionRequests dele
// PROBLEMA: não tem como paginar relações do include (https://stackoverflow.com/questions/70957831/prisma-2-how-to-paginate-fields-of-a-findunique-query)
export async function loadUserByIdWithParams(id, params){
    return await prisma.user.findFirst({
        where: {
            id
        },
        include: {
            ...params
        }
    })
}

export async function save(user){
    if(!user) return null;

    user.password = await bcrypt.hash(user.password, await bcrypt.genSalt())

    const createdUser = await prisma.user.create({
        data: {
            ...user, 
            roles: {
                connect: {
                    name: 'USER'
                }
            }
        }
    })

    delete createdUser.password

    return createdUser
}

export async function loadById(id){
    return await prisma.user.findUnique({where: {id: Number(id)}, select: {...USER_FIELDS}})
}

export async function LoadByIdWithPetData(id){
    return await prisma.user.findUnique({where: {id: Number(id)}, select: {...USER_FIELDS, pets: true}})
}

export async function loadByUsername(username){
    return await prisma.user.findUnique({where: {username: username}, select: {...USER_FIELDS}})
}

export async function loadByCredentials(username, password){
    const user = await prisma.user.findUnique({where: {username: username}, select: {...USER_FIELDS, password: true}})
    if(!user) throw notFound("User not found: " + username);

    if(!await bcrypt.compare(password, user.password)) throw unauthorized('Invalid Credentials')

    delete user.password

    return (user)
}

export async function removeUserByUsername(username){
    return await prisma.user.delete({
        where: {
            username
        }
    })

}

export async function update(user){

    if (user.password) user.password = await bcrypt.hash(user.password, await bcrypt.genSalt())

    return await prisma.user.update({
        where: {
            id: user.id
        },
        data: user
    })
}