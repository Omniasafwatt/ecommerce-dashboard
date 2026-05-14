import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { Language } from '../../types/common'
import type { RootState } from '../index'

export interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export interface UIState {
  sidebarOpen: boolean
  language: Language
  theme: 'light' | 'dark'
  toasts: Toast[]
}

const getInitialLanguage = (): Language => {
  const stored = localStorage.getItem('i18nextLng')
  if (stored === 'en' || stored === 'ar') return stored
  return 'en'
}

const getInitialTheme = (): 'light' | 'dark' => {
  const stored = localStorage.getItem('theme')
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'
}

const initialState: UIState = {
  sidebarOpen: true,
  language: getInitialLanguage(),
  theme: getInitialTheme(),
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload
    },
    setLanguage: (state, action: PayloadAction<Language>) => {
      state.language = action.payload
      localStorage.setItem('i18nextLng', action.payload)
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
      if (action.payload === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      state.toasts.push({ ...action.payload, id })
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts.filter((t) => t.id !== action.payload)
    },
    clearAllToasts: (state) => {
      state.toasts = []
    },
  },
})

export const {
  toggleSidebar,
  setSidebarOpen,
  setLanguage,
  setTheme,
  addToast,
  removeToast,
  clearAllToasts,
} = uiSlice.actions

// Selectors
export const selectSidebarOpen = (state: RootState) => state.ui.sidebarOpen
export const selectLanguage = (state: RootState) => state.ui.language
export const selectTheme = (state: RootState) => state.ui.theme
export const selectToasts = (state: RootState) => state.ui.toasts

export default uiSlice.reducer
