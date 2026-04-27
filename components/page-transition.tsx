"use client"

import { motion } from "framer-motion"
import { usePathname } from "next/navigation"

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 15, scale: 0.98, filter: "blur(4px)" }}
      animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      transition={{ 
        duration: 0.35, 
        ease: [0.16, 1, 0.3, 1] // Custom spring-like easing (Apple-style)
      }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  )
}
