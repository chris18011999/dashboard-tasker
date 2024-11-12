"use client";

import { handleUpdateTask } from "@/app/(root)/tasks/[id]/actions";
import type { Task } from "@prisma/client";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import Linkify from "linkify-react";
import { EditIcon } from "lucide-react";

const TaskEditForm = ({ task }: { task: Task }) => {
  return <form className="flex flex-col gap-3" action={handleUpdateTask}>
  <input type="hidden" name="id" value={task.id} />
  <Textarea
    name="description"
    defaultValue={task.description as string}
    placeholder="Task description..."
  ></Textarea>
  <Button type="submit" variant={"secondary"}>
    Save changes
  </Button>
</form>
}
const TaskDetailText = ({ task }: { task: Task }) => {
  return <Linkify options={{ nl2br: true }}>{task.description}</Linkify>
}

export const TaskDetails = ({ task }: { task: Task }) => {
  const [isEditting, setIsEditting] = useState(false);

  
  return <div className="flex flex-col gap-2">
    <Button className="h-10 w-fit" variant={"default"} onClick={() => setIsEditting(!isEditting)}><EditIcon/> Edit</Button>
    {isEditting ? <TaskEditForm task={task}></TaskEditForm> : <TaskDetailText task={task}></TaskDetailText>}
  </div>
};
