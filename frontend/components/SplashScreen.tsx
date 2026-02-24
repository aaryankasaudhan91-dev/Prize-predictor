"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Building } from "lucide-react"

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false)
            setTimeout(onFinish, 800) // Wait for exit animation to complete
        }, 4000)

        return () => clearTimeout(timer)
    }, [onFinish])

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0f172a] text-white overflow-hidden"
                >
                    {/* Background effects */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-emerald-500/20 blur-[120px] rounded-full pointer-events-none" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none" />

                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative z-10 flex flex-col items-center space-y-8"
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="relative flex items-center justify-center w-24 h-24 rounded-full bg-slate-900/50 border border-emerald-500/30 shadow-2xl shadow-emerald-500/20 backdrop-blur-xl"
                        >
                            <Building className="w-10 h-10 text-emerald-400" />
                            <div className="absolute inset-0 rounded-full border-t-2 border-emerald-400 animate-spin" style={{ animationDuration: '2s' }} />
                        </motion.div>

                        <div className="text-center space-y-6 max-w-lg mx-auto px-4">
                            <motion.h1
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                className="text-4xl md:text-5xl font-black tracking-tight"
                            >
                                Navi Mumbai <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">HouseVal</span>
                            </motion.h1>

                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6 }}
                                className="text-slate-300 text-base md:text-lg leading-relaxed"
                            >
                                Advanced AI-driven property valuation system analyzing real-time market trends across Navi Mumbai&apos;s nodes.
                            </motion.p>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6 }}
                                className="pt-2 space-y-1"
                            >
                                <p className="text-emerald-400/80 text-xs font-medium tracking-wider uppercase">
                                    Created By
                                </p>
                                <p className="text-white font-bold text-xl tracking-wide">
                                    Aaryan Kasaudhan
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.8, duration: 0.4 }}
                                className="pt-6"
                            >
                                <p className="text-slate-400 text-sm md:text-base tracking-widest uppercase font-semibold animate-pulse">
                                    Initializing Neural Engine...
                                </p>
                            </motion.div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
