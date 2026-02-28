"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onFinish, 800) // Wait for exit animation to complete
        }, 3500)

        return () => clearTimeout(timer)
    }, [onFinish])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -50 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-page text-black overflow-hidden"
                >
                    <motion.div
                        className="flex flex-col items-center gap-12"
                    >
                        {/* Geometric Morphing Loader */}
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1, 1.2, 1],
                                rotate: [0, 90, 180, 270, 360],
                                borderRadius: ["50%", "0%", "50%", "0%", "50%"],
                                backgroundColor: ["#E53935", "#1E88E5", "#FFC107", "#E53935", "#1E88E5"]
                            }}
                            transition={{
                                duration: 3,
                                ease: "easeInOut",
                                times: [0, 0.25, 0.5, 0.75, 1],
                                repeat: Infinity,
                            }}
                            className="w-24 h-24 border-2 border-black"
                        />

                        <div className="flex flex-col items-center gap-4 text-center">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2, duration: 0.5 }}
                                className="text-5xl font-display font-bold tracking-tight text-black"
                            >
                                HouseVal
                            </motion.h1>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6, duration: 0.5 }}
                                className="flex flex-col items-center gap-2 pt-4"
                            >
                                <p className="text-black font-mono text-sm font-bold tracking-widest uppercase">
                                    INITIALIZING SYSTEM
                                </p>
                                <div className="flex gap-2 mt-4">
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-4 h-4 rounded-full bg-red-primary border-2 border-black" />
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} className="w-4 h-4 bg-blue-primary border-2 border-black" />
                                    <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 1.0 }} className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[14px] border-b-yellow-primary border-t-2 border-t-black drop-shadow-[0_2px_0_rgba(0,0,0,1)]" style={{ filter: 'drop-shadow(0px 2px 0px black)' }} />
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
