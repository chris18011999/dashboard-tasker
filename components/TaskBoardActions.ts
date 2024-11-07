"use server";

import { currentUser } from "@clerk/nextjs/server";
import { PrismaClient, type TaskState } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cache } from "react";

const prisma = new PrismaClient();

// Use a cached Prisma client to avoid multiple instances
const getPrismaClient = cache(() => prisma);

export async function handleAddTask(
  title: string,
  description: string,
  due?: Date
) {
  const user = await currentUser();

  if (!user) {
    throw new Error("Must be authenticated to execute this action!");
  }

  const client = getPrismaClient();
  const task = await client.task.create({
    data: {
      title,
      description,
      status: "todo",
      preferredIndex: await getNextPreferredIndex("todo"),
      ownerId: user.id,
    },
  });

  revalidatePath("/tasks");
  return task;
}

export async function resetAllTasksToTodo() {
  const client = getPrismaClient();
  const user = await currentUser();

  if (!user) {
    throw new Error("Must be authenticated to execute this action!");
  }

  await client.task.updateMany({
    data: {
      status: "todo",
      preferredIndex: 0,
    },
    where: {
      ownerId: user.id,
    },
  });

  revalidatePath("/tasks");
}

export async function updateTaskStatus(
  taskId: number,
  newStatus: TaskState,
  index?: number
) {
  const client = getPrismaClient();
  const user = await currentUser();

  if (!user) {
    throw new Error("Must be authenticated to execute this action!");
  }

  await client.task.update({
    where: { id: taskId, ownerId: user.id },
    data: {
      status: newStatus,
      preferredIndex: index ?? (await getNextPreferredIndex(newStatus)),
    },
  });

  revalidatePath("/tasks");
}

export async function handleDeleteTask(taskId: number) {
  const client = getPrismaClient();
  const user = await currentUser();

  if (!user) {
    throw new Error("Must be authenticated to execute this action!");
  }

  try {
    await client.task.delete({
      where: { id: taskId, ownerId: user.id },
    });

    revalidatePath("/tasks");

    return { success: true };
  } catch (e) {
    console.error("Error deleting task:", e);
    return { success: false, error: "Failed to delete task" };
  }
}

async function getNextPreferredIndex(status: TaskState): Promise<number> {
  const client = getPrismaClient();
  const user = await currentUser();

  if (!user) {
    throw new Error("Must be authenticated to execute this action!");
  }

  const highestIndexTask = await client.task.findFirst({
    where: { status, ownerId: user.id },
    orderBy: { preferredIndex: "desc" },
    select: { preferredIndex: true },
  });

  return (highestIndexTask?.preferredIndex ?? 0) + 1;
}
