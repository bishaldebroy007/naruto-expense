"use client";

import { motion } from "framer-motion";

export function RasenganLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[400px] w-full gap-8">
      <div className="relative w-32 h-32">
        {/* Inner Core */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: 360,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute inset-4 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 blur-sm shadow-[0_0_20px_rgba(34,211,238,0.8)]"
        />

        {/* Outer Swirls */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              rotate: i % 2 === 0 ? 360 : -360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 1.5 + i * 0.2,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 rounded-full border-2 border-cyan-400/30 border-t-cyan-400 blur-[1px]"
            style={{ padding: `${i * 8}px` }}
          />
        ))}

        {/* Sparkles */}
        {[...Array(4)].map((_, i) => (
          <motion.div
            key={i}
            animate={{
              opacity: [0, 1, 0],
              scale: [0.5, 1.5, 0.5],
              x: [0, (i % 2 === 0 ? 1 : -1) * 40],
              y: [0, (i < 2 ? 1 : -1) * 40],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
            }}
            className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full blur-[1px]"
          />
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-cyan-400 font-bold tracking-[0.2em] text-sm animate-pulse"
      >
        RELEASING CHAKRA...
      </motion.div>
    </div>
  );
}
