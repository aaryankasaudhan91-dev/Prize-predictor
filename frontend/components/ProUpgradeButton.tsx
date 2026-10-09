"use client"

import React, { useState, useRef, useEffect } from 'react'
import { Zap } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

export default function ProUpgradeButton() {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-mono font-bold hover:text-[#ff6600] text-black dark:text-white dark:hover:text-[#ff6600] transition-colors uppercase tracking-widest bg-transparent border-none p-0 cursor-pointer"
                title="Unlock Pro"
            >
                <Zap className="w-5 h-5 md:w-4 md:h-4 text-[#ff6600]" />
                <span className="hidden md:inline">Pro</span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 mt-2 w-[280px] bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-[100] origin-top-right p-6 flex flex-col gap-6"
                    >
                        <div className="w-12 h-12 bg-yellow-primary border-2 border-black flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-black" strokeWidth={2} />
                        </div>

                        <div className="space-y-3">
                            <h3 className="text-black font-display font-bold text-xl uppercase tracking-tight m-0 leading-none">Unlock Pro Features</h3>
                            <p className="text-gray-700 font-mono text-sm leading-relaxed m-0 font-medium tracking-wide">
                                Advanced analytics, unlimited exports, and priority support.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                alert('Upgrade flow initiated!')
                                setIsOpen(false)
                            }}
                            className="w-full bg-blue-primary text-white border-2 border-black hover:bg-blue-600 transition-colors py-3 font-mono text-xs font-bold uppercase tracking-[2px] cursor-pointer"
                        >
                            Upgrade Now
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
