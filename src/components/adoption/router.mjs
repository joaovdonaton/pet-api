import { saveProfile, updateProfile } from "./service.mjs"

/**
 * @openapi
 * /adoption:
 *   post:
 *     summary: create an Adoption Profile for authenticated user
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: create_profile
 *     x-eov-operation-handler: adoption/router
 *
 *     requestBody:
 *       description: objeto contendo dados do perfil
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdoptionProfileRegister"
 *
 *
 *     responses:
 *       '201':
 *         description: perfil criado com sucesso
 *       '400':
 *         description: dados inválidas (consulte o schema)
 *       '401':
 *         description: autenticação inválida
 *     
 *     security:
 *        - JWT: ['USER']
 * /adoption/me:
 *   put:
 *     summary: update currently authenticated user's profile
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: update_profile
 *     x-eov-operation-handler: adoption/router
 *
 *     requestBody:
 *       description: objeto contendo dados do perfil
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/AdoptionProfileRegister"
 *
 *
 *     responses:
 *       '204':
 *         description: perfil atualizado com sucesso
 *       '400':
 *         description: dados inválidas (consulte o schema)
 *       '401':
 *         description: autenticação inválida
 *     
 *     security:
 *        - JWT: ['USER']
 * */
export async function create_profile(req, res, next){
    const currentAuth = req.user
    const profile = req.body

    profile.userId = currentAuth.id

    const p = await saveProfile(profile)

    return res.status(201).json(p)
}
export async function update_profile(req, res, next){
    const currentAuth = req.user
    const profile = req.body

    profile.userId = currentAuth.id

    const p = await updateProfile(profile);

    return res.status(204).json(p)
}


/**
 * @openapi
 * /adoption/matcher:
 *   get:
 *     summary: retorna o próximo match do usuário autenticado
 *     description: utiliza o Adoption Profile do usuário atualmente autenticado para encontrar pets que se encaixam com o seu perfil
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: get_user_by_id
 *     x-eov-operation-handler: users/router
 *
 *     parameters:
 *       - $ref: '#/components/parameters/Id'
 *
 *     responses:
 *       '200':
 *         description: "usuário encontrado com sucesso"
 *       '404':
 *         description: usuário não encontrado
 *       '400':
 *         description: id inválido
 * 
 *     security:
 *       - JWT: ['USER']
 */