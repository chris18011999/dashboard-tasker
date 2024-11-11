"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CheckSquare, LayoutDashboard } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail
} from "@/components/ui/sidebar";

const links = [
  {
    slug: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    slug: "/tasks",
    label: "Tasks",
    icon: CheckSquare,
  },
];

export function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <Sidebar variant="inset"
      collapsible="icon"
      className="dark border-r border-zinc-800 bg-zinc-900 transition-all duration-300 ease-in-out"
    >
      <SidebarHeader className="flex h-16 items-start justify-between  text-foreground">
        <div className="flex items-center gap-2">
          <UserButton></UserButton>
        </div>
      </SidebarHeader>
      <SidebarContent className="px-2">
        <SidebarMenu>
          {links.map((link) => {
            const isActive = pathname === link.slug;
            return (
              <SidebarMenuItem key={link.label}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className="group relative"
                >
                  <Link
                    href={link.slug}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                      isActive
                        ? "bg-red-500/10 text-red-500"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100"
                    )}
                  >
                    <link.icon
                      className={cn(
                        "h-5 w-5",
                        isActive ? "text-red-500" : "text-zinc-400"
                      )}
                    />
                    <span className="transition-opacity duration-300 group-data-[collapsible=icon]:hidden">
                      {link.label}
                    </span>
                    {isActive && (
                      <div className="absolute -left-2 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-red-500" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
