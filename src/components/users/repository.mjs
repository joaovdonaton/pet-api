import { prisma } from "../../database/database.mjs";
import bcrypt from 'bcrypt'

const USER_FIELDS = {
    name: true,
    username: true, 
    roles: true,
    id: true,
    pets: true, 
    password: false
}

export async function formatUser(user){
    if(!user) return user;
    return {...user, password: undefined}
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

export async function loadByUsername(username){
    return await prisma.user.findUnique({where: {username: username}, select: {...USER_FIELDS}})
}

export async function loadByCredentials(username, password){
    const user = await prisma.user.findUnique({where: {username: username}, select: {...USER_FIELDS, password: true}})
    if(!user) return null;

    if(!await bcrypt.compare(password, user.password)) return null

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