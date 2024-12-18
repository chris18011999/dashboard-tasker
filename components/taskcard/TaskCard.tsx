"use client";

import type { Prisma } from "@prisma/client";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../ui/context-menu";
import { AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Draggable } from "@hello-pangea/dnd";
import { Trash2Icon } from "lucide-react";

import * as motion from "framer-motion/client";
import Link from "next/link";

export function TaskCard({
  task,
  index,
  handleDeleteTask,
}: {
  task: Prisma.TaskGetPayload<{
    include: { tags: true }
  }>;
  index: number;
  stateTitle: string;
  handleDeleteTask: (taskId: number) => Promise<void>;
}) {
  const _handleDeleteTask = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await handleDeleteTask(task.id);
  };

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <Draggable draggableId={task.id.toString()} key={task.id} index={index}>
          {(provided) => (
            <AnimatePresence>
              <motion.div>
                <Link href={`/tasks/${task.id}`}>
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
                      </div>
                    </CardHeader>
                    {task.description && (
                      <CardContent className="px-4">
                        <div className="text-sm text-muted-foreground truncate line-clamp-1 text-ellipsis">
                          {task.description}
                        </div>
                        {task.imageUrl && <img className="aspect-square object-cover rounded-sm" src={task.imageUrl} width={200} height={100} alt={task.title}/>}
                      </CardContent>
                    )}
                    {task.tags && <ul>
                      {task.tags.map(tag => {
                        return <li key={tag.id}>
                          <Link href={`/tasks/tag/${tag.id}`}>{tag.name}</Link>
                        </li>
                      })}  
                    </ul>}
                  </Card>
                </Link>
              </motion.div>
            </AnimatePresence>
          )}
        </Draggable>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuItem onClick={_handleDeleteTask}>
          <span className="w-full cursor-pointer text-destructive flex items-center gap-2">
            <Trash2Icon size={16} />
            Delete
          </span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
