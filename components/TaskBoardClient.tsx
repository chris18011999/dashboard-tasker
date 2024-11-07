"use client";

import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import type { OnDragEndResponder } from "@hello-pangea/dnd";
import { CalendarIcon, MoreHorizontal, Plus, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  handleAddTask,
  handleDeleteTask as server_handleDeleteTask,
  resetAllTasksToTodo,
  updateTaskStatus,
} from "./TaskBoardActions";
import { Task, TaskState } from "@prisma/client";

import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { groupBy } from "@/lib/groupby";
import { Calendar } from "@/components/ui/calendar";
import Linkify from "linkify-react";
import { cn } from "@/utils";

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
  const [isAddingTask, setIsAddingTask] = useState(false);

  const groupedTasks = groupBy(tasks, (task: Task) => task.status);

  const handleDeleteTask = async (taskId: number) => {
    const result = await server_handleDeleteTask(taskId);
    if (result.success) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } else {
      console.error("Failed to delete task:", result.error);
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

  const reopenAllTasks = () => {
    resetAllTasksToTodo();
    setTasks((prevTasks) =>
      prevTasks.map((task) => ({ ...task, status: TaskState.todo }))
    );
  };

  const addTask = async (formData: FormData) => {
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const due = formData.get("due")?.valueOf() as Date;

    const newTask = await handleAddTask(title, description, due);
    if (newTask) {
      setTasks((prevTasks) => [...prevTasks, newTask]);
      setIsAddingTask(false);
    }
  };

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="flex flex-col gap-4 h-full">
        <div className="flex space-x-4">
          {tasks.length > 0 && (
            <Button size="sm" variant="destructive" onClick={reopenAllTasks}>
              REOPEN ALL TASKS
            </Button>
          )}
          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <AddTaskForm onSubmit={addTask} />
            </DialogContent>
          </Dialog>
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

function AddTaskForm({
  onSubmit,
}: {
  onSubmit: (formData: FormData) => Promise<void> | void;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [loading, setLoading] = useState(false);

  const _onSubmit = async (data: FormData) => {
    setLoading(true);
    await onSubmit(data);
    setLoading(false);
  };

  return (
    <form action={_onSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title</Label>
          <Input name="title" id="title" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="description">Description</Label>
          <Textarea name="description" id="description" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="due">Due date</Label>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <input type="hidden" name="due" value={date?.toString()} />
        </div>
      </div>
      <Button type="submit">{loading ? "Adding task..." : "Add Task"}</Button>
    </form>
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
              "flex-1 bg-muted/50 rounded-lg p-4 flex flex-col gap-3",
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

function TaskCard({
  task,
  index,
  stateTitle,
  handleDeleteTask,
}: {
  task: Task;
  index: number;
  stateTitle: string;
  handleDeleteTask: (taskId: number) => Promise<void>;
}) {
  const badgeStatus: Record<TaskState, BadgeProps["variant"]> = {
    todo: "outline",
    done: "default",
    inProgress: "secondary",
  };

  const _handleDeleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    await handleDeleteTask(task.id);
    setIsLoading(false);
  };

  const [isLoading, setIsLoading] = useState(false);

  return (
    <Draggable draggableId={task.id.toString()} key={task.id} index={index}>
      {(provided) => (
        <AnimatePresence>
          <motion.div>
            <Dialog>
              <DialogTrigger asChild>
                <Card
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                  className="bg-background"
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-md font-bold">
                        {task.title}
                      </CardTitle>
                      {task.status == TaskState.done && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={_handleDeleteTask}
                            >
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                  </CardHeader>
                  {task.description && (
                    <CardContent className="px-4">
                      <div className="text-sm text-muted-foreground truncate line-clamp-1 text-ellipsis">
                        {task.description}
                      </div>
                    </CardContent>
                  )}
                </Card>
              </DialogTrigger>
              <DialogContent className="w-full max-w-[700px]">
                <DialogHeader className="flex flex-col items-start">
                  <DialogTitle>Task: {task.title}</DialogTitle>

                  <div className="flex items-center gap-2">
                    <span>Status:</span>
                    <Badge variant={badgeStatus[task.status]}>
                      {stateTitle || task.status}
                    </Badge>
                  </div>
                </DialogHeader>
                <DialogDescription className="flex flex-col gap-4">
                  {task.imageUrl && (
                    <Image
                      src={task.imageUrl}
                      alt={task.title}
                      width={500}
                      height={200}
                    />
                  )}
                </DialogDescription>
                <div>
                  <Linkify
                    options={{
                      nl2br: true,
                    }}
                  >
                    {task.description && <p>{task.description}</p>}
                  </Linkify>
                </div>
                {task.due && (
                  <div className="text-xs italic flex items-center gap-2">
                    <CalendarIcon size={14} />
                    {task.due.toLocaleString()}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Button variant={"destructive"} onClick={_handleDeleteTask}>
                    {isLoading ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn("animate-spin")}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </motion.div>
        </AnimatePresence>
      )}
    </Draggable>
  );
}
