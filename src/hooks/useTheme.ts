import type { AppTheme } from '#/types'
import { localStorageUtil } from '#/util/local-storage.util'
import { useEffect, useState } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState<AppTheme>('light')

  useEffect(() => {
    const html = document.documentElement
    const storedTheme = localStorageUtil.getItem<AppTheme>('theme')
    if (storedTheme) {
      setTheme(storedTheme)
      html.classList.toggle('dark', storedTheme === 'dark')
    }
  }, [])

  const toggleTheme = (newTheme: AppTheme) => {
    const html = document.documentElement
    html.classList.toggle('dark', newTheme === 'dark')
    setTheme(newTheme)
    localStorageUtil.setItem('theme', newTheme)
  }

  return { theme, toggleTheme }
}
