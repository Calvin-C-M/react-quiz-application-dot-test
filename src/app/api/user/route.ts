import { authOptions } from "@/server/auth"
import { getDatabase } from "@/server/database"
import { getServerSession } from "next-auth"

interface SignUpForm {
    username: string,
    password: string,
    confirmPassword: string
}

export async function POST(req: Request) {
    const body = await req.json() as SignUpForm

    try {
        const database = await getDatabase()
        const insertUser = await database.collection("user").insertOne({
            username: body.username,
            password: body.password
        })

        if(insertUser.acknowledged) {
            return new Response(JSON.stringify({ status: "SUCCESS", message: "BERHASIL SIGN UP" }))
        } else {
            return new Response(JSON.stringify({ status: "FAILED", message: "GAGAL SIGN UP" }))
        }
        
    } catch(err) {
        console.error(err)
        return new Response(JSON.stringify({ status: "FAILED", message: "INTERNAL SERVER ERROR" }))
    }
}