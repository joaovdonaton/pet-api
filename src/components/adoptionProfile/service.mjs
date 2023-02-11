import { badRequest, notFound, ServerError, unauthorized } from "../../security/errors.mjs";
import { findProfilesByParams, update } from "../adoptionProfile/repository.mjs";
import { findProfileByUserId, save } from "./repository.mjs";
import {findUserById} from '../users/service.mjs'
import { getAllPetsOrderByDistance } from "../pets/service.mjs";
import { completeLocationData } from "../../util/location.mjs";

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

export async function resetViewed(id){
    const profile = await findProfileByUserId(id)
    if(!profile) throw unauthorized(`Invalid authentication for user id [${id}]`)

    profile.viewed = []
    return await update(profile)
}

/**
 * @param {number} userid 
 * @param {number} limit quantidade de matches para retornar 
 * @returns {array} lista de pets 
 */
export async function getNextMatches(userId, limit){
    const user = await findUserById(userId)
    if(!user) throw unauthorized("Invalid autentication for id " + userId )

    const profile = user.profile
    if(!profile) throw badRequest(`User ${user.username} (id ${user.id}) does not have an adoption profile`)

    // algoritmo de busca por proximidade
    let pets = await getAllPetsOrderByDistance(profile, limit, true)

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

/**
 * @param {string} area district, city, state ou global
 * @param {object} details objeto com dados adicionais sobre localização, para evitar problemas como dois distritos com o mesmo nome em cidades diferentes
 * @returns array de profiles
 */
export async function getProfilesByArea(area='global', details={district:'', city:'', state:''}){
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