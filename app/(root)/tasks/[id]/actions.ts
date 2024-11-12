'use server';

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const client = new PrismaClient();

export const handleUpdateTask = async (data: FormData) => {
  const dataDescription = data.get("description")?.toString();
  const dataTitle = data.get("title")?.toString();
  const taskId = data.get('id')?.toString();

  try {
    await client.task.update({
      where: {
        id: Number(taskId!)
      },
      data: {
        title: dataTitle || undefined,
        description: dataDescription || undefined
      }
    })

    revalidatePath('/tasks')
    revalidatePath(`/tasks/${taskId}`)

  } catch(e: unknown) {
    console.log(e);

  }
}