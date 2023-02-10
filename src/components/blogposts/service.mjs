import { loadUserByIdWithParams } from "../users/repository.mjs";
import {getCampaignByTitle} from '../campaigns/service.mjs'
import { forbidden } from "../../security/errors.mjs";
import { findAllBlogpostsByCampaign, save } from "./repository.mjs";

export async function saveBlogpost(blogpost, campaignTitle, currentAuth){
    const u = await loadUserByIdWithParams(currentAuth.id, {organizations: true})
    const campaign = await getCampaignByTitle(campaignTitle)

    console.log(u)
    console.log(campaign)

    if(!u.organizations.some(o => o.id === campaign.organizationId)) throw forbidden(`User id [${currentAuth.id}] is NOT in the organization (id [${campaign.organizationId}]) that owns this campaign`)

    blogpost.authorId = u.id
    blogpost.campaignId = campaign.id

    return await save(blogpost)
}

export async function listBlogposts(limit, page, ascDesc, campaignTitle){
    const campaignId = (await getCampaignByTitle(campaignTitle)).id

    return await findAllBlogpostsByCampaign(limit, page, ascDesc, campaignId)
}