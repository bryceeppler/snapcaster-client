import type React from "react"
import { Frame, LineChart, Lock, Settings, Users } from "lucide-react"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useRouter } from "next/router"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAdmin, isVendor } = useAuth();
  const router = useRouter();

  if (!isAdmin && !isVendor) {
    return <div
    className="flex items-center justify-center h-96"
    ><div className="flex flex-col items-center gap-2">
      <Lock className="h-10 w-10 text-primary" />
      <p className="text-sm text-muted-foreground">You are not authorized to access this page.</p>
      </div></div>;
  }

  return (
    <SidebarProvider>
      <div className="flex w-full">
        <Sidebar className="h-[calc(100vh-4rem)] top-[112px] fixed">
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={router.pathname === "/vendors/dashboard"}>
                      <Link href="/vendors/dashboard" className="py-6">
                        <LineChart className="h-4 w-4" />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={router.pathname === "/vendors/dashboard/users"}>
                      <Link href="/vendors/dashboard/users" className="py-6">
                        <Users className="h-4 w-4" />
                        <span>Users</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={router.pathname === "/vendors/dashboard/tcgs"}>
                      <Link href="/vendors/dashboard/tcgs" className="py-6">
                      <div className="flex justify-center items-center h-4 w-4">
                        <div className="h-4 w-3 border border-foreground rounded-sm bg-muted" />
                        </div>
                        <span>TCGs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1">
          <div className="border-b">
            <div className="flex h-16 items-center gap-4 px-4">
              <SidebarTrigger />
              <div className="font-semibold">Analytics Dashboard</div>
            </div>
          </div>
          {children}
        </main>
      </div>
    </SidebarProvider>
  )
}