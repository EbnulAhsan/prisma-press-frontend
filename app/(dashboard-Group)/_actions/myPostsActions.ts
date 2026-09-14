/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { title } from "process";

// post state as like as login state

type PostState = {
    success: true,
    statusCode: number,
    message: string,
    data: Record<string, any>
}


// new function for updatingff new post

export const createPost = async (prevState: PostState, formdata: FormData) => {

    console.log({
        title: formdata.get("title"),
        content: formdata.get("content"),
        thumbnail: formdata.get("thumbnail"),
        tags: (formdata.get("tags") as string).split(", "),
        isPremium: formdata.get("isPremium") === "on"

    })

    // creating payload for body

    const payload = {
        title: formdata.get("title"),
        content: formdata.get("content"),
        thumbnail: formdata.get("thumbnail"),
        tags: (formdata.get("tags") as string).split(", "),
        isPremium: formdata.get("isPremium") === "on"

    }










    // here initially return  empty obj

    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        // throw new Error("User Not Logged In!");

        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
        method: "POST",
        headers: {
            // Authorization : accessToken as unknown as string,
            // Authorization : `${accessToken}`,
            // Authorization : `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`,

            "Content-Types": "application/json"
        },

        body: JSON.stringify(payload)


    });

    const result = await res.json()

    if (result.success) {

        revalidateTag("my-posts", "max")

    }

    if (result.success && result.data.isPremium) {
        revalidateTag("premium-posts", "max")

    } else {
        revalidateTag("public-posts", "max")

    }




    return result

}












export const getMyPosts = async () => {
    const cookieStore = await cookies();

    const accessToken = cookieStore.get("accessToken")?.value || null;

    if (!accessToken) {
        // throw new Error("User Not Logged In!");

        return {
            success: false,
            message: "User not logged in!"
        }
    }

    const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/my-posts`, {
        headers: {
            // Authorization : accessToken as unknown as string,
            // Authorization : `${accessToken}`,
            // Authorization : `Bearer ${accessToken}`

            Cookie: `accessToken=${accessToken}`
        },

        cache: "force-cache",
        next: {
            revalidate: 60 * 60 * 24, // 1day
            tags: ["my-posts"]
        }
    });

    const result = res.json();


    return result
}