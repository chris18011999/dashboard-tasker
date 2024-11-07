import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { TaskBoardClient } from "@/components/TaskBoardClient";
import { PrismaClient } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Dashboard | Tasks",
};

export default async function TasksPage() {
  const client = new PrismaClient();
  const user = await currentUser();

  if(!user) {
    return <></>
  }

  const tasks = await client.task.findMany({
    where: {
      ownerId: user.id
    }
  })

  return (
    <div className="flex flex-col gap-3 h-full">
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

      <TaskBoardClient initialTasks={tasks} />
    </div>
  );
}
