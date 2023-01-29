import { getNextMatches, saveProfile, updateProfile } from "./service.mjs"

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
 *     summary: retorna um ou mais dos próximos matches do usuário autenticado
 *     description: utiliza o Adoption Profile do usuário atualmente autenticado para encontrar pets que se encaixam com o seu perfil
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: find_next_match
 *     x-eov-operation-handler: adoption/router
 *
 *     parameters:
 *       - $ref: '#/components/parameters/MatchLimit'
 *
 *     responses:
 *       '200':
 *         description: matches encontrado com sucesso
 *       '401':
 *         description: autenticação inválida
 * 
 *     security:
 *       - JWT: ['USER']
 */
export async function find_next_match(req, res, next){
    const currentAuth = req.user

    const matches = await getNextMatches(currentAuth.id, req.query.limit);

    res.sendStatus(200)
}