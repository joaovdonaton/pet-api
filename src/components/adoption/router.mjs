import { saveProfile } from "./service.mjs"

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
 * */
export async function create_profile(req, res, next){
    const currentAuth = req.user
    const profile = req.body

    profile.userId = currentAuth.id

    const p = await saveProfile(profile)

    return res.status(201).json(p)
}