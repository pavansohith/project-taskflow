import type { Transition, Variants } from "framer-motion";

const easeOut: Transition = { duration: 0.3, ease: [0.22, 1, 0.36, 1] };

/** y: 20 → 0, opacity 0 → 1, duration 0.3 */
export const fadeInUp: Variants = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: easeOut },
  exit: { y: 20, opacity: 0, transition: { duration: 0.2 } },
};

/** Parent variant — staggerChildren 0.08 */
export const staggerContainer: Variants = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.02,
    },
  },
  exit: {
    transition: {
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
};

/** Child variant for use inside staggerContainer */
export const staggerItem: Variants = {
  initial: { y: 16, opacity: 0 },
  animate: { y: 0, opacity: 1, transition: easeOut },
  exit: { y: 8, opacity: 0, transition: { duration: 0.15 } },
};

/** scale 0.95 → 1, opacity 0 → 1 */
export const scaleIn: Variants = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1, transition: easeOut },
  exit: { scale: 0.95, opacity: 0, transition: { duration: 0.2 } },
};

/** x: 100% → 0 — sidebar / drawer / panel */
export const slideInRight: Variants = {
  initial: { x: "100%" },
  animate: {
    x: 0,
    transition: { type: "spring", damping: 28, stiffness: 320 },
  },
  exit: {
    x: "100%",
    transition: { type: "spring", damping: 32, stiffness: 400 },
  },
};

/** Backdrop fade for overlays */
export const fadeOverlay: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
