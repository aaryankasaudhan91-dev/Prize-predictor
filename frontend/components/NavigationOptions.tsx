"use client"

import React, { useState } from 'react'
import { X, Settings, User, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { useSettings } from '@/context/SettingsContext'
import { translations } from '@/lib/translations'

export default function NavigationOptions() {
    const [activeModal, setActiveModal] = useState<'settings' | 'contact' | 'about' | null>(null)
    const { language, setLanguage, theme, setTheme } = useSettings()
    const t = translations[language]

    const closeModal = () => setActiveModal(null)

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
                <button onClick={() => setActiveModal('settings')} className="bg-transparent border-none p-1 pointer-cursor"><Settings className="w-5 h-5 hover:text-red-primary" /></button>
                <button onClick={() => setActiveModal('contact')} className="bg-transparent border-none p-1 pointer-cursor"><Mail className="w-5 h-5 hover:text-blue-primary" /></button>
                <button onClick={() => setActiveModal('about')} className="bg-transparent border-none p-1 pointer-cursor"><User className="w-5 h-5 hover:text-yellow-primary" /></button>
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
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-lg bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 border-b-4 border-black">
                                <h2 className="text-2xl font-display font-bold uppercase tracking-tight flex items-center gap-3">
                                    {activeModal === 'settings' && <><Settings className="w-6 h-6 text-red-primary" /> {t.settings}</>}
                                    {activeModal === 'contact' && <><Mail className="w-6 h-6 text-blue-primary" /> {t.contact}</>}
                                    {activeModal === 'about' && <><User className="w-6 h-6 text-yellow-primary" /> {t.about}</>}
                                </h2>
                                <button
                                    onClick={closeModal}
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
                                                        key={lang}
                                                        onClick={() => setLanguage(lang as 'english' | 'hindi' | 'marathi')}
                                                        className={cn(
                                                            "py-3 px-4 border-2 font-bold transition-all text-sm uppercase cursor-pointer w-full text-center tracking-widest",
                                                            language === lang
                                                                ? "bg-red-primary border-black text-white"
                                                                : "bg-white border-black text-black hover:bg-gray-100/50"
                                                        )}
                                                    >
                                                        {lang}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="h-0.5 w-full bg-black/10" />

                                        {/* Theme Settings */}
                                        <div className="space-y-4">
                                            <label className="block text-sm font-bold tracking-[1px] text-black uppercase">{t.theme}</label>
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                                {['light', 'dark', 'system'].map((t) => (
                                                    <button
                                                        key={t}
                                                        onClick={() => setTheme(t as 'light' | 'dark' | 'system')}
                                                        className={cn(
                                                            "py-3 px-4 border-2 font-bold transition-all text-sm uppercase cursor-pointer w-full text-center tracking-widest",
                                                            theme === t
                                                                ? "bg-black border-black text-white"
                                                                : "bg-white border-black text-black hover:bg-gray-100/50"
                                                        )}
                                                    >
                                                        {t}
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

                                        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Message sent!'); closeModal(); }}>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold tracking-[1px] uppercase">{t.nameLabel}</label>
                                                <input
                                                    type="text"
                                                    required
                                                    className="w-full border-2 border-black p-3 bg-white outline-none focus:bg-blue-50 font-mono text-sm"
                                                    placeholder={t.nameLabel}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold tracking-[1px] uppercase">{t.emailLabel}</label>
                                                <input
                                                    type="email"
                                                    required
                                                    className="w-full border-2 border-black p-3 bg-white outline-none focus:bg-blue-50 font-mono text-sm"
                                                    placeholder="your.email@example.com"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="block text-xs font-bold tracking-[1px] uppercase">{t.messageLabel}</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    className="w-full border-2 border-black p-3 bg-white outline-none focus:bg-blue-50 font-mono text-sm resize-none"
                                                    placeholder={t.messageLabel}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                className="w-full mt-4 bg-blue-primary text-white border-2 border-black py-4 font-display font-bold text-lg hover:bg-blue-600 transition-colors uppercase tracking-[2px] cursor-pointer"
                                            >
                                                {t.sendMessage}
                                            </button>
                                        </form>
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
