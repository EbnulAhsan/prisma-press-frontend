import { Navbar } from "@/components/shared/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { getMe } from "@/service/getMe";
import { Sidebar } from "lucide-react";
import DashboardSidebar from "./_components/DashboardSidebar";

const DashboardLayout = async (
    {
        children
    }: {
        children: React.ReactNode
    }
) => {
    const user = await getMe();
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar user={user} />
            <SidebarProvider className="flex-1">
                <DashboardSidebar />
                <main className="flex-1-min-w-0">{children}</main>
            </SidebarProvider>

        </div>
    )
}

export default DashboardLayout