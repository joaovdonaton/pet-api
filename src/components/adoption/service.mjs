import { save } from "./repository.mjs";

export async function saveProfile(profile){
    return await save(profile)
}