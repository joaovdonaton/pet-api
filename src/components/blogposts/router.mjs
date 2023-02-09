import { saveBlogpost } from "./service.mjs"

/**
 * @openapi
 * /campaigns/{campaignTitle}/blogposts:
 *   post:
 *     summary: criar novo blogpost
 *     tags:
 *     - "campaigns"
 *
 *     operationId: create_blogpost
 *     x-eov-operation-handler: blogposts/router
 *     
 *     requestBody:
 *       description: objeto com dados do blogpost
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/BlogpostRegister"
 *      
 *     parameters:
 *       - $ref: '#/components/parameters/CampaignTitle'
 *        
 *     responses:
 *       '200':
 *         description: blogpost postado com sucesso
 *       '403':
 *         description: usuário autenticado não tem permissão pra publicar no nome dessa organização
 *     
 *     security:
 *       - JWT: ['USER']
 */
export async function create_blogpost(req, res, next){
    const currentAuth = req.user

    const blogpost = await saveBlogpost(req.body, req.params.campaignTitle, currentAuth)

    res.json(blogpost)
}