import jwt from 'jwt-simple'

const SECRET = "senha ultra secreta";
const ISSUER = "pets";

function clockTimestamp(date = new Date()) {
    return Math.floor(date.getTime() / 1000);
}

export function createToken(user) {
    const DAYS = 10;
    const exp = new Date();
    exp.setDate(exp.getDate() + DAYS);

    const payload = {
        iss: ISSUER,
        iat: clockTimestamp(),
        exp: clockTimestamp(exp),
        sub: user.id,
        user: {
            id: user.id,
            login: user.login,
            admin: user.admin
        }
    }
    return jwt.encode(payload, SECRET);
}
//
// export function hasAnyRole(token, roles){
//
// }
//
// export function expandClaims(){
//
// }
//
// export function decode(){
//
// }
//
// export function JWT_SECURITY(req, scopes = []){
//     if(scopes.size === 0) scopes.push(['USER'])
//     const token = decode(req.header("Authorization"))
//     if(!token.user || token.issuer !== ISSUER){
//         throw {status: 401, message: 'Unauthorized'}
//     }
//     //if(!hasAnyRole())
// }