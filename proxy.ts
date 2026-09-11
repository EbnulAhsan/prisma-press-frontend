
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken"
import { jwtUtils } from './lib/jwt'
import { getNewAccessToken } from './service/refreshToken';


const AUTH_ROUTES = ["/login", "/register"]
// public route------

const PUBLIC_ROUTES = ["/", "/news"]



// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const pathname = request.nextUrl.pathname

    // 1st approach to get coockies -------------------------

    const cookieStore = await cookies()

    // check if there refresh token valid or not ---




    // const accessToken = cookieStore.get("accessToken")

    // ------------------------------------------------------


    // 2nd approach to get coockies ------------------

    const coockieStore = await cookies()

    let accessToken = coockieStore.get("accessToken")?.value
    const refreshToken = request.cookies.get("refreshToken")?.value


    let decodedAccessToken = accessToken ? jwtUtils.verifyToken(accessToken, process.env.JWT_ACCESS_SECRET as string) : null;


    const decodedRefreshToken = refreshToken ? jwtUtils.verifyToken(refreshToken, process.env.JWT_ACCESS_SECRET as string) : null;


    if (!decodedAccessToken?.success && decodedRefreshToken?.success) {

        // here access token has expired but refresh token is still valid

        const result = await getNewAccessToken()
        if (result.success) {
            const newAccessToken = result.data.accessToken

            cookieStore.set("accessToken", newAccessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 24,
                sameSite: "lax"
            })

            accessToken = newAccessToken

            decodedAccessToken = jwtUtils.verifyToken(accessToken!, process.env.JWT_ACCESS_SECRET as string)
        }
    }




    let userRole = null

    if (decodedAccessToken?.success && decodedAccessToken.data) {
        userRole = (decodedAccessToken.data as JwtPayload).role;
    }

    if (!decodedAccessToken?.success) {
        cookieStore.delete("accessToken")

        return NextResponse.redirect(new URL('/login', request.url))

    }

    if (accessToken && AUTH_ROUTES.includes(pathname)) {
        if (userRole === "USER") {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        } else if (userRole === "ADMIN") {
            return NextResponse.redirect(new URL('/admin-dashboard', request.url))
        } else if (userRole === "AUTHOR") {
            return NextResponse.redirect(new URL('/author-dashboard', request.url))
        } else {
            return NextResponse.redirect(new URL('/', request.url))

        }

    }

    // checking user route is public or protected

    const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))

    const isAuthRoute = AUTH_ROUTES.some((route) => pathname === route || pathname.startsWith(route + "/"))


    //   aauthenticaated paagess protection

    if (!accessToken && !isPublicRoute && !isAuthRoute) {
        return NextResponse.redirect(new URL('/login', request.url))


    }

    // authorization-----

    // authorization-----

    // Shudhu USER /dashboard e jete parbe
    if (pathname.startsWith("/dashboard") && userRole !== "USER") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // Shudhu ADMIN /admin-dashboard e jete parbe
    if (pathname.startsWith("/admin-dashboard") && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }

    // Shudhu AUTHOR /author-dashboard e jete parbe
    if (pathname.startsWith("/author-dashboard") && userRole !== "AUTHOR") {
        return NextResponse.redirect(new URL('/not-found', request.url));
    }









    // console.log(pathname, "pathname")

    // console.log(request.nextUrl, "request")
    // console.log("proxy")






    // return NextResponse.redirect(new URL('/', request.url))

    return NextResponse.next();
}

// Alternatively, you can use a default export:
// export default function proxy(request: NextRequest) { ... }

export const config = {
    matcher: [
        // '/dashboard/:path*',
        // '/admin-dashboad/:path*'

        '/((?!api|_next/static|_next/image|.*\\.png$).*)' // proxy will trigger all route except this one .
    ]
}








