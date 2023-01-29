import { getProfilesByArea } from "../adoption/service.mjs";
import { findUserById } from "../users/service.mjs";
import {findAllPets, save} from "./repository.mjs";

export async function savePet(pet){
    return await save(pet)  
}

export async function getPets(limit, page, sortBy, ascDesc){
    return await findAllPets(limit, page, sortBy, ascDesc)
}

// area => district, city, state or global
export async function getAllPetsInArea(area='global', areaName){
    const profiles = await getProfilesByArea(area, areaName)

    const allPets = []
    for(let profile of profiles){
        const pets = (await findUserById(profile.userId)).pets
        allPets.push(...pets)
    }

    return allPets
}