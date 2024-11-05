import { cn } from "@/utils";

interface HomeCardProps {
  children?: React.ReactNode;
  title: string;
  classes?: string;
}

export function HomeCard({ children, classes, title }: HomeCardProps) {
  return (
    <div
      className={cn(
        `w-full rounded-lg backdrop-blur-sm bg-slate-800/40 p-8 border border-white/30`,
        classes
      )}
    >
      <h1 className="font-bold text-white text-2xl mb-2">{title}</h1>
      {children}
    </div>
  );
}
