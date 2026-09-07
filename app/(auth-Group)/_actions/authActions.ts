"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import jwt from "jsonwebtoken"
import { JwtPayload } from "jsonwebtoken"

type LoginSuccessState = {
    success: true
    statusCode: number
    message: string
    data: {
        accessToken: string
        refreshToken: string
    }
}

type LoginErrorState = {
    success: false
    statusCode: number
    message: string
    errorDetails?: unknown
}

type LoginState = LoginSuccessState | LoginErrorState

export const loginAction = async (
    prevState: unknown,
    formData: FormData
): Promise<LoginState> => {
    const email = formData.get("email")
    const password = formData.get("password")

    const payload = {
        email,
        password
    }

    const res = await fetch(
        `${process.env.BACKEND_API_URL}/api/auth/login`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload),
            cache: "no-store"
        }
    )

    const result: LoginState = await res.json()

    if (result.success) {
        const cookieStore = await cookies()

        cookieStore.set("accessToken", result.data.accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24,
            sameSite: "lax",
            path: "/"
        })

        cookieStore.set("refreshToken", result.data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7,
            sameSite: "lax",
            path: "/"
        })

        const decodedToken = jwt.decode(
            result.data.accessToken
        ) as JwtPayload




        if (decodedToken.role === "USER") {
            redirect("/dashboard")

        } else if (decodedToken.role === "ADMIN") {

            redirect("/admin-dashboard")

        } else if (decodedToken.role === "AUTHOR") {

            redirect("/author-dashboard")
        }










        // console.log(decodedToken)



        redirect("/dashboard")
    }

    return result
}