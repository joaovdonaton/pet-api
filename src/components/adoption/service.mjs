import { badRequest } from "../../security/errors.mjs";
import { getCEPData, getLongLat } from "../../util/util.mjs";
import { findProfileByUserId, save } from "./repository.mjs";

export async function saveProfile(profile){
    const exists = await findProfileByUserId(profile.userId)
    if(exists) throw badRequest(`Adoption profile for userId "${profile.userId}" already exists`)

    const cep = profile.cep

    const cepData = await getCEPData(cep)
    const {latitude, longitude} = await getLongLat({city: cepData.city, state: cepData.state, district: cepData.district, street: cepData.street})

    profile.latitude = latitude
    profile.longitude = longitude

    profile.state = cepData.state
    profile.city = cepData.city
    profile.district = cepData.district

    return await save(profile)
}