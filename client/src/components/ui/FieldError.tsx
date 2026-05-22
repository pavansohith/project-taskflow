"use client";

import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <motion.p
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className="mt-1 flex items-center gap-1 text-xs text-rose-400"
      role="alert"
    >
      <AlertCircle className="h-3 w-3 shrink-0" strokeWidth={1.5} aria-hidden />
      {message}
    </motion.p>
  );
}
