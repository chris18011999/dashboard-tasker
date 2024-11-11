import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dashboard",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Dashboard</h1>
    </div>
  );
}
