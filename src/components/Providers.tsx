"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            className: "!bg-white dark:!bg-gray-800 !text-gray-900 dark:!text-gray-100 !shadow-lg !rounded-xl",
            duration: 4000,
          }}
        />
      </ThemeProvider>
    </SessionProvider>
  );
}
