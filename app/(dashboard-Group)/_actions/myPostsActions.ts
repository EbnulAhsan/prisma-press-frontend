/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

type PostState = {
    success: boolean;
    statusCode?: number;
    message: string;
    data?: Record<string, any>;
};

// Create new post Server Action
export const createPost = async (prevState: any, formdata: FormData): Promise<PostState> => {

    const rawTags = formdata.get("tags") as string;
    const tags = rawTags
        ? rawTags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];


    const payload = {
        title: formdata.get("title") as string,
        content: formdata.get("content") as string,
        thumbnail: formdata.get("thumbnail") as string,
        tags: tags,
        isPremium: formdata.get("isPremium") === "on",
    };

    console.log("Submitting Payload to Backend:", payload);


    const cookieStore = await cookies();
    const accessToken =
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value ||
        null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!",
        };
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();


        if (result?.success) {
            revalidateTag("my-posts", {
                expire: 0
            });

            if (result?.data?.isPremium) {
                revalidateTag("premium-posts", {
                    expire: 0
                });
            } else {
                revalidateTag("public-posts", {
                    expire: 0
                });
            }
        }

        return result;
    } catch (error: any) {
        console.error("Create Post Action Error:", error);
        return {
            success: false,
            message: error.message || "Something went wrong while creating post!",
        };
    }
};


// update or edit the post

export const updatePost = async (postId: string, prevState: any, formdata: FormData): Promise<PostState> => {

    const rawTags = formdata.get("tags") as string;
    const tags = rawTags
        ? rawTags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];


    const payload = {
        title: formdata.get("title") as string ?? "",
        content: formdata.get("content") as string ?? "",
        thumbnail: formdata.get("thumbnail") as string ?? "",
        tags: tags,
        isPremium: formdata.get("isPremium") === "on",
    };

    console.log("Submitting Payload to Backend:", payload);


    const cookieStore = await cookies();
    const accessToken =
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value ||
        null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!",
        };
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/${postId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();


        if (result?.success) {
            revalidateTag("my-posts", {
                expire: 0
            });

            if (result?.data?.isPremium) {
                revalidateTag("premium-posts", {
                    expire: 0
                });
            } else {
                revalidateTag("public-posts", {
                    expire: 0
                });
            }
        }

        return result;
    } catch (error: any) {
        console.error("Create Post Action Error:", error);
        return {
            success: false,
            message: error.message || "Something went wrong while creating post!",
        };
    }
};






// Get current user posts Server Action
export const getMyPosts = async () => {
    const cookieStore = await cookies();
    const accessToken =
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value ||
        null;

    if (!accessToken) {
        return {
            success: false,
            message: "User not logged in!",
        };
    }

    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/api/posts/my-posts`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Cookie: `accessToken=${accessToken}`,
            },
            cache: "force-cache",
            next: {
                revalidate: 60 * 60 * 24,
                tags: ["my-posts"],
            },
        });

        const result = await res.json();
        return result;
    } catch (error: any) {
        console.error("Get My Posts Error:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch posts",
        };
    }
};