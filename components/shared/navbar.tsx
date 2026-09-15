/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout } from "@/service/logout";
import { LayoutDashboard, LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "../ui/button";

// Navigation items configuration
const navItems = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Services", href: "/services" },
    { label: "Contact", href: "/contact" },
    { label: "News", href: "/news" },
    { label: "Premium", href: "/premium" },
];

export function Navbar({ user }: { user?: any }) {
    const router = useRouter();

    const role = user?.data?.profile?.role?.toUpperCase();

    // রোল অনুযায়ী সঠিক ড্যাশবোর্ড পাথ নির্ধারণ
    const getDashboardPath = () => {
        if (role === "ADMIN") return "/admin-dashboard";
        if (role === "AUTHOR") return "/author-dashboard";
        return "/dashboard"; // ডিফল্ট USER এর জন্য
    };

    const handleLogout = async () => {
        await logout();
        toast.success("User Logged Out Successfully!");
        router.push("/login");
    };

    return (
        <nav className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="shrink-0">
                        <span className="text-2xl font-bold text-primary">
                            NextJs Press
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <div className="hidden md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:flex md:items-center md:gap-8">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="text-foreground hover:text-primary transition-colors text-sm font-medium"
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* User Dropdown */}
                    {user?.success ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <div className="cursor-pointer">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                        <User className="w-4 h-4 text-primary" />
                                    </div>
                                </div>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col gap-1">
                                        <p className="text-sm font-medium">
                                            {user.data?.profile?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {user.data?.profile?.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />

                                {/* Dashboard Link */}
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={getDashboardPath()}
                                        className="flex items-center w-full cursor-pointer"
                                    >
                                        <LayoutDashboard className="w-4 h-4 mr-2" />
                                        <span>Dashboard</span>
                                    </Link>
                                </DropdownMenuItem>

                                {/* Profile Link */}
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard/my-profile"
                                        className="flex items-center w-full cursor-pointer"
                                    >
                                        <User className="w-4 h-4 mr-2" />
                                        <span>Profile</span>
                                    </Link>
                                </DropdownMenuItem>

                                {/* Settings Link */}
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/dashboard/settings"
                                        className="flex items-center w-full cursor-pointer"
                                    >
                                        <Settings className="w-4 h-4 mr-2" />
                                        <span>Settings</span>
                                    </Link>
                                </DropdownMenuItem>

                                <DropdownMenuSeparator />

                                {/* Logout */}
                                <DropdownMenuItem
                                    onClick={handleLogout}
                                    className="cursor-pointer text-destructive focus:text-destructive"
                                >
                                    <LogOut className="w-4 h-4 mr-2" />
                                    <span>Log out</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link href="/login">
                            <Button className="cursor-pointer">Login</Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}