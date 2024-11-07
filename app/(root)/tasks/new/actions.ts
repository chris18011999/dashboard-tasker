"use server";

import { handleAddTask } from "@/components/TaskBoardActions";
import { redirect } from "next/navigation";

export async function addTask(data: FormData) {
  const title = data.get("title") as string;
  const description = data.get("description") as string;
  await handleAddTask(title, description);
  redirect("/tasks");
}
