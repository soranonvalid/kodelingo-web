import { cn } from "@/lib/utils";
import {
  animate,
  useMotionValue,
  useTransform,
  motion,
  useInView,
} from "framer-motion";
import { useEffect, useRef } from "react";

export const AnimatedScore = ({
  score,
  delay = 0,
  duration = 1.2,
  className,
}: {
  score: number;
  delay?: number;
  duration?: number;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, score, {
        duration,
        ease: "easeOut",
        delay,
      });
      return () => controls.stop();
    }
  }, [isInView, score]);

  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0 }}
      animate={{ opacity: isInView ? 1 : 0 }}
      transition={{ duration: 0.5 }}
      className={cn("text-sm font-medium text-primary", className)}
    >
      {rounded}
    </motion.span>
  );
};
