import { getProfilesByArea } from "../adoptionProfile/service.mjs";
import { findUserById, findUserByIdWithPetData } from "../users/service.mjs";
import {findAllPets, save} from "./repository.mjs";
import { getGeoDistance } from "../../util/util.mjs";
import { unauthorized, badRequest } from "../../security/errors.mjs";

export async function savePet(pet){
    return await save(pet)  
}

export async function getPets(limit, page, sortBy, ascDesc, currentAuth){
    if(sortBy === 'distance'){
        if(!currentAuth) throw unauthorized("Cannot sort by distance if user is not authenticated")

        const user = await findUserById(currentAuth.id)
        if(!user) throw unauthorized("Invalid autentication for id " + userId )

        const profile = user.profile
        if(!profile) throw badRequest(`User ${user.username} (id ${user.id}) does not have an adoption profile`)

        let pets = await getAllPetsOrderByDistance(profile, limit*(page+1))
        pets = pets.sort((a, b) => {
            const dif = a.distance - b.distance
            return ascDesc === 'desc' ? -dif : dif 
        })
        pets = pets.slice(page*limit)
        return pets
    }

    return await findAllPets(limit, page, sortBy, ascDesc)
}

export async function getPetById(id){
    return await findPetById(id)
}

// adiciona a propriedade distance (distancia do profile até o pet) aos pets retornados. 
// page é opcional e será ignorado se for undefined
//filterViewed exclui os pets já vistos no matching pelo perfil atual
export async function getAllPetsOrderByDistance(profile, limit){
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