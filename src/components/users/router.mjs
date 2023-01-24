import {authenticateUser, deleteUserByUsername, findUserById, findUserByUsername, saveUser, updateUser} from "./service.mjs";
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
 *             $ref: "#/components/schemas/UserRegister"
 *
 *
 *     responses:
 *       '201':
 *         description: usuário criado com sucesso
 *       '400':
 *         description: credenciais inválidas (consulte o schema)
 */
export async function create_user(req, res, _){
    const savedUser = await saveUser(req.body);

    if(!savedUser) return res.sendStatus(400)

    return res.status(201).json(savedUser)
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

/**
 * @openapi
 * /users/login:
 *   post:
 *     summary: realizar login e receber token JWT
 *
 *     tags:
 *       - "auth"
 *
 *     operationId: login
 *     x-eov-operation-handler: users/router
 *
 *     requestBody:
 *       required: true
 *       description: nome de usuario e senha
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UsernamePassword'
 *
 *     responses:
 *       '200':
 *         description: login realizado com sucesso
 *       '400':
 *         description: falha no login
 *       '404':
 *         description: usuário não está cadastrado
 * */
export async function login(req, res, _){
    if(!(await findUserByUsername(req.body.username))){
        return res.sendStatus(404)
    }

    const u = await authenticateUser(req.body)
    if(!u) return res.sendStatus(400)

    return res.json(u)
}

/**
 * @openapi
 * /users/me:
 *   delete:
 *     summary: apagar a conta do usuário autenticado
 *
 *     tags:
 *       - "profile"
 *
 *     operationId: deleteUser
 *     x-eov-operation-handler: users/router
 *
 *     responses:
 *       '204':
 *         description: usuario apagado com sucesso
 *       '401':
 *         description: não autenticado
 *       '404':
 *         description: usuário não existe
 *
 *     security:
 *       - JWT: ['USER']
 *   put:
 *     summary: atualizar informações do usuário
 *
 *     tags:
 *       - "profile"
 *
 *     operationId: updateUserInfo
 *     x-eov-operation-handler: users/router
 *
 *     requestBody:
 *       required: true
 *       description: nome de usuario e senha novos
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *
 *
 *     responses:
 *       '204':
 *         description: usuario atualizado com sucesso
 *       '401':
 *         description: autenticação inválida
 *
 *     security:
 *       - JWT: ['USER']
 * */
export async function deleteUser(req, res, _) {
    const currentAuth = req.user // criado pelo middleware JWT_SECURITY

    if(await deleteUserByUsername(currentAuth.username)) return res.sendStatus(204)
    return res.sendStatus(404)
}
export async function updateUserInfo(req, res, _){
    const currentAuth = req.user

    const u = await findUserById(currentAuth.id)
    if(!u) return res.sendStatus(401)

    if(await updateUser({...req.body, id: u.id})) return res.sendStatus(204)
    return res.sendStatus(404)
}