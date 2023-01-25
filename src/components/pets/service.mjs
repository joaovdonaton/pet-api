import {save} from "./repository.mjs";

export async function savePet(pet){
    return await save(pet)  
}