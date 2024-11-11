"use client";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import {
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  handleDeleteTask as server_handleDeleteTask,
  updateTaskStatus,
  revalidateTasks as server_revalidateTasks,
} from "./TaskBoardActions";
import { Task, TaskState } from "@prisma/client";

import { groupBy } from "@/lib/groupby";
import { cn } from "@/utils";
import { toast } from "@/hooks/use-toast";
import Link from "next/link";
import { TaskCard } from "./taskcard/TaskCard";

const COLUMN_TITLES: Record<TaskState, string> = {
  todo: "To do",
  inProgress: "In progress",
  done: "Done",
};

const MODIFIER: Record<TaskState, number> = {
  todo: 1000,
  inProgress: 5000,
  done: 1000,
};

export function TaskBoardClient({
  initialTasks = [],
}: {
  initialTasks: Task[];
}) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const groupedTasks = groupBy(tasks, (task: Task) => task.status);

  const handleDeleteTask = async (taskId: number) => {
    const result = await server_handleDeleteTask(taskId);
    if (result.success) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } else {
      console.error("Failed to delete task:", result.error);
    }
  };

  const revalidateTasks = async () => {
    if (document.visibilityState == "visible") {
      toast({
        title: "Revalidating tasks",
        variant: "default",
        duration: 2000,
      });
      try {
        const result = await server_revalidateTasks();
        setTasks(result);
      } catch (e: unknown) {
        const error = e as Error;
        console.error("Failed to revalidate tasks:", e);

        toast({
          title: "Error revalidating tasks",
          description: error.message,
          variant: "destructive",
          duration: 4000,
        });
      }
    }
  };

  const handleDragEnd: OnDragEndResponder = (result) => {
    if (!result.destination) return;

    const newStatus = result.destination.droppableId as TaskState;
    const taskId = parseInt(result.draggableId);
    const newIndex = MODIFIER[newStatus] + (result.destination.index || 0);

    updateTaskStatus(taskId, newStatus, newIndex);

    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: newStatus, preferredIndex: newIndex }
          : task
      )
    );
  };

  useEffect(() => {
    document.addEventListener("visibilitychange", revalidateTasks);

    return () => {
      document.removeEventListener("visibilitychange", revalidateTasks);
    };
  });

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex space-x-4">
          <Button size="sm" asChild>
            <Link href={"/tasks/new"}>
              <Plus className="h-4 w-4 mr-1" />
              Add task
            </Link>
          </Button>
        </div>
        <div className="overflow-x-auto overflow-y-hidden flex-1">
          <div className="grid grid-cols-[repeat(3,1fr)] gap-4 h-full">
            {Object.entries(COLUMN_TITLES).map(([status, title]) => (
              <TaskColumn
                key={status}
                status={status as TaskState}
                title={title}
                handleDeleteTask={handleDeleteTask}
                tasks={groupedTasks[status as TaskState] || []}
              />
            ))}
          </div>
        </div>
      </div>
    </DragDropContext>
  );
}

function TaskColumn({
  status,
  title,
  tasks,
  handleDeleteTask,
}: {
  status: TaskState;
  title: string;
  tasks: Task[];
  handleDeleteTask: (taskId: number) => Promise<void>;
}) {
  return (
    <div className="flex flex-col min-w-[300px]">
      <h3 className="font-semibold text-lg mb-4">{title}</h3>

      <Droppable droppableId={status}>
        {(provided, snap) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={cn(
              "h-full bg-muted/50 rounded-lg p-4 flex flex-col gap-3",
              snap.isDraggingOver && "bg-muted/80"
            )}
          >
            {tasks.length > 0 ? (
              tasks
                .sort(
                  (a, b) => (a.preferredIndex || 0) - (b.preferredIndex || 0)
                )
                .map((task, index) => (
                  <TaskCard
                    stateTitle={title}
                    key={task.id}
                    task={task}
                    index={index}
                    handleDeleteTask={handleDeleteTask}
                  />
                ))
            ) : (
              <span className="text-muted-foreground">
                Nothing in &quot;{title}&quot;
              </span>
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}
