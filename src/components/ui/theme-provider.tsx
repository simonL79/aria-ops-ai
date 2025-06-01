
"use client"

import * as React from "react"
import { createContext, useContext, useEffect, useState } from "react"

type Theme = "dark" | "light" | "system"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: "dark", // Force dark theme by default
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark", // Force dark theme
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(
    () => "dark" // Always return dark theme
  )

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    
    // Always apply dark theme for corporate styling
    root.classList.add("dark")
    
    // Force corporate dark background
    document.body.style.backgroundColor = '#0A0B0D'
    document.body.style.color = '#F9FAFB'
    document.documentElement.style.backgroundColor = '#0A0B0D'
    document.documentElement.style.color = '#F9FAFB'
  }, [theme])

  const value = {
    theme: "dark" as Theme,
    setTheme: (theme: Theme) => {
      // Always stay on dark theme for corporate branding
      localStorage.setItem(storageKey, "dark")
      setTheme("dark")
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}

export function ThemeToggle() {
  return null // Disable theme toggle for corporate branding
}
