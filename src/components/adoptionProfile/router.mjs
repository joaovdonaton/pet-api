import { getNextMatches, resetViewed, saveProfile, updateProfile } from "./service.mjs"

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
 *     x-eov-operation-handler: adoptionProfile/router
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
 *     x-eov-operation-handler: adoptionProfile/router
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
 *     x-eov-operation-handler: adoptionProfile/router
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
 *   delete:
 *     summary: apagar o histórico de pets já vistos no matcher pelo usuário authenticado
 *
 *     tags:
 *     - "adoption"
 *
 *     operationId: delete_history
 *     x-eov-operation-handler: adoptionProfile/router
 *
 *     responses:
 *       '204':
 *         description: sucesso
 *       '401':
 *         description: autenticação inválida
 * 
 *     security:
 *       - JWT: ['USER']
 * 
 */
export async function find_next_match(req, res, next){
    const currentAuth = req.user

    const matches = await getNextMatches(currentAuth.id, req.query.limit);

    res.status(200).json(matches)
}
export async function delete_history(req, res, next){
    const currentAuth = req.user

    await resetViewed(currentAuth.id)

    res.sendStatus(204)
}