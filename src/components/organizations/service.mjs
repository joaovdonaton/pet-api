import { badRequest, forbidden, notFound } from "../../security/errors.mjs";
import { loadOrganizationByName, save, updateMembers } from "./repository.mjs";

export async function saveOrganization(currentAuth, organization){
    if(await loadOrganizationByName(organization.name)) throw badRequest(`An organization named [${organization.name}] already exists`)

    organization.organizers = [{id: currentAuth.id}]
    organization.ownerId = currentAuth.id

    return await save(organization)
}

export async function getOrganizationByName(name){
    const org = await loadOrganizationByName(name)

    if(!org) throw notFound(`Organization named [${name}] was not found`)

    return org
}

export async function addMember(currentAuth, memberId, orgName){
    const org = await getOrganizationByName(orgName)

    if(org.ownerId !==  currentAuth.id) throw forbidden(`Insufficient Permission: user id [${currentAuth.id}] does not own organization [${orgName}]`)
    if(org.organizers.some(o => o.id === memberId)) throw badRequest(`User id [${memberId}] is already in the organization`)

    return await updateMembers(org, memberId)
}