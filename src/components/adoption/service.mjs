import { badRequest, notFound, ServerError, unauthorized } from "../../security/errors.mjs";
import { getCEPData, getLongLat } from "../../util/util.mjs";
import { findProfilesByParams, update } from "../adoption/repository.mjs";
import { findProfileByUserId, save } from "./repository.mjs";
import {findUserById} from '../users/service.mjs'
import { getAllPetsInArea } from "../pets/service.mjs";

// adds state, city, district and coordinates to profile with CEP data.
async function completeLocationData(profile){
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

    const viewedPetIds = profile.viewed

    /* Como vai funcionar o algoritmo para encontrar os matches:
    
    - Primeiro pegar todos os pets que se encontram no mesmo District que está no AdoptionProfile atual
    - Ordenar por distância, aplicar ordenação por filtros e filtros normais (preferencia por tipo de animal, se está no viewed e outros...)
    - Ver se a lista de pets que sobra é o suficiente para retornar a quantidade requisitada no limit.
    - Caso seja. Retorne os pets.
    - Caso NÃO seja. Adicione os que der na lista de pets para retornar. Expendir a busca para City (depois State, depois Global), e repetir os mesmos passos acima,
    até que a lista seja preenchida
    */

    //console.log(await getAllPetsInArea('district', 'centro', {district: profile.district, city: profile.city, state:profile.state}))

    //return []

    const pets = []
    const searchOrder = ['district', 'city', 'state']

    for(let i = 0; i < searchOrder.length; i++){
        const petsInSameArea = await getAllPetsInArea(searchOrder[i], profile[searchOrder[i]], {district: profile.district, city: profile.city, state:profile.state})
        console.log(`getting all pets in the same ${searchOrder[i]}: ${profile[searchOrder[i]]}`)
        console.log('Results:')
        console.log(petsInSameArea)
    }

    return pets
}

// area => district, city, state or global
// details => {district, city, state} (required to avoid problems such as having a district with the same name in two different cities)
export async function getProfilesByArea(area='global', areaName='', details={district:'', city:'', state:''}){
    if(!["district", "city", "state", "global"].includes(area)) throw new ServerError("Invalid Area", 500)
    const params = {...details}
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