import { badRequest, forbidden } from "../../security/errors.mjs";
import { getOrganizationById } from "../organizations/service.mjs";
import { loadCampaignByTitle, save } from "./repository.mjs";
import {getPetById } from '../pets/service.mjs'

export async function saveCampaign(currentAuth, campaign){
    const org = await getOrganizationById(campaign.organizationId)

    if(org.ownerId !== currentAuth.id) throw forbidden(`User id [${currentAuth.id}] is not the owner of organization id [${org.id}]`)
    if(await loadCampaignByTitle(campaign.title)) throw badRequest(`A campaign titled [${campaign.title}] already exists`)

    // ver se os pets da campanha pertencem a membros da organização
    const organizerIds = org.organizers.map(o => o.id)

    for(const petId of campaign.pets){
        const pet = await getPetById(petId);
        if(!pet) throw badRequest(`Pet id [${petId}] does not exist`)
        
        if(!organizerIds.some(oId => oId === pet.ownerId)) throw badRequest(`Pet id [${pet.id}] does not belong to any members of the campaign`)
    }

    return await save(campaign)
}