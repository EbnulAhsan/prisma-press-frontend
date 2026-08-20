
"use server"

import { cookies } from "next/headers"


export const getMe = async () => {

    const cookieStore = await cookies()

    const accessToken = cookieStore.get("accessToken")

    if (!accessToken) {
        // throw new Error("user not Logged in")


        return {
            success: false,
            message: "user not logged in "
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/users/me`, {
        headers: {

            Cookie: `accessToken=${accessToken}`

        }
    })

    const result = res.json()

    console.log(result)

    return result

}