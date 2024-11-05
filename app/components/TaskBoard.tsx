import { PrismaClient } from "@prisma/client";
import { TaskBoardClient } from "./TaskBoardClient";
import { cache } from "react";

// Task type definition
type Task = {
  id: string;
  title: string;
  description: string;
};

export const TaskBoard = async () => {
  const client = new PrismaClient();
  const tasks = await client.task.findMany({
    orderBy: {
      preferredIndex: "asc",
    },
  })

  console.dir(tasks, { depth: Infinity });

  return <TaskBoardClient initialTasks={tasks} />;
};
