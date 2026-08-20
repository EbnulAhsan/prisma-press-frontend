"use client"

import Link from "next/link"
import {
    ChevronDown,
    CreditCard,
    LogOut,
    Settings,
    UserRound,
} from "lucide-react"

import { Avatar, AvatarFallback } from "../ui/avatar"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "Contact", href: "#contact" },
]



const accountItems = [
    { label: "Profile", icon: UserRound },
    { label: "Billing", icon: CreditCard },
    { label: "Settings", icon: Settings },
]

export function SiteNavbar() {
    return (
        <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-5 lg:px-8">
                <Link
                    href="#overview"
                    className="flex shrink-0 items-center gap-2.5"
                    aria-label="Northstar home"
                >
                    <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground">
                        P
                    </span>
                    <span className="text-sm font-semibold tracking-tight">
                        Prisma-Press
                    </span>
                </Link>

                <nav
                    className="hidden items-center gap-1 md:flex"
                    aria-label="Main navigation"
                >
                    {navItems.map((item, index) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`rounded-md px-3 py-2 text-sm transition-colors hover:bg-muted ${index === 0
                                ? "bg-muted font-medium"
                                : "text-muted-foreground"
                                }`}
                        >
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="ml-auto flex items-center gap-2">
                    <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                        Share feedback
                    </Button>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-10 gap-2 rounded-full px-1.5 pr-2"
                                aria-label="Open user menu"
                            >
                                <Avatar size="sm">
                                    <AvatarFallback className="bg-primary text-primary-foreground">
                                        AS
                                    </AvatarFallback>
                                </Avatar>

                                <span className="hidden text-sm font-medium sm:inline">
                                    Alex Smith
                                </span>

                                <ChevronDown className="hidden sm:block" aria-hidden="true" />
                            </Button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuGroup>
                                <DropdownMenuLabel>
                                    <p className="font-medium">Alex Smith</p>
                                    <p className="font-normal text-muted-foreground">
                                        alex@northstar.dev
                                    </p>
                                </DropdownMenuLabel>
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuGroup>
                                {accountItems.map((item) => {
                                    const Icon = item.icon

                                    return (
                                        <DropdownMenuItem key={item.label}>
                                            <Icon aria-hidden="true" />
                                            {item.label}
                                        </DropdownMenuItem>
                                    )
                                })}
                            </DropdownMenuGroup>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem>
                                <LogOut aria-hidden="true" />
                                Log out
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <nav
                className="flex gap-1 overflow-x-auto border-t px-5 py-2 md:hidden"
                aria-label="Mobile navigation"
            >
                {navItems.map((item, index) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`shrink-0 rounded-md px-3 py-1.5 text-sm ${index === 0
                            ? "bg-muted font-medium"
                            : "text-muted-foreground"
                            }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>
        </header>
    )


}