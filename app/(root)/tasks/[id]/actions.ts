"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const client = new PrismaClient();

export const handleUpdateTask = async (data: FormData) => {
  const dataDescription = data.get("description")?.toString();
  const dataTitle = data.get("title")?.toString();
  const imageSrc = data.get("image")?.toString();
  const taskId = data.get("id")?.toString();

  console.log(Object.fromEntries(data))

  try {
    await client.task.update({
      where: {
        id: Number(taskId!),
      },
      data: {
        imageUrl: imageSrc,
        title: dataTitle,
        description: dataDescription,
      },
    });

    revalidatePath("/tasks");
    revalidatePath(`/tasks/${taskId}`);
  } catch (e: unknown) {
    console.log(e);
  }
  redirect("/tasks");
};
