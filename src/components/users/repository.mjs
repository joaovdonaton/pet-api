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
    return await formatUser(users.find(u => u.id === Number(id)))
}

export async function loadByUsername(username){
    return await formatUser(users.find(u => u.username === username))
}

// verify credentials
export async function loadByCredentials(username, password){
    return formatUser(users.find(u => u.username === username && u.password === password))
}

export async function removeUserByUsername(username){
    const ind = users.findIndex(u => u.username === username)
    if(ind === -1) return false
    users.splice(ind, 1)
    return true
}

// updates user based on id
export async function update(user){
    const ind = users.findIndex(u => u.id === Number(user.id))
    if(ind === -1) return false

    users[ind] = {...user}
    return user
}

export async function debug_list(){
    return users
}