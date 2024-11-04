"use client";

import { useEffect, useState } from "react";
import {
  Battery,
  Cloud,
  CloudRain,
  Sun,
  Plus,
  MoreHorizontal,
  BatteryCharging,
} from "lucide-react";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence } from "framer-motion";
import * as motion from "framer-motion/client";

// Task type definition
type Task = {
  id: string;
  title: string;
  description: string;
};

type Column = {
  id: string;
  title: string;
  tasks: Task[];
};

export default function Component() {
  const [date, setDate] = useState(new Date());
  const [battery, setBattery] = useState<{
    level: number;
    charging: boolean;
  } | null>(null);
  const [weather] = useState({ temp: 24, condition: "Sunny" }); // Mock weather data
  const [quote] = useState({
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
  });

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      tasks: [
        {
          id: "1",
          title: "Research competitors",
          description: "Analyze main competitors",
        },
        {
          id: "2",
          title: "Design system",
          description: "Create design tokens",
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      tasks: [
        {
          id: "3",
          title: "User interviews",
          description: "Conduct user research",
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "4",
          title: "Wireframes",
          description: "Create initial wireframes",
        },
      ],
    },
  ]);

  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setDate(new Date()), 1000);

    // Get initial battery status and set up listeners
    const setupBattery = async () => {
      if ("getBattery" in navigator) {
        try {
          const batteryManager = await (navigator as any).getBattery();

          const updateBatteryStatus = () => {
            setBattery({
              level: batteryManager.level * 100,
              charging: batteryManager.charging,
            });
          };

          // Initial update
          updateBatteryStatus();

          // Add event listeners
          batteryManager.addEventListener("levelchange", updateBatteryStatus);
          batteryManager.addEventListener(
            "chargingchange",
            updateBatteryStatus
          );

          // Cleanup function
          return () => {
            batteryManager.removeEventListener(
              "levelchange",
              updateBatteryStatus
            );
            batteryManager.removeEventListener(
              "chargingchange",
              updateBatteryStatus
            );
          };
        } catch (error) {
          console.error("Battery status not available:", error);
        }
      }
    };

    setupBattery();

    return () => clearInterval(timer);
  }, []);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const { source, destination } = result;
    const newColumns = [...columns];
    const sourceColumn = newColumns.find(
      (col) => col.id === source.droppableId
    );
    const destColumn = newColumns.find(
      (col) => col.id === destination.droppableId
    );

    if (sourceColumn && destColumn) {
      const [movedTask] = sourceColumn.tasks.splice(source.index, 1);
      destColumn.tasks.splice(destination.index, 0, movedTask);
      setColumns(newColumns);
    }
  };

  const handleAddTask = () => {
    if (newTask.title && addingToColumn) {
      const newColumns = [...columns];
      const column = newColumns.find((col) => col.id === addingToColumn);
      if (column) {
        column.tasks.push({
          id: Date.now().toString(),
          title: newTask.title,
          description: newTask.description,
        });
        setColumns(newColumns);
        setNewTask({ title: "", description: "" });
        setIsAddingTask(false);
        setAddingToColumn(null);
      }
    }
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    const newColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        };
      }
      return column;
    });
    setColumns(newColumns);
  };

  return (
    <div className="h-screen bg-background p-6">
      <Tabs defaultValue="dashboard" className="h-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="h-[calc(100%-50px)]">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Time and Date Card */}
            <Card>
              <CardHeader>
                <CardTitle>Time & Date</CardTitle>
              </CardHeader>
              <CardContent className="text-2xl font-bold" suppressHydrationWarning>
                {date.toLocaleTimeString()}
                <div className="text-sm font-normal text-muted-foreground" suppressHydrationWarning>
                  {date.toLocaleDateString('nl-nl', {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Weather Card */}
            <Card>
              <CardHeader>
                <CardTitle>Weather</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                {weather.condition === "Sunny" ? (
                  <Sun className="h-8 w-8 text-yellow-500" />
                ) : (
                  <CloudRain className="h-8 w-8 text-blue-500" />
                )}
                <div className="text-2xl font-bold">{weather.temp}°C</div>
              </CardContent>
            </Card>

            {/* Battery Card */}
            <Card>
              <CardHeader>
                <CardTitle>System Status</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <AnimatePresence>
                  {battery?.charging && (
                    <motion.svg
                      viewBox={"0 0 24 24"}
                      className="h-8 w-8"
                      variants={{
                        show: {
                          opacity: 1,
                        },
                        hide: {
                          opacity: 0,
                        },
                      }}
                      initial={"hide"}
                      animate={"show"}
                    >
                      <BatteryCharging className="h-8 w-8 text-green-500" />
                    </motion.svg>
                  )}
                  {!battery?.charging && (
                    <motion.svg
                      viewBox={"0 0 24 24"}
                      className="h-8 w-8"
                      variants={{
                        show: {
                          opacity: 1,
                        },
                        hide: {
                          opacity: 0,
                        },
                      }}
                      initial={"hide"}
                      animate={"show"}
                    >
                      <Battery className={`h-8 w-8`}></Battery>
                    </motion.svg>
                  )}
                </AnimatePresence>
                <div className="text-xl">
                  {battery ? (
                    <div className="flex items-center gap-2">
                      {Math.round(battery.level)}%
                    </div>
                  ) : (
                    "Battery status unavailable"
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quote Card */}
            <Card className="md:col-span-2 lg:col-span-3">
              <CardHeader>
                <CardTitle>Quote of the Day</CardTitle>
              </CardHeader>
              <CardContent>
                <blockquote className="border-l-2 pl-6 italic">
                  "{quote.text}"
                  <footer className="mt-2 text-sm text-muted-foreground">
                    — {quote.author}
                  </footer>
                </blockquote>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tasks" className="h-[calc(100%-50px)]">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full">
              {columns.map((column) => (
                <div key={column.id} className="flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">{column.title}</h3>
                    <Dialog
                      open={isAddingTask && addingToColumn === column.id}
                      onOpenChange={(open) => {
                        setIsAddingTask(open);
                        if (!open) setAddingToColumn(null);
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setAddingToColumn(column.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Add New Task</DialogTitle>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                              id="title"
                              value={newTask.title}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  title: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid gap-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                              id="description"
                              value={newTask.description}
                              onChange={(e) =>
                                setNewTask({
                                  ...newTask,
                                  description: e.target.value,
                                })
                              }
                            />
                          </div>
                        </div>
                        <Button onClick={handleAddTask}>Add Task</Button>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <Droppable droppableId={column.id}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="flex-1 bg-muted/50 rounded-lg p-4 space-y-4"
                      >
                        {column.tasks.map((task, index) => (
                          <Draggable
                            key={task.id}
                            draggableId={task.id}
                            index={index}
                          >
                            {(provided) => (
                              <Card
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-background"
                              >
                                <CardHeader className="p-4">
                                  <div className="flex items-center justify-between">
                                    <CardTitle className="text-sm font-medium">
                                      {task.title}
                                    </CardTitle>
                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm">
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onSelect={() =>
                                            handleDeleteTask(column.id, task.id)
                                          }
                                          className="text-destructive"
                                        >
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  <p className="text-sm text-muted-foreground">
                                    {task.description}
                                  </p>
                                </CardHeader>
                              </Card>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              ))}
            </div>
          </DragDropContext>
        </TabsContent>
      </Tabs>
    </div>
  );
}
