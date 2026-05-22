"use client";

import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/motion";
import type { ReactNode } from "react";

export function AuthPageTransition({ children }: { children: ReactNode }) {
  return (
    <motion.div
      variants={fadeInUp}
      initial="initial"
      animate="animate"
      className="w-full"
    >
      {children}
    </motion.div>
  );
}
