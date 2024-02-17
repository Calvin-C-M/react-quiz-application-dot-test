"use client"

import Button from "@/components/Button"
import axios from "axios"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChangeEvent, FormEvent, useState } from "react"

interface Form {
    username: string,
    password: string,
    confirmPassword: string
}

interface Response {
    status: ("SUCCESS" | "FAILED"),
    message: string,
}

export default function SignUpPage() {
    const router = useRouter()

    const [form, setForm] = useState<Form>({
      username: "",
      password: "",
      confirmPassword: "",
    })
  
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const submitHandler = (e: FormEvent) => {
        e.preventDefault()
        axios.post("/api/user", form)
            .then(res => {
                const data = res.data as Response
                if(data.status == "SUCCESS") {
                    router.push('/')
                } else {
                    alert("Gagal sign up")
                }
            })
            .catch(err => {
                console.error(err)
                alert("Gagal sign up")
            })
    }

    return (
        <>
        <main>
            <section className="bg-primary rounded-md p-5">
                <h1 className="text-3xl font-bold text-center">Sign Up Form</h1>
                <form onSubmit={submitHandler} className="flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                        <label htmlFor="username">Username</label>
                        <input 
                            id="username"
                            type="text"
                            name="username"
                            className="rounded-sm text-primary px-2 py-1 focus:outline-secondary"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="password">Password</label>
                        <input 
                            id="password"
                            type="password"
                            name="password"
                            className="rounded-sm text-primary px-2 py-1 focus:outline-secondary"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input 
                            id="confirm-password"
                            type="password"
                            name="confirm-password"
                            className="rounded-sm text-primary px-2 py-1 focus:outline-secondary"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <Button type="submit">
                        Sign Up
                    </Button>
                    <span>
                       Already have an account? Login <Link href="/" className="text-tertiery hover:underline">here</Link>
                    </span>
                </form>
            </section>
        </main>
        </>
    )
}