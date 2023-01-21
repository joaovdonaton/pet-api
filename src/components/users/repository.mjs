const users = [
    {
        id: 0,
        username: "joao",
        password: "123",
        roles: ["ADMIN", "USER"]
    },
    {
        id: 1,
        username: "pedro",
        password: "111",
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