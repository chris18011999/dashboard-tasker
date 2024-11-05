"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimatePresence } from "framer-motion";
import { Battery, BatteryCharging } from "lucide-react";
import { useEffect, useState } from "react";

import * as motion from "framer-motion/client";

export const BatteryInfo = () => {
  const [battery, setBattery] = useState<{
    level: number;
    charging: boolean;
  } | null>(null);

  useEffect(() => {
    // Get initial battery status and set up listeners
    const setupBattery = async () => {
      if ("getBattery" in navigator) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  }, []);

  return (
    <Card className="h-full">
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
  );
};
