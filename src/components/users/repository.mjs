const users = [
    {
        id: 0,
        username: "joaozinho",
        password: "joaozinho1",
        roles: ["ADMIN", "USER"]
    },
    {
        id: 1,
        username: "pedro",
        password: "iampedro",
        roles: ["USER"]
    }
]

let idCount = users.length-1

export async function formatUser(user){
    if(!user) return user;
    return {...user, password: undefined}
}

export async function save(user){
    if(!user) return null;

    idCount++
    users.push({...user, id: idCount, roles: ['USER']});

    return user;
}

export async function loadById(id){
    return await formatUser(users.find(u => u.id === id))
}

export async function loadByUsername(username){
    return await formatUser(users.find(u => u.username === username))
}

// verify credentials
export async function loadByCredentials(username, password){
    return formatUser(users.find(u => u.username === username && u.password === password))
}