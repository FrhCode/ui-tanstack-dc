import { LOCAL_STORAGE_KEY } from '#/constant/localStorage'
import type { AppTheme } from '#/types'
import { localStorageUtil } from '#/util/local-storage.util'
import { useEffect, useState } from 'react'

export const useTheme = () => {
  const [theme, setTheme] = useState<AppTheme>('light')

  useEffect(() => {
    const html = document.documentElement
    const storedTheme = localStorageUtil.getItem<AppTheme>(LOCAL_STORAGE_KEY.THEME)
    if (storedTheme) {
      setTheme(storedTheme)
      html.classList.toggle('dark', storedTheme === 'dark')
    }
  }, [])

  const toggleTheme = (newTheme: AppTheme) => {
    const html = document.documentElement
    html.classList.toggle('dark', newTheme === 'dark')
    setTheme(newTheme)
    localStorageUtil.setItem(LOCAL_STORAGE_KEY.THEME, newTheme)
  }

  return { theme, toggleTheme }
}
