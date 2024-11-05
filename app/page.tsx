import { Suspense } from "react";

import { CurrentTime } from "./components/CurrentTime";
import { WeatherInfo } from "./components/WeatherInfo";
import { BatteryInfo } from "./components/BatteryInfo";
import { QuoteOfTheDay } from "./components/QuoteOfTheDay";
import * as motion from "framer-motion/client";
import { AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Metadata } from "next";

const components = [CurrentTime, WeatherInfo, BatteryInfo, QuoteOfTheDay];

export const metadata: Metadata = {
  title: "Dashboard",
}

export default function HomePage() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {components.map((Component, index) => {
        return (
          <AnimatePresence>
            <motion.div
              transition={{ delay: 0.05 * index }}
              variants={{
                show: { y: 0, opacity: 1 },
                hide: { y: -10, opacity: 0.3 },
              }}
              exit="hide"
              animate="show"
              initial="hide"
            >
              <Suspense
                fallback={
                  <Card>
                    <CardHeader>
                      <CardTitle>Component Loading</CardTitle>
                    </CardHeader>
                    <CardContent>Loading...</CardContent>
                  </Card>
                }
              >
                <Component />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
}
