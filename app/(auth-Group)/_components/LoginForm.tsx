
"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const LoginForm = () => {
    return (
        <form>

            <Card>

                <Input name="email" type="email" placeholder="Enter your email" required />

                <Input name="password" type="password" placeholder="Enter your password" required />


            </Card>



        </form>
    )
}

export default LoginForm