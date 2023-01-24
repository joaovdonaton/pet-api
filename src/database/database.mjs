import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';

export const prisma = new PrismaClient();

async function makeRole(name) {
    let exists = await prisma.role.findUnique({ where: { name } });
    if (exists) {
        console.log(`role ${name} found`);
        return;
    }

    await prisma.role.create({ data: { name } });
    console.log(`role ${name} created`)
}

async function makeAdmin(){
    const username = process.env.DEFAULT_ADMIN_NAME
    const password = await bcrypt.hash(process.env.DEFAULT_ADMIN_PASSWORD, await bcrypt.genSalt(),  )
    
    const exists = await prisma.user.findFirst({
        where: {
            roles: {
                some: {
                    name: "ADMIN"
                }
            }
        }
    })

    if (exists) {
        console.log(`administrator found`);
        return;
    }

    await prisma.user.create({
        data: {
            username,
            password,
            name: 'Pet Server Admin',
            roles: {
                connect: [{name: 'ADMIN'}, {name: 'USER'}]
            }
            }
        }
    )
    console.log(`Default administrator created`)

}

export async function bootstrapDb() {
    console.log("Checking initial data...");
    await makeRole("ADMIN");
    await makeRole("USER");

    await makeAdmin();

    console.log("Done!");
}
