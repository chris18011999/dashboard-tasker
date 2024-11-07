"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { CheckSquare, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getCount } from "./NavigationActions";
import { useClerk, useUser } from "@clerk/nextjs";
import { Avatar, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { ExitIcon } from "@radix-ui/react-icons";

export const SidebarNavigation = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    await signOut({ redirectUrl: '/' })
  }

  const [taskCount, setTaskCount] = useState<number | '?' | null>();

  useEffect(() => {
    getCount().then(setTaskCount);
  }, []);

  const links = [
    {
      slug: "/",
      label: "Dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      slug: "/tasks",
      label: "Tasks",
      icon: <CheckSquare className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    <Sidebar className="w-64 border-r" collapsible="offcanvas">
      <SidebarHeader>
        <h1 className="py-2 text-lg flex items-center gap-3 justify-start font-semibold">
          <Avatar>
            <AvatarImage src={user?.imageUrl} />
          </Avatar>
          {user?.fullName}

          <Button className='ms-auto size-10' variant={'ghost'}  onClick={handleSignOut}>
            <ExitIcon/>
          </Button>
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {links.map((link) => {
            return (
              <SidebarMenuItem key={link.label}>
                <Link href={link.slug} passHref legacyBehavior>
                  <SidebarMenuButton asChild isActive={pathname === link.slug}>
                    <a>
                      {link.icon}
                      {link.label}
                      {link.slug === "/tasks" && (
                        <span className="rounded-full px-2 h-4 w-fit bg-destructive text-white text-center text-xs">
                          {taskCount || '0'}
                        </span>
                      )}
                    </a>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};
