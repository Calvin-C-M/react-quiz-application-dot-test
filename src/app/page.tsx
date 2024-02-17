"use client"

import Button from "@/components/Button";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useState } from "react";

interface Response {
  status: ("SUCCESS" | "FAILED"),
  data: any
}

export default function HomePage() {
  const router = useRouter()
  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submitHandler = (e: FormEvent) => {
    e.preventDefault()

    axios.post("/api/login", form)
      .then(res => {
        console.log(res)
        const data = res.data as Response

        if(data.status == "SUCCESS") {
          router.push("/quiz")
        } else {
          alert("Login salah")
        }
      })
      .catch(err => {
        console.error(err)
        alert("Ada kesalahan pada server")
      })
  }

  return (
    <main>
      <section className="bg-primary text-neutral rounded-md p-5">
        <h1 className="text-3xl font-bold text-center">Login Form</h1>
        <form onSubmit={submitHandler} className="flex flex-col gap-5 mt-3">
          <div className="flex flex-col gap-1">
            <label htmlFor="username" className="font-bold">Username</label>
            <input 
              id="username"
              type="text"
              name="username"
              className="rounded-sm text-primary px-2 py-1 focus:outline-secondary"
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-bold">Password</label>
            <input 
              id="password"
              type="password" 
              name="password"
              className="rounded-sm text-primary px-2 py-1 focus:outline-secondary"
              onChange={handleChange}
            />
          </div>
          <Button className="w-full">
            Login
          </Button>
          <span>
            Don&apos;t have an account? Sign Up <Link href="/sign-up" className="text-tertiery hover:underline">here</Link>
          </span>
        </form>
      </section>
    </main>
  );
}
