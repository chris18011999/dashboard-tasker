"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReloadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { revalidateWeatherTag } from "./WeatherInfoActions";

export const WeatherInfoCard = ({
  icon,
  text,
  temp,
}: {
  icon: string;
  text: string;
  temp: number;
}) => {
  return (
    <Card className="h-full">
      <CardHeader className="relative w-full flex items-start justify-between flex-row">
        <CardTitle>
          Weather
        </CardTitle>
        <Button className="size-10 absolute right-4 top-4" onClick={() => revalidateWeatherTag()}><ReloadIcon/></Button>
      </CardHeader>
      <CardContent className="flex items-center gap-4">
        <Image src={icon} alt={text} width={80} height={80} />

        <div className="text-2xl font-bold">{temp}°C</div>
      </CardContent>
    </Card>
  );
};
