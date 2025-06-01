
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
  theme: "dark",
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = "dark",
  storageKey = "ui-theme",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("dark")

  useEffect(() => {
    const root = window.document.documentElement
    const body = document.body
    
    // Remove any existing theme classes
    root.classList.remove("light", "dark")
    
    // Always apply dark theme for corporate styling
    root.classList.add("dark")
    
    // Apply CSS custom properties for consistent theming
    root.style.setProperty('--background', '10 11 13') // #0A0B0D
    root.style.setProperty('--foreground', '249 250 251') // #F9FAFB
    root.style.setProperty('--card', '17 18 20') // #111214
    root.style.setProperty('--card-foreground', '249 250 251') // #F9FAFB
    root.style.setProperty('--popover', '10 11 13') // #0A0B0D
    root.style.setProperty('--popover-foreground', '249 250 251') // #F9FAFB
    root.style.setProperty('--primary', '245 158 11') // #F59E0B
    root.style.setProperty('--primary-foreground', '10 11 13') // #0A0B0D
    root.style.setProperty('--secondary', '26 27 30') // #1A1B1E
    root.style.setProperty('--secondary-foreground', '249 250 251') // #F9FAFB
    root.style.setProperty('--muted', '107 114 128') // #6B7280
    root.style.setProperty('--muted-foreground', '156 163 175') // #9CA3AF
    root.style.setProperty('--accent', '245 158 11') // #F59E0B
    root.style.setProperty('--accent-foreground', '10 11 13') // #0A0B0D
    root.style.setProperty('--destructive', '239 68 68') // #EF4444
    root.style.setProperty('--destructive-foreground', '249 250 251') // #F9FAFB
    root.style.setProperty('--border', '55 65 81') // #374151
    root.style.setProperty('--input', '55 65 81') // #374151
    root.style.setProperty('--ring', '245 158 11') // #F59E0B
    
    // Force background colors on html and body
    root.style.backgroundColor = '#0A0B0D'
    root.style.color = '#F9FAFB'
    body.style.backgroundColor = '#0A0B0D'
    body.style.color = '#F9FAFB'
    body.style.minHeight = '100vh'
    
    // Force root div styling
    const rootDiv = document.getElementById('root')
    if (rootDiv) {
      rootDiv.style.backgroundColor = '#0A0B0D'
      rootDiv.style.color = '#F9FAFB'
      rootDiv.style.minHeight = '100vh'
    }
  }, [])

  const value = {
    theme: "dark" as Theme,
    setTheme: (theme: Theme) => {
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
  return null
}
