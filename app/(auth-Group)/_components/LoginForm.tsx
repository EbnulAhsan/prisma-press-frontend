
"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { loginAction } from "../_actions/authActions"
import { useActionState, useEffect } from "react"
import { toast } from "sonner"

const LoginForm = () => {

    const [state, action, pending] = useActionState(loginAction, false)

    console.log(state, "state")

    useEffect(() => {

        if (state?.success) {
            toast.success(state.message || "Login successful")
        }

        if (state && !state.success) {
            toast.error(state.message || "Login failed")
        }
    }, [state])






    return (
        <form action={action} className="space-y-4">

            <Card className="p-5 space-y-4">

                <Input name="email" type="email" placeholder="Enter your email" required />

                <Input name="password" type="password" placeholder="Enter your password" required />


                <Button type="submit">
                    {/* conditional rendering */}

                    {
                        pending ? "Submitting..." : "Login"
                    }
                </Button>


            </Card>



        </form>
    )
}

export default LoginForm