'use server'

import { PrismaClient, type TaskState } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { cache } from 'react'

const prisma = new PrismaClient()

// Use a cached Prisma client to avoid multiple instances
const getPrismaClient = cache(() => prisma)

export async function handleAddTask(title: string, description: string) {
  const client = getPrismaClient()
  const task = await client.task.create({
    data: {
      title,
      description,
      status: "todo",
      preferredIndex: await getNextPreferredIndex("todo"),
    },
  })

  revalidatePath("/tasks")
  return task
}

export async function resetAllTasksToTodo() {
  const client = getPrismaClient()
  await client.task.updateMany({
    data: {
      status: 'todo',
      preferredIndex: 0,
    }
  })

  revalidatePath('/tasks')
}

export async function updateTaskStatus(
  taskId: number,
  newStatus: TaskState,
  index?: number
) {
  const client = getPrismaClient()
  await client.task.update({
    where: { id: taskId },
    data: {
      status: newStatus,
      preferredIndex: index ?? await getNextPreferredIndex(newStatus),
    },
  })

  revalidatePath("/tasks")
}

export async function handleDeleteTask(taskId: number) {
  const client = getPrismaClient()
  try {
    await client.task.delete({
      where: { id: taskId },
    })
  
    revalidatePath("/tasks")

    return { success: true }
  } catch(e) {
    
    console.error("Error deleting task:", e)
    return { success: false, error: "Failed to delete task" }
  }
}

async function getNextPreferredIndex(status: TaskState): Promise<number> {
  const client = getPrismaClient()
  const highestIndexTask = await client.task.findFirst({
    where: { status },
    orderBy: { preferredIndex: 'desc' },
    select: { preferredIndex: true },
  })

  return (highestIndexTask?.preferredIndex ?? 0) + 1
}