import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export const prisma = new PrismaClient();

async function makeRole(name) {
    let exists = await prisma.role.findUnique({ where: { name } });
    if (exists) {
        console.log(`role ${name} found`);
        return;
    }

    await prisma.role.create({ data: { name } });
    console.log(`role ${name} created`);
}

async function makeAdmin() {
    const username = process.env.DEFAULT_ADMIN_NAME;
    const password = await bcrypt.hash(
        process.env.DEFAULT_ADMIN_PASSWORD,
        await bcrypt.genSalt()
    );

    const exists = await prisma.user.findFirst({
        where: {
            roles: {
                some: {
                    name: "ADMIN",
                },
            },
        },
    });

    if (exists) {
        console.log(`administrator found`);
        return;
    }

    await prisma.user.create({
        data: {
            username,
            password,
            name: "Pet Server Admin",
            roles: {
                connect: [{ name: "ADMIN" }, { name: "USER" }],
            },
        },
    });
    console.log(`Default administrator created`);
}

async function makeUsers() {
    // generate mock user data
    const usernames = [
        "joseph400",
        "iamarnold",
        "joaozinho",
        "vingadores",
        "cabelocolorido12",
        "maaaazinha",
    ];
    const names = [
        "Joseph Faria",
        "Arnold Schwartznegger",
        "Joao Vitor Donaton",
        "Tony Stark",
        "Gabriela de Souza",
        "Mariana Bradenburg von Sinner",
    ];

    /*aqui não da pra usar o createMany pq ele não tem suporte pra adicionar relações (https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#create-a-single-record-and-multiple-related-records)*/

    for (let i = 0; i < usernames.length; i++) {
        try {
            await prisma.user.create({
                data: {
                    username: usernames[i],
                    name: names[i],
                    password: await bcrypt.hash(
                        "12345678",
                        await bcrypt.genSalt()
                    ),
                    roles: { connect: [{ name: "USER" }] },
                },
            });
            console.log(`Mock user ${usernames[i]} created`);
        } catch (e) {
            console.log(`Mock user "${usernames[i]}" already exists`);
        }
    }

    console.log("Mock users created");
}

async function makePets() {
    const names = ["encephalius", "jimmy", "ababa", "pedro", "o gato immortal"];
    const nicknames = ["ence", "jiji", "ababs", "pepe", "dracula"];
    const animalType = ["dog", "dog", "dog", "cat", "cat"];
    const age = [1, 2, 3, 4, 5];
    const description = [
        "um cachorro muito fof e grande, cuide bem pelo por favor",
        "um cachorrito bem lindo e colorido",
        "simplesmente o cachorro mais carinhoso e amigável do mundo",
        "pepe é o meu bichinho, mas eu não tenho mais condições de alimentá-lo",
        "ele não morre, já tentei matar 3 vezes",
    ];
    const ownerIds = [];
    const mockUsers = await prisma.user.findMany({
        select: {
            id: true,
        },
        take: 5,
    });

    for (const u of mockUsers) {
        ownerIds.push(u.id);
    }

    for (let i = 0; i < names.length; i++) {
        if(await prisma.pet.findFirst({
            where:{
                name: names[i]
            }
        })) {
            console.log(`Mock pet ${names[i]} already exists`)
            continue
        }

        await prisma.pet.create({
            data: {
                name: names[i],
                nickname: nicknames[i],
                animal: animalType[i],
                age: age[i],
                description: description[i],
                ownerId: ownerIds[i],
            },
        });
        console.log(`Mock pet ${names[i]} created`);
    }
}

export async function bootstrapDb() {
    console.log("Checking initial data...");
    await makeRole("ADMIN");
    await makeRole("USER");

    await makeAdmin();

    await makeUsers();
    await makePets();

    console.log("Done!");
}
