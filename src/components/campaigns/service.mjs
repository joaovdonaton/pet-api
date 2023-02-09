import { badRequest, forbidden, notFound } from "../../security/errors.mjs";
import { getOrganizationById } from "../organizations/service.mjs";
import { findAllCampaigns, loadCampaignByTitle, save } from "./repository.mjs";
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

export async function getCampaignByTitle(title){
    const campaign = await loadCampaignByTitle(title);

    if(!campaign) throw notFound(`Campaign titled [${title}] does not exist.`)

    return campaign
}

export async function listCampaigns(limit, page, sortBy, ascDesc, searchData, searchType){
    let whereQuery = {}

    if(searchType){
        if(!searchData) throw badRequest(`searchData field must not be empty`)

        if(searchType === 'title' || searchType === 'description') whereQuery[searchType] = {contains: searchData}
        else {
            // https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-nested-array-value
            // só funciona se o searchData for EXATAMENTE igual ao name OU description do resource.
            whereQuery = {
                OR: [
                    {
                        [searchType]: {
                            path: '$[*].name',
                            array_contains: searchData
                        } 
                    },
                    {
                        [searchType]: {
                            path: '$[*].description',
                            array_contains: searchData
                        } 
                    }
                ]
            }
        }
    }

    console.log(JSON.stringify(whereQuery))

    return await findAllCampaigns(limit, page, sortBy, ascDesc, whereQuery)
}