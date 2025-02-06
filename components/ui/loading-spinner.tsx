import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export const LoadingSpinner = ({ size = 24, className }: LoadingSpinnerProps) => {
  const spinTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 1
  };

  const circleVariants = {
    initial: {
      rotate: 0,
    },
    animate: {
      rotate: 360
    }
  };

  const dotVariants = {
    initial: {
      scale: 0.8,
      opacity: 0.4
    },
    animate: {
      scale: 1,
      opacity: 1
    }
  };

  const dotTransition = {
    duration: 0.5,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: "easeInOut"
  };

  return (
    <div className={className}>
      <motion.div
        className="relative"
        style={{
          width: size,
          height: size
        }}
        variants={circleVariants}
        initial="initial"
        animate="animate"
        transition={spinTransition}
      >
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className="absolute bg-primary rounded-full"
            style={{
              width: size / 4,
              height: size / 4,
              x: -size / 8,
              y: -size / 8,
              left: "50%",
              top: "50%",
              transform: `rotate(${index * 120}deg) translateY(-${size / 2.5}px)`
            }}
            variants={dotVariants}
            initial="initial"
            animate="animate"
            transition={{
              ...dotTransition,
              delay: index * 0.15
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}; 