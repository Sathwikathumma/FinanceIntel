import { forwardRef } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface CardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", children, gradient = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`
          rounded-2xl p-6 md:p-8
          ${gradient ? 'bg-gradient-to-br from-card to-secondary' : 'bg-card'}
          shadow-xl shadow-black/5 border border-border/50
          hover:shadow-2xl hover:border-border transition-all duration-300
          ${className}
        `}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
);
Card.displayName = "Card";
