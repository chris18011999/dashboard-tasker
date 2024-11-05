import type { Metadata } from "next";
import { TaskBoard } from "../components/TaskBoard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Dashboard | Tasks",
};

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-3">
      <SidebarTrigger size={"icon"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/">
            Home
          </BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Tasks</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Your tasks</h1>

      <TaskBoard />
    </div>
  );
}
