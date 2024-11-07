"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

export const CurrentTime = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Time & Date</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold" suppressHydrationWarning>
        {currentTime.toLocaleTimeString()}
        <div
          className="text-sm font-normal text-muted-foreground"
          suppressHydrationWarning
        >
          {currentTime.toLocaleDateString("nl-nl", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
      </CardContent>
    </Card>
  );
};