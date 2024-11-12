"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { CheckSquare, LayoutDashboard } from "lucide-react";

import * as motion from 'framer-motion/client';

import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { AnimatePresence } from "framer-motion";

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

export default function SidebarNavigation() {
  const pathname = usePathname();

  return (
    <Sidebar
      variant="inset"
      collapsible="icon"
      className="border-r border-slate-200 bg-white transition-all duration-300 ease-in-out"
    >
      <SidebarHeader className="flex h-16 items-start justify-between">
        <div className="flex items-center gap-2 p-2 w-full">
          <UserButton
            showName
            appearance={{
              elements: {
                rootBox: "flex-1",
                userButtonTrigger: "w-full",
                userButtonBox: "flex-1 flex-row-reverse justify-end",
                avatarBox:
                  "rounded-full border-2 bg-red-500 border-violet-100 size-10 hover:border-violet-200 transition-colors duration-200",
              },
            }}
          />
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
                      "flex items-center gap-3 rounded-full px-6 py-6 text-sm transition-all duration-200 ease-in-out",
                      isActive
                        ? "bg-violet-500 text-white shadow-lg shadow-violet-100"
                        : "text-slate-600 hover:bg-violet-50 hover:text-violet-600"
                    )}
                  >
                    <link.icon
                      className={cn(
                        "size-5 transition-transform duration-200 ease-in-out",
                        isActive
                          ? "text-violet-500"
                          : "text-slate-400"
                      )}
                    />
                    <span className="transition-all duration-200 ease-in-out group-data-[collapsible=icon]:opacity-0 group-data-[collapsible=icon]:translate-x-2 group-hover:font-medium">
                      {link.label}
                    </span>
                    {isActive && (
                      <AnimatePresence>
                        <motion.span initial={{ width: 0 }} animate={{ width: 4 }} exit={{width: 0}} className="absolute right-0 top-0 h-full w-1 rounded-full bg-violet-500 animate-pulse" />
                      </AnimatePresence>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail className="bg-slate-50" />
    </Sidebar>
  );
}
