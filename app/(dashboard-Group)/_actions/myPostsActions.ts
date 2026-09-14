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
    // 1. FormData থেকে ট্যাগ প্রসেসিং
    const rawTags = formdata.get("tags") as string;
    const tags = rawTags
        ? rawTags.split(",").map((tag) => tag.trim()).filter(Boolean)
        : [];

    // 2. সঠিক Payload অবজেক্ট তৈরি
    const payload = {
        title: formdata.get("title") as string,
        content: formdata.get("content") as string,
        thumbnail: formdata.get("thumbnail") as string,
        tags: tags,
        isPremium: formdata.get("isPremium") === "on",
    };

    console.log("Submitting Payload to Backend:", payload);

    // 3. কুকি থেকে টোকেন নেওয়া
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
                "Content-Type": "application/json", // 🔥 ফিক্সড: Content-Types নয়, Content-Type হবে
                Authorization: `Bearer ${accessToken}`, // Bearer ফরম্যাটে পাঠানো নিরাপদ
                Cookie: `accessToken=${accessToken}`,
            },
            body: JSON.stringify(payload),
        });

        const result = await res.json();

        // 4. ক্যাশ রিভ্যালিডেশন
        if (result?.success) {
            revalidateTag("my-posts");

            if (result?.data?.isPremium) {
                revalidateTag("premium-posts");
            } else {
                revalidateTag("public-posts");
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
                revalidate: 60 * 60 * 24, // 1 day
                tags: ["my-posts"],
            },
        });

        const result = await res.json(); // 🔥 ফিক্সড: await যোগ করা হয়েছে
        return result;
    } catch (error: any) {
        console.error("Get My Posts Error:", error);
        return {
            success: false,
            message: error.message || "Failed to fetch posts",
        };
    }
};