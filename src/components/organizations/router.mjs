import { saveOrganization } from "./service.mjs"

/**
 * @openapi
 * /organizations:
 *   post:
 *     summary: cria uma nova organization
 *
 *     tags:
 *     - "organizations"
 *
 *     operationId: create_organization
 *     x-eov-operation-handler: organizations/router
 * 
 *     requestBody:
 *       description: objeto com dados da organization
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/OrganizationRegister"
 *
 *     responses:
 *       '204':
 *         description: organização criada com sucesso
 *       '400':
 *         description: dados inválidos (consulte o schema)
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function create_organization(req, res, next){
    const currentAuth = req.user
    
    const org = await saveOrganization(currentAuth, req.body)
    
    res.status(204).json(org)
}