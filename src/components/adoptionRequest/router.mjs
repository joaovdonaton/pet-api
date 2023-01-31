import { createRequest, getRequests, updateRequest } from "./service.mjs"

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
 *       description: objeto com dados do adoption request
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdoptionRequest"
 *
 *     responses:
 *       '200':
 *         description: request enviado com sucesso!
 *       '404':
 *         description: pet não existe
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function send_adoption_request(req, res, next){
    const currentAuth = req.user
    
    const request = await createRequest(req.body, currentAuth)

    return res.status(200).json(request)
}

/**
 * @openapi
 * /adoption/adopt:
 *   get:
 *     summary: ver os pedidos de adoção do usuário atualmente autenticado
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: get_adoption_requests
 *     x-eov-operation-handler: adoptionRequest/router
 *
 *     responses:
 *       '200':
 *         description: lista de requests retornada com sucesso
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function get_adoption_requests(req, res, next){
    const currentAuth = req.user
    
    let requests = await getRequests(currentAuth.id)
    if(!requests) requests = {}

    return res.status(200).json(requests)
}

/**
 * @openapi
 * /adoption/adopt:
 *   put:
 *     summary: atualizar status do adoption request
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: update_request
 *     x-eov-operation-handler: adoptionRequest/router
 * 
 *     requestBody:
 *       description: objeto com id do adoptionrequest para atualizar, e o status novo (Consulte StatusEnum)
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdoptionRequestUpdate"
 *
 *     responses:
 *       '204':
 *         description: atualizado com sucesso
 *       '403':
 *         description: usuário autenticado não é o receptor do request
 *       '400':
 *         description: status inválido
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function update_request(req, res, next){
    const currentAuth = req.user
    
    const updated = await updateRequest(req.body, currentAuth)
    
    return res.status(204).json(updated)
}