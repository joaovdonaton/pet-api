/**
 * @openapi
 * /info:
 *   get:
 *     summary: retorna nomes de todos os alunos
 *
 *     tags:
 *       - "auth"
 *
 *     operationId: get_grupo
 *     x-eov-operation-handler: users/router
 *
 *     responses:
 *       '200':
 *         description: ok
 *
 *
* */

export async function get_grupo(req, res, _){
    return res.json({"alunos": ['João Vitor Macambira Donaton']})
}