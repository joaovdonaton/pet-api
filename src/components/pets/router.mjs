import { savePet } from "./service.mjs"

/**
 * @openapi
 * /pets:
 *   post:
 *     summary: registers a new pet to a user
 *
 *     tags:
 *     - "pets"
 *
 *     operationId: create_pet
 *     x-eov-operation-handler: pets/router
 *
 *     requestBody:
 *       description: objeto contendo dados do pet
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/PetRegister"
 *
 *
 *     responses:
 *       '201':
 *         description: pet criado com sucesso
 *       '400':
 *         description: dados inválidas (consulte o schema)
 *       '401':
 *         description: autenticação inválida
 *     
 *     security:
 *        - JWT: ['USER']
 *   get:
 *     summary: returns a list of pets available for adoption
 *     
 *     tags:
 *       - "pets"
 *     
 *     operationId: list_available_pets
 *     x-eov-operation-handler: pets/router
 *     
 *     parameters:
 *       - $ref: "#/components/parameters/LimitParam"
 *       - $ref: "#/components/parameters/PageParam"
 * 
 *     responses:
 *       '200':
 *          description: pets returned successfully
 */
export async function create_pet(req, res, _){
    const currentAuth = req.user
    const pet = req.body

    pet.ownerId = currentAuth.id

    const savedPet = await savePet(pet)

    return res.status(201).json(savedPet)
}
export async function list_available_pets(req, res, _){
    
}