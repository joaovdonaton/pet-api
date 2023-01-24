// const users = [
//     {
//         id: 0,
//         username: "joaozinho",
//         password: "joaozinho1",
//         roles: ["ADMIN", "USER"]
//     },
//     {
//         id: 1,
//         username: "pedro",
//         password: "iampedro",
//         roles: ["USER"]
//     }
// ]

// let idCount = users.length-1

import { prisma } from "../../database/database.mjs";
import bcrypt from 'bcrypt'

const USER_FIELDS = {
    name: true,
    username: true, 
    roles: true,
    id: true,
    password: false
}

export async function formatUser(user){
    if(!user) return user;
    return {...user, password: undefined}
}

export async function save(user){
    if(!user) return null;

    idCount++
    users.push({...user, id: idCount, roles: ['USER']});

    return user;
}

export async function loadById(id){
    return await prisma.user.findUnique({where: {id: Number(id)}, select: {...USER_FIELDS}})
}

export async function loadByUsername(username){
    return await prisma.user.findUnique({where: {username: username}, select: {...USER_FIELDS}})
}

// verify credentials
export async function loadByCredentials(username, password){
    const user = await prisma.user.findUnique({where: {username: username}, select: {...USER_FIELDS, password: true}})
    if(!user) return null;

    if(!await bcrypt.compare(password, user.password)) return null

    delete user.password

    return (user)
}

export async function removeUserByUsername(username){
    const ind = users.findIndex(u => u.username === username)
    if(ind === -1) return false
    users.splice(ind, 1)
    return true
}

// updates user based on id
export async function update(user){
    const ind = users.findIndex(u => u.id === Number(user.id))
    if(ind === -1) return false

    users[ind] = {...user}
    return user
}