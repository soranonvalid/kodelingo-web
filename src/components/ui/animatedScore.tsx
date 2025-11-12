import {
  animate,
  useMotionValue,
  useTransform,
  motion,
  useInView,
} from "framer-motion";
import { useEffect, useRef } from "react";

export const AnimatedScore = ({ score }: { score: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true }); // 👈 hanya sekali saat masuk viewport

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.floor(latest));

  useEffect(() => {
    if (isInView) {
      // mulai animasi hanya saat terlihat
      const controls = animate(count, score, {
        duration: 1.2,
        ease: "easeOut",
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
      className="text-sm font-medium text-primary"
    >
      {rounded}
    </motion.span>
  );
};
