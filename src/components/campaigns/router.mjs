import { getCampaignByTitle, saveCampaign } from "./service.mjs"

/**
 * @openapi
 * /campaigns:
 *   post:
 *     summary: cria uma nova campanha
 *     description: apenas o dono de uma organização pode criar campanhas
 *
 *     tags:
 *     - "campaigns"
 *
 *     operationId: create_campaign
 *     x-eov-operation-handler: campaigns/router
 * 
 *     requestBody:
 *       description: objeto com dados da campanha
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/CampaignRegister"
 *        
 *     responses:
 *       '200':
 *         description: campanha criada com sucesso
 *       '400':
 *         description: dados inválidos (consulte o schema)
 *       '403':
 *         description: o usuario deve ser dono da organização para criar uma campanha através dela
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function create_campaign(req, res, next){
    const currentAuth = req.user

    const campaign = await saveCampaign(currentAuth, req.body)

    res.status(200).json(campaign)
}

/**
 * @openapi
 * /campaigns/{campaignTitle}:
 *   get:
 *     summary: ver dados da camapnha
 *     tags:
 *     - "campaigns"
 *
 *     operationId: get_campaign
 *     x-eov-operation-handler: campaigns/router
 * 
 *     parameters:
 *       - $ref: '#/components/parameters/CampaignTitle'
 *        
 *     responses:
 *       '200':
 *         description: dados da campanha retornados com sucesso
 *       '404':
 *         description: campanha nao encontrada
 * 
 */
export async function get_campaign(req, res, next){
    res.json(await getCampaignByTitle(req.params.campaignTitle))
}