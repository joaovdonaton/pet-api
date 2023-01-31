import { getProfilesByArea } from "../adoptionProfile/service.mjs";
import { findUserById, findUserByIdWithPetData } from "../users/service.mjs";
import {findAllPets, save} from "./repository.mjs";
import { getGeoDistance } from "../../util/util.mjs";

export async function savePet(pet){
    return await save(pet)  
}

export async function getPets(limit, page, sortBy, ascDesc){
    return await findAllPets(limit, page, sortBy, ascDesc)
}

export async function getPetById(id){
    return await findPetById(id)
}

export async function getAllPetsOrderByDistance(profile, limit, page){
    let pets = []
    const searchOrder = ['district', 'city', 'state', 'global']

    // encontrar pets próximos
    for(let i = 0; i < searchOrder.length; i++){
        const petsInSameArea = await getAllPetsInArea(searchOrder[i], profile[searchOrder[i]], {district: profile.district, city: profile.city, state:profile.state})
        
        for(let pet of petsInSameArea){
            if(!profile.viewed.includes(pet.id) && pet.ownerId !== profile.userId){
                const distance = parseInt((await (getGeoDistance(pet.latitude, pet.longitude, profile.latitude, profile.longitude))).s12)
                pet.distance = distance 

                if(pets.length < limit){
                    pets.push(pet)
                    profile.viewed.push(pet.id)
                }
                else break
            }
        }
        if(pets.length === limit) break
    }

    return pets
}

// area => district, city, state or global
// details => {district, city, state} (required to avoid problems such as having a district with the same name in two different cities)
// returns an array of pets. Each pet object has two additional properties (latitude and longitude)
export async function getAllPetsInArea(area='global', areaName, details={district:'', city:'', state:''}){
    const profiles = await getProfilesByArea(area, areaName, details)

    const allPets = []
    for(let profile of profiles){
        const pets = (await findUserByIdWithPetData(profile.userId)).pets
        
        for(let pet of pets){
            pet.latitude = profile.latitude
            pet.longitude = profile.longitude
        }

        allPets.push(...pets)
    }

    return allPets
}