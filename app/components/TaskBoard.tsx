import { PrismaClient } from "@prisma/client";
import { TaskBoardClient } from "./TaskBoardClient";

export const TaskBoard = async () => {
  const client = new PrismaClient();
  const tasks = await client.task.findMany({
    orderBy: {
      preferredIndex: "asc",
    },
  })

  return <TaskBoardClient initialTasks={tasks} />;
};
