"use client"

import React, { useState, useEffect, useRef } from 'react'
import { X, Settings, User, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSettings } from '@/context/SettingsContext'
import { translations } from '@/lib/translations'

import { statusTranslations } from "@/lib/statusTranslations"

export default function NavigationOptions() {
    const [activeModal, setActiveModal] = useState<'settings' | 'contact' | 'about' | null>(null)
    const { language, setLanguage, theme, setTheme } = useSettings()
    const t: Record<string, string> = { ...translations[language], ...statusTranslations[language] }
    const dialog = useRef<HTMLDivElement>(null)

    const closeModal = () => setActiveModal(null)

    useEffect(() => {
        if (!activeModal) return;
        const previous = document.activeElement as HTMLElement | null;
        const oldOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        const frame = requestAnimationFrame(() => dialog.current?.focus());
        const handleKey = (event: KeyboardEvent) => {
            if (event.key === "Escape") setActiveModal(null);
            if (event.key !== "Tab") return;
            const items = Array.from(dialog.current?.querySelectorAll<HTMLElement>('button, a[href], input, textarea, select, [tabindex="0"]') ?? []).filter(el => !el.hasAttribute("disabled"));
            const first = items[0], last = items[items.length - 1];
            if (!first) { event.preventDefault(); return; }
            if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog.current)) { event.preventDefault(); last.focus(); }
            else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog.current)) { event.preventDefault(); first.focus(); }
        };
        document.addEventListener("keydown", handleKey);
        return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", handleKey); document.body.style.overflow = oldOverflow; previous?.focus(); };
    }, [activeModal]);

    return (
        <>
            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-black">
                <button
                    onClick={() => setActiveModal('settings')}
                    className="text-sm font-mono font-bold hover:text-red-primary cursor-pointer uppercase tracking-widest bg-transparent border-none p-0 flex items-center gap-2"
                >
                    <Settings className="w-4 h-4" />
                    {t.settings}
                </button>
                <button
                    onClick={() => setActiveModal('contact')}
                    className="text-sm font-mono font-bold hover:text-blue-primary cursor-pointer uppercase tracking-widest bg-transparent border-none p-0 flex items-center gap-2"
                >
                    <Mail className="w-4 h-4" />
                    {t.contact}
                </button>
                <button
                    onClick={() => setActiveModal('about')}
                    className="text-sm font-mono font-bold hover:text-yellow-primary cursor-pointer uppercase tracking-widest bg-transparent border-none p-0 flex items-center gap-2"
                >
                    <User className="w-4 h-4" />
                    {t.about}
                </button>
            </nav>

            {/* Mobile Navigation Icons */}
            <nav className="md:hidden flex items-center gap-4 text-black">
                <button aria-label={t.settings} onClick={() => setActiveModal('settings')} className="bg-transparent border-none p-1 cursor-pointer"><Settings className="w-5 h-5 hover:text-red-primary" /></button>
                <button aria-label={t.contact} onClick={() => setActiveModal('contact')} className="bg-transparent border-none p-1 cursor-pointer"><Mail className="w-5 h-5 hover:text-blue-primary" /></button>
                <button aria-label={t.about} onClick={() => setActiveModal('about')} className="bg-transparent border-none p-1 cursor-pointer"><User className="w-5 h-5 hover:text-yellow-primary" /></button>
            </nav>

            {/* Modals */}
            <AnimatePresence>
                {activeModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 text-black font-mono">
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={closeModal}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Modal Content */}
                        <motion.div ref={dialog} role="dialog" aria-modal="true" aria-labelledby="dialog-title" tabIndex={-1}
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b-4 border-black">
                                <h2 id="dialog-title" className="text-2xl font-display font-bold uppercase tracking-tight flex items-center gap-3">
                                    {activeModal === 'settings' && <><Settings className="w-6 h-6 text-red-primary" /> {t.settings}</>}
                                    {activeModal === 'contact' && <><Mail className="w-6 h-6 text-blue-primary" /> {t.contact}</>}
                                    {activeModal === 'about' && <><User className="w-6 h-6 text-yellow-primary" /> {t.about}</>}
                                </h2>
                                <button
                                    onClick={closeModal} aria-label={t.close}
                                    className="p-2 border-2 border-black hover:bg-red-primary hover:text-white transition-colors cursor-pointer"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 overflow-y-auto w-full">
                                {activeModal === 'settings' && (
                                    <div className="space-y-8">
                                        {/* Language Settings */}
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold tracking-[1px] text-black uppercase">{t.language}</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {['english', 'hindi', 'marathi'].map((lang) => (
                                                    <button
                                                        key={t[lang]}
                                                        onClick={() => setLanguage(lang as 'english' | 'hindi' | 'marathi')}
                                                        className={cn(
                                                            "py-3 px-4 border-2 font-bold transition-all text-sm uppercase cursor-pointer w-full text-center tracking-widest",
                                                            language === lang
                                                                ? "bg-red-primary border-black text-white"
                                                                : "bg-white border-black text-black hover:bg-gray-100/50"
                                                        )}
                                                    >
                                                        {t[lang]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-0.5 w-full bg-black/10" />

                                        {/* Theme Settings */}
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold tracking-[1px] text-black uppercase">{t.theme}</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {['light', 'dark', 'system'].map((themeOption) => (
                                                    <button
                                                        key={themeOption}
                                                        onClick={() => setTheme(themeOption as 'light' | 'dark' | 'system')}
                                                        className={cn(
                                                            "py-3 px-4 border-2 font-bold transition-all text-sm uppercase cursor-pointer w-full text-center tracking-widest",
                                                            theme === themeOption
                                                                ? "bg-black border-black text-white"
                                                                : "bg-white border-black text-black hover:bg-gray-100/50"
                                                        )}
                                                    >
                                                        {t[themeOption]}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeModal === 'contact' && (
                                    <div className="space-y-6">
                                        <div className="bg-blue-primary/10 border-2 border-blue-primary p-4 mb-6">
                                            <p className="text-sm font-bold text-blue-900 leading-relaxed">
                                                {t.contactDesc}
                                            </p>
                                        </div>

                                        <p role="status">{t.contactDemo}</p>
                                    </div>
                                )}

                                {activeModal === 'about' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center gap-6 mb-8">
                                            <div className="w-20 h-20 bg-yellow-primary border-4 border-black flex items-center justify-center shrink-0">
                                                <User className="w-10 h-10 text-black" />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-display font-bold uppercase leading-none mb-1">☠ master</h3>
                                                <p className="text-gray-600 text-sm font-bold tracking-widest uppercase">Lead Data Engineer</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-sm leading-relaxed font-medium">
                                                {t.aboutDesc1}
                                            </p>
                                            <p className="text-sm leading-relaxed font-medium">
                                                {t.aboutDesc2}
                                            </p>
                                        </div>

                                        <div className="h-0.5 w-full bg-black/10 my-6" />

                                        <div className="grid grid-cols-2 gap-4">
                                            <a href="https://github.com/aaryankasaudhan91-dev" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 border-2 border-black bg-white hover:bg-yellow-100 transition-colors text-xs font-bold uppercase tracking-widest text-black no-underline">
                                                GitHub
                                            </a>
                                            <a href="https://www.linkedin.com/in/aaryan-kasaudhan-00a4b7388?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 p-3 border-2 border-black bg-white hover:bg-yellow-100 transition-colors text-xs font-bold uppercase tracking-widest text-black no-underline">
                                                LinkedIn
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    )
}
