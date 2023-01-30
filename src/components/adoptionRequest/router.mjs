import { createRequest } from "./service.mjs"

/**
 * @openapi
 * /adoption/adopt:
 *   post:
 *     summary: enviar um pedido de adoção para o dono de um pet 
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: send_adoption_request
 *     x-eov-operation-handler: adoptionRequest/router
 * 
 *     requestBody:
 *       description: objeto contendo dados do perfil
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdoptionRequest"
 *
 *     responses:
 *       '200':
 *         description: request enviado com sucesso!
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function send_adoption_request(req, res, next){
    const currentAuth = req.user
    
    const request = await createRequest(req.body, currentAuth)

    return res.status(200).json(request)
}