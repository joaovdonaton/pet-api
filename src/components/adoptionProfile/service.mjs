import { badRequest, notFound, ServerError, unauthorized } from "../../security/errors.mjs";
import { getCEPData, getGeoDistance, getLongLat } from "../../util/util.mjs";
import { findProfilesByParams, update } from "../adoptionProfile/repository.mjs";
import { findProfileByUserId, save } from "./repository.mjs";
import {findUserById} from '../users/service.mjs'
import { getAllPetsInArea, getAllPetsOrderByDistance } from "../pets/service.mjs";

// adds state, city, district and coordinates to profile with CEP data.
export async function completeLocationData(profile){
    const cep = profile.cep

    const cepData = await getCEPData(cep)
    const {latitude, longitude} = await getLongLat({city: cepData.city, state: cepData.state, district: cepData.district, street: cepData.street})

    profile.latitude = latitude
    profile.longitude = longitude

    profile.state = cepData.state
    profile.city = cepData.city
    profile.district = cepData.district

    return profile
}

export async function saveProfile(profile){
    const exists = await findProfileByUserId(profile.userId)
    if(exists) throw badRequest(`Adoption profile for userId "${profile.userId}" already exists`)

    profile = await completeLocationData(profile)

    return await save(profile)
}

export async function updateProfile(profile){
    const exists = await findProfileByUserId(profile.userId)
    if(!exists) throw notFound(`Profile not found for id ${profile.userId}`)

    profile = await completeLocationData(profile)

    return await update(profile)
}

export async function getNextMatches(userId, limit){
    const user = await findUserById(userId)
    if(!user) throw unauthorized("Invalid autentication for id " + userId )

    const profile = user.profile
    if(!profile) throw badRequest(`User ${user.username} (id ${user.id}) does not have an adoption profile`)

    /* Como vai funcionar o algoritmo para encontrar os matches:
    
    - Primeiro pegar todos os pets que se encontram no mesmo District que está no AdoptionProfile atual
    - Ordenar por distância, aplicar ordenação por filtros e filtros normais (preferencia por tipo de animal, se está no viewed e outros...)
    - Ver se a lista de pets que sobra é o suficiente para retornar a quantidade requisitada no limit.
    - Caso seja. Retorne os pets.
    - Caso NÃO seja. Adicione os que der na lista de pets para retornar. Expandir a busca para City (depois State, depois Global), e repetir os mesmos passos acima,
    até que a lista seja preenchida (ou até que acabe as áreas de busca)
    */

    // algoritmo de busca por proximidade
    let pets = await getAllPetsOrderByDistance(profile, limit)

    //atualizar pets já vistos pelo AdoptionProfile atual
    const u = await update(profile)

    //ordenar por distância, caso seja igual (mesmo bairro, cidade e estado), Ordenar por preferência
    pets = pets.sort((a, b) => {
        const diff = a.distance - b.distance

        // distancia igual, ordenar por preferencia
        if(diff === 0){
            const hasA = profile.preferedTypes.includes(a.typeId), hasB = profile.preferedTypes.includes(b.typeId);

            if(hasA && hasB) return 0
            if (hasA) return -1
            return 1
        }

        return diff
    })


    return pets
}

// area => district, city, state or global
// details => {district, city, state} (required to avoid problems such as having a district with the same name in two different cities)
export async function getProfilesByArea(area='global', areaName='', details={district:'', city:'', state:''}){
    if(!["district", "city", "state", "global"].includes(area)) throw new ServerError("Invalid Area", 500)
    let params = {...details}
    if(area === 'global'){
        params = {}
    }
    else if(area === 'city'){
        delete params.district
    }
    else if(area === 'state'){
        delete params.district
        delete params.city
    }

    return await findProfilesByParams(params)
}