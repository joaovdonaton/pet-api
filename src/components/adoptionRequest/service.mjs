import { findPetById } from "../pets/repository.mjs"
import { save } from "./repository.mjs"

export async function createRequest(data, currentAuth){
    const request = {...data}

    request.senderId = currentAuth.id

    const pet = await findPetById(data.petId)

    request.receiverId = pet.ownerId

    return await save(request)
}