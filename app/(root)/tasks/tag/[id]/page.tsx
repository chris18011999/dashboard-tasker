import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard | Tasks",
};

interface Params {
  params: {
    id: string;
  };
}

export default async function TasksTagPage({ params }: Params) {
  return <h1>{params.id}</h1>
}