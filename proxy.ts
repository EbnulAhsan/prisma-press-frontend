import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { JwtPayload } from "jsonwebtoken";
import { jwtUtils } from './lib/jwt';
import { getNewAccessToken } from './service/refreshToken';

const AUTH_ROUTES = ["/login", "/register"];
const PUBLIC_ROUTES = ["/", "/news", "/payment"];

export default async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"));

    // Cookies নেওয়া
    let accessToken = request.cookies.get("accessToken")?.value;
    const refreshToken = request.cookies.get("refreshToken")?.value;

    // Tokens ভেরিফাই করা
    let decodedAccessToken = accessToken
        ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string)
        : null;

    const decodedRefreshToken = refreshToken
        ? jwtUtils.verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET as string)
        : null;

    let response = NextResponse.next();

    // Access token expired হলে Refresh token দিয়ে নতুন টোকেন নেওয়া
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

    // ১. ইউজার যদি লগইন না থাকে বা টোকেন ইনভ্যালিড হয়
    if (!decodedAccessToken?.success) {
        if (accessToken) {
            response.cookies.delete("accessToken");
        }

        // পাবলিক বা লগইন/রেজিস্টার রুট হলে সরাসরি ঢুকতে দিন
        if (isPublicRoute || isAuthRoute) {
            return response;
        }

        // বাকি যেকোনো প্রটেক্টেড রুটের জন্য লগইনে রিডাইরেক্ট করবে
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // ২. টোকেন ডাটা এবং রোল এক্সট্র্যাক্ট করা (সরাসরি বা নেস্টেড user অবজেক্ট উভয়ই সাপোর্ট করবে)
    const tokenData = decodedAccessToken.data as (JwtPayload & {
        role?: string;
        isSubscribed?: boolean;
        user?: {
            role?: string;
            isSubscribed?: boolean;
        };
    }) | undefined;

    const rawRole = tokenData?.role || tokenData?.user?.role;
    const userRole = rawRole ? rawRole.toUpperCase() : null;
    const isSubscribed = Boolean(tokenData?.isSubscribed ?? tokenData?.user?.isSubscribed);

    // ৩. লগইন করা ইউজার যদি আবার /login বা /register এ যেতে চায়
    if (isAuthRoute) {
        if (userRole === "ADMIN") return NextResponse.redirect(new URL('/admin-dashboard', request.url));
        if (userRole === "AUTHOR") return NextResponse.redirect(new URL('/author-dashboard', request.url));
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // ৪. Premium পেজ প্রটেকশন (সাবস্ক্রিপশন না থাকলে পেমেন্টে পাঠাবে)
    if (pathname.startsWith("/premium")) {
        if (!isSubscribed && userRole !== "ADMIN") {
            return NextResponse.redirect(new URL('/payment', request.url));
        }
    }

    // ৫. রোল-বেজড ড্যাশবোর্ড প্রটেকশন
    if (pathname.startsWith("/dashboard") && userRole !== "USER") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }
    if (pathname.startsWith("/author-dashboard") && userRole !== "AUTHOR") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$).*)'
    ]
};