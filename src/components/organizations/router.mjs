import { addMember, getOrganizationByName, saveOrganization } from "./service.mjs"

/**
 * @openapi
 * /organizations:
 *   post:
 *     summary: cria uma nova organization
 *     description: ter uma organization é necessário para criar e gerenciar campanhas.
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

/**
 * @openapi
 * /organizations/{orgName}:
 *   get:
 *     summary: get organization info
 *     
 *     tags:
 *       - "organizations"
 *
 *     operationId: get_organization
 *     x-eov-operation-handler: organizations/router
 * 
 *     parameters:
 *       - $ref: '#/components/parameters/OrganizationName'
 *        
 *     responses:
 *       '200':
 *         description: organização retornada com sucesso
 *       '404':
 *         description: organização não existe
 */
export async function get_organization(req, res, next){
    res.status(200).json(await getOrganizationByName(req.params.orgName))
}

/**
 * @openapi
 * /organizations/{orgName}/members:
 *   post:
 *     summary: adicionar um membro à organization 
 *     description: para adicionar um membro à organization é necessário que o usuário autenticado seja o owner.
 *
 *     tags:
 *     - "organizations"
 *
 *     operationId: add_member
 *     x-eov-operation-handler: organizations/router
 * 
 *     parameters: 
 *       - $ref: '#/components/parameters/OrganizationName'
 * 
 *     requestBody:
 *       description: objeto com dados do novo membro
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MemberInfo"
 *        
 *     responses:
 *       '204':
 *         description: membro adicionado com sucesso
 *       '404':
 *         description: organização não existe
 *       '403':
 *         description: usuario autenticado deve ser o dono da organização
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function add_member(req, res, next){
    const currentAuth = req.user
    
    const org = await addMember(currentAuth, req.body.id, req.params.orgName)
    
    res.status(204).json(org)
}