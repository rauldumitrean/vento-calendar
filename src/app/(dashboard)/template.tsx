"use client";

import { motion } from "framer-motion";

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, filter: "blur(8px)", scale: 0.98 }}
      animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-full w-full"
    >
      {children}
    </motion.div>
  );
}
