import { badRequest, forbidden, notFound } from "../../security/errors.mjs"
import { findPetById } from "../pets/repository.mjs"
import { findRequestById, findRequestsByReceiverId, save, update } from "./repository.mjs"

export async function createRequest(data, currentAuth){
    const request = {...data}

    request.senderId = currentAuth.id

    const pet = await findPetById(data.petId)
    if(!pet) throw notFound(`Pet id [${data.petId}] not found`)

    request.receiverId = pet.ownerId

    if(request.receiverId === request.senderId) throw badRequest(`User id [${request.senderId}] cannot send an adoption request to himself`)

    return await save(request)
}

// retorna os adoption requests do usuário receiverId
export async function getRequests(receiverId){
    return await findRequestsByReceiverId(receiverId)
}

export async function getRequestById(id){
    return await findRequestById(id)
}

export async function updateRequest(data, currentAuth){
    const request = await getRequestById(data.id)

    if(request.receiverId !== currentAuth.id) throw forbidden(`User id [${currentAuth.id}] is not the receiver of adoption request id [${data.id}]`)

    if(!['accepted', 'pending', 'rejected'].includes(data.status)) throw badRequest(`Invalid status: [${data.status}]`)

    request.status = data.status

    return await update(request)
}