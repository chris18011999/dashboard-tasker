
import * as motion from "framer-motion/client";
import type { Metadata } from "next";
import { CurrentTime } from "@/components/CurrentTime";
import { WeatherInfo } from "@/components/WeatherInfo";
import { BatteryInfo } from "@/components/BatteryInfo";
import { QuoteOfTheDay } from "@/components/QuoteOfTheDay";

const components = [CurrentTime, WeatherInfo, BatteryInfo, QuoteOfTheDay];

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function HomePage() {
  return (
    <div className="flex flex-col gap-3">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {components.map((Component, index) => {
          return (
            <motion.div
            key={Component.name}
              transition={{
                delay: index * 0.15,
                type: "spring",
                restSpeed: 10,
                bounce: 0.7,
              }}
              variants={{
                show: {
                  y: 0,
                  opacity: 1,
                },
                hide: {
                  y: -10,
                  opacity: 0.3,
                },
              }}
              animate="show"
              exit="hide"
              initial="hide"
            >
              <Component />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
