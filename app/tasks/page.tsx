import type { Metadata } from "next";
import { TaskBoard } from "../components/TaskBoard";

export const metadata: Metadata = {
  title: "Dashboard | Tasks",
}

export default function TasksPage() {
  return <TaskBoard />;
}
