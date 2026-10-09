"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'

import { MotionConfig } from "framer-motion"

type Theme = 'light' | 'dark' | 'system'
type Language = 'english' | 'hindi' | 'marathi'

interface SettingsContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
    language: Language
    setLanguage: (lang: Language) => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
    // Try to load from localStorage first, otherwise fallback to defaults
    const [theme, setThemeState] = useState<Theme>('light')
    const [language, setLanguageState] = useState<Language>('english')
    const [mounted, setMounted] = useState(false)

    // Wait for mount to avoid hydration mismatch
    useEffect(() => {
        let savedTheme: Theme = 'light'
        let savedLang: Language = 'english'
        try { savedTheme = localStorage.getItem('houseval-theme') as Theme; savedLang = localStorage.getItem('houseval-lang') as Language; } catch { /* Storage may be disabled. */ }

        // Enqueue the state update using setTimeout so we don't
        // mutate state synchronously inside the effect, which causes a
        // React hydration mismatch / cascaded render warning
        setTimeout(() => {
            if (["light", "dark", "system"].includes(savedTheme)) setThemeState(savedTheme)
            if (["english", "hindi", "marathi"].includes(savedLang)) setLanguageState(savedLang)
            setMounted(true)
        }, 0)
    }, [])

    const setTheme = (newTheme: Theme) => {
        setThemeState(newTheme)
        try { localStorage.setItem('houseval-theme', newTheme) } catch { /* Keep session preference. */ }
    }

    const setLanguage = (newLang: Language) => {
        setLanguageState(newLang)
        try { localStorage.setItem('houseval-lang', newLang) } catch { /* Keep session preference. */ }
    }

    useEffect(() => { document.documentElement.lang = { english: "en", hindi: "hi", marathi: "mr" }[language]; }, [language])

    // Effect to apply the dark mode class to the document element
    useEffect(() => {
        if (!mounted) return

        const applyTheme = () => {
            const root = window.document.documentElement
            root.classList.remove('light', 'dark')

            if (theme === 'system') {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                root.classList.add(systemTheme)
            } else {
                root.classList.add(theme)
            }
        }

        applyTheme()

        // Listen for system theme changes if 'system' is selected
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        const handleChange = () => {
            if (theme === 'system') applyTheme()
        }
        mediaQuery.addEventListener('change', handleChange)
        return () => mediaQuery.removeEventListener('change', handleChange)
    }, [theme, mounted])

    // Prevent flash of unstyled content
    if (!mounted) {
        return <div className="min-h-screen bg-page text-black font-mono"></div>
    }

    return (
        <SettingsContext.Provider value={{ theme, setTheme, language, setLanguage }}>
            <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </SettingsContext.Provider>
    )
}

export function useSettings() {
    const context = useContext(SettingsContext)
    if (context === undefined) {
        throw new Error('useSettings must be used within a SettingsProvider')
    }
    return context
}
