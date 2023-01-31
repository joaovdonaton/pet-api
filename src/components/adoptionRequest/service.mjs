import { badRequest, forbidden, notFound } from "../../security/errors.mjs"
import { findPetById } from "../pets/repository.mjs"
import { loadUserByIdWithParams } from "../users/repository.mjs"
import { findRequestById, findRequestsByReceiverId, save, update, findRequestsBySenderId, findRequestsBySenderIdOrReceiverId} from "./repository.mjs"

export async function createRequest(data, currentAuth){
    const request = {...data}

    request.senderId = currentAuth.id

    const pet = await findPetById(data.petId)
    if(!pet) throw notFound(`Pet id [${data.petId}] not found`)

    request.receiverId = pet.ownerId

    if(request.receiverId === request.senderId) throw badRequest(`User id [${request.senderId}] cannot send an adoption request to himself`)

    return await save(request)
}

export async function getRequests(currentAuth, limit, page, requestType){
    const requests = []

    if(requestType === 'incoming'){
        const incoming = await findRequestsByReceiverId(currentAuth.id, limit, page)   
        if(incoming) requests.push(...incoming)
    }
    if(requestType === 'outgoing'){
        const outgoing = await findRequestsBySenderId(currentAuth.id, limit, page)
        if(outgoing) requests.push(...outgoing)
    }
    if(requestType === 'both'){
        const both = await findRequestsBySenderIdOrReceiverId(currentAuth.id, limit, page)
        if(both) requests.push(...both)
    }

    return requests
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