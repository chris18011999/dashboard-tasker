import type { Metadata } from "next";
import {
  ClerkProvider
} from "@clerk/nextjs";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <main className="flex-1 flex h-screen overflow-auto p-6 items-center justify-center">{children}</main>
    </ClerkProvider>
  );
}
