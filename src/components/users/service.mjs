import {loadByCredentials, loadById, LoadByIdWithPetData, loadByUsername, removeUserByUsername, save, update} from './repository.mjs';
import {createToken} from "../../security/jwt.mjs";
import { badRequest } from '../../security/errors.mjs';

export async function saveUser(user){
    const exists = await loadByUsername(user.username);
    if(!exists) return await save(user);
    throw badRequest("User already exists: " + user.username)
}

export async function updateUser(user){
    const exists = await loadByUsername(user.username);
    if(!exists) return await update(user)
    throw badRequest("User already exists: " + user.username)}

export async function findUserById(id){
    return await loadById(id);
}

export async function findUserByIdWithPetData(id){
    return await LoadByIdWithPetData(id);
}

export async function findUserByUsername(username){
    return await loadByUsername(username)
}

// gerar token jwt se nome e senha estiverem corretas
export async function authenticateUser(user){
    const authenticatedUser = await loadByCredentials(user.username, user.password)
    if(!authenticatedUser) return null;

    const token = createToken(authenticatedUser)

    return {...authenticatedUser, token}
}

export async function deleteUserByUsername(username){
    return await removeUserByUsername(username)
}