import { getProfilesByArea } from "../adoptionProfile/service.mjs";
import { findUserById, findUserByIdWithPetData } from "../users/service.mjs";
import {findAllPets, save, findPetById} from "./repository.mjs";
import { getGeoDistance } from "../../util/location.mjs";
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

/**
 * Os pets retornados recebem a propriedade adicional "distance" (distancia em km do usuario autenticado até o pet)
 * 
 * Como funciona o algoritmo: 
 * - Primeiro pegar todos os pets que se encontram no mesmo District que está no AdoptionProfile atual
 * - Ver se o pet está no viewed caso filterViewed sejá true
 * - Ver se a lista de pets que sobra é o suficiente para retornar a quantidade requisitada no limit.
 * - Caso seja. Retorne os pets.
 * - Caso NÃO seja. Adicione os que der na lista de pets para retornar. Expandir a busca para City (depois State, depois Global), e repetir os mesmos passos acima,
 * até que a lista seja preenchida (ou até que acabe as áreas de busca)
 * 
 * @param {object} profile adoptionprofile do usuario autenticado
 * @param {number} limit quantidade de pets para buscar
 * @param {boolean} filterViewed pular os pets já vistos pelo usuario atenticado
 * @returns lista de pets
 */
export async function getAllPetsOrderByDistance(profile, limit, filterViewed=false){
    let pets = []
    const searchOrder = ['district', 'city', 'state', 'global']

    // encontrar pets próximos
    for(let i = 0; i < searchOrder.length; i++){
        const petsInSameArea = await getAllPetsInArea(searchOrder[i], {district: profile.district, city: profile.city, state:profile.state})
        
        for(let pet of petsInSameArea){
            if(!pets.some((p) => p.id === pet.id) && pet.ownerId !== profile.userId){
                if(filterViewed && profile.viewed.includes(pet.id)) continue

                const distance = parseInt((await (getGeoDistance(pet.latitude, pet.longitude, profile.latitude, profile.longitude))).s12)
                pet.distance = Math.floor(distance / 1000) // distancia é convertida pra KM, a api não precisa dar tanta precisão quanto a distância
                
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

/**
 * @param {string} area district, city, state ou global
 * @param {object} details objeto com dados adicionais sobre localização, para evitar problemas como dois distritos com o mesmo nome em cidades diferentes
 * @returns array de pets, cada pet recebe as propriedades latitude e longitude
 */
export async function getAllPetsInArea(area='global', details={district:'', city:'', state:''}){
    const profiles = await getProfilesByArea(area, details)

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