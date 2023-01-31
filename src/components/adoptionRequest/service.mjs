import { badRequest, notFound } from "../../security/errors.mjs"
import { findPetById } from "../pets/repository.mjs"
import { findRequestsByReceiverId, save } from "./repository.mjs"

export async function createRequest(data, currentAuth){
    const request = {...data}

    request.senderId = currentAuth.id

    const pet = await findPetById(data.petId)
    if(!pet) throw notFound(`Pet id [${data.petId}] not found`)

    request.receiverId = pet.ownerId

    return await save(request)
}

// retorna os adoption requests do usuário receiverId
export async function getRequests(receiverId){
    return await findRequestsByReceiverId(receiverId)
}