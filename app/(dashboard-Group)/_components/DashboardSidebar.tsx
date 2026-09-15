"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import { ISidebarItem, NavbarProps } from "@/lib/types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { sidebarMenuItems } from "../_config/sidebarMenuItems";

export default function DashboardSidebar({ user }: Partial<NavbarProps>) {
    const pathname = usePathname();

    
    console.log("DASHBOARD_SIDEBAR_USER:", user);

    const role = user?.data?.profile?.role;
    console.log("DASHBOARD_SIDEBAR_ROLE:", role);

    let navItems: ISidebarItem[] = [];

    if (role === "USER") {
        navItems = sidebarMenuItems?.USER ?? [];
    } else if (role === "AUTHOR") {
        navItems = sidebarMenuItems?.AUTHOR ?? [];
    } else if (role === "ADMIN") {
        navItems = sidebarMenuItems?.ADMIN ?? [];
    } else {
      
        navItems = sidebarMenuItems?.USER ?? [];
    }

    return (
        <Sidebar
            collapsible="none"
            className="h-[calc(100svh-0rem)] border-r border-sidebar-border"
        >
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navItems.map((item) => (
                                <SidebarMenuItem key={item.href}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={pathname === item.href}
                                    >
                                        <Link href={item.href}>
                                            <item.icon />
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}