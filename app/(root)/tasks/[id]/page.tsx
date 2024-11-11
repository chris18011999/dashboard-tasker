import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { PrismaClient, type TaskState } from "@prisma/client";
import { currentUser } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Linkify from "linkify-react";
import { CalendarIcon } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Dashboard | Tasks",
};

interface Params {
  params: {
    id: string;
  };
}

export default async function TasksPage({ params }: Params) {
  const client = new PrismaClient();
  const user = await currentUser();

  if (!user) {
    return <></>;
  }

  const task = await client.task.findUnique({
    where: {
      id: Number(params.id),
    },
  });

  if (!task) {
    notFound();
  }

  const badgeStatus: Record<TaskState, BadgeProps["variant"]> = {
    todo: "outline",
    done: "default",
    inProgress: "secondary",
  };

  return (
    <div className="flex flex-col gap-3 h-full">
      <SidebarTrigger size={"icon"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbLink href="/tasks">Tasks</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>{task.title}</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Task: {task.title}</h1>

      <div className="flex items-center gap-2">
        <span>Status:</span>
        <Badge variant={badgeStatus[task.status]}>
          {task.status}
        </Badge>
      </div>

      <div className="flex flex-col gap-4">
        {task.imageUrl && (
          <Image
            src={task.imageUrl}
            alt={task.title}
            width={500}
            height={200}
          />
        )}
      </div>
      <div>
        <Linkify
          options={{
            nl2br: true,
          }}
        >
          {task.description && <p>{task.description}</p>}
        </Linkify>
      </div>
      {task.due && (
        <div className="text-xs italic flex items-center gap-2">
          <CalendarIcon size={14} />
          {task.due.toLocaleString()}
        </div>
      )}
    </div>
  );
}
