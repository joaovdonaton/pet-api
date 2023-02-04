import { badRequest, notFound } from "../../security/errors.mjs";
import { loadOrganizationByName, save } from "./repository.mjs";

export async function saveOrganization(currentAuth, organization){
    if(await loadOrganizationByName(organization.name)) throw badRequest(`An organization named [${organization.name}] already exists`)

    organization.organizers = [{id: currentAuth.id}]

    return await save(organization)
}

export async function getOrganizationByName(name){
    const org = await loadOrganizationByName(name)

    if(!org) throw notFound(`Organization named [${name}] was not found`)

    return org
}