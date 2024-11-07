import type { Metadata } from "next";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { addTask } from "./actions";

export const metadata: Metadata = {
  title: "Dashboard | Tasks",
};

export default function TasksPage() {
  return (
    <div className="flex flex-col gap-3 h-full">
      <SidebarTrigger size={"icon"} />
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Tasks</BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>Add new task</BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <h1 className="text-2xl font-bold">Add new task</h1>

      <form action={addTask}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input name="title" id="title" required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea name="description" id="description" />
          </div>
        </div>
        <Button type="submit">{"Add Task"}</Button>
      </form>
    </div>
  );
}
