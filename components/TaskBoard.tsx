import { PrismaClient } from "@prisma/client";
import { TaskBoardClient } from "./TaskBoardClient";
import { currentUser } from "@clerk/nextjs/server";

export const TaskBoard = async () => {
  const client = new PrismaClient();

  const user = await currentUser();

  if(!user) {
    return <></>
  }

  const tasks = await client.task.findMany({
    orderBy: {
      preferredIndex: "asc",
    },
    where: {
      ownerId: user.id
    }
  })

  return <TaskBoardClient initialTasks={tasks} />;
};
