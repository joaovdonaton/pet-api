import {loadById, loadByUsername, save} from './repository.mjs';

export async function saveUser(user){
    return await save(user);
}

export async function findUserById(id){
    return await loadById(id);
}

export async function findUserByUsername(username){
    return await loadByUsername(username)
}