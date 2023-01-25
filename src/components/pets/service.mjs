import {findAllPets, save} from "./repository.mjs";

export async function savePet(pet){
    return await save(pet)  
}

export async function getPets(limit, page){
    return await findAllPets(limit, page)
}