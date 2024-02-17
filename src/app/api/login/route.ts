import { getDatabase } from "@/server/database"

interface User {
    username: string,
    password: string
}

export async function POST(req: Request) {
    const body = await req.json() as User

    try {
        const database = await getDatabase()

        const findUser = await database.collection("user").findOne({
            username: body.username
        })

        if(findUser && body.password == findUser.password) {
            return new Response(JSON.stringify({ status: "SUCCESS", user: findUser }))
        } else {
            return new Response(JSON.stringify({ status: "FAILED", message: "NOT FOUND" }))
        }
    } catch(err) {
        console.error(err)

        return new Response(JSON.stringify({ status: "FAILED", message: "INTERNAL SERVER ERROR" }))
    }
}