import { NotFound } from "express-openapi-validator/dist/framework/types.js"
import { getPets, savePet } from "./service.mjs"
import { notFound } from "../../security/errors.mjs"

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
 *     description: return a paginated and ordered list of pets. Sorting by distance requires user to be authenticated and have an adoption profile
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
 *       - $ref: "#/components/parameters/SortByParam"
 *       - $ref: "#/components/parameters/AscDescParam"
 * 
 *     responses:
 *       '200':
 *          description: pets returned successfully
 *       '404':
 *          description: no results
 *     
 *     security:
 *       - {}
 *       - JWT: ['USER']
 */
export async function create_pet(req, res, _){
    const currentAuth = req.user
    const pet = req.body

    pet.ownerId = currentAuth.id

    const savedPet = await savePet(pet)

    return res.status(201).json(savedPet)
}
export async function list_available_pets(req, res, _){
    let pets = await getPets(req.query.limit, req.query.page, req.query.sortBy, req.query.ascDesc, req.user)
    
    if(pets.length === 0) pets = []

    return res.json(pets)
}