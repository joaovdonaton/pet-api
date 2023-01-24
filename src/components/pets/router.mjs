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
 */
export async function create_pet(req, res, _){

}