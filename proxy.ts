
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import jwt, { JwtPayload } from "jsonwebtoken"

const AUTH_ROUTES = ["/login", "/register"]

// This function can be marked `async` if using `await` inside
export async function proxy(request: NextRequest) {

    const pathname = request.nextUrl.pathname

    // 1st approach to get coockies -------------------------

    // const cookieStore = await cookies()

    // const accessToken = cookieStore.get("accessToken")

    // ------------------------------------------------------


    // 2nd approach to get coockies ------------------

    const coockieStore = await cookies()
    const accessToken = coockieStore.get("accessToken")?.value
    const decodedToken = accessToken ? jwt.decode(accessToken) as JwtPayload : null;

    let userRole = null
    if (decodedToken) {
        userRole = decodedToken.role;
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