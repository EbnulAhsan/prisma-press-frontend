import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import type { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from './lib/jwt';
import { getNewAccessToken } from './service/refreshToken';
import { getSubscriptionStatus } from './app/(public-Group)/_actions/getSubscriptionStatus';

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news", "/payment"];

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    let decodedAccessToken = accessToken
        ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
        : null;

    const decodedRefreshToken = refreshToken
        ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
        : null;

    let response = NextResponse.next();

    // রিফ্রেশ টোকেন দিয়ে নতুন অ্যাক্সেস টোকেন জেনারেট করা
    if ((!decodedAccessToken || !decodedAccessToken.success) && decodedRefreshToken?.success) {
        const result = await getNewAccessToken();
        if (result?.success) {
            accessToken = result.data.accessToken;
            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string);

            response.cookies.set("accessToken", accessToken!, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax",
            });
        }
    }

    // অথেন্টিকেশন ভ্যালিডেশন
    if (!decodedAccessToken?.success) {
        if (accessToken) {
            response.cookies.delete("accessToken");
        }

        if (isPublicRoute || isAuthRoute) {
            return response;
        }

        return NextResponse.redirect(new URL('/login', request.url));
    }

    // টোকেন ডাটা এবং রোল এক্সট্র্যাক্ট করা
    const tokenData = decodedAccessToken.data as (JwtPayload & {
        role?: string;
        isSubscribed?: boolean;
        subscriptionStatus?: string;
        subscription?: { status?: string };
        user?: {
            role?: string;
            isSubscribed?: boolean;
            subscriptionStatus?: string;
            subscription?: { status?: string };
        };
    }) | undefined;

    const rawRole = tokenData?.role || tokenData?.user?.role;
    const userRole = rawRole ? rawRole.toUpperCase() : null;

    // লগইন বা রেজিস্টার পেজে থাকলে রোল অনুযায়ী রিডাইরেক্ট
    if (isAuthRoute) {
        if (userRole === "ADMIN") return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        if (userRole === "AUTHOR") return NextResponse.redirect(new URL('/author-dashboard', request.url));
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // 1. ADMIN ড্যাশবোর্ড প্রোটেকশন
    if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // 2. AUTHOR ড্যাশবোর্ড প্রোটেকশন
    if (pathname.startsWith("/author-dashboard") && userRole !== "AUTHOR") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // 3. সাধারণ /dashboard এ হিট করলে রোল অনুযায়ী নিজ নিজ ড্যাশবোর্ডে রিডাইরেক্ট
    if (pathname.startsWith("/dashboard")) {
        if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        }
        if (userRole === "AUTHOR") {
            return NextResponse.redirect(new URL('/author-dashboard', request.url));
        }
        if (userRole !== "USER") {
            return NextResponse.redirect(new URL('/not-found', request.url));
        }
    }

    // প্রিমিয়াম রুট ভ্যালিডেশন
    if (pathname === "/premium") {
        const subscriptionStatus = await getSubscriptionStatus();

        const isActive = Boolean(
            subscriptionStatus?.success && subscriptionStatus.data?.isSubscribed,
        );

        if (!isActive) {
            return NextResponse.redirect(new URL("/payment", request.url));
        }
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'
    ]
};