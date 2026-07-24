'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { localeOptions, defaultLocale, LocaleCode, translations } from '@/lib/locale'

interface LocaleContextValue {
    locale: LocaleCode
    setLocale: (locale: LocaleCode) => void
    availableLocales: typeof localeOptions
    t: typeof translations[LocaleCode]
}

const LocaleContext = createContext<LocaleContextValue | undefined>(undefined)

const STORAGE_KEY = 'techno-logia-locale'

export function LocaleProvider({ children }: { children: React.ReactNode }) {
    const [locale, setLocaleState] = useState<LocaleCode>(defaultLocale)

    useEffect(() => {
        if (typeof window === 'undefined') return
        const stored = window.localStorage.getItem(STORAGE_KEY) as LocaleCode | null
        if (stored && translations[stored]) {
            setLocaleState(stored)
            document.documentElement.lang = stored
        } else {
            document.documentElement.lang = defaultLocale
        }
    }, [])

const setLocale = (newLocale: LocaleCode) => {
        if (!translations[newLocale]) return
        setLocaleState(newLocale)
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(STORAGE_KEY, newLocale)
            document.documentElement.lang = newLocale
            // Force le rafraîchissement de la page pour appliquer la nouvelle langue
            window.location.reload()
        }
    }

    const value = useMemo(
        () => ({ locale, setLocale, availableLocales: localeOptions, t: translations[locale] }),
        [locale]
    )

    return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
    const context = useContext(LocaleContext)
    if (!context) {
        throw new Error('useLocale must be used within LocaleProvider')
    }
    return context
}
