import {findUserById, saveUser} from "./service.mjs";
import {loadByUsername} from "./repository.mjs";

/**
 * @openapi
 * /info:
 *   get:
 *     summary: retorna nomes de todos os alunos
 *
 *     tags:
 *       - "info"
 *
 *     operationId: get_grupo
 *     x-eov-operation-handler: users/router
 *
 *     responses:
 *       '200':
 *         description: lista de alunos retornada com successo
 *
 *
* */
export async function get_grupo(req, res, _){
    return res.json({"alunos": ['João Vitor Macambira Donaton']})
}

/**
 * @openapi
 * /users:
 *   post:
 *     summary: registra um novo usuário
 *
 *     tags:
 *     - "auth"
 *
 *     operationId: create_user
 *     x-eov-operation-handler: users/router
 *
 *     requestBody:
 *       description: objeto contendo nome e senha
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/UsernamePassword"
 *
 *
 *     responses:
 *       '201':
 *         description: usuário criado com sucesso
 *       '400':
 *         description: credenciais inválidas (consulte o schema)
 */

export async function create_user(req, res, _){
    if(await loadByUsername(req.body.username)){
        return res.sendStatus(400)
    }
    return res.status(201).json(await saveUser(req.body))
}

/**
 * @openapi
 * /users/{id}:
 *   get:
 *     summary: retorna informações do usuário pelo id
 *
 *     tags:
 *     - "profile"
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
 *
 */
export async function get_user_by_id(req, res, _){
    const u = await findUserById(req.params.id)
    if(!u) return res.sendStatus(404);
    return res.json(u);
}

