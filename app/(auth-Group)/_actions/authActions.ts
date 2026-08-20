"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"

type LoginState = {
    success: true,
    statusCode: number,
    message: string,
    data: {
        accessToken: string,
        refreshToken: string
    }
}


export const loginAction = async (prevState: unknown,
    formData: FormData
) => {

    console.log(formData)
    // console.log(prevState,"prev state" )

    const email = formData.get("email")

    const password = formData.get("password")

    const payload = {
        email,
        password
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(payload)
    })


    const result: LoginState = await res.json()

    // console.log(result)

    if (result.success) {
        const cookiesStore = await cookies()

        cookiesStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
        })


        cookiesStore.set("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
        })

        redirect("/dashboard")
    }



    return result

}