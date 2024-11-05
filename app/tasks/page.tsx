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

export const metadata: Metadata = {
  title: "Dashboard | Tasks",
};

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-3">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <SidebarTrigger size={"icon"} />
          </BreadcrumbItem>
          <BreadcrumbItem>
          <BreadcrumbLink>
          <Link href="/">Home</Link>
          </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Tasks</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <TaskBoard />;
    </div>
  );
}
