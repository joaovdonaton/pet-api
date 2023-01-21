import {loadByCredentials, loadById, loadByUsername, save} from './repository.mjs';
import {createToken} from "../../security/jwt.mjs";

export async function saveUser(user){
    return await save(user);
}

export async function findUserById(id){
    return await loadById(id);
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