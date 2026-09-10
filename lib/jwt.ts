

/* eslint-disable @typescript-eslint/no-explicit-any */
import jwt from "jsonwebtoken";

// const createToken =  (
//     payload: JwtPayload,
//     secret: Secret,
//     expiresIn: SignOptions["expiresIn"]
// ) => {
//     return jwt.sign(payload, secret, {
//         expiresIn,
//     });
// };


const verifyToken = (token: string, secret: string) => {


    try {
        const verifiedToken = jwt.verify(token, secret)
        return {
            success: true,
            data: verifiedToken
        }

    } catch (error: any) {

        console.log("token verification failed ", error)

        return {
            success: false,
            error: error.message
        }


    };

}





export const jwtUtils = {
    verifyToken
};